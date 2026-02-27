import { Component } from "~/model/Component";

export const participantsListComponent = (selectedSystemStore: any) => new Component({
    id: "participants-list",
    name: "Participants List",
    tags: ["participants"],
    description: `SQL for fetching participants list.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT * FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}` }
});
