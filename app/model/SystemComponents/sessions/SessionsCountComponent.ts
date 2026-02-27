import { Component } from "~/model/Component";

export const sessionsCountComponent = (selectedSystemStore: any) => new Component({
    id: "sessions-count",
    name: "Sessions Count",
    tags: ["sessions"],
    description: `SQL for counting sessions.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}` }
});
