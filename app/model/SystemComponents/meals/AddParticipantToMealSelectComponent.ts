import { Component } from "~/model/Component";

export const addParticipantToMealSelectComponent = (selectedSystemStore: any) => new Component({
    id: "add-participant-to-meal-select",
    name: "Add Participant to Meal - Participant Select",
    tags: ["meals"],
    description: `Component for selecting participants to add to meals.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `SELECT participant_id as id, name FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} ORDER BY name`,
    }
});
