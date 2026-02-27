import { Component } from "~/model/Component";

export const supervisorAllergenIdsComponent = (selectedSystemStore: any) => new Component({
    id: "supervisor-allergen-ids",
    name: "Supervisor Allergen IDs",
    tags: ["supervisors"],
    description: `SQL for getting supervisor allergen IDs.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT allergen_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors_allergens')} WHERE supervisor_id = ?` }
});
