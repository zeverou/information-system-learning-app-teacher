import { Component } from "~/model/Component";

export const mealPlanSupervisorAllergensComponent = (selectedSystemStore: any) => new Component({
    id: "meal-plan-supervisor-allergen-list",
    name: "Meal Plan Supervisor Allergen List",
    tags: ["meals"],
    description: `Component for getting meal plan allergens related to supervisors.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `SELECT a.name, ms.supervisor_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} AS am JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} AS m ON am.meal_id = m.meal_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} AS a ON a.allergen_id = am.allergen_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_supervisors')} AS ms ON ms.meal_id = m.meal_id WHERE am.meal_id = ?`,
    }
});
