import { Component } from "~/model/Component";

export const participantAllergenDeleteComponent = (selectedSystemStore: any) => new Component({
    id: "participant-allergen-delete",
    name: "Participant Allergen Delete",
    tags: ["participants"],
    description: `SQL for deleting participant-allergen association.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants_allergens')} WHERE participant_id = ? AND allergen_id = ?` }
});
