/**
 * AuditLogger.js
 * Centralized State & User Interaction Audit Logging System.
 */

const MAX_BUFFER_SIZE = 200;
const auditLogStore = [];
const SESSION_ID = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

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

  auditLogStore.push(entry);
  if (auditLogStore.length > MAX_BUFFER_SIZE) {
    auditLogStore.shift();
  }

  if (typeof console !== 'undefined') {
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
      { Field: 'Timestamp', Value: entry.timestamp },
      { Field: 'Action', Value: entry.action },
      { Field: 'Previous State', Value: typeof previousState === 'object' ? JSON.stringify(previousState) : String(previousState) },
      { Field: 'New State', Value: typeof newState === 'object' ? JSON.stringify(newState) : String(newState) },
      { Field: 'Route', Value: entry.metadata.route },
      { Field: 'Component', Value: entry.metadata.component || 'N/A' }
    ]);

    if (Object.keys(metadata).length > 0) {
      console.info('Additional Metadata:', entry.metadata);
    }
    console.groupEnd();
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('finlenss-audit-log', { detail: entry }));
  }

  return entry;
};

export const getAuditLogs = () => [...auditLogStore];
export const clearAuditLogs = () => { auditLogStore.length = 0; };

if (typeof window !== 'undefined') {
  window.__FINLENSS_AUDIT_LOGS__ = auditLogStore;
  window.getAuditLogs = getAuditLogs;
  window.clearAuditLogs = clearAuditLogs;
  window.logAudit = logAudit;
}

export default logAudit;
