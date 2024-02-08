import { compile } from "../modules/handlebars.js";
import { Action, Condition, Rule, Schema } from "../typings/common.js";
import { anyProvider, CSV as CSVProvider, LDAP as LDAPProvider } from "../typings/providers.js";
import { CSV, LDAP } from "./providers.js";
import FileCopy from "./operations/FileCopy.js";
import SysComparator from "./operations/SysComparator.js";
import FileMove from "./operations/FileMove.js";
import FileDelete from "./operations/FileDelete.js";
import FileWriteTxt from "./operations/FileWriteTxt.js";
import DocWritePDF from "./operations/DocWritePDF.js";
import DocPrint from "./operations/DocPrint.js";
import FolderCopy from "./operations/FolderCopy.js";
import FolderMove from "./operations/FolderMove.js";
import FolderDelete from "./operations/FolderDelete.js";
import FolderCreate from "./operations/FolderCreate.js";
import SysTemplate from "./operations/SysTemplate.js";
import SysEncryptString from "./operations/SysEncryptString.js";
import { server } from "../server.js";
import StmcUpload from "./operations/StmcUpload.js";

export type actionProps = { action: Action, template: template, connections: connections, schema: Schema, execute: boolean, conclude: boolean, data: {[k: string]: string} };
interface template {[connector: string]: {[header: string]: string}}
interface connections { [k: string]: connection }
interface connection {
    rows: {[k: string]: string}[];
    provider?: anyProvider;
    client?: unknown;
    close?: () => Promise<unknown>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type operation = (props: any) => any;
const availableActions: { [k: string]: operation } = {
    //'Create User': createUser,
    //'Enable User': enableUser,
    //'Disable User': disableUser,
    //'Delete User': deleteUser,
    //'Move Organisational Unit': moveOU,
    //'Update Attributes': updateAtt,
    //'Update Groups': dirUpdateSec,
    'Send To Printer': DocPrint,
    'Write PDF': DocWritePDF,
    'Write To File': FileWriteTxt,
    'Delete File': FileDelete,
    'Move File': FileMove,
    'Copy File': FileCopy,
    'Copy Folder': FolderCopy,
    'Move Folder': FolderMove,
    'Delete Folder': FolderDelete,
    'Create Folder': FolderCreate,
    'Template': SysTemplate,
    'Encrypt String': SysEncryptString,
    'Comparator': SysComparator,
    'Upload Student Passwords': StmcUpload,
}

export async function connect(schema: Schema, connectorName: string, connections: connections): Promise<connection> {
    if (connections[connectorName]) return connections[connectorName];
    const provider = schema._connectors[connectorName] as anyProvider;
    server.io.emit("job_status", `Connecting to ${connectorName}`);
    let connection: connection = {rows:[], provider};
    switch (provider.id) {
        case 'csv': {
            const csv = new CSV(undefined, undefined, provider as CSVProvider );
            const data = await csv.open() as { data: {[k: string]: string}[] };
            connection = { rows: data.data, provider }; break;
        }
        case 'ldap': {
            const prov = provider as LDAPProvider;
            const ldap = new LDAP(prov);
            const client = await ldap.configure();
            const users = await client.search(ldap.attributes, (prov.filter && prov.filter.trim()!=='') ? prov.filter : undefined);
            const data = users.map(user=>user.stringified);
            const close = async () => client.close();
            connection = { rows: data, provider, close }; break;
        }
        default: throw Error("Unknown connector.");
    } connections[connectorName] = connection; return connection;
}

async function compare(key: string, value: string, operator: string, connections: connections): Promise<boolean> {
    // connect if needed
    switch (operator) {
        case '==': return key === value;
        case '!=': return key !== value;
        case '><': return key.includes(value);
        case '<>': return !key.includes(value);
        case '>*': return key.startsWith(value);
        case '*<': return key.endsWith(value);
        case '//': return (new RegExp(value, 'g')).test(key);
        case '===': return Number(key) === Number(value);
        case '!==': return Number(key) !== Number(value);
        case '>': return Number(key) > Number(value);
        case '<': return Number(key) < Number(value);
        case '>=': return Number(key) >= Number(value);
        case '<=': return Number(key) <= Number(value);
        default: return false;
    }
}

async function delimit(key: string, value: string, condition: Condition, connections: connections): Promise<boolean> {
    const delimited = value.split(condition.delimiter)
    for (const value of delimited) {
        if ( await compare(key, value, condition.operator, connections) ) return true;
    } return false;
}

async function evaluate(condition: Condition, template: template, connections: connections): Promise<boolean> {
    const key = compile(template, condition.key);
    const value = compile(template, condition.value);
    const delimiter = condition.delimiter !== "";
    return delimiter ? await delimit(key, value, condition, connections) : await compare(key, value, condition.operator, connections);
}

export async function evaluateAll(conditions: Condition[], template: template, connections: connections): Promise<boolean> {
    for (const condition of conditions) {
        if (!(await evaluate(condition, template, connections))) return false;
    } return true;
}

async function actions(actions: Action[], template: template, connections: connections, schema: Schema, execute = false) {
    let template_ = template;
    const todo: {name: string, result: {error?: string, warning?: string, data?: object, success?: true } }[] = [];
    for (const action of (actions||[])) {
        const result = await availableActions[action.name]({ action, template, connections, execute, schema, data: {} });
        if (!result) continue;
        if (result.template) template_ = { ...template_, ...result.data as object  };
        todo.push({name: action.name, result });
    } return todo;
}

async function conclude(connections: connections) {
    for (const connection of Object.values(connections)) {
        if (connection.close) await connection.close();
    } server.io.emit("job_status", "Idle");
}

export default async function process(schema: Schema , rule: Rule, idFilter?: string[]) {
    server.io.emit("job_status", `Search engine initialized`);
    const connections: connections = {};
    const primary = await connect(schema, rule.primary, connections);
    if (idFilter) primary.rows = primary.rows.filter(p=>idFilter.includes(p[rule.primaryKey]));
    for (const secondary of rule.secondaries||[]) await connect(schema, secondary.primary, connections);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matches: any[] = [];
    for (const row of primary.rows) {
        const id = row[rule.primaryKey];
        server.io.emit("job_status", `Proccessing ${id}`);
        const template: template = { [rule.primary]: row };
        for (const secondary of rule.secondaries||[])  {
            const joins = connections[secondary.primary].rows.filter(r=>r[secondary.secondaryKey]===row[secondary.primaryKey]);
            template[secondary.primary] = (joins.length <=0 || joins.length > 1) ? {} : joins[0];
        }
        if (!(await evaluateAll(rule.conditions, template, connections))) continue;
        const display = (rule.display && rule.display.trim()!=='') ? compile(template, rule.display) : id;
        if (!display || display.trim()==='') continue;
        const todo = await actions(rule.actions, template, connections, schema, !!idFilter)
        const actionable = todo.filter(t=>t.result.warning||t.result.error).length <= 0;
        matches.push({id, display, actions: todo, actionable});
    }
    await conclude(connections);
    return {matches, initActions: [], finalActions: []};
}