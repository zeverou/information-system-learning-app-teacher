import { Component } from "~/model/Component";

export const participantsPageCount1Component = new Component({
    id: "participants-page-count-1",
    name: "Participants Page Count 1",
    tags: ["participants"],
    description: `Component for displaying page count.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "Math.ceil(totalItems / itemsPerPage)" },
    sql: { "sql": "" }
});
