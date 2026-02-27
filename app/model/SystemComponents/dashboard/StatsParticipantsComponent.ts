import { Component } from "~/model/Component";

export const statsParticipantsComponent = (selectedSystemStore: any) => new Component({
  id: "stats-participants",
  name: "Stats Participants",
    tags: ["dashboard"],
  description: `Component for participants stats. SQL: SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}`,
  html: {
    "html": `
  <div class="stat-card">
    <div class="stat-icon">👥</div>
    <div class="stat-content">
      <div class="stat-number">{{ participantsCount }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  </div>
` },
  css: {
    "css": `
.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 160px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: #000;
  font-weight: bold;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8, #3b82f6);
  background-size: 200% 100%;
}

.stat-icon {
  font-size: 2rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 12px;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 3.5rem;
  height: 3.5rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
` },
  js: {
    "js": `
selectedTableStore.select('účastníci');
navigateTo({
  path: \`/systems/\${systemId}/participants\`,
});
` },
  sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}` }
});
