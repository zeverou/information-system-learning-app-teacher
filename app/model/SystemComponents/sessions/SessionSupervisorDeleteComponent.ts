import { Component } from "~/model/Component";

export const sessionSupervisorDeleteComponent = (selectedSystemStore: any) => new Component({
    id: "session-supervisor-delete",
    name: "Session Supervisor Delete",
    tags: ["sessions"],
    description: `SQL for deleting session-supervisor association.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} WHERE session_id = ? AND supervisor_id = ?` }
});
