import { Component } from "~/model/Component";

export const sessionDeleteButtonComponent = (selectedSystemStore: any) => new Component({
    id: "session-delete-button",
    name: "Session Delete Button",
    tags: ["sessions"],
    description: `Button component for deleting a session with confirmation and proper cleanup.`,
    html: {
        "html": `
        <button class="delete-button" onclick="handleDelete()">
      <span class="delete-icon">🗑️</span>
      <span class="delete-text">{{ deleteLabel }}</span>
    </button>
    ` },
    css: {
        "css": `.delete-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #dc2626;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .delete-button:hover {
    background-color: #b91c1c;
  }

  .delete-icon {
    font-size: 1rem;
  }

  .delete-text {
    white-space: nowrap;
  }
` },
    js: { "js": `` },
    sql: {
        "sql-1": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} WHERE session_id = ?`,
        "sql-2": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} WHERE session_id = ?`,
        "sql-3": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} WHERE session_id = ?`,
    }
});
