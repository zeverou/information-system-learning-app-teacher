import { Component } from "~/model/Component";

export const supervisorsPageCount1Component = new Component({
    id: "supervisors-page-count-1",
    name: "Supervisors Page Count 1",
    tags: ["supervisors"],
    description: `Component for displaying page count for supervisors.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "Math.ceil(totalItems / itemsPerPage)" },
    sql: { "sql": "" }
});
