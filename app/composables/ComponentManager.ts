import { Component } from "~/model/Component";

/**
 * Class encapsulating the management of components in the system. 
 */
export class ComponentManager {
  public static initializeComponents() {

    console.log("Initializing components...");
    const componentCodeStore = useComponentCodeStore()
    const selectedSystemStore = useSelectedSystemStore();

    // Component maps are now part of the InformationSystem object, no need to load separately

    // if (!selectedSystemStore.selectedSystem?.db) {
    //   console.warn("Cannot initialize components: Database not ready");
    //   return;
    // }

    // New instances created from the existing code above
    const statsMealsComponent = new Component({
      id: "stats-meals",
      name: "Stats Meals",
      description: `Component for meals stats. SQL: SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')}`,
      html: {
        "html": `
  <div class="stat-card">
    <div class="stat-icon">🍽️</div>
    <div class="stat-content">
      <div class="stat-number">{{ mealsCount }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  </div>
` },
      css: { "css": "" },
      js: {
        "js": `
selectedTableStore.select('jídla');
navigateTo({
  path: \`/systems/\${systemId}/meals\`,
});
` },
      sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')}` }
    });

    const statsParticipantsComponent = new Component({
      id: "stats-participants",
      name: "Stats Participants",
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
      css: { "css": "" },
      js: {
        "js": `
selectedTableStore.select('účastníci');
navigateTo({
  path: \`/systems/\${systemId}/participants\`,
});
` },
      sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}` }
    });

    const statsSessionsComponent = new Component({
      id: "stats-sessions",
      name: "Stats Sessions",
      description: `Component for sessions stats. SQL: SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}`,
      html: {
        "html": `
  <div class="stat-card">
    <div class="stat-icon">📅</div>
    <div class="stat-content">
      <div class="stat-number">{{ sessionsCount }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  </div>
` },
      css: { "css": "" },
      js: {
        "js": `
selectedTableStore.select('turnusy');
navigateTo({
  path: \`/systems/\${systemId}/sessions\`,
});
` },
      sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}` }
    });

    console.log("XXXXXX_:", statsSessionsComponent);

    const statsSupervisorsComponent = new Component({
      id: "stats-supervisors",
      name: "Stats Supervisors",
      description: `Component for supervisors stats. SQL: SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')}`,
      html: {
        "html": `
  <div class="stat-card">
    <div class="stat-icon">👨‍🏫</div>
    <div class="stat-content">
      <div class="stat-number">{{ supervisorsCount }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  </div>
` },
      css: { "css": "" },
      js: {
        "js": `
selectedTableStore.select('vedoucí');
navigateTo({
  path: \`/systems/\${systemId}/supervisors\`,
});
` },
      sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')}` }
    });

    // participants.vue participants-capacity-count
    const participantsCapacityCountComponentAll = new Component({
      id: "participants-capacity-count-all",
      name: "Participants Capacity Count (All)",
      description: `Badge showing the capacity count of all sessions.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": `Math.round(currentCount / totalCapacity * 100)` },
      sql: {
        "sql-1": `SELECT SUM(capacity) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}`,
        "sql-2": `
            SELECT COUNT(*) as count
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id
        `
      }
    });

    const tableCountBadgeComponent = new Component({
      id: "dashboard-table-count-badge",
      name: "Dashboard Table Count Badge",
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

    const sessionDayCountBadgeComponent = new Component({
      id: "session-day-count-badge",
      name: "Session Day Count Badge",
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

    const mealCountBadgeComponent = new Component({
      id: "meals-count-badge",
      name: "Meals Count Badge",
      description: `Badge showing the count of meals, optionally filtered by when_served type.`,
      html: {
        "html": ``
      },
      css: {
        "css": ``
      },
      js: { "js": `` },
      sql: {
        "sql-1": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')}`,
        "sql-2": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} WHERE when_served = ?`,
      }
    });


    const sessionDateRangeComponent = new Component({
      id: "session-date-range",
      name: "Session Date Range",
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

    const sessionCapacitySectionComponent = new Component({
      id: "session-capacity-section",
      name: "Session Capacity Section",
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

    const sessionParticipantsSectionComponent = new Component({
      id: "session-participants-section",
      name: "Session Participants Section",
      description: `Component showing the list of participants for a session with avatars and details.`,
      html: {
        "html": ``
      },
      css: {
        "css": ``
      },
      js: { "js": `` },
      sql: {
        "sql-1": `SELECT p.* FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id WHERE sp.session_id = ?`,
        "sql-2": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id WHERE sp.session_id = ?`
      }
    });

    const sessionParticipantsListComponent = new Component({
      id: "session-participants-list",
      name: "Session Participants List",
      description: `Component showing the list of participants for a session with avatars and details.`,
      html: {
        "html": ``
      },
      css: {
        "css": ``
      },
      js: { "js": `` },
      sql: {
        "sql-1": `SELECT p.* FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id WHERE sp.session_id = ?`,
      }
    });

    const sessionParticipantsCountComponent = new Component({
      id: "session-participants-count",
      name: "Session Participants Count",
      description: `Component showing the count of participants for a session.`,
      html: {
        "html": ``
      },
      css: {
        "css": ``
      },
      js: { "js": `` },
      sql: {
        "sql-1": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id WHERE sp.session_id = ?`
      }
    });

    const sessionSupervisorsSectionComponent = new Component({
      id: "session-supervisors-section",
      name: "Session Supervisors Section",
      description: `Component showing the list of supervisors for a session with avatars and contact details.`,
      html: {
        "html": ``
      },
      css: {
        "css": ``
      },
      js: { "js": `` },
      sql: {
        "sql-1": `SELECT s.* FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss ON s.supervisor_id = ss.supervisor_id WHERE ss.session_id = ?`,
        "sql-2": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss ON s.supervisor_id = ss.supervisor_id WHERE ss.session_id = ?`,
      }
    });

    const sessionSupervisorsListComponent = new Component({
      id: "session-supervisors-list",
      name: "Session Supervisors List",
      description: `Component showing the list of supervisors for a session with avatars and contact details.`,
      html: {
        "html": ``
      },
      css: {
        "css": ``
      },
      js: { "js": `` },
      sql: {
        "sql-1": `SELECT s.* FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss ON s.supervisor_id = ss.supervisor_id WHERE ss.session_id = ?`,
      }
    });

    const sessionSupervisorsCountComponent = new Component({
      id: "session-supervisors-count",
      name: "Session Supervisors Count",
      description: `Component showing the count of supervisors for a session.`,
      html: {
        "html": ``
      },
      css: {
        "css": ``
      },
      js: { "js": `` },
      sql: {
        "sql-1": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss ON s.supervisor_id = ss.supervisor_id WHERE ss.session_id = ?`,
      }
    });

    const sessionDeleteButtonComponent = new Component({
      id: "session-delete-button",
      name: "Session Delete Button",
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

    const sessionStatusBadgeComponent = new Component({
      id: "session-status-badge",
      name: "Session Status Badge",
      description: `Badge component showing the status of a session based on capacity and participant count.`,
      html: {
        "html": `
        <div class="status-badge status-{{ color }}">
      <span class="status-text">{{ status }}</span>
    </div>
    ` },
      css: {
        "css": `.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .status-badge.status-red {
    background-color: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  .status-badge.status-yellow {
    background-color: #fffbeb;
    color: #d97706;
    border: 1px solid #fde68a;
  }

  .status-badge.status-green {
    background-color: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }

  .status-badge.status-neutral {
    background-color: #f9fafb;
    color: #6b7280;
    border: 1px solid #e5e7eb;
  }

  .status-text {
    white-space: nowrap;
  }
` },
      js: { "js": `if (capacity === 0) return 0; return Math.round((participantCount / capacity) * 100);` },
      sql: {
        "sql-1": `SELECT capacity FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} WHERE session_id = ?;`,
        "sql-2": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} WHERE session_id = ?`,
      }
    });

    /*
    const participantsCapacityCountComponent = new Component({
      id: "participants-capacity-count",
      name: "Participants Capacity Count",
      description: `Badge showing the capacity count of the selected session.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": `Math.round(currentCount / totalCapacity * 100)` },
      sql: {
        "sql-1": `SELECT capacity as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} WHERE session_id = ?`,
        "sql-2": `
            SELECT COUNT(*) as count
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id
            WHERE sp.session_id = ?
        `
      }
    });
    */

    // Participants page components
    const participantsCapacityCountComponent = new Component({
      id: "participants-capacity-count",
      name: "Participants Capacity Count",
      description: `Component for displaying capacity count.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-total-all": `SELECT SUM(capacity) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}`,
        "sql-current-all": `
            SELECT COUNT(*) as count
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id
        `,
        "sql-total-session": `SELECT capacity as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} WHERE session_id = ?`,
        "sql-current-session": `
            SELECT COUNT(*) as count
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON p.participant_id = sp.participant_id
            WHERE sp.session_id = ?
        `
      }
    });

    const participantsCapacityPercentageComponent = new Component({
      id: "participants-capacity-percentage",
      name: "Participants Capacity Percentage",
      description: `Component for displaying capacity percentage.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "Math.round(currentCount / totalCapacity * 100)" },
      sql: { "sql": "" }
    });

    const participantsPageCount1Component = new Component({
      id: "participants-page-count-1",
      name: "Participants Page Count 1",
      description: `Component for displaying page count.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "Math.ceil(totalItems / itemsPerPage)" },
      sql: { "sql": "" }
    });

    const participantsPageCount2Component = new Component({
      id: "participants-page-count-2",
      name: "Participants Page Count 2",
      description: `Component for displaying participant count.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsFilterResetComponent = new Component({
      id: "participants-filter-reset",
      name: "Participants Filter Reset",
      description: `Component for filter reset button.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsFilterInputComponent = new Component({
      id: "participants-filter-input",
      name: "Participants Filter Input",
      description: `Component for filter input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: {
        "js": `(p.name && p.name.toLowerCase().includes(text)) ||
               (p.email && p.email.toLowerCase().includes(text)) ||
               (p.phone && p.phone.toLowerCase().includes(text)) ||
               (p.address && p.address.toLowerCase().includes(text))`
      },
      sql: { "sql": "" }
    });

    const participantsAddNameComponent = new Component({
      id: "participants-add-name",
      name: "Participants Add Name",
      description: `Component for add name input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsAddEmailComponent = new Component({
      id: "participants-add-email",
      name: "Participants Add Email",
      description: `Component for add email input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsAddPersonalNumberComponent = new Component({
      id: "participants-add-personal_number",
      name: "Participants Add Personal Number",
      description: `Component for add personal number input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsAddPhoneComponent = new Component({
      id: "participants-add-phone",
      name: "Participants Add Phone",
      description: `Component for add phone input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsAddAddressComponent = new Component({
      id: "participants-add-address",
      name: "Participants Add Address",
      description: `Component for add address input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsAddAgeComponent = new Component({
      id: "participants-add-age",
      name: "Participants Add Age",
      description: `Component for add age input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsAddSessionComponent = new Component({
      id: "participants-add-session",
      name: "Participants Add Session",
      description: `Component for add session select.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsAddAllergensComponent = new Component({
      id: "participants-add-allergens",
      name: "Participants Add Allergens",
      description: `Component for add allergens select.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsCardComponent = new Component({
      id: "participants-card",
      name: "Participants Card",
      description: `Component for participant card.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsDeleteButtonComponent = new Component({
      id: "participants-delete-button",
      name: "Participants Delete Button",
      description: `Component for delete button.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsEditNameComponent = new Component({
      id: "participants-edit-name",
      name: "Participants Edit Name",
      description: `Component for edit name input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsEditEmailComponent = new Component({
      id: "participants-edit-email",
      name: "Participants Edit Email",
      description: `Component for edit email input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsEditPersonalNumberComponent = new Component({
      id: "participants-edit-personal_number",
      name: "Participants Edit Personal Number",
      description: `Component for edit personal number input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsEditPhoneComponent = new Component({
      id: "participants-edit-phone",
      name: "Participants Edit Phone",
      description: `Component for edit phone input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsEditAddressComponent = new Component({
      id: "participants-edit-address",
      name: "Participants Edit Address",
      description: `Component for edit address input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsEditAgeComponent = new Component({
      id: "participants-edit-age",
      name: "Participants Edit Age",
      description: `Component for edit age input.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsEditAllergensComponent = new Component({
      id: "participants-edit-allergens",
      name: "Participants Edit Allergens",
      description: `Component for edit allergens select.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsEditSessionsComponent = new Component({
      id: "participants-edit-sessions",
      name: "Participants Edit Sessions",
      description: `Component for edit sessions select.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const participantsSessionMenuComponent = new Component({
      id: "participants-session-menu",
      name: "Participants Session Menu",
      description: `Component for session select menu.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    // SQL Components for participants.vue
    const participantsAllergenOptionsComponent = new Component({
      id: "participants-allergen-options",
      name: "Participants Allergen Options",
      description: `SQL for getting allergen options.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT allergen_id, name from ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')}` }
    });

    const participantsCountComponent = new Component({
      id: "participants-count",
      name: "Participants Count",
      description: `SQL for counting participants.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}` }
    });

    const sessionsCountComponent = new Component({
      id: "sessions-count",
      name: "Sessions Count",
      description: `SQL for counting sessions.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}` }
    });

    const participantsSampleComponent = new Component({
      id: "participants-sample",
      name: "Participants Sample",
      description: `SQL for getting participants sample.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT participant_id, name, email FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} ORDER BY participant_id DESC LIMIT 3` }
    });

    const participantsListComponent = new Component({
      id: "participants-list",
      name: "Participants List",
      description: `SQL for getting all participants.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            SELECT participant_id, name, email, personal_number, phone, address, age
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}
            ORDER BY participant_id
        ` }
    });

    const participantsAllergensComponent = new Component({
      id: "participants-allergens",
      name: "Participants Allergens",
      description: `SQL for getting participants allergens.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            SELECT pa.participant_id, a.allergen_id
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants_allergens')} pa
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} a ON pa.allergen_id = a.allergen_id
        ` }
    });

    const participantAllergenCountComponent = new Component({
      id: "participant-allergen-count",
      name: "Participant Allergen Count",
      description: `SQL for counting participant allergens.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants_allergens')} WHERE participant_id = ?` }
    });

    const participantsSessionsComponent = new Component({
      id: "participants-sessions",
      name: "Participants Sessions",
      description: `SQL for getting participants sessions.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            SELECT ps.participant_id, s.session_id
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} ps
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} s ON ps.session_id = s.session_id
        ` }
    });

    const sessionsListComponent = new Component({
      id: "sessions-list",
      name: "Sessions List",
      description: `SQL for getting all sessions.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            SELECT session_id, from_date, to_date, capacity
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}
            ORDER BY session_id
        ` }
    });

    const participantInsertComponent = new Component({
      id: "participant-insert",
      name: "Participant Insert",
      description: `SQL for inserting a participant.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} (name, email, personal_number, phone, address, age)
            VALUES (?, ?, ?, ?, ?, ?)
        ` }
    });

    const participantGetIdComponent = new Component({
      id: "participant-get-id",
      name: "Participant Get ID",
      description: `SQL for getting participant ID after insert.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            SELECT participant_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}
            WHERE name = ? AND email = ?
            ORDER BY participant_id DESC LIMIT 1
        ` }
    });

    const participantUpdateComponent = new Component({
      id: "participant-update",
      name: "Participant Update",
      description: `SQL for updating a participant.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            UPDATE ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')}
            SET name = ?, email = ?, personal_number = ?, phone = ?, address = ?, age = ?
            WHERE participant_id = ?
        ` }
    });

    const participantDeleteComponent = new Component({
      id: "participant-delete",
      name: "Participant Delete",
      description: `SQL for deleting a participant.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} WHERE participant_id = ?` }
    });

    const sessionParticipantInsertComponent = new Component({
      id: "session-participant-insert",
      name: "Session Participant Insert",
      description: `SQL for inserting session-participant association.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} (session_id, participant_id) VALUES (?, ?)` }
    });

    const sessionParticipantDeleteComponent = new Component({
      id: "session-participant-delete",
      name: "Session Participant Delete",
      description: `SQL for deleting session-participant association.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} WHERE session_id = ? AND participant_id = ?` }
    });

    const participantAllergenIdsComponent = new Component({
      id: "participant-allergen-ids",
      name: "Participant Allergen IDs",
      description: `SQL for getting participant allergen IDs.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT allergen_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants_allergens')} WHERE participant_id = ?` }
    });

    const participantAllergenInsertComponent = new Component({
      id: "participant-allergen-insert",
      name: "Participant Allergen Insert",
      description: `SQL for inserting participant-allergen association.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('participants_allergens')} (participant_id, allergen_id) VALUES (?, ?)` }
    });

    const participantAllergenDeleteComponent = new Component({
      id: "participant-allergen-delete",
      name: "Participant Allergen Delete",
      description: `SQL for deleting participant-allergen association.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants_allergens')} WHERE participant_id = ? AND allergen_id = ?` }
    });

    const validationNameComponent = new Component({
      id: "validation-name",
      name: "Name Validation",
      description: `Validation function for participant/supervisor names. Ensures first and last name are provided.`,
      html: { "html": "" },
      css: { "css": "" },
      js: {
        "isValidName": `const isValidName = (name) => {
    if (!name || name.trim().length === 0) return false
    // Must have at least one space (first and last name)
    return name.trim().split(' ').length >= 2
}`
      },
      sql: { "sql": `` }
    });

    const validationEmailComponent = new Component({
      id: "validation-email",
      name: "Email Validation",
      description: `Validation function for email addresses using regex pattern.`,
      html: { "html": "" },
      css: { "css": "" },
      js: {
        "isValidEmail": `const isValidEmail = (email) => {
    if (!email || email.trim().length === 0) return false
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
    return emailRegex.test(email.trim())
}`
      },
      sql: { "sql": `` }
    });

    const validationPersonalNumberComponent = new Component({
      id: "validation-personal-number",
      name: "Personal Number Validation",
      description: `Validation function for Czech personal numbers. Format: xxxxxx/xxxx (6 digits, slash, 4 digits).`,
      html: { "html": "" },
      css: { "css": "" },
      js: {
        "isValidPersonalNumber": `const isValidPersonalNumber = (personalNumber) => {
    if (!personalNumber || personalNumber.trim().length === 0) return false
    // Format: xxxxxx/xxxx (6 digits, slash, 4 digits)
    const personalNumberRegex = /^\\d{6}\\/\\d{4}$/
    return personalNumberRegex.test(personalNumber.trim())
}`
      },
      sql: { "sql": `` }
    });

    const validationPhoneComponent = new Component({
      id: "validation-phone",
      name: "Phone Validation",
      description: `Validation function for Czech phone numbers. Supports multiple formats including +420 prefix.`,
      html: { "html": "" },
      css: { "css": "" },
      js: {
        "isValidPhone": `const isValidPhone = (phone) => {
    if (!phone || phone.trim().length === 0) return false
    // Czech phone number regex: supports multiple formats
    // +420 xxx xxx xxx, +420xxxxxxxxx, xxx xxx xxx, xxxxxxxxx
    const phoneRegex = /^(\\+420\\s?)?(\\d{3}\\s?\\d{3}\\s?\\d{3}|\\d{9})$/
    const cleanPhone = phone.trim().replace(/\\s+/g, '')
    return phoneRegex.test(cleanPhone)
}`
      },
      sql: { "sql": `` }
    });

    const validationDateRangeComponent = new Component({
      id: "validation-date-range",
      name: "Date Range Validation",
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



    // Supervisors page components (mirroring participants)
    const supervisorsCapacityCountComponent = new Component({
      id: "supervisors-capacity-count",
      name: "Supervisors Capacity Count",
      description: `Component for displaying supervisors count vs capacity.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-total-all": `SELECT SUM(capacity) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')}`,
        "sql-current-all": `
            SELECT COUNT(*) as count
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss ON s.supervisor_id = ss.supervisor_id
        `,
        "sql-total-session": `SELECT capacity as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} WHERE session_id = ?`,
        "sql-current-session": `
            SELECT COUNT(*) as count
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss ON s.supervisor_id = ss.supervisor_id
            WHERE ss.session_id = ?
        `
      }
    });

    const supervisorsCapacityPercentageComponent = new Component({
      id: "supervisors-capacity-percentage",
      name: "Supervisors Capacity Percentage",
      description: `Component for displaying supervisors capacity percentage.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "Math.round(currentCount / totalCapacity * 100)" },
      sql: { "sql": "" }
    });

    const supervisorsPageCount1Component = new Component({
      id: "supervisors-page-count-1",
      name: "Supervisors Page Count 1",
      description: `Component for displaying page count for supervisors.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "Math.ceil(totalItems / itemsPerPage)" },
      sql: { "sql": "" }
    });

    const supervisorsPageCount2Component = new Component({
      id: "supervisors-page-count-2",
      name: "Supervisors Page Count 2",
      description: `Component for displaying supervisor count.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const supervisorsFilterResetComponent = new Component({
      id: "supervisors-filter-reset",
      name: "Supervisors Filter Reset",
      description: `Component for filter reset button (supervisors).`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "" }
    });

    const supervisorsFilterInputComponent = new Component({
      id: "supervisors-filter-input",
      name: "Supervisors Filter Input",
      description: `Component for filter input (supervisors).`,
      html: { "html": "" },
      css: { "css": "" },
      js: {
        "js": `(p.name && p.name.toLowerCase().includes(text)) ||
               (p.email && p.email.toLowerCase().includes(text)) ||
               (p.phone && p.phone.toLowerCase().includes(text)) ||
               (p.address && p.address.toLowerCase().includes(text))`
      },
      sql: { "sql": "" }
    });

    const supervisorsSessionMenuComponent = new Component({
      id: "supervisors-session-menu",
      name: "Supervisors Session Menu",
      description: `Component for session select menu (supervisors).`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": "SELECT *" }
    });

    const supervisorAllergenCountComponent = new Component({
      id: "supervisor-allergen-count",
      name: "Supervisor Allergen Count",
      description: `SQL for counting supervisor allergens.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors_allergens')} WHERE supervisor_id = ?` }
    });

    const supervisorsAllergenOptionsComponent = new Component({
      id: "supervisors-allergen-options",
      name: "Supervisors Allergen Options",
      description: `SQL for getting allergen options (same table).`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT allergen_id, name from ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')}` }
    });

    const supervisorsCountComponent = new Component({
      id: "supervisors-count",
      name: "Supervisors Count",
      description: `SQL for counting supervisors.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT COUNT(*) as count FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')}` }
    });

    const supervisorsSampleComponent = new Component({
      id: "supervisors-sample",
      name: "Supervisors Sample",
      description: `SQL for getting supervisors sample.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT supervisor_id, name, email FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} ORDER BY supervisor_id DESC LIMIT 3` }
    });

    const supervisorsListComponent = new Component({
      id: "supervisors-list",
      name: "Supervisors List",
      description: `SQL for getting all supervisors.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            SELECT supervisor_id, name, email, personal_number, phone, address, age
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')}
            ORDER BY supervisor_id
        ` }
    });

    const supervisorsAllergensComponent = new Component({
      id: "supervisors-allergens",
      name: "Supervisors Allergens",
      description: `SQL for getting supervisors allergens.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            SELECT sa.supervisor_id, a.allergen_id
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors_allergens')} sa
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} a ON sa.allergen_id = a.allergen_id
        ` }
    });

    const supervisorsSessionsComponent = new Component({
      id: "supervisors-sessions",
      name: "Supervisors Sessions",
      description: `SQL for getting supervisors sessions.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            SELECT ss.supervisor_id, s.session_id
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} ss
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')} s ON ss.session_id = s.session_id
        ` }
    });

    const supervisorInsertComponent = new Component({
      id: "supervisor-insert",
      name: "Supervisor Insert",
      description: `SQL for inserting a supervisor.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} (name, email, personal_number, phone, address, age)
            VALUES (?, ?, ?, ?, ?, ?)
        ` }
    });

    const supervisorGetIdComponent = new Component({
      id: "supervisor-get-id",
      name: "Supervisor Get ID",
      description: `SQL for getting supervisor ID after insert.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            SELECT supervisor_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')}
            WHERE name = ? AND email = ?
            ORDER BY supervisor_id DESC LIMIT 1
        ` }
    });

    const supervisorUpdateComponent = new Component({
      id: "supervisor-update",
      name: "Supervisor Update",
      description: `SQL for updating a supervisor.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `
            UPDATE ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')}
            SET name = ?, email = ?, personal_number = ?, phone = ?, address = ?, age = ?
            WHERE supervisor_id = ?
        ` }
    });

    const supervisorDeleteComponent = new Component({
      id: "supervisor-delete",
      name: "Supervisor Delete",
      description: `SQL for deleting a supervisor.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} WHERE supervisor_id = ?` }
    });

    const sessionSupervisorInsertComponent = new Component({
      id: "session-supervisor-insert",
      name: "Session Supervisor Insert",
      description: `SQL for inserting session-supervisor association.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} (session_id, supervisor_id) VALUES (?, ?)` }
    });

    const sessionSupervisorDeleteComponent = new Component({
      id: "session-supervisor-delete",
      name: "Session Supervisor Delete",
      description: `SQL for deleting session-supervisor association.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} WHERE session_id = ? AND supervisor_id = ?` }
    });

    const supervisorAllergenIdsComponent = new Component({
      id: "supervisor-allergen-ids",
      name: "Supervisor Allergen IDs",
      description: `SQL for getting supervisor allergen IDs.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT allergen_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors_allergens')} WHERE supervisor_id = ?` }
    });

    const supervisorAllergenInsertComponent = new Component({
      id: "supervisor-allergen-insert",
      name: "Supervisor Allergen Insert",
      description: `SQL for inserting supervisor-allergen association.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors_allergens')} (supervisor_id, allergen_id) VALUES (?, ?)` }
    });

    const supervisorAllergenDeleteComponent = new Component({
      id: "supervisor-allergen-delete",
      name: "Supervisor Allergen Delete",
      description: `SQL for deleting supervisor-allergen association.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors_allergens')} WHERE supervisor_id = ? AND allergen_id = ?` }
    });

    const mealsComponent = new Component({
      id: "meals",
      name: "Meals",
      description: `SQL for getting meals.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql": `SELECT * FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')}` }
    });

    const mealsAllergensComponent = new Component({
      id: "meals-allergens",
      name: "Meals Allergens",
      description: `SQL for getting meals allergens.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `SELECT ma.meal_id, a.allergen_id
            FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} ma
            JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} a ON ma.allergen_id = a.allergen_id
            WHERE meal_id = ?`,
        "sql-2": `SELECT name from ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} WHERE allergen_id = ?`
      }
    });

    const deleteMealButtonComponent = new Component({
      id: "meals-delete",
      name: "Delete Meal Button",
      description: `Button for deleting a meal.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} WHERE meal_id = ?`,
        "sql-2": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} WHERE meal_id = ?`,
        "sql-3": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_participants')} WHERE meal_id = ?`,
        "sql-4": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_supervisors')} WHERE meal_id = ?`
      }
    });

    const addMealComponent = new Component({
      id: "meals-add",
      name: "Add Meal",
      description: `Component for adding a new meal.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} (name, when_served) VALUES (?, ?)`,
        "sql-2": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} (meal_id, allergen_id) VALUES (?, ?)`
      }
    });

    const editMealComponent = new Component({
      id: "meals-edit",
      name: "Edit Meal",
      description: `Component for editing a meal.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `UPDATE ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} SET name = ?, when_served = ? WHERE meal_id = ?`,
        "sql-2": `SELECT allergen_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} WHERE meal_id = ?`,
        "sql-3": `SELECT * from ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')}`,
        "sql-4": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} WHERE meal_id = ?`,
        "sql-5": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} (meal_id, allergen_id) VALUES (?, ?)`,
      }
    });

    const whenServedComponent = new Component({
      id: "meals-when-served",
      name: "Meals When Served",
      description: `Component for getting unique when_served values.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql": `SELECT DISTINCT when_served FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} ORDER BY when_served`
      }
    });



    const mealPlanComponent = new Component({
      id: "meal-plan-list",
      name: "Meal Plan List",
      description: `Component for getting meal plan information.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `SELECT * FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions')};`,
        "sql-2": `SELECT DISTINCT m.name AS meal_name, m.meal_id, mp.date_served, m.when_served, p.name AS participant_name, p.participant_id, p.email AS participant_email, sp.session_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} m JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_participants')} mp ON m.meal_id = mp.meal_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} p ON p.participant_id = mp.participant_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_participants')} sp ON sp.participant_id = p.participant_id`,
        "sql-3": `SELECT DISTINCT m.name AS meal_name,  m.meal_id, mp.date_served, m.when_served, s.name AS supervisor_name, s.supervisor_id ,s.email AS supervisor_email, sp.session_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} m JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_supervisors')} mp ON m.meal_id = mp.meal_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} s ON s.supervisor_id = mp.supervisor_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('sessions_supervisors')} sp ON sp.supervisor_id = s.supervisor_id`,
        "sql-4": `SELECT allergen_id, name FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} ON ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')}.meal_id = ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')}.meal_id WHERE ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')}.meal_id = ?`,


      }
    });

    const mealListComponent = new Component({
      id: "meal-plan-meal-allergen-list",
      name: "Meal Plan Meal List",
      description: `Component for getting meal plan information.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `SELECT am.allergen_id, a.name, am.meal_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} AS am JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} AS m ON am.meal_id = m.meal_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} AS a ON a.allergen_id = am.allergen_id WHERE am.meal_id = ?`,
      }
    });

    const mealPlanParticipantAllergensComponent = new Component({
      id: "meal-plan-participant-allergen-list",
      name: "Meal Plan Participant Allergen List",
      description: `Component for getting meal plan allergens related to participants.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `SELECT a.name, mp.participant_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} AS am JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} AS m ON am.meal_id = m.meal_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} AS a ON a.allergen_id = am.allergen_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_participants')} AS mp ON mp.meal_id = m.meal_id WHERE am.meal_id = ?`,
      }
    });

    const mealPlanSupervisorAllergensComponent = new Component({
      id: "meal-plan-supervisor-allergen-list",
      name: "Meal Plan Supervisor Allergen List",
      description: `Component for getting meal plan allergens related to supervisors.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `SELECT a.name, ms.supervisor_id FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} AS am JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} AS m ON am.meal_id = m.meal_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('allergens')} AS a ON a.allergen_id = am.allergen_id JOIN ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_supervisors')} AS ms ON ms.meal_id = m.meal_id WHERE am.meal_id = ?`,
      }
    });

    const mealParticipantDeleteComponent = new Component({
      id: "meal-participant-delete",
      name: "Meal Participant Delete",
      description: `Component for deleting a participant from a meal.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_participants')} WHERE meal_id = ? AND participant_id = ?`,
      }
    });

    const mealSupervisorDeleteComponent = new Component({
      id: "meal-supervisor-delete",
      name: "Meal Supervisor Delete",
      description: `Component for deleting a supervisor from a meal.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `DELETE FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_supervisors')} WHERE meal_id = ? AND supervisor_id = ?`,
      }
    });

    // Add Participant to Meal Components
    const addParticipantToMealSelectComponent = new Component({
      id: "add-participant-to-meal-select",
      name: "Add Participant to Meal - Participant Select",
      description: `Component for selecting participants to add to meals.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `SELECT participant_id as id, name FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('participants')} ORDER BY name`,
      }
    });

    const addParticipantToMealMealsComponent = new Component({
      id: "add-participant-to-meal-meals",
      name: "Add Participant to Meal - Meals Select",
      description: `Component for selecting meals to add participants to.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `SELECT meal_id as id, name, when_served FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} ORDER BY when_served, name`,
      }
    });

    const addParticipantToMealInsertComponent = new Component({
      id: "add-participant-to-meal-insert",
      name: "Add Participant to Meal - Insert",
      description: `Component for inserting participant-meal relationships.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_participants')} (meal_id, participant_id, date_served) VALUES (?, ?, ?)`,
      }
    });

    // Add Supervisor to Meal Components
    const addSupervisorToMealSelectComponent = new Component({
      id: "add-supervisor-to-meal-select",
      name: "Add Supervisor to Meal - Supervisor Select",
      description: `Component for selecting supervisors to add to meals.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `SELECT supervisor_id as id, name FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('supervisors')} ORDER BY name`,
      }
    });

    const addSupervisorToMealMealsComponent = new Component({
      id: "add-supervisor-to-meal-meals",
      name: "Add Supervisor to Meal - Meals Select",
      description: `Component for selecting meals to add supervisors to.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `SELECT meal_id as id, name, when_served FROM ${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} ORDER BY when_served, name`,
      }
    });

    const addSupervisorToMealInsertComponent = new Component({
      id: "add-supervisor-to-meal-insert",
      name: "Add Supervisor to Meal - Insert",
      description: `Component for inserting supervisor-meal relationships.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: {
        "sql-1": `INSERT INTO ${selectedSystemStore.selectedSystem?.db?.getTableName('meals_supervisors')} (meal_id, supervisor_id, date_served) VALUES (?, ?, ?)`,
      }
    });

    // Date components for meal assignments
    const addParticipantToMealDateComponent = new Component({
      id: "add-participant-to-meal-date",
      name: "Add Participant to Meal - Date Selection",
      description: `Component for selecting date when meal is served to participant.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql-1": "" }
    });

    const addSupervisorToMealDateComponent = new Component({
      id: "add-supervisor-to-meal-date",
      name: "Add Supervisor to Meal - Date Selection",
      description: `Component for selecting date when meal is served with supervisor.`,
      html: { "html": "" },
      css: { "css": "" },
      js: { "js": "" },
      sql: { "sql-1": "" }
    });


    // Store the instances into the store
    componentCodeStore.updateDefaultComponent(mealListComponent);

    componentCodeStore.updateDefaultComponent(statsMealsComponent);
    componentCodeStore.updateDefaultComponent(statsParticipantsComponent);
    componentCodeStore.updateDefaultComponent(statsSessionsComponent);
    componentCodeStore.updateDefaultComponent(statsSupervisorsComponent);
    componentCodeStore.updateDefaultComponent(participantsCapacityCountComponentAll);
    componentCodeStore.updateDefaultComponent(tableCountBadgeComponent);
    componentCodeStore.updateDefaultComponent(sessionDayCountBadgeComponent);
    componentCodeStore.updateDefaultComponent(sessionDateRangeComponent);
    componentCodeStore.updateDefaultComponent(sessionCapacitySectionComponent);
    componentCodeStore.updateDefaultComponent(sessionParticipantsSectionComponent);
    componentCodeStore.updateDefaultComponent(sessionSupervisorsSectionComponent);
    componentCodeStore.updateDefaultComponent(sessionDeleteButtonComponent);
    componentCodeStore.updateDefaultComponent(sessionStatusBadgeComponent);
    componentCodeStore.updateDefaultComponent(participantsCapacityCountComponent);
    componentCodeStore.updateDefaultComponent(participantsCapacityPercentageComponent);
    componentCodeStore.updateDefaultComponent(participantsPageCount1Component);
    componentCodeStore.updateDefaultComponent(participantsPageCount2Component);
    componentCodeStore.updateDefaultComponent(participantsFilterResetComponent);
    componentCodeStore.updateDefaultComponent(participantsFilterInputComponent);
    componentCodeStore.updateDefaultComponent(participantsAddNameComponent);
    componentCodeStore.updateDefaultComponent(participantsAddEmailComponent);
    componentCodeStore.updateDefaultComponent(participantsAddPersonalNumberComponent);
    componentCodeStore.updateDefaultComponent(participantsAddPhoneComponent);
    componentCodeStore.updateDefaultComponent(participantsAddAddressComponent);
    componentCodeStore.updateDefaultComponent(participantsAddAgeComponent);
    componentCodeStore.updateDefaultComponent(participantsAddSessionComponent);
    componentCodeStore.updateDefaultComponent(participantsAddAllergensComponent);
    componentCodeStore.updateDefaultComponent(participantsCardComponent);
    componentCodeStore.updateDefaultComponent(participantsDeleteButtonComponent);
    componentCodeStore.updateDefaultComponent(participantsEditNameComponent);
    componentCodeStore.updateDefaultComponent(participantsEditEmailComponent);
    componentCodeStore.updateDefaultComponent(participantsEditPersonalNumberComponent);
    componentCodeStore.updateDefaultComponent(participantsEditPhoneComponent);
    componentCodeStore.updateDefaultComponent(participantsEditAddressComponent);
    componentCodeStore.updateDefaultComponent(participantsEditAgeComponent);
    componentCodeStore.updateDefaultComponent(participantsEditAllergensComponent);
    componentCodeStore.updateDefaultComponent(participantsEditSessionsComponent);
    componentCodeStore.updateDefaultComponent(participantsSessionMenuComponent);
    componentCodeStore.updateDefaultComponent(participantsAllergenOptionsComponent);
    componentCodeStore.updateDefaultComponent(participantsCountComponent);
    componentCodeStore.updateDefaultComponent(sessionsCountComponent);
    componentCodeStore.updateDefaultComponent(participantsSampleComponent);
    componentCodeStore.updateDefaultComponent(participantsListComponent);
    componentCodeStore.updateDefaultComponent(participantsAllergensComponent);
    componentCodeStore.updateDefaultComponent(participantsSessionsComponent);
    componentCodeStore.updateDefaultComponent(sessionsListComponent);
    componentCodeStore.updateDefaultComponent(participantInsertComponent);
    componentCodeStore.updateDefaultComponent(participantGetIdComponent);
    componentCodeStore.updateDefaultComponent(participantUpdateComponent);
    componentCodeStore.updateDefaultComponent(participantDeleteComponent);
    componentCodeStore.updateDefaultComponent(sessionParticipantInsertComponent);
    componentCodeStore.updateDefaultComponent(sessionParticipantDeleteComponent);
    componentCodeStore.updateDefaultComponent(participantAllergenIdsComponent);
    componentCodeStore.updateDefaultComponent(participantAllergenInsertComponent);
    componentCodeStore.updateDefaultComponent(participantAllergenDeleteComponent);
    componentCodeStore.updateDefaultComponent(participantAllergenCountComponent);
    componentCodeStore.updateActualComponent(participantAllergenCountComponent);
    componentCodeStore.updateDefaultComponent(validationNameComponent);
    componentCodeStore.updateDefaultComponent(validationEmailComponent);
    componentCodeStore.updateDefaultComponent(validationPersonalNumberComponent);
    componentCodeStore.updateDefaultComponent(validationPhoneComponent);
    componentCodeStore.updateDefaultComponent(validationDateRangeComponent);
    componentCodeStore.updateDefaultComponent(sessionParticipantsCountComponent);

    // Register defaults for supervisors
    componentCodeStore.updateDefaultComponent(supervisorsCapacityCountComponent);
    componentCodeStore.updateDefaultComponent(supervisorsCapacityPercentageComponent);
    componentCodeStore.updateDefaultComponent(supervisorsPageCount1Component);
    componentCodeStore.updateDefaultComponent(supervisorsPageCount2Component);
    componentCodeStore.updateDefaultComponent(supervisorsFilterResetComponent);
    componentCodeStore.updateDefaultComponent(supervisorsFilterInputComponent);
    componentCodeStore.updateDefaultComponent(supervisorsSessionMenuComponent);
    componentCodeStore.updateDefaultComponent(supervisorAllergenCountComponent);
    componentCodeStore.updateDefaultComponent(supervisorsAllergenOptionsComponent);
    componentCodeStore.updateDefaultComponent(supervisorsCountComponent);
    componentCodeStore.updateDefaultComponent(supervisorsSampleComponent);
    componentCodeStore.updateDefaultComponent(supervisorsListComponent);
    componentCodeStore.updateDefaultComponent(supervisorsAllergensComponent);
    componentCodeStore.updateDefaultComponent(supervisorsSessionsComponent);
    componentCodeStore.updateDefaultComponent(supervisorInsertComponent);
    componentCodeStore.updateDefaultComponent(supervisorGetIdComponent);
    componentCodeStore.updateDefaultComponent(supervisorUpdateComponent);
    componentCodeStore.updateDefaultComponent(supervisorDeleteComponent);
    componentCodeStore.updateDefaultComponent(sessionSupervisorInsertComponent);
    componentCodeStore.updateDefaultComponent(sessionSupervisorDeleteComponent);
    componentCodeStore.updateDefaultComponent(supervisorAllergenIdsComponent);
    componentCodeStore.updateDefaultComponent(supervisorAllergenInsertComponent);
    componentCodeStore.updateDefaultComponent(supervisorAllergenDeleteComponent);
    componentCodeStore.updateDefaultComponent(mealsComponent);
    componentCodeStore.updateDefaultComponent(mealsAllergensComponent);
    componentCodeStore.updateDefaultComponent(deleteMealButtonComponent);
    componentCodeStore.updateDefaultComponent(addMealComponent);
    componentCodeStore.updateDefaultComponent(editMealComponent);
    componentCodeStore.updateDefaultComponent(whenServedComponent);
    componentCodeStore.updateDefaultComponent(mealPlanComponent);
    componentCodeStore.updateDefaultComponent(mealPlanParticipantAllergensComponent);
    componentCodeStore.updateDefaultComponent(mealPlanSupervisorAllergensComponent);
    componentCodeStore.updateDefaultComponent(mealParticipantDeleteComponent);
    componentCodeStore.updateDefaultComponent(mealSupervisorDeleteComponent);
    componentCodeStore.updateDefaultComponent(addParticipantToMealSelectComponent);
    componentCodeStore.updateDefaultComponent(addParticipantToMealMealsComponent);
    componentCodeStore.updateDefaultComponent(addParticipantToMealInsertComponent);
    componentCodeStore.updateDefaultComponent(addSupervisorToMealSelectComponent);
    componentCodeStore.updateDefaultComponent(addSupervisorToMealMealsComponent);
    componentCodeStore.updateDefaultComponent(addSupervisorToMealInsertComponent);
    componentCodeStore.updateDefaultComponent(addParticipantToMealDateComponent);
    componentCodeStore.updateDefaultComponent(addSupervisorToMealDateComponent);
    componentCodeStore.updateDefaultComponent(sessionParticipantsListComponent);
    componentCodeStore.updateDefaultComponent(sessionSupervisorsListComponent);
    componentCodeStore.updateDefaultComponent(sessionSupervisorsCountComponent);
    componentCodeStore.updateDefaultComponent(mealCountBadgeComponent);



    // Reset to defaults so they are available
    componentCodeStore.resetComponent("supervisors-capacity-count");
    componentCodeStore.resetComponent("supervisors-capacity-percentage");
    componentCodeStore.resetComponent("supervisors-page-count-1");
    componentCodeStore.resetComponent("supervisors-page-count-2");
    componentCodeStore.resetComponent("supervisors-filter-reset");
    componentCodeStore.resetComponent("supervisors-filter-input");
    componentCodeStore.resetComponent("supervisors-session-menu");
    componentCodeStore.resetComponent("supervisor-allergen-count");
    componentCodeStore.resetComponent("supervisors-allergen-options");
    componentCodeStore.resetComponent("supervisors-count");
    componentCodeStore.resetComponent("supervisors-sample");
    componentCodeStore.resetComponent("supervisors-list");
    componentCodeStore.resetComponent("supervisors-allergens");
    componentCodeStore.resetComponent("supervisors-sessions");
    componentCodeStore.resetComponent("supervisor-insert");
    componentCodeStore.resetComponent("supervisor-get-id");
    componentCodeStore.resetComponent("supervisor-update");
    componentCodeStore.resetComponent("supervisor-delete");
    componentCodeStore.resetComponent("session-supervisor-insert");
    componentCodeStore.resetComponent("session-supervisor-delete");
    componentCodeStore.resetComponent("supervisor-allergen-ids");
    componentCodeStore.resetComponent("supervisor-allergen-insert");
    componentCodeStore.resetComponent("supervisor-allergen-delete");
    componentCodeStore.resetComponent("stats-meals");
    componentCodeStore.resetComponent("stats-participants");
    componentCodeStore.resetComponent("stats-sessions");
    componentCodeStore.resetComponent("stats-supervisors");
    componentCodeStore.resetComponent("participants-capacity-count-all");
    componentCodeStore.resetComponent("participants-capacity-count");
    componentCodeStore.resetComponent("dashboard-table-count-badge");
    componentCodeStore.resetComponent("session-day-count-badge");
    componentCodeStore.resetComponent("meals-count-badge");
    componentCodeStore.resetComponent("session-date-range");
    componentCodeStore.resetComponent("session-capacity-section");
    componentCodeStore.resetComponent("session-participants-section");
    componentCodeStore.resetComponent("session-supervisors-section");
    componentCodeStore.resetComponent("session-delete-button");
    componentCodeStore.resetComponent("session-status-badge");
    componentCodeStore.resetComponent("participants-capacity-percentage");
    componentCodeStore.resetComponent("participants-page-count-1");
    componentCodeStore.resetComponent("participants-page-count-2");
    componentCodeStore.resetComponent("participants-filter-reset");
    componentCodeStore.resetComponent("participants-filter-input");
    componentCodeStore.resetComponent("participants-add-name");
    componentCodeStore.resetComponent("participants-add-email");
    componentCodeStore.resetComponent("participants-add-personal_number");
    componentCodeStore.resetComponent("participants-add-phone");
    componentCodeStore.resetComponent("participants-add-address");
    componentCodeStore.resetComponent("participants-add-age");
    componentCodeStore.resetComponent("participants-add-session");
    componentCodeStore.resetComponent("participants-add-allergens");
    componentCodeStore.resetComponent("participants-card");
    componentCodeStore.resetComponent("participants-delete-button");
    componentCodeStore.resetComponent("participants-edit-name");
    componentCodeStore.resetComponent("participants-edit-email");
    componentCodeStore.resetComponent("participants-edit-personal_number");
    componentCodeStore.resetComponent("participants-edit-phone");
    componentCodeStore.resetComponent("participants-edit-address");
    componentCodeStore.resetComponent("participants-edit-age");
    componentCodeStore.resetComponent("participants-edit-allergens");
    componentCodeStore.resetComponent("participants-edit-sessions");
    componentCodeStore.resetComponent("participants-session-menu");
    componentCodeStore.resetComponent("participants-allergen-options");
    componentCodeStore.resetComponent("participants-count");
    componentCodeStore.resetComponent("sessions-count");
    componentCodeStore.resetComponent("participants-sample");
    componentCodeStore.resetComponent("participants-list");
    componentCodeStore.resetComponent("participants-allergens");
    componentCodeStore.resetComponent("participants-sessions");
    componentCodeStore.resetComponent("sessions-list");
    componentCodeStore.resetComponent("participant-insert");
    componentCodeStore.resetComponent("participant-get-id");
    componentCodeStore.resetComponent("participant-update");
    componentCodeStore.resetComponent("participant-delete");
    componentCodeStore.resetComponent("session-participant-insert");
    componentCodeStore.resetComponent("session-participant-delete");
    componentCodeStore.resetComponent("participant-allergen-ids");
    componentCodeStore.resetComponent("participant-allergen-insert");
    componentCodeStore.resetComponent("participant-allergen-delete");
    componentCodeStore.resetComponent("participant-allergen-count");
    componentCodeStore.resetComponent("validation-name");
    componentCodeStore.resetComponent("validation-email");
    componentCodeStore.resetComponent("validation-personal-number");
    componentCodeStore.resetComponent("validation-phone");
    componentCodeStore.resetComponent("validation-date-range");
    componentCodeStore.resetComponent("meals");
    componentCodeStore.resetComponent("meals-allergens");
    componentCodeStore.resetComponent("meals-delete");
    componentCodeStore.resetComponent("meals-add");
    componentCodeStore.resetComponent("meals-edit");
    componentCodeStore.resetComponent("meals-when-served");
    componentCodeStore.resetComponent("meal-plan-list");
    componentCodeStore.resetComponent("meal-plan-participant-allergen-list");
    componentCodeStore.resetComponent("meal-plan-supervisor-allergen-list");
    componentCodeStore.resetComponent("meal-participant-delete");
    componentCodeStore.resetComponent("meal-supervisor-delete");
    componentCodeStore.resetComponent("add-participant-to-meal-select");
    componentCodeStore.resetComponent("add-participant-to-meal-meals");
    componentCodeStore.resetComponent("add-participant-to-meal-insert");
    componentCodeStore.resetComponent("add-supervisor-to-meal-select");
    componentCodeStore.resetComponent("add-supervisor-to-meal-meals");
    componentCodeStore.resetComponent("add-supervisor-to-meal-insert");
    componentCodeStore.resetComponent("add-participant-to-meal-date");
    componentCodeStore.resetComponent("add-supervisor-to-meal-date");
    componentCodeStore.resetComponent("session-participants-count");
    componentCodeStore.resetComponent("session-participants-list");
    componentCodeStore.resetComponent("session-supervisors-list");
    componentCodeStore.resetComponent("session-supervisors-count");
    componentCodeStore.resetComponent("meal-plan-meal-allergen-list");
  }

  public static areComponentsInitialized(): boolean {
    const selectedSystemStore = useSelectedSystemStore();
    return selectedSystemStore.selectedSystem?.defaultComponentMap.length > 0;
  }

}