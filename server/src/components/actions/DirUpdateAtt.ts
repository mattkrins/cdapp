import { Action, result, template } from "../../typings/common.js";
import { connections } from "../rules.js";
import Handlebars from "../../modules/handlebars.js";
import ldap, { User } from "../../modules/ldap.js";
import { default as ldapjs } from "ldapjs";

interface Attribute {
    type: 'Add'|'Replace'|'Delete';
    name: string;
    value: string;
}

interface UpdateAtt extends Action  {
    target: string;
    upn: string;
    attributes: Attribute[];
}

interface update extends Attribute {
    currentValue: string;
    success?: true;
    error?: string;
}

export default async function updateAtt(execute = false, act: Action, template: template, connections: connections, ): Promise <result> {
    const action = act as UpdateAtt;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: {[k: string]: any} = {};
    try {
        data.directory = action.target;
        if (!(action.target in connections)) return {error: 'Connector not found.', data};
        const client = connections[action.target].client as ldap;
        if (!client) return {error: 'LDAP client not found.', data};
        data.upn = Handlebars.compile(action.upn)(template);
        if (!ldap.validUpn(data.upn)) return {error: 'Invalid User Principal Name.', data};
        const attributes = action.attributes.map(a=>a.name);
        const found = await client.searchUser('userPrincipalName', data.upn, ['distinguishedName', ...attributes] );
        if (!found) return {error: `User does not exist.`, data};
        const user = new User(found, client.client );
        data.attributes = user.attributes;
        const changes: update[] = [];
        for (const a of action.attributes) {
            switch (a.type) {
                case 'Add': {
                    const value = Handlebars.compile(a.value||"")(template);
                    if (!(a.name in user.attributes)) changes.push({...a, value, currentValue: '' }); break;
                }
                case 'Replace': {
                    const value = Handlebars.compile(a.value||"")(template);
                    const currentValue = String(user.attributes[a.name]||'');
                    if (currentValue===value) break;
                    changes.push({...a, value, currentValue });
                    break;
                }
                case 'Delete': {
                    if (!(a.name in user.attributes)) break;
                    changes.push({...a, currentValue: '' }); break;
                }
                default: break;
            }
        }
        if (changes.length<=0) return {warning: `No changes required.`, data};
        data.changes = changes;
        if (!execute) return {data};

        for (const i in changes) {
            const a = changes[i];
            let change: ldapjs.Change|undefined;
            switch (a.type) {
                case 'Add': {
                    change = new ldapjs.Change({
                        operation: 'add',
                        modification: new ldapjs.Attribute({
                            type: a.name,
                            values: String(a.value)
                        })
                    }); break;
                }
                case 'Delete': {
                    change = new ldapjs.Change({
                        operation: 'delete',
                        modification: new ldapjs.Attribute({
                            type: a.name,
                        })
                    }); break;
                }
                default: {
                    change = new ldapjs.Change({
                        operation: 'replace',
                        modification: new ldapjs.Attribute({
                            type: a.name,
                            values: String(a.value)
                        })
                    });
                }
            }
            try {
                await user.change(change);
                changes[i].success = true;
            } catch (e) {
                changes[i].error = String(e);
            }
        }
        data.changes = changes;
        return { success: true, data};
    } catch (e){
        return {error: String(e), data};
    }
}
