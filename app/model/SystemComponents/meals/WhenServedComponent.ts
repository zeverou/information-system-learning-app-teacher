import { Component } from "~/model/Component";

export const whenServedComponent = (selectedSystemStore: any) => new Component({
    id: "meals-when-served",
    name: "Meals When Served",
    tags: ["meals"],
    description: `Component for getting unique when_served values.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql": `SELECT DISTINCT when_served FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} ORDER BY when_served`
    }
});
