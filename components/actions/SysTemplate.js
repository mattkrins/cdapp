import Handlebars from "../../modules/handlebars.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function templateData(execute = false, act, template) {
    const action = act;
    try {
        const newTemplate = {};
        for (const t of action.templates) {
            const name = Handlebars.compile(t.name || "")(template);
            const value = Handlebars.compile(t.value || "")(template);
            newTemplate[name] = value;
        }
        return { template: true, data: newTemplate };
    }
    catch (e) {
        return { error: String(e) };
    }
}
