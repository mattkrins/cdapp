import { compile } from "../../modules/handlebars.js";
import { Action } from "../../typings/common.js";
import { actionProps } from "../engine.js";
import * as fs from 'fs';
import pdfPrinter from "pdf-to-printer";
const { print } = pdfPrinter;
import { server } from "../../server.js";

interface props extends actionProps {
    action: Action & {
        source: string;
        target: string;
        validate: boolean;
    }
}
//TODO - rename this to PDF since it only prints PDFs
export default async function ({ action, template, execute, data }: props) {
    try {
        data.source = compile(template, action.source);
        data.target = action.target;
        if (action.validate) if (!fs.existsSync(data.source)) return {warning: `Souce path does not exist.`, data};
        if (!execute) return {data};
        let options = {};
        if (data.target!=="System Default"&&data.target!=="") options = { printer: data.target };
        server.io.emit("job_status", `Printing ${data.source}`);
        await print(data.source, options);
        return { success: true, data};
    } catch (e){
        return {error: String(e), data};
    }
}