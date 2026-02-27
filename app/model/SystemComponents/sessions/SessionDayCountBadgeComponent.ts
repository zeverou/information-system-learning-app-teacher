import { Component } from "~/model/Component";

export const sessionDayCountBadgeComponent = (selectedSystemStore: any) => new Component({
    id: "session-day-count-badge",
    name: "Session Day Count Badge",
    tags: ["sessions"],
    description: `Badge showing the count of days for a session.`,
    html: {
        "html": `
      <div class="badge primary medium">
        <span class="icon">📅</span>
        <span>{{ label }}: {{ dayCount }}</span>
      </div>
    `
    },
    css: {
        "css": `.badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      border-radius: 0.5rem;
      font-weight: bold;
      cursor: pointer;
    }

    .badge.primary {
      background-color: #10b981; /* Green */
      color: white;
    }

    .badge.small {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }

    .badge.medium {
      font-size: 1rem;         /* medium text */
      padding: 0.4rem 0.75rem; /* medium padding */
    }

    .badge.large {
      font-size: 1.25rem;
      padding: 0.5rem 1rem;
    }

    .icon {
      font-size: 1.2rem; /* balanced icon size */
    }
    `
    },
    js: {
        "js": `const timeDifference = end.getTime() - start.getTime(); return Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;`
    },
    sql: {
        "sql": `SELECT from_date, to_date FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} WHERE session_id = ?`,
    }
});
