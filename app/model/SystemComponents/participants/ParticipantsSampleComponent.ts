import { Component } from "~/model/Component";

export const participantsSampleComponent = (selectedSystemStore: any) => new Component({
    id: "participants-sample",
    name: "Participants Sample",
    tags: ["participants"],
    description: `SQL for getting participants sample.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT participant_id, name, email FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} ORDER BY participant_id DESC LIMIT 3` }
});
