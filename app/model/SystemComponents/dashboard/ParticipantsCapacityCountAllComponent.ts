import { Component } from "~/model/Component";

export const participantsCapacityCountComponentAll = (selectedSystemStore: any) => new Component({
    id: "participants-capacity-count-all",
    name: "Participants Capacity Count (All)",
    tags: ["dashboard"],
    description: `Badge showing the capacity count of all sessions.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": `Math.round(currentCount / totalCapacity * 100)` },
    sql: {
        "sql-1": `SELECT SUM(capacity) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}`,
        "sql-2": `
            SELECT COUNT(*) as count
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id
        `
    }
});
