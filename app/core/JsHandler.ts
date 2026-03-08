import type { VariableType } from "~/model/types/VariableType";

export class JsHandler {
    public static getSqlVariablesIntoJs(sqlVariables: Record<string, VariableType | VariableType[]>): string {
        let result: string = "";
        for (const [key, variable] of Object.entries(sqlVariables)) {
            const isArray = Array.isArray(variable);
            const samples = isArray ? (variable as any[]) : [variable];

            if (samples.length === 0 || samples[0] === undefined) continue;

            const firstValue = samples[0];
            let tsType = "string";

            if (typeof firstValue === "number") tsType = "number";
            else if (firstValue instanceof Date) tsType = "Date";

            const formatValue = (v: any) => {
                if (typeof v === "string") return JSON.stringify(v);
                if (v instanceof Date) return `new Date("${v.toISOString()}")`;
                return v;
            };

            if (isArray && (variable as any[]).length === 1) {
                // Single-item array — emit a scalar constant
                result += `const ${key}: ${tsType} = ${formatValue((variable as any[])[0])};\n`;
            } else if (isArray) {
                const valuesStr = (variable as any[]).map(formatValue).join(", ");
                result += `const ${key}: ${tsType}[] = [${valuesStr}];\n`;
            } else {
                result += `const ${key}: ${tsType} = ${formatValue(variable)};\n`;
            }
        }
        return result;
    }

    public static getJsVariables(jsCode: string): Record<string, VariableType | VariableType[]> {
        const result: Record<string, VariableType | VariableType[]> = {};
        if (!jsCode) return result;

        // remove single line and multi-line comments
        const cleanCode = jsCode
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*/g, '');

        // check for const and let declarations
        const regex = /(?:const|let)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)(?:\s*:\s*[^=]+)?\s*=\s*([\s\S]+?)(?=;|\n\s*(?:const|let|console|return|if|for|while|function)\b|$)/g;
        let match;

        while ((match = regex.exec(cleanCode)) !== null) {
            const varName = match[1];
            if (!varName) continue;

            const rawValue = match[2]?.trim();
            if (!rawValue) continue;

            let parsedValue: any;
            try {
                parsedValue = new Function(`return ${rawValue}`)();
            } catch (e) {
                parsedValue = rawValue;
            }

            if (typeof parsedValue === "number" || typeof parsedValue === "string") {
                result[varName] = parsedValue;
            } else if (parsedValue instanceof Date) {
                result[varName] = parsedValue;
            } else if (typeof parsedValue === "boolean") {
                result[varName] = parsedValue ? 1 : 0;
            } else if (Array.isArray(parsedValue)) {
                result[varName] = parsedValue
                    .filter(v => typeof v === "string" || typeof v === "number" || typeof v === "boolean" || v instanceof Date)
                    .map(v => typeof v === "boolean" ? (v ? 1 : 0) : v) as VariableType[];
            } else if (typeof parsedValue === "object" && parsedValue !== null) {
                try {
                    result[varName] = JSON.stringify(parsedValue);
                } catch {
                    result[varName] = String(parsedValue);
                }
            } else {
                result[varName] = String(parsedValue);
            }
        }

        return result;
    }
}