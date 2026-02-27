import { Component } from "~/model/Component";

export const mealPlanParticipantAllergensComponent = (selectedSystemStore: any) => new Component({
    id: "meal-plan-participant-allergen-list",
    name: "Meal Plan Participant Allergen List",
    tags: ["meals"],
    description: `Component for getting meal plan allergens related to participants.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `SELECT a.name, mp.participant_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} AS am JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} AS m ON am.meal_id = m.meal_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} AS a ON a.allergen_id = am.allergen_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_participants')} AS mp ON mp.meal_id = m.meal_id WHERE am.meal_id = ?`,
    }
});
