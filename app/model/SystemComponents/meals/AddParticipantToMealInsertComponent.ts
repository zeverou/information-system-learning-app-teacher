import { Component } from "~/model/Component";

export const addParticipantToMealInsertComponent = (selectedSystemStore: any) => new Component({
    id: "add-participant-to-meal-insert",
    name: "Add Participant to Meal - Insert",
    tags: ["meals"],
    description: `Component for inserting participant-meal relationships.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_participants')} (meal_id, participant_id, date_served) VALUES (?, ?, ?)`,
    }
});
