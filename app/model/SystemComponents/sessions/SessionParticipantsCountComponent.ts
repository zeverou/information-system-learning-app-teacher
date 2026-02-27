import { Component } from "~/model/Component";

export const sessionParticipantsCountComponent = (selectedSystemStore: any) => new Component({
    id: "session-participants-count",
    name: "Session Participants Count",
    tags: ["sessions"],
    description: `Component showing the count of participants for a session.`,
    html: {
        "html": ``
    },
    css: {
        "css": ``
    },
    js: { "js": `` },
    sql: {
        "sql-1": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id WHERE sp.session_id = ?`
    }
});
