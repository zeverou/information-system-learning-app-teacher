import { Component } from "~/model/Component";

export const validationNameComponent = new Component({
    id: "validation-name",
    name: "Name Validation",
    tags: ["validation"],
    description: `Validation function for participant/supervisor names. Ensures first and last name are provided.`,
    html: { "html": "" },
    css: { "css": "" },
    js: {
        "isValidName": `const isValidName = (name) => {
    if (!name || name.trim().length === 0) return false
    // Must have at least one space (first and last name)
    return name.trim().split(' ').length >= 2
}`
    },
    sql: { "sql": `` }
});
