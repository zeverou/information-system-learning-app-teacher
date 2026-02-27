import { Component } from "~/model/Component";

export const supervisorsCapacityPercentageComponent = new Component({
    id: "supervisors-capacity-percentage",
    name: "Supervisors Capacity Percentage",
    tags: ["supervisors"],
    description: `Component for displaying supervisors capacity percentage.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "Math.round(currentCount / totalCapacity * 100)" },
    sql: { "sql": "" }
});
