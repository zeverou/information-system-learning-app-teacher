import { Component } from "~/model/Component";

export const addParticipantToMealMealsComponent = (selectedSystemStore: any) => new Component({
    id: "add-participant-to-meal-meals",
    name: "Add Participant to Meal - Meals Select",
    tags: ["meals"],
    description: `Component for selecting meals to add participants to.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `SELECT meal_id as id, name, when_served FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} ORDER BY when_served, name`,
    }
});
