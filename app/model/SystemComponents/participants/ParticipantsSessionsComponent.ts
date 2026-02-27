import { Component } from "~/model/Component";

export const participantsSessionsComponent = (selectedSystemStore: any) => new Component({
    id: "participants-sessions",
    name: "Participants Sessions",
    tags: ["participants"],
    description: `SQL for getting participants sessions.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `
            SELECT ps.participant_id, s.session_id
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} ps
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} s ON ps.session_id = s.session_id
        ` }
});
