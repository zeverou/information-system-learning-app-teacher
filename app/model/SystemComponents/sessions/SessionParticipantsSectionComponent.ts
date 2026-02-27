import { Component } from "~/model/Component";

export const sessionParticipantsSectionComponent = (selectedSystemStore: any) => new Component({
    id: "session-participants-section",
    name: "Session Participants Section",
    tags: ["sessions"],
    description: `Component showing the list of participants for a session with avatars and details.`,
    html: {
        "html": ``
    },
    css: {
        "css": ``
    },
    js: { "js": `` },
    sql: {
        "sql-1": `SELECT p.* FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id WHERE sp.session_id = ?`,
        "sql-2": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id WHERE sp.session_id = ?`
    }
});
