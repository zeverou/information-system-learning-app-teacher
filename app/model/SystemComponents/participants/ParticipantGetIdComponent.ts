import { Component } from "~/model/Component";

export const participantGetIdComponent = (selectedSystemStore: any) => new Component({
    id: "participant-get-id",
    name: "Participant Get ID",
    tags: ["participants"],
    description: `SQL for getting participant ID after insert.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            SELECT participant_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}
            WHERE name = ? AND email = ?
            ORDER BY participant_id DESC LIMIT 1
        `
    }
});
