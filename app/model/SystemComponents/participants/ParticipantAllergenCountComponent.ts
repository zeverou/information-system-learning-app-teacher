import { Component } from "~/model/Component";

export const participantAllergenCountComponent = (selectedSystemStore: any) => new Component({
    id: "participant-allergen-count",
    name: "Participant Allergen Count",
    tags: ["participants"],
    description: `SQL for counting participant allergens.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants_allergens')} WHERE participant_id = ?` }
});
