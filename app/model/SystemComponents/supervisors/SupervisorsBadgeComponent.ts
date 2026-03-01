import { Component } from "~/model/Component";

export const supervisorsBadgeComponent = (selectedSystemStore: any) => new Component({
    id: "supervisors-badge",
    name: "Supervisors Badge",
    tags: ["supervisors"],
    description: `SQL for getting all supervisors.`,
    html: {
        "html": `<div class="supervisors-badge">{{age}}</div>`
    },
    css: {
        "css": `.supervisors-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            font-size: 0.875rem;
            font-weight: 600;
            border-radius: 9px;
            background-color: #f5f3ff;
            color: #7c3aed;
            border: 1px solid rgba(124, 58, 237, 0.1);
            white-space: nowrap;
        }`
    },
    js: { "js": "" },
    sql: {
        "sql": `
            SELECT supervisor_id, name, email, personal_number, phone, address, age
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')}
            ORDER BY supervisor_id
        ` }
});
