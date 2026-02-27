import { Component } from "~/model/Component";

export const addSupervisorToMealMealsComponent = (selectedSystemStore: any) => new Component({
    id: "add-supervisor-to-meal-meals",
    name: "Add Supervisor to Meal - Meals Select",
    tags: ["meals"],
    description: `Component for selecting meals to add supervisors to.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `SELECT meal_id as id, name, when_served FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} ORDER BY when_served, name`,
    }
});
