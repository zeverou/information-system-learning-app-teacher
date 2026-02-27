import { Component } from "~/model/Component";

export const addMealComponent = (selectedSystemStore: any) => new Component({
    id: "meals-add",
    name: "Add Meal",
    tags: ["meals"],
    description: `Component for adding a new meal.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} (name, when_served) VALUES (?, ?)`,
        "sql-2": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} (meal_id, allergen_id) VALUES (?, ?)`
    }
});
