import { CSV } from "./providers.js";
import ldap from "../modules/ldap.js";
import { decrypt } from "../modules/cryptography.js";
import Handlebars from "handlebars";
import createUser from "./actions/DirCreateUser.js";
import enableUser from "./actions/DirEnableUser.js";
import writePDF from "./actions/DocWritePDF.js";
import sendToPrinter from "./actions/DocSendToPrinter.js";
import templateData from "./actions/SysTemplate.js";
import { server } from "../server.js";
import disableUser from "./actions/DirDisableUser.js";
import deleteFile from "./actions/FileDelete.js";
import moveFile from "./actions/FileMove.js";
import copyFile from "./actions/FileCopy.js";
import copyFolder from "./actions/FolderCopy.js";
import moveFolder from "./actions/FolderMove.js";
import deleteFolder from "./actions/FolderDelete.js";
import deleteUser from "./actions/DirDeleteUser.js";
import moveOU from "./actions/DirMoveOU.js";
import updateAtt from "./actions/DirUpdateAtt.js";
async function getRows(connector, attribute) {
    switch (connector.id) {
        case 'csv': {
            const csv = new CSV(connector.path);
            const data = await csv.open();
            return { rows: data.data, connector, object: {} };
        }
        case 'ldap': {
            const client = new ldap();
            await client.connect(connector.url);
            const password = await decrypt(connector.password);
            await client.login(connector.username, password);
            let base = await client.getRoot();
            if ((connector.base || '') !== '')
                base = `${connector.base},${base}`;
            client.base = base;
            const mustHave = ['sAMAccountName', 'userPrincipalName', 'cn', 'distinguishedName', 'userAccountControl', 'memberOf'];
            let attributes = [];
            if (connector.attributes.length > 0) {
                attributes = connector.attributes;
                for (const a of mustHave)
                    if (!attributes.includes(a))
                        attributes.push(a);
            }
            const { array, object } = await client.getUsers(attributes, attribute);
            return { rows: array, client, connector, object };
        }
        default: throw Error("Unknown connector.");
    }
}
async function match(operator, key, value, connections, id) {
    const user = (key in connections) && (id in connections[key].object) && connections[key].object[id];
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
        case 'exists': return !!user;
        case 'notexists': return !user;
        case 'enabled': return user && user.enabled();
        case 'disabled': return user && user.disabled();
        case 'member': return user && user.hasGroup(value);
        case 'notmember': return user && user.hasGroup(value);
        case 'child': return user && user.childOf(value);
        case 'notchild': return user && user.childOf(value);
        default: return false;
    }
}
async function matchDelimited(key, value, condition, connections, id) {
    const delimited = value.split(condition.delimiter);
    for (const value of delimited) {
        if (await match(condition.operator, key, value, connections, id))
            return true;
    }
    return false;
}
async function matchCondition(condition, template, connections, id) {
    const key = Handlebars.compile(condition.key)(template);
    const value = Handlebars.compile(condition.value)(template);
    const delimiter = condition.delimiter !== "";
    return delimiter ? await matchDelimited(key, value, condition, connections, id) : await match(condition.operator, key, value, connections, id);
}
async function matchedAllConditions(conditions, template, connections, id) {
    for (const condition of conditions) {
        if (!(await matchCondition(condition, template, connections, id)))
            return false;
    }
    return true;
}
const actionMap = {
    'Create User': createUser,
    'Enable User': enableUser,
    'Disable User': disableUser,
    'Delete User': deleteUser,
    'Move Organisational Unit': moveOU,
    'Update Attributes': updateAtt,
    'Write PDF': writePDF,
    'Send To Printer': sendToPrinter,
    'Delete File': deleteFile,
    'Move File': moveFile,
    'Copy File': copyFile,
    'Copy Folder': copyFolder,
    'Move Folder': moveFolder,
    'Delete Folder': deleteFolder,
    'Template': templateData,
    //NOTE - Should work in theory, but not currently implemented due to arbitrary code execution vulnerability concerns:
    //LINK - server\src\components\actions\SysRunCommand.tsx
    // 'Run Command': runCommand,
    //REVIEW - add icacls? might also be vulnerable. https://4sysops.com/archives/icacls-list-set-grant-remove-and-deny-permissions/
};
async function getActions(actions, connections, template, execute = false) {
    const todo = [];
    let _template = template;
    for (const action of actions) {
        if (!(action.name in actionMap))
            continue;
        const result = await actionMap[action.name](execute, action, _template, connections);
        if (result.template && result.data) {
            _template = { ..._template, ...result.data };
        }
        todo.push({ name: action.name, result });
        if (result.error || result.warning)
            return todo;
    }
    return todo;
}
function calculateTimeRemaining(currentWork, totalWork, speed) {
    if (speed <= 0)
        return "Estimating...";
    const timeRemainingInSeconds = (totalWork - currentWork) / speed;
    const hours = Math.floor(timeRemainingInSeconds / 3600);
    const minutes = Math.floor((timeRemainingInSeconds % 3600) / 60);
    const seconds = Math.round(timeRemainingInSeconds % 60);
    const formattedTime = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedTime;
}
let curTime = (new Date()).getTime();
export default async function findMatches(schema, rule, limitTo) {
    server.io.emit("global_status", { schema: schema.name, rule: rule.name, running: !!limitTo });
    server.io.emit("job_status", "Loading Primary");
    const primaryConnector = schema._connectors[rule.primary];
    const primary = await getRows(primaryConnector, rule.primaryKey);
    server.io.emit("job_status", "Loading Secondaries");
    const secondaries = {};
    for (const secondary of rule.secondaries || []) {
        const rows = await getRows(schema._connectors[secondary.primary], secondary.secondaryKey);
        secondaries[secondary.primary] = { ...rows, ...secondary };
    }
    server.io.emit("job_status", "Matching Data");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matches = [];
    let i = 0;
    if (limitTo)
        primary.rows = primary.rows.filter(p => limitTo.includes(p[rule.primaryKey]));
    for (const object of primary.rows) {
        const id = object[rule.primaryKey];
        i++;
        if (Math.abs(new Date().getTime() - curTime) > 1) {
            const eta = calculateTimeRemaining(i, primary.rows.length, 100);
            const p = (i / primary.rows.length) * 100;
            server.io.emit("progress", { eta, i, p, m: primary.rows.length });
            server.io.emit("job_status", `Proccessing ${id}`);
            curTime = (new Date()).getTime();
        }
        const template = {};
        template[`${rule.primary}`] = object;
        for (const name of Object.keys(secondaries)) {
            const secondary = secondaries[name];
            let found;
            for (const row of secondary.rows) {
                if (row[secondary.secondaryKey] === object[secondary.primaryKey])
                    found = row;
            }
            if (!found)
                continue;
            template[`${name}`] = found || {};
        }
        const connections = { ...secondaries, [rule.primary]: primary };
        const todo = await getActions(rule.actions, connections, template, !!limitTo);
        const display = rule.display !== '' ? Handlebars.compile(rule.display)(template) : id;
        if (!(await matchedAllConditions(rule.conditions, template, connections, id)))
            continue;
        const actionable = todo.filter(t => t.result.warning || t.result.error).length <= 0;
        matches.push({ id, display, actions: todo, actionable });
    }
    server.io.emit("job_status", "Idle");
    server.io.emit("global_status", {});
    return matches;
}
export async function runActionFor(schema, rule, limitTo) {
    if (!limitTo || limitTo.length <= 0)
        throw (Error("Unreviewed bulk actions not allowed"));
    return findMatches(schema, rule, limitTo);
}
