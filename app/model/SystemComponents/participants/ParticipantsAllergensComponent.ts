import { Component } from "~/model/Component";

export const participantsAllergensComponent = (selectedSystemStore: any) => new Component({
    id: "participants-allergens",
    name: "Participants Allergens",
    tags: ["participants"],
    description: `SQL for getting participants allergens.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            SELECT pa.participant_id, a.allergen_id
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants_allergens')} pa
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} a ON pa.allergen_id = a.allergen_id
        ` }
});
