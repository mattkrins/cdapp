import axios from 'axios';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { CookieJar } from 'tough-cookie';
import { createCookieAgent } from 'http-cookie-agent/http';
import { JSDOM } from 'jsdom';
import { log, paths } from '../server.js';
import * as fs from 'node:fs';
import { decrypt, encrypt } from './cryptography.js';
const Axios = axios;
export default class eduSTAR {
    constructor(options) {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "school", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cachePolicy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1440
        });
        Object.defineProperty(this, "username", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "jar", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new CookieJar()
        });
        Object.defineProperty(this, "users", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "eduhub", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.users = [];
        let httpAgent;
        let httpsAgent;
        this.school = options.school;
        this.eduhub = options.eduhub;
        if (options.cache)
            this.cachePolicy = Number(options.cache);
        if (options.proxy) {
            const url = new URL(options.proxy); // TODO: Add support for auth
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const HttpProxyCookieAgent = createCookieAgent(HttpProxyAgent);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const HttpsProxyCookieAgent = createCookieAgent(HttpsProxyAgent);
            httpAgent = new HttpProxyCookieAgent({ cookies: { jar: this.jar }, host: url.hostname, port: url.port });
            httpsAgent = new HttpsProxyCookieAgent({ cookies: { jar: this.jar }, host: url.hostname, port: url.port });
        }
        this.client = Axios.default.create({
            baseURL: 'https://apps.edustar.vic.edu.au',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.42' },
            httpAgent,
            httpsAgent,
            proxy: false,
        });
    }
    async validate() {
        try {
            const response = await this.client.get('/');
            log.debug(response);
            if (!response || !response.data)
                throw Error("No response.");
            if (!response.data.includes("Department of Education and Early Childhood Development"))
                throw Error("Malformed response.");
            return response.data;
        }
        catch (e) {
            const error = e;
            if (error.response && error.response.status === 401)
                throw Error("401 Validation error. This is likely due to access behind a VPN.");
            throw Error(error.message);
        }
    }
    async login(username, password) {
        const data = {
            username,
            password,
            SubmitCreds: 'Log in',
            trusted: '0',
            formdir: '3',
            forcedownlevel: '0',
            flags: '0',
            curl: 'Z2FedustarmcZ2Fstudent_passwords',
        };
        const searchParams = new URLSearchParams(data);
        const encoded = searchParams.toString();
        try {
            const response = await this.client.post("/CookieAuth.dll?Logon", encoded);
            log.debug(response);
            if (!response || !response.data)
                throw (Error("No response."));
            const cookies = await this.jar.getCookies(response.config.baseURL);
            if (!cookies || cookies.length <= 0) {
                const dom = new JSDOM(response.data);
                const error = dom.window.document.querySelector('.wrng');
                if (error && error.textContent) {
                    throw (Error(error.textContent));
                }
                throw (Error("Unknown Error."));
            }
            this.username = username;
        }
        catch (e) {
            const error = e;
            if (error.response && error.response.status === 401)
                throw Error("401 Validation error. This is likely due to access behind a VPN.");
            throw Error(error.message);
        }
    }
    async getUsers() {
        const cache = await this.getUserCache();
        const ret = (users) => { this.users = users; return this.users; };
        if (!cache)
            return ret(await this.download());
        if ((((new Date().valueOf()) - new Date(cache.date).valueOf()) / 1000 / 60) >= (this.cachePolicy))
            return ret(await this.download());
        return ret(cache.data);
    }
    async getUserCache() {
        if (!fs.existsSync(`${paths.cache}/${this.school}.users.json`))
            return;
        try {
            const cached = fs.readFileSync(`${paths.cache}/${this.school}.users.json`, 'utf8');
            const hash = JSON.parse(cached);
            const data = await decrypt(hash);
            const cache = JSON.parse(data);
            return cache;
        }
        catch (e) {
            log.warn("Failed to read STMC cache.");
            return;
        }
    }
    async cache(data) {
        const cache = JSON.stringify({ date: new Date(), username: this.username, data });
        const hash = await encrypt(cache);
        fs.writeFileSync(`${paths.cache}/${this.school}.users.json`, JSON.stringify(hash));
    }
    async download() {
        try {
            const response = await this.client.get(`/edustarmc/api/MC/GetStudents/${this.school}/FULL`);
            if (!response || !response.data || typeof (response.data) !== "object")
                throw (Error("No response."));
            this.cache(response.data);
            return response.data;
        }
        catch (e) {
            if (e.response.data.Message && e.response.data.Message.includes("Object reference"))
                throw (Error("Incorrect School ID."));
            throw e;
        }
    }
    bindEduhub() {
        for (const row in this.users || []) {
            const starUser = this.users[row];
            const possible_matches = [];
            for (const hubUser of this.eduhub || []) {
                if (["LEFT", "LVNG", "DEL"].includes(hubUser.STATUS))
                    continue; //REVIEW - this should be a gui toggle; saves time but some may want these matches.
                if (!hubUser.STKEY || !hubUser.SURNAME)
                    continue;
                let hits = 0;
                const DISPLAY_NAME = `${hubUser.PREF_NAME} ${hubUser.SURNAME}`;
                const LASTNAME_ABREV = hubUser.SURNAME.trim().toLowerCase().slice(0, 3);
                if (starUser._displayName === DISPLAY_NAME)
                    hits++;
                if (starUser._displayName.trim().toLowerCase() === DISPLAY_NAME.trim().toLowerCase())
                    hits++;
                if (starUser._firstName === hubUser.FIRST_NAME)
                    hits++;
                if (starUser._firstName === hubUser.PREF_NAME)
                    hits++;
                if (starUser._firstName.trim().toLowerCase() === hubUser.PREF_NAME.trim().toLowerCase())
                    hits++;
                if (starUser._firstName.trim().toLowerCase() === hubUser.FIRST_NAME.trim().toLowerCase())
                    hits++;
                if (starUser._lastName === hubUser.SURNAME)
                    hits++;
                if (starUser._lastName.trim().toLowerCase() === hubUser.SURNAME.trim().toLowerCase())
                    hits++;
                if (hits <= 0)
                    continue;
                if (starUser._login.trim().toLowerCase()[0] === hubUser.FIRST_NAME.trim().toLowerCase()[0])
                    hits++;
                if (starUser._login.trim().toLowerCase().slice(-3).includes(LASTNAME_ABREV))
                    hits++;
                if (starUser._login.slice(-3) === hubUser.SURNAME)
                    hits++;
                if (starUser._class.trim().toLowerCase() === hubUser.HOME_GROUP.trim().toLowerCase())
                    hits++;
                if (starUser._desc === hubUser.SCHOOL_YEAR)
                    hits++;
                if (hubUser.STATUS === "ACTV")
                    hits++;
                if (!starUser._disabled)
                    hits++;
                possible_matches.push({ hits, starUser, hubUser });
            }
            if (possible_matches.length <= 0)
                continue;
            const best_match = possible_matches.reduce(function (prev, current) {
                return (prev && prev.hits > current.hits) ? prev : current;
            }); //TODO - make gui toggle to ensure certainty; maybe a slider?
            if (!best_match)
                continue;
            this.users[row]._eduhub = best_match.hubUser.STKEY;
        }
        return this.users;
    }
}
