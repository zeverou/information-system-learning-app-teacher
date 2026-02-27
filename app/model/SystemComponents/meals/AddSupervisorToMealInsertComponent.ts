import { Component } from "~/model/Component";

export const addSupervisorToMealInsertComponent = (selectedSystemStore: any) => new Component({
    id: "add-supervisor-to-meal-insert",
    name: "Add Supervisor to Meal - Insert",
    tags: ["meals"],
    description: `Component for inserting supervisor-meal relationships.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_supervisors')} (meal_id, supervisor_id, date_served) VALUES (?, ?, ?)`,
    }
});
