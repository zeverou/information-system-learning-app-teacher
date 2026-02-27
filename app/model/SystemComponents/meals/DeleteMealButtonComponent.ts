import { Component } from "~/model/Component";

export const deleteMealButtonComponent = (selectedSystemStore: any) => new Component({
    id: "meals-delete",
    name: "Delete Meal Button",
    tags: ["meals"],
    description: `Button for deleting a meal.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} WHERE meal_id = ?`,
        "sql-2": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} WHERE meal_id = ?`,
        "sql-3": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_participants')} WHERE meal_id = ?`,
        "sql-4": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_supervisors')} WHERE meal_id = ?`
    }
});
