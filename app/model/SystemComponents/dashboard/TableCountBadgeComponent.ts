import { Component } from "~/model/Component";

export const tableCountBadgeComponent = new Component({
    id: "dashboard-table-count-badge",
    name: "Dashboard Table Count Badge",
    tags: ["dashboard"],
    description: `Badge showing the count of all tables.`,
    html: {
        "html": `
        <div class="badge primary large">
      <span class="icon">🗃️</span>
      <span>{{ label }}: {{ tableCount }}</span>
    </div>
    ` },
    css: {
        "css": `.badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: bold;
    cursor: pointer;
  }

  .badge.primary {
    background-color: #3b82f6; /* Blue */
    color: white;
  }

  .badge.large {
    font-size: 1.25rem;
  }

  .icon {
    font-size: 1.5rem;
  }
` },
    js: { "js": `` },
    sql: {
        "sql": `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
    }
});
