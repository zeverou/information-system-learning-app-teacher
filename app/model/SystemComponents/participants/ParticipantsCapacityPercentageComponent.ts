import { Component } from "~/model/Component";

export const participantsCapacityPercentageComponent = new Component({
    id: "participants-capacity-percentage",
    name: "Participants Capacity Percentage",
    tags: ["participants"],
    description: `Component for displaying capacity percentage.`,
    html: { "html": "" },
    css: { "css": "" },
    js: { "js": "Math.round(currentCount / totalCapacity * 100)" },
    sql: { "sql": "" }
});
