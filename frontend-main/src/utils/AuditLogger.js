/**
 * AuditLogger.js
 * 
 * Centralized State & User Interaction Audit Logging System.
 * Captures, formats, and tracks state/setting changes across the entire Finlenss application.
 * 
 * Schema:
 *  - id: Unique entry identifier
 *  - timestamp: ISO 8601 string of exact time
 *  - action: Upper-case identifier string (e.g. "CATEGORY_FILTER_CHANGED", "FEEDBACK_SUBMITTED")
 *  - previousState: State value before the change
 *  - newState: State value after the change
 *  - metadata: Additional context (component, route, user agent, etc.)
 */

// Maximum number of logs retained in in-memory circular buffer
const MAX_BUFFER_SIZE = 200;
const auditLogStore = [];

// Generate session ID for tracking current browser session
const SESSION_ID = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

/**
 * Log a state or setting change to the unified audit log.
 * 
 * @param {string} action - Descriptive action identifier (e.g. 'CATEGORY_FILTER_CHANGED')
 * @param {any} previousState - Previous state value
 * @param {any} newState - New state value
 * @param {object} [metadata={}] - Optional metadata such as component name, URL, user context
 * @returns {object} The logged audit entry
 */
export const logAudit = (action, previousState, newState, metadata = {}) => {
  const timestamp = new Date().toISOString();
  const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const currentRoute = typeof window !== 'undefined' ? window.location.pathname : '/';

  const entry = {
    id,
    timestamp,
    action: action ? String(action).toUpperCase() : 'UNKNOWN_ACTION',
    previousState: previousState !== undefined ? previousState : null,
    newState: newState !== undefined ? newState : null,
    metadata: {
      route: currentRoute,
      sessionId: SESSION_ID,
      ...metadata
    }
  };

  // Add to in-memory circular buffer
  auditLogStore.push(entry);
  if (auditLogStore.length > MAX_BUFFER_SIZE) {
    auditLogStore.shift();
  }

  // Visual Console Output for DevTools
  if (typeof console !== 'undefined') {
    // Styled Console Badge
    const badgeStyle = 'background: #0D47A1; color: #FFFFFF; font-weight: bold; padding: 2px 6px; border-radius: 4px;';
    const actionStyle = 'color: #0284C7; font-weight: 700;';
    const timeStyle = 'color: #64748B; font-size: 10px;';

    console.groupCollapsed(
      `%cAUDIT%c ${entry.action} %c@ ${new Date(timestamp).toLocaleTimeString()}`,
      badgeStyle,
      actionStyle,
      timeStyle
    );

    console.table([
      {
        Field: 'Timestamp',
        Value: entry.timestamp
      },
      {
        Field: 'Action',
        Value: entry.action
      },
      {
        Field: 'Previous State',
        Value: typeof previousState === 'object' ? JSON.stringify(previousState) : String(previousState)
      },
      {
        Field: 'New State',
        Value: typeof newState === 'object' ? JSON.stringify(newState) : String(newState)
      },
      {
        Field: 'Route',
        Value: entry.metadata.route
      },
      {
        Field: 'Component',
        Value: entry.metadata.component || 'N/A'
      }
    ]);

    if (Object.keys(metadata).length > 0) {
      console.info('Additional Metadata:', entry.metadata);
    }
    console.groupEnd();
  }

  // Dispatch custom browser event for reactive subscribers/analytics
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('finlenss-audit-log', { detail: entry }));
  }

  return entry;
};

/**
 * Retrieve all currently buffered audit logs.
 */
export const getAuditLogs = () => [...auditLogStore];

/**
 * Clear all buffered audit logs.
 */
export const clearAuditLogs = () => {
  auditLogStore.length = 0;
  console.info('%c[AUDIT LOG] Cleared in-memory log buffer.', 'color: #10B981; font-weight: bold;');
};

/**
 * Export audit logs as downloadable JSON file (for QA / debugging).
 */
export const exportAuditLogs = () => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogStore, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `finlenss_audit_logs_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Batch sender hook ready to flush logs to a backend API endpoint.
 * 
 * @param {string} [apiEndpoint='/api/audit-logs']
 */
export const flushLogsToBackend = async (apiEndpoint = '/api/audit-logs') => {
  if (auditLogStore.length === 0) return;
  const payload = [...auditLogStore];
  try {
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs: payload })
    });
    if (res.ok) {
      console.info(`%c[AUDIT SYNC] Flushed ${payload.length} logs to backend.`, 'color: #10B981;');
    }
  } catch (err) {
    console.warn('[AUDIT SYNC WARNING] Failed to flush logs to backend:', err.message);
  }
};

// Expose helpful developer tools utilities on the global window object in development/browser
if (typeof window !== 'undefined') {
  window.__FINLENSS_AUDIT_LOGS__ = auditLogStore;
  window.getAuditLogs = getAuditLogs;
  window.clearAuditLogs = clearAuditLogs;
  window.exportAuditLogs = exportAuditLogs;
  window.logAudit = logAudit;
}

export default logAudit;
