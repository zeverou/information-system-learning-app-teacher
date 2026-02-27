import { Component } from "~/model/Component";

export const supervisorsSessionsComponent = (selectedSystemStore: any) => new Component({
    id: "supervisors-sessions",
    name: "Supervisors Sessions",
    tags: ["supervisors"],
    description: `SQL for getting supervisors sessions.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            SELECT ss.supervisor_id, s.session_id
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} s ON ss.session_id = s.session_id
        `
    }
});
