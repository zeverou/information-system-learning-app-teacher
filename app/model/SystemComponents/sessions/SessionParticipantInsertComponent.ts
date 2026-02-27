import { Component } from "~/model/Component";

export const sessionParticipantInsertComponent = (selectedSystemStore: any) => new Component({
    id: "session-participant-insert",
    name: "Session Participant Insert",
    tags: ["sessions"],
    description: `SQL for inserting session-participant association.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} (session_id, participant_id) VALUES (?, ?)` }
});
