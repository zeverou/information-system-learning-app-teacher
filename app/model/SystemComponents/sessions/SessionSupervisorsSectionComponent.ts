import { Component } from "~/model/Component";

export const sessionSupervisorsSectionComponent = (selectedSystemStore: any) => new Component({
    id: "session-supervisors-section",
    name: "Session Supervisors Section",
    tags: ["sessions"],
    description: `Component showing the list of supervisors for a session with avatars and contact details.`,
    html: {
        "html": ``
    },
    css: {
        "css": ``
    },
    js: { "js": `` },
    sql: {
        "sql-1": `SELECT s.* FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss ON s.supervisor_id = ss.supervisor_id WHERE ss.session_id = ?`,
        "sql-2": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss ON s.supervisor_id = ss.supervisor_id WHERE ss.session_id = ?`,
    }
});
