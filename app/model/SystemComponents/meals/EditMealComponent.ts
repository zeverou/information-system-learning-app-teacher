import { Component } from "~/model/Component";

export const editMealComponent = (selectedSystemStore: any) => new Component({
    id: "meals-edit",
    name: "Edit Meal",
    tags: ["meals"],
    description: `Component for editing a meal.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `UPDATE ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} SET name = ?, when_served = ? WHERE meal_id = ?`,
        "sql-2": `SELECT allergen_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} WHERE meal_id = ?`,
        "sql-3": `SELECT * from ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')}`,
        "sql-4": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} WHERE meal_id = ?`,
        "sql-5": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} (meal_id, allergen_id) VALUES (?, ?)`,
    }
});
