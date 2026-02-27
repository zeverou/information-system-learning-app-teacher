import { Component } from "~/model/Component";

export const mealSupervisorDeleteComponent = (selectedSystemStore: any) => new Component({
    id: "meal-supervisor-delete",
    name: "Meal Supervisor Delete",
    tags: ["meals"],
    description: `Component for deleting a supervisor from a meal.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_supervisors')} WHERE meal_id = ? AND supervisor_id = ?`,
    }
});
