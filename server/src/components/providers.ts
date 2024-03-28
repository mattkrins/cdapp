import * as fs from 'fs';
import { Schema, connection, connections } from "../typings/common.js";
import Papa, { ParseResult } from 'papaparse';
import eduSTAR from '../modules/eduSTAR.js';
import { Hash, decrypt } from '../modules/cryptography.js';
import { PROXY, anyProvider, CSV as CSVProvider, STMC as STMCProvider, LDAP as LDAPProvider } from '../typings/providers.js';
import ldap from '../modules/ldap.js';
import { server } from '../server.js';

interface connectorConfig {[k: string]: unknown}
export default async function connect(schema: Schema, connectorName: string, connections: connections, id: string, config: connectorConfig = {}, caseSen = false): Promise<connection> {
    if (connections[connectorName]) return connections[connectorName];
    const provider = schema._connectors[connectorName] as anyProvider;
    server.io.emit("job_status", `Connecting to ${connectorName}`);
    let connection: connection = {rows:[], keyed: {}, provider};
    switch (provider.id) {
        case 'stmc': {
            const stmc = new STMC(schema, provider as STMCProvider, config); //TODO - move to options, config
            const client = await stmc.configure();
            const users = await client.getUsers();
            const keyed: {[k: string]: object} = {};
            const rows = [];
            for (const row of users){
                if (keyed[row[id]]) continue;
                keyed[caseSen?row[id]:row[id].toLowerCase()] = row;
                rows.push(row);
            }
            connection = { rows: users, provider, client, keyed }; break;
        }
        case 'csv': {
            const csv = new CSV(undefined, undefined, provider as CSVProvider );
            const data = await csv.open() as { data: {[k: string]: string}[] };
            const keyed: {[k: string]: object} = {}; //TODO - add config
            const rows = [];
            for (const row of data.data){
                if (keyed[row[id]]) continue;
                keyed[caseSen?row[id]:row[id].toLowerCase()] = row;
                rows.push(row);
            } data.data = [];
            connection = { rows, provider, keyed }; break;
        }
        case 'ldap': {
            const ldap = new LDAP(provider as LDAPProvider, config);
            const client = await ldap.configure();
            const { users, keyed } = await client.search(ldap.attributes, id, caseSen);
            const close = async () => client.close();
            connection = { rows: users, keyed, provider, client, close }; break;
        }
        default: throw Error("Unknown connector.");
    } connections[connectorName] = connection; return connection;
}

export class CSV {
    private path: string;
    private encoding: BufferEncoding = 'utf8';
    constructor(path?: string, encoding?: BufferEncoding, connector?: CSVProvider) { //TODO - move to config
        this.path = connector ? connector.path : (path || '');
        this.encoding = connector ? connector.encoding : (encoding || 'utf8');
    }
    async validate() {
        if (!this.path || !fs.existsSync(this.path)) throw Error("Path does not exist.");
        if (!(fs.lstatSync(this.path as string).isFile())) throw Error("Path is not a file.");
        await this.open();
    }
    open(header=true, autoClose=true): Promise<ParseResult<unknown>> {
        return new Promise((resolve, reject) => {
            try {
                const file = fs.createReadStream(this.path, this.encoding);
                Papa.parse(file, {
                    header,
                    complete: (result: Papa.ParseResult<unknown> | PromiseLike<Papa.ParseResult<unknown>>) => {
                        if (autoClose) file.close();
                        return resolve(result);
                    },
                    error: (reason?: unknown) => {
                        if (autoClose) file.close();
                        return reject(reason);
                    }
                });
            } catch (e) { reject(e); }
        });
    }
}

interface STMCConfig extends connectorConfig {
    match?: string;
    inactive?: boolean;
}
export class STMC {
    private schema: Schema;
    private connector: STMCProvider;
    private proxy?: URL|string;
    private config: STMCConfig;
    constructor(schema: Schema, connector: STMCProvider, config: STMCConfig) {
        this.schema = schema;
        this.connector = connector;
        this.proxy = connector.proxy;
        this.config  = config;
    }
    async validate() {
        //TODO - check inputs
        await this.configure();
    }
    private async eduhub(name: string): Promise<{ data: {[k: string]: string}[] }> {
        if (!this.schema._connectors[name]) throw Error(`Connector '${name}' does not exist.`);
        const connector = this.schema._connectors[name] as CSVProvider;
        const csv = new CSV(connector.path);
        return await csv.open() as { data: {[k: string]: string}[] };
    }
    public async configure(): Promise<eduSTAR> {
        if (this.proxy && String(this.proxy).trim()!==""){
            if (!this.schema._connectors[String(this.proxy)]) throw Error(`Connector '${this.proxy}' does not exist.`);
            const connector = this.schema._connectors[String(this.proxy)] as PROXY;
            const url = new URL(connector.url);
            if (connector.username) url.username = connector.username;
            if (connector.password) url.password = await decrypt(connector.password as Hash);
            this.proxy = url;
        }
        const eduhub = this.config.match ? (await this.eduhub(this.config.match)).data : undefined;
        const client = new eduSTAR({
            school: this.connector.school,
            proxy: this.proxy,
            inactive: this.config.inactive,
            eduhub
        });
        const password = await decrypt(this.connector.password as Hash);
        await client.login(this.connector.username, password);
        return client;
    }
}

interface LDAPConfig extends connectorConfig {
    filter?: string;
}
export class LDAP {
    private mustHave = ['sAMAccountName', 'userPrincipalName', 'cn', 'uid', 'distinguishedName', 'userAccountControl', 'memberOf'];
    public attributes: string[] = this.mustHave;
    private connector: LDAPProvider;
    private config: LDAPConfig;
    constructor(connector: LDAPProvider, config: LDAPConfig) {
        this.connector = connector;
        this.config = config;
    }
    async validate() {
        //TODO - check inputs
        await this.configure();
    }
    public async configure(): Promise<ldap> {
        const client = new ldap();
        if (this.config.filter) client.filter = this.config.filter;
        await client.connect(this.connector.url);
        const password = await decrypt(this.connector.password as Hash);
        await client.login(this.connector.username, password);
        let base: string = this.connector.dse || await client.getRoot();
        if (!base || base.trim()==='') throw Error("Root DSE is empty.");
        if ((this.connector.base||'')!=='') base = `${this.connector.base},${base}`;
        client.base = base;
        if (this.connector.attributes.length>0) {
            this.attributes = this.connector.attributes;
            for (const a of this.mustHave) if (!this.attributes.includes(a)) this.attributes.push(a);
        }
        return client;
    }
}

export type provider = typeof CSV|typeof STMC|typeof LDAP;
export const providers: { [id: string]: provider } = {
    csv: CSV,
    stmc: STMC,
    ldap: LDAP,
}