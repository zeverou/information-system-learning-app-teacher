import { Component } from "~/model/Component";

export const participantDeleteComponent = (selectedSystemStore: any) => new Component({
    id: "participant-delete",
    name: "Participant Delete",
    tags: ["participants"],
    description: `SQL for deleting a participant.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} WHERE participant_id = ?` }
});
