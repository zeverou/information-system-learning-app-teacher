import { Component } from "~/model/Component";

export const participantsAllergenOptionsComponent = (selectedSystemStore: any) => new Component({
    id: "participants-allergen-options",
    name: "Participants Allergen Options",
    tags: ["participants"],
    description: `SQL for getting allergen options.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT allergen_id, name from ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')}` }
});
