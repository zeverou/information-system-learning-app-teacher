import { Component } from "~/model/Component";

export const supervisorsListComponent = (selectedSystemStore: any) => new Component({
    id: "supervisors-list",
    name: "Supervisors List",
    tags: ["supervisors"],
    description: `SQL for fetching supervisors list.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT * FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')}` }
});
