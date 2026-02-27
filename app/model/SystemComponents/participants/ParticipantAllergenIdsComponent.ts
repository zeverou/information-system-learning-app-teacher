import { Component } from "~/model/Component";

export const participantAllergenIdsComponent = (selectedSystemStore: any) => new Component({
    id: "participant-allergen-ids",
    name: "Participant Allergen IDs",
    tags: ["participants"],
    description: `SQL for getting participant allergen IDs.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT allergen_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants_allergens')} WHERE participant_id = ?` }
});
