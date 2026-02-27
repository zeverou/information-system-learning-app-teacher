import { Component } from "~/model/Component";

export const participantsCountComponent = (selectedSystemStore: any) => new Component({
    id: "participants-count",
    name: "Participants Count",
    tags: ["participants"],
    description: `SQL for counting participants.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}` }
});
