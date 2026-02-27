import { Component } from "~/model/Component";

export const mealsAllergensComponent = (selectedSystemStore: any) => new Component({
    id: "meals-allergens",
    name: "Meals Allergens",
    tags: ["meals"],
    description: `SQL for getting meals allergens.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `SELECT ma.meal_id, a.allergen_id
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} ma
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} a ON ma.allergen_id = a.allergen_id
            WHERE meal_id = ?`,
        "sql-2": `SELECT name from ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} WHERE allergen_id = ?`
    }
});
