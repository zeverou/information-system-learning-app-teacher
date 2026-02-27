import { Component } from "~/model/Component";

export const supervisorAllergenDeleteComponent = (selectedSystemStore: any) => new Component({
    id: "supervisor-allergen-delete",
    name: "Supervisor Allergen Delete",
    tags: ["supervisors"],
    description: `SQL for deleting supervisor-allergen association.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors_allergens')} WHERE supervisor_id = ? AND allergen_id = ?` }
});
