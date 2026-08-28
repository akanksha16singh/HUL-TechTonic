// NEXT AI Telemetry & Activity Drawer Component
(function() {
  function initAIDrawer() {
    if (document.getElementById('nextGlobalAIDrawer')) return;

    const drawer = document.createElement('div');
    drawer.id = 'nextGlobalAIDrawer';
    drawer.className = 'next-ai-drawer';
    drawer.innerHTML = `
      <div style="padding:14px 16px;border-bottom:1px solid #1E2B40;background:#080D1A;display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#38BDF8"></span>
          <span style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;color:#F8FAFC">AI Telemetry & Agent Stream</span>
        </div>
        <button onclick="window.toggleAIDrawer()" style="background:none;border:none;color:#94A3B8;font-size:18px;cursor:pointer;line-height:1">✕</button>
      </div>

      <div id="aiDrawerLogStream" style="flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px;font-family:'IBM Plex Mono',monospace;font-size:11px">
        <div style="color:#64748B;text-align:center;padding:20px 0">Listening for multi-agent reasoning logs...</div>
      </div>

      <div style="padding:10px 16px;border-top:1px solid #1E2B40;background:#080D1A;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:10px;color:#64748B;font-family:'IBM Plex Mono',monospace">Gemini 2.5 Flash / 7-Agent Mesh</span>
        <button onclick="fetchLatestAILogs()" style="background:#1E293B;color:#38BDF8;border:1px solid #334155;border-radius:4px;font-size:10px;padding:3px 8px;cursor:pointer">Clear / Refresh</button>
      </div>
    `;

    document.body.appendChild(drawer);
    initSSEListener();
  }

  window.toggleAIDrawer = function() {
    const drawer = document.getElementById('nextGlobalAIDrawer');
    if (!drawer) return;
    drawer.classList.toggle('open');
    if (drawer.classList.contains('open')) {
      fetchLatestAILogs();
    }
  };

  async function fetchLatestAILogs() {
    const container = document.getElementById('aiDrawerLogStream');
    if (!container) return;
    try {
      const res = await fetch('/api/ai-logs');
      const data = await res.json();
      if (!data.logs || data.logs.length === 0) {
        container.innerHTML = `<div style="color:#64748B;text-align:center;padding:20px 0">No recent agent activity.</div>`;
        return;
      }
      container.innerHTML = data.logs.map(log => renderLogItem(log)).join('');
    } catch (e) {
      console.warn('Failed to fetch AI logs:', e);
    }
  }

  function renderLogItem(log) {
    const isError = log.status === 'ERROR' || log.type === 'ERROR';
    const isExecution = log.type === 'DECISION_DISPATCH';
    const badgeBg = isError ? 'rgba(239, 68, 68, 0.2)' : isExecution ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.15)';
    const badgeColor = isError ? '#EF4444' : isExecution ? '#10B981' : '#60A5FA';

    return `
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;display:flex;flex-direction:column;gap:4px">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="background:${badgeBg};color:${badgeColor};padding:2px 6px;border-radius:4px;font-weight:700;font-size:10px">${log.agent || log.type || 'SYSTEM'}</span>
          <span style="color:#64748B;font-size:10px">${log.time || log.timestamp || 'Just now'}</span>
        </div>
        <div style="color:#E2E8F0;line-height:1.4">${log.text || log.title || log.detail || ''}</div>
        ${log.durationMs ? `<div style="color:#94A3B8;font-size:9px">Latency: ${log.durationMs}ms · Prompt: ${log.promptName || 'Autonomous'}</div>` : ''}
      </div>
    `;
  }

  function initSSEListener() {
    if (typeof EventSource === 'undefined') return;
    try {
      const es = new EventSource('/api/news/stream');
      es.addEventListener('agent_log', e => {
        try {
          const log = JSON.parse(e.data);
          const container = document.getElementById('aiDrawerLogStream');
          if (container) {
            const el = document.createElement('div');
            el.innerHTML = renderLogItem(log);
            container.prepend(el.firstElementChild);
          }
        } catch {}
      });
    } catch {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIDrawer);
  } else {
    initAIDrawer();
  }
})();
