import { Component } from "~/model/Component";

export const supervisorsSampleComponent = (selectedSystemStore: any) => new Component({
    id: "supervisors-sample",
    name: "Supervisors Sample",
    tags: ["supervisors"],
    description: `SQL for getting supervisors sample.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT supervisor_id, name, email FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} ORDER BY supervisor_id DESC LIMIT 3` }
});
