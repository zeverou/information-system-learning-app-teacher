import { Component } from "~/model/Component";

export const mealsComponent = (selectedSystemStore: any) => new Component({
    id: "meals",
    name: "Meals",
    tags: ["meals"],
    description: `SQL for getting meals.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: { "sql": `SELECT * FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')}` }
});
