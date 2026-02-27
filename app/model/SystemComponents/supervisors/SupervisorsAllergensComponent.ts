import { Component } from "~/model/Component";

export const supervisorsAllergensComponent = (selectedSystemStore: any) => new Component({
    id: "supervisors-allergens",
    name: "Supervisors Allergens",
    tags: ["supervisors"],
    description: `SQL for getting supervisors allergens.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            SELECT sa.supervisor_id, a.allergen_id
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors_allergens')} sa
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} a ON sa.allergen_id = a.allergen_id
        `
    }
});
