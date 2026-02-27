import { Component } from "~/model/Component";

export const sessionCapacitySectionComponent = (selectedSystemStore: any) => new Component({
    id: "session-capacity-section",
    name: "Session Capacity Section",
    tags: ["sessions"],
    description: `Component showing the capacity and participant count for a session with a progress bar.`,
    html: {
        "html": `
        <div class="capacity-section">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">{{ label }}</span>
        <span class="text-sm text-gray-600">{{ participantCount }}/{{ capacity }}</span>
      </div>
      <div class="capacity-bar">
        <div class="capacity-fill" style="width: {{ percentage }}%; background-color: {{ color }}"></div>
      </div>
      <div class="text-xs text-gray-500 mt-1"> {{ percentage }}% {{ occupied }}</div>
    </div>
    ` },
    css: {
        "css": `.capacity-section {
    margin-bottom: 1.5rem;
  }

  .capacity-bar {
    width: 100%;
    background-color: #e5e7eb;
    border-radius: 9999px;
    height: 0.5rem;
    overflow: hidden;
  }

  .capacity-fill {
    height: 100%;
    transition: all 0.5s ease-out;
    border-radius: 9999px;
  }
` },
    js: { "js": `if (capacity === 0) return 0; return Math.round((participantCount / capacity) * 100);` },
    sql: {
        "sql-1": `SELECT capacity FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} WHERE session_id = ?;`,
        "sql-2": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} WHERE session_id = ?`,
    }
});
