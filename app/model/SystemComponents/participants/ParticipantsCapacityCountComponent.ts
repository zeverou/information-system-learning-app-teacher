import { Component } from "~/model/Component";

export const participantsCapacityCountComponent = (selectedSystemStore: any) => new Component({
    id: "participants-capacity-count",
    name: "Participants Capacity Count",
    tags: ["participants"],
    description: `Component for displaying capacity count.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-total-all": `SELECT SUM(capacity) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}`,
        "sql-current-all": `
        SELECT COUNT(*) as count
        FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p
        JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id
    `,
        "sql-total-session": `SELECT capacity as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} WHERE session_id = ?`,
        "sql-current-session": `
        SELECT COUNT(*) as count
        FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p
        JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id
        WHERE sp.session_id = ?
    `
    }
});
