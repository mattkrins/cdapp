import ldap, { User } from "../../modules/ldap.js";
import Handlebars from "../../modules/handlebars.js";
export default async function deleteUser(execute = false, act, template, connections) {
    const action = act;
    const data = {};
    try {
        data.directory = action.target;
        if (!(action.target in connections))
            return { error: 'Connector not found.', data };
        const client = connections[action.target].client;
        if (!client)
            return { error: 'LDAP client not found.', data };
        data.upn = Handlebars.compile(action.upn)(template);
        if (!ldap.validUpn(data.upn))
            return { error: 'Invalid User Principal Name.', data };
        const found = await client.searchUser('userPrincipalName', data.upn, ['userAccountControl', 'distinguishedName']);
        if (!found)
            return { error: `User does not exist.`, data };
        const user = new User(found, client.client);
        if (!execute)
            return { data };
        await user.delete();
        return { success: true, data };
    }
    catch (e) {
        return { error: String(e), data };
    }
}
