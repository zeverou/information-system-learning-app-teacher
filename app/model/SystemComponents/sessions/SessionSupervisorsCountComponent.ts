import { Component } from "~/model/Component";

export const sessionSupervisorsCountComponent = (selectedSystemStore: any) => new Component({
    id: "session-supervisors-count",
    name: "Session Supervisors Count",
    tags: ["sessions"],
    description: `Component showing the count of supervisors for a session.`,
    html: {
        "html": ``
    },
    css: {
        "css": ``
    },
    js: { "js": `` },
    sql: {
        "sql-1": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss ON s.supervisor_id = ss.supervisor_id WHERE ss.session_id = ?`,
    }
});
