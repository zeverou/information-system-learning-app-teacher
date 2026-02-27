import { Component } from "~/model/Component";

export const participantsFilterInputComponent = new Component({
    id: "participants-filter-input",
    name: "Participants Filter Input",
    tags: ["participants"],
    description: `Component for filter input.`,
    html: { "html": "" },
    css: { "css": "" },
    js: {
        "js": `(p.name && p.name.toLowerCase().includes(text)) ||
           (p.email && p.email.toLowerCase().includes(text)) ||
           (p.phone && p.phone.toLowerCase().includes(text)) ||
           (p.address && p.address.toLowerCase().includes(text))`
    },
    sql: { "sql": "" }
});
