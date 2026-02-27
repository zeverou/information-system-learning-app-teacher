import { Component } from "~/model/Component";

export const participantsBadgeComponent = (selectedSystemStore: any) => new Component({
    id: "participants-badge",
    name: "Participants Badge",
    tags: ["participants"],
    description: `SQL for getting all participants.`,
    html: {
        "html": `<div style="display: inline-flex; align-items: center; padding: 0.25rem 0.75rem; font-size: 0.875rem; font-weight: 600; border-radius: 9px; background-color: #f0f9ff; color: #0284c7; border: 1px solid rgba(2, 132, 199, 0.1); white-space: nowrap;">{{age}}</div>`
    },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            SELECT participant_id, name, email, personal_number, phone, address, age
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}
            ORDER BY participant_id
        ` }
});
