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
    "css": `  .delete-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #fef2f2;
    color: #dc2626;
    border: 1px solid #dc2626;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .delete-button:hover {
    background-color: #fee2e2;
    border-color: #b91c1c;
    color: #b91c1c;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .delete-button:active {
    transform: translateY(0);
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
