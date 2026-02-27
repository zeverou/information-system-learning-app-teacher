import { Component } from "~/model/Component";

export const supervisorAllergenInsertComponent = (selectedSystemStore: any) => new Component({
    id: "supervisor-allergen-insert",
    name: "Supervisor Allergen Insert",
    tags: ["supervisors"],
    description: `SQL for inserting supervisor-allergen association.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors_allergens')} (supervisor_id, allergen_id) VALUES (?, ?)` }
});
