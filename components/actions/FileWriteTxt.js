import Handlebars from "../../modules/handlebars.js";
import * as fs from 'fs';
function openStream(path) {
    return new Promise((resolve, reject) => {
        const a = fs.createWriteStream(path, { flags: 'a' });
        a.on('error', reject);
        resolve(a);
    });
}
function closeStream(stream) {
    return new Promise((resolve, reject) => {
        if (!stream)
            return resolve();
        stream.close((e) => e ? reject(e) : resolve());
    });
}
export default async function fileWriteTxt(execute = false, act, template, _connections, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
fileHandles, close) {
    const action = act;
    const data = {};
    try {
        data.target = Handlebars.compile(action.target)(template);
        data.data = Handlebars.compile(action.data)(template);
        if (action.validate)
            if (!fs.existsSync(data.target))
                return { warning: `Target path does not exist.`, data };
        if (!execute)
            return { data };
        if (!fileHandles[action.target])
            fileHandles[action.target] = { type: 'fileStream', id: action.target, handle: await openStream(data.target) };
        fileHandles[action.target].handle.write(data.data + (action.newline ? "\r\n" : ''));
        if (close && fileHandles[action.target]) {
            await closeStream(fileHandles[action.target].handle);
            delete fileHandles[action.target];
        }
        return { success: true, data };
    }
    catch (e) {
        return { error: String(e), data };
    }
}
