import { Component } from "~/model/Component";

export const sessionParticipantDeleteComponent = (selectedSystemStore: any) => new Component({
    id: "session-participant-delete",
    name: "Session Participant Delete",
    tags: ["sessions"],
    description: `SQL for deleting session-participant association.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} WHERE session_id = ? AND participant_id = ?` }
});
