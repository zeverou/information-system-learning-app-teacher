import { Component } from "~/model/Component";

export const supervisorAllergenCountComponent = (selectedSystemStore: any) => new Component({
    id: "supervisor-allergen-count",
    name: "Supervisor Allergen Count",
    tags: ["supervisors"],
    description: `SQL for counting supervisor allergens.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors_allergens')} WHERE supervisor_id = ?` }
});
