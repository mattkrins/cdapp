import Handlebars from "../../modules/handlebars.js";
import * as fs from 'fs';
export default async function folderCreate(execute = false, act, template) {
    const action = act;
    const data = {};
    try {
        data.recursive = String(action.recursive);
        data.target = Handlebars.compile(action.target)(template);
        if (!execute)
            return { data };
        if (!fs.existsSync(data.target))
            fs.mkdirSync(data.target, { recursive: action.recursive });
        return { success: true, data };
    }
    catch (e) {
        return { error: String(e), data };
    }
}
