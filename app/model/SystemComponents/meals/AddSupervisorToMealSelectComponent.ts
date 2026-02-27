import { Component } from "~/model/Component";

export const addSupervisorToMealSelectComponent = (selectedSystemStore: any) => new Component({
    id: "add-supervisor-to-meal-select",
    name: "Add Supervisor to Meal - Supervisor Select",
    tags: ["meals"],
    description: `Component for selecting supervisors to add to meals.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `SELECT supervisor_id as id, name FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} ORDER BY name`,
    }
});
