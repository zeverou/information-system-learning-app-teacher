import { Component } from "~/model/Component";

export const supervisorsCapacityCountComponent = (selectedSystemStore: any) => new Component({
    id: "supervisors-capacity-count",
    name: "Supervisors Capacity Count",
    tags: ["supervisors"],
    description: `Component for displaying supervisors count vs capacity.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-total-all": `SELECT SUM(capacity) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}`,
        "sql-current-all": `
            SELECT COUNT(*) as count
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss ON s.supervisor_id = ss.supervisor_id
        `,
        "sql-total-session": `SELECT capacity as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} WHERE session_id = ?`,
        "sql-current-session": `
            SELECT COUNT(*) as count
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss ON s.supervisor_id = ss.supervisor_id
            WHERE ss.session_id = ?
        `
    }
});
