import { Component } from "~/model/Component";

export const sessionsListComponent = (selectedSystemStore: any) => new Component({
    id: "sessions-list",
    name: "Sessions List",
    tags: ["sessions"],
    description: `SQL for getting all sessions.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            SELECT session_id, from_date, to_date, capacity
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}
            ORDER BY session_id
        ` }
});
