import { Component } from "~/model/Component";

export const validationPersonalNumberComponent = new Component({
    id: "validation-personal-number",
    name: "Personal Number Validation",
    tags: ["validation"],
    description: `Validation function for Czech personal numbers. Format: xxxxxx/xxxx (6 digits, slash, 4 digits).`,
    html: { "html": "" },
    css: { "css": "" },
    js: {
        "isValidPersonalNumber": `const isValidPersonalNumber = (personalNumber) => {
    if (!personalNumber || personalNumber.trim().length === 0) return false
    // Format: xxxxxx/xxxx (6 digits, slash, 4 digits)
    const personalNumberRegex = /^\\d{6}\\/\\d{4}$/
    return personalNumberRegex.test(personalNumber.trim())
}`
    },
    sql: { "sql": `` }
});
