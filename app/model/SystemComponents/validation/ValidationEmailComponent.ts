import { Component } from "~/model/Component";

export const validationEmailComponent = new Component({
    id: "validation-email",
    name: "Email Validation",
    tags: ["validation"],
    description: `Validation function for email addresses using regex pattern.`,
    html: { "html": "" },
    css: { "css": "" },
    js: {
        "isValidEmail": `const isValidEmail = (email) => {
    if (!email || email.trim().length === 0) return false
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
    return emailRegex.test(email.trim())
}`
    },
    sql: { "sql": `` }
});
