import { Component } from "~/model/Component";

export const supervisorGetIdComponent = (selectedSystemStore: any) => new Component({
    id: "supervisor-get-id",
    name: "Supervisor Get ID",
    tags: ["supervisors"],
    description: `SQL for getting supervisor ID after insert.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            SELECT supervisor_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')}
            WHERE name = ? AND email = ?
            ORDER BY supervisor_id DESC LIMIT 1
        `
    }
});
