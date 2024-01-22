import * as fs from 'fs';
import Papa from 'papaparse';
import { getSchema } from '../routes/schema.js';
import eduSTAR from '../modules/eduSTAR.js';
import { decrypt } from '../modules/cryptography.js';
export class CSV {
    constructor(path, encoding) {
        Object.defineProperty(this, "path", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "encoding", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'utf8'
        });
        this.path = path;
        this.encoding = encoding || 'utf8';
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    open(header = true) {
        return new Promise((resolve, reject) => {
            try {
                const file = fs.createReadStream(this.path, this.encoding);
                Papa.parse(file, {
                    header,
                    complete: resolve,
                    error: reject
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
export class STMC {
    constructor(schema, school, proxy, eduhub) {
        Object.defineProperty(this, "schema", {
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
        Object.defineProperty(this, "proxy", {
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
        this.schema = schema;
        this.school = school;
        this.proxy = proxy;
        this.eduhub = eduhub;
    }
    async configure() {
        const schema = getSchema(this.schema);
        if (this.proxy && String(this.proxy).trim() !== "") {
            if (!schema._connectors[String(this.proxy)])
                throw Error(`Connector '${this.proxy}' does not exist.`);
            const connector = schema._connectors[String(this.proxy)];
            const url = new URL(connector.url);
            if (connector.username)
                url.username = connector.username;
            if (connector.password)
                url.password = await decrypt(connector.password);
            this.proxy = url;
        }
        let data;
        if (this.eduhub) {
            if (!schema._connectors[this.eduhub])
                throw Error(`Connector '${this.eduhub}' does not exist.`);
            const connector = schema._connectors[this.eduhub];
            const csv = new CSV(connector.path);
            data = await csv.open();
        }
        return new eduSTAR({
            school: this.school,
            proxy: this.proxy,
            eduhub: data?.data
        });
    }
}
