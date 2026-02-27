import { Component } from "~/model/Component";

export const mealParticipantDeleteComponent = (selectedSystemStore: any) => new Component({
    id: "meal-participant-delete",
    name: "Meal Participant Delete",
    tags: ["meals"],
    description: `Component for deleting a participant from a meal.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_participants')} WHERE meal_id = ? AND participant_id = ?`,
    }
});
