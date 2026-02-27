import { Component } from "~/model/Component";

export const mealListComponent = (selectedSystemStore: any) => new Component({
    id: "meal-plan-meal-allergen-list",
    name: "Meal Plan Meal List",
    tags: ["meals"],
    description: `Component for getting meal plan information.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `SELECT am.allergen_id, a.name, am.meal_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} AS am JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} AS m ON am.meal_id = m.meal_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} AS a ON a.allergen_id = am.allergen_id WHERE am.meal_id = ?`,
    }
});
