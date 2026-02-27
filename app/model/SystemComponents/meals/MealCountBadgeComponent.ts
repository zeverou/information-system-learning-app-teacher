import { Component } from "~/model/Component";

export const mealCountBadgeComponent = (selectedSystemStore: any) => new Component({
    id: "meals-count-badge",
    name: "Meals Count Badge",
    tags: ["meals"],
    description: `Badge showing the count of meals, optionally filtered by when_served type.`,
    html: {
        "html": ``
    },
    css: {
        "css": ``
    },
    js: { "js": `` },
    sql: {
        "sql-1": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')}`,
        "sql-2": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} WHERE when_served = ?`,
    }
});
