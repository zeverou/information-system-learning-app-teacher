import { Component } from "~/model/Component";

export const validationPhoneComponent = new Component({
    id: "validation-phone",
    name: "Phone Validation",
    tags: ["validation"],
    description: `Validation function for Czech phone numbers. Supports multiple formats including +420 prefix.`,
    html: { "html": "" },
    css: { "css": "" },
    js: {
        "isValidPhone": `const isValidPhone = (phone) => {
    if (!phone || phone.trim().length === 0) return false
    // Czech phone number regex: supports multiple formats
    // +420 xxx xxx xxx, +420xxxxxxxxx, xxx xxx xxx, xxxxxxxxx
    const phoneRegex = /^(\\+420\\s?)?(\\d{3}\\s?\\d{3}\\s?\\d{3}|\\d{9})$/
    const cleanPhone = phone.trim().replace(/\\s+/g, '')
    return phoneRegex.test(cleanPhone)
}`
    },
    sql: { "sql": `` }
});
