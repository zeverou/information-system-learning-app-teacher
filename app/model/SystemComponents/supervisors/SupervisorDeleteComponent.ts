import { Component } from "~/model/Component";

export const supervisorDeleteComponent = (selectedSystemStore: any) => new Component({
    id: "supervisor-delete",
    name: "Supervisor Delete",
    tags: ["supervisors"],
    description: `SQL for deleting a supervisor.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} WHERE supervisor_id = ?` }
});
