import { Component } from "~/model/Component";

export const supervisorsAllergenOptionsComponent = (selectedSystemStore: any) => new Component({
    id: "supervisors-allergen-options",
    name: "Supervisors Allergen Options",
    tags: ["supervisors"],
    description: `SQL for getting allergen options (same table).`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT allergen_id, name from ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')}` }
});
