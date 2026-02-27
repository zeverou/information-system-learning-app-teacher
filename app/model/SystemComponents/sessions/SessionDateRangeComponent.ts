import { Component } from "~/model/Component";

export const sessionDateRangeComponent = (selectedSystemStore: any) => new Component({
    id: "session-date-range",
    name: "Session Date Range",
    tags: ["sessions"],
    description: `Component showing the date range for a session.`,
    html: {
        "html": `
        <div class="date-range">
      <span class="calendar-icon">📅</span>
      <span class="date-text">{{ dateRange }}</span>
    </div>
    ` },
    css: {
        "css": `.date-range {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    background-color: #f3f4f6;
  }

  .calendar-icon {
    font-size: 1rem;
  }

  .date-text {
    white-space: nowrap;
  }
` },
    js: { "js": `` },
    sql: {
        "sql": `SELECT from_date, to_date FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} WHERE session_id = ?`,
    }
});
