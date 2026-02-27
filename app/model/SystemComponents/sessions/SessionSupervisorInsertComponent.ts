import { Component } from "~/model/Component";

export const sessionSupervisorInsertComponent = (selectedSystemStore: any) => new Component({
    id: "session-supervisor-insert",
    name: "Session Supervisor Insert",
    tags: ["sessions"],
    description: `SQL for inserting session-supervisor association.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} (session_id, supervisor_id) VALUES (?, ?)` }
});
