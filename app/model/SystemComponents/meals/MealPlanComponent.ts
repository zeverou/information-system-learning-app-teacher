import { Component } from "~/model/Component";

export const mealPlanComponent = (selectedSystemStore: any) => new Component({
    id: "meal-plan-list",
    name: "Meal Plan List",
    tags: ["meals"],
    description: `Component for getting meal plan information.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "" },
    sql: {
        "sql-1": `SELECT * FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')};`,
        "sql-2": `SELECT DISTINCT m.name AS meal_name, m.meal_id, mp.date_served, m.when_served, p.name AS participant_name, p.participant_id, p.email AS participant_email, sp.session_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} m JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_participants')} mp ON m.meal_id = mp.meal_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p ON p.participant_id = mp.participant_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON sp.participant_id = p.participant_id`,
        "sql-3": `SELECT DISTINCT m.name AS meal_name,  m.meal_id, mp.date_served, m.when_served, s.name AS supervisor_name, s.supervisor_id ,s.email AS supervisor_email, sp.session_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} m JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_supervisors')} mp ON m.meal_id = mp.meal_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s ON s.supervisor_id = mp.supervisor_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} sp ON sp.supervisor_id = s.supervisor_id`,
        "sql-4": `SELECT allergen_id, name FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} ON ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')}.meal_id = ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')}.meal_id WHERE ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')}.meal_id = ?`,
    }
});
