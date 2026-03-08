import type { ComponentVariables } from "~/model/ComponentVariables";

export class HtmlHandler {
    public static ReplaceHtmlForVariables(variables: ComponentVariables, html: string): string {
        if (!html) return "";

        let result = html;
        const allVariables = {
            ...(variables.generalVariables || {}),  // lowest priority — overridden by SQL/JS vars
            ...(variables.sqlVariables || {}),
            ...(variables.jsVariables || {})
        };

        for (const [key, value] of Object.entries(allVariables)) {
            // Match {{ varName }} syntax or just varName without braces
            const escapedKey = key.replace(/([\\$])/g, '\\$1');
            const regex = new RegExp(`(?:\\{\\{\\s*)?(?<![a-zA-Z0-9_$])${escapedKey}(?![a-zA-Z0-9_$])(?:\\s*\\}\\})?`, 'g');

            let stringValue = "";
            if (Array.isArray(value)) {
                stringValue = value.map(v => v instanceof Date ? v.toISOString() : String(v)).join(", ");
            } else if (value instanceof Date) {
                stringValue = value.toISOString();
            } else if (value !== null && value !== undefined) {
                stringValue = String(value);
            }

            result = result.replace(regex, stringValue);
        }

        return result;
    }
}