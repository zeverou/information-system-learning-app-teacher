import { Component } from "~/model/Component";

export const supervisorInsertComponent = (selectedSystemStore: any) => new Component({
    id: "supervisor-insert",
    name: "Supervisor Insert",
    tags: ["supervisors"],
    description: `SQL for inserting a supervisor.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} (name, email, personal_number, phone, address, age)
            VALUES (?, ?, ?, ?, ?, ?)
        `
    }
});
