import { Component } from "~/model/Component";

export const participantAllergenInsertComponent = (selectedSystemStore: any) => new Component({
    id: "participant-allergen-insert",
    name: "Participant Allergen Insert",
    tags: ["participants"],
    description: `SQL for inserting participant-allergen association.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('participants_allergens')} (participant_id, allergen_id) VALUES (?, ?)` }
});
