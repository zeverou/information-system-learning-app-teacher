import { Component } from "~/model/Component";

export const participantUpdateComponent = (selectedSystemStore: any) => new Component({
    id: "participant-update",
    name: "Participant Update",
    tags: ["participants"],
    description: `SQL for updating a participant.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            UPDATE ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}
            SET name = ?, email = ?, personal_number = ?, phone = ?, address = ?, age = ?
            WHERE participant_id = ?
        ` }
});
