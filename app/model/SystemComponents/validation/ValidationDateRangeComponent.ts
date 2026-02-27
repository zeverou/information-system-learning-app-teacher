import { Component } from "~/model/Component";

export const validationDateRangeComponent = new Component({
    id: "validation-date-range",
    name: "Date Range Validation",
    tags: ["validation"],
    description: `Validation function for date ranges. Ensures to_date is greater than or equal to from_date.`,
    html: { "html": "" },
    css: { "css": "" },
    js: {
        "isValidDateRange": `const isValidDateRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) return true
    const from = new Date(fromDate)
    const to = new Date(toDate)
    return to >= from
}`
    },
    sql: { "sql": `` }
});
