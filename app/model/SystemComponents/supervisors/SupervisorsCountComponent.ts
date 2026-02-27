import { Component } from "~/model/Component";

export const supervisorsCountComponent = (selectedSystemStore: any) => new Component({
    id: "supervisors-count",
    name: "Supervisors Count",
    tags: ["supervisors"],
    description: `SQL for counting supervisors.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')}` }
});
