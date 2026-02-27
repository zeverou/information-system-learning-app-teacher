import { Component } from "~/model/Component";

export const supervisorUpdateComponent = (selectedSystemStore: any) => new Component({
    id: "supervisor-update",
    name: "Supervisor Update",
    tags: ["supervisors"],
    description: `SQL for updating a supervisor.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            UPDATE ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')}
            SET name = ?, email = ?, personal_number = ?, phone = ?, address = ?, age = ?
            WHERE supervisor_id = ?
        `
    }
});
