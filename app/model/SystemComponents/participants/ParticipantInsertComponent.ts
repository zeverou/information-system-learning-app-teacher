import { Component } from "~/model/Component";

export const participantInsertComponent = (selectedSystemStore: any) => new Component({
    id: "participant-insert",
    name: "Participant Insert",
    tags: ["participants"],
    description: `SQL for inserting a participant.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} (name, email, personal_number, phone, address, age)
            VALUES (?, ?, ?, ?, ?, ?)
        ` }
});
