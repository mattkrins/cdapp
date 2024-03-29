import Handlebars from "../../modules/handlebars.js";
import { encryptString as encrypt } from "../../modules/cryptography.js";
function ensureMinimumValue(value) {
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
    return Math.max(numericValue, 100);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function encryptString(execute = false, act, template) {
    const action = act;
    const data = {};
    try {
        data.source = Handlebars.compile(action.source)(template);
        data.password = Handlebars.compile(action.password)(template);
        data.target = Handlebars.compile(action.target)(template);
        data.strength = action.value || "100";
        const strength = ensureMinimumValue(data.strength);
        const encrypted = await encrypt(data.source, data.password, strength);
        const newTemplate = {
            [data.target]: JSON.stringify(encrypted)
        };
        return { template: true, data: newTemplate };
    }
    catch (e) {
        return { error: String(e), data };
    }
}
