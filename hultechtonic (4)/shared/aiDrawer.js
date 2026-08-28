// NEXT Collapsible Activity Log Drawer & Raw Telemetry Inspector
(function() {
  let logs = [];
  let drawerOpen = false;
  let activeTab = 'activity'; // 'activity' or 'telemetry'

  function createDrawer() {
    if (document.getElementById('nextAiDrawer')) return;

    const drawer = document.createElement('div');
    drawer.id = 'nextAiDrawer';
    drawer.className = 'next-ai-drawer';
    drawer.innerHTML = `
      <style>
        .next-ai-drawer {
          position: fixed;
          bottom: 0;
          right: 24px;
          z-index: 9999;
          font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .next-drawer-toggle {
          background: #0f172a;
          color: #f8fafc;
          border: 1px solid #334155;
          border-bottom: none;
          padding: 8px 18px;
          border-radius: 8px 8px 0 0;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.4);
          transition: all 0.2s ease;
          user-select: none;
        }
        .next-drawer-toggle:hover {
          background: #1e293b;
          border-color: #475569;
        }
        .next-drawer-toggle .pulse-ring {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
          animation: pulseGreen 2s infinite;
        }
        @keyframes pulseGreen {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .drawer-count {
          background: #3b82f6;
          color: #fff;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          padding: 1px 6px;
          border-radius: 10px;
        }
        .next-drawer-panel {
          display: none;
          width: 760px;
          max-width: 92vw;
          height: 480px;
          background: #090d16;
          border: 1px solid #334155;
          border-bottom: none;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.7);
          flex-direction: column;
        }
        .next-drawer-panel.open {
          display: flex;
        }
        .next-drawer-header {
          padding: 12px 18px;
          background: #0f172a;
          border-bottom: 1px solid #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .drawer-nav-tabs {
          display: flex;
          gap: 6px;
          background: #090d16;
          padding: 3px;
          border-radius: 6px;
          border: 1px solid #1e293b;
        }
        .drawer-tab-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .drawer-tab-btn.active {
          background: #1e293b;
          color: #38bdf8;
        }
        .drawer-btn {
          background: #1e293b;
          border: 1px solid #334155;
          color: #cbd5e1;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        .drawer-btn:hover {
          background: #334155;
        }
        .drawer-content-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .activity-card {
          background: #0d131f;
          border: 1px solid #1e293b;
          border-radius: 6px;
          padding: 10px 14px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          transition: border-color 0.15s;
        }
        .activity-card:hover {
          border-color: #3b82f6;
        }
        .activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .activity-main {
          flex: 1;
          min-width: 0;
        }
        .activity-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 3px;
        }
        .activity-title {
          font-size: 13px;
          font-weight: 700;
          color: #f1f5f9;
        }
        .activity-time {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #64748b;
        }
        .activity-desc {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.4;
        }
        .activity-badges {
          display: flex;
          gap: 6px;
          margin-top: 6px;
        }
        .act-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          padding: 1px 6px;
          border-radius: 3px;
          background: #1e293b;
          color: #cbd5e1;
        }
        .telemetry-row {
          background: #0c1017;
          border: 1px solid #1f293d;
          border-radius: 4px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #cbd5e1;
          cursor: pointer;
        }
        .telemetry-row:hover {
          border-color: #38bdf8;
          background: #111827;
        }
        /* Inspector Modal */
        .next-inspector-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(4px);
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .next-inspector-modal {
          background: #090d16;
          border: 1px solid #334155;
          border-radius: 8px;
          width: 100%;
          max-width: 800px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
        }
        .inspector-header {
          padding: 16px 20px;
          background: #0f172a;
          border-bottom: 1px solid #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .inspector-body {
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .inspector-section {
          background: #050811;
          border: 1px solid #1e293b;
          border-radius: 6px;
          padding: 12px;
        }
        .inspector-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: 700;
          color: #38bdf8;
          margin-bottom: 8px;
          font-family: 'IBM Plex Mono', monospace;
        }
        .inspector-code {
          margin: 0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          line-height: 1.5;
          color: #cbd5e1;
          white-space: pre-wrap;
          word-break: break-word;
          max-height: 220px;
          overflow-y: auto;
        }
        .copy-btn {
          background: #1e293b;
          border: 1px solid #334155;
          color: #94a3b8;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 3px;
          cursor: pointer;
        }
        .copy-btn:hover { color: #fff; background: #334155; }
      </style>

      <div class="next-drawer-toggle" id="nextAiDrawerToggle" aria-label="Toggle Activity Log" role="button" tabindex="0">
        <span class="pulse-ring"></span>
        <span>⚡ Activity Log</span>
        <span class="drawer-count" id="nextDrawerCount">0</span>
        <span class="drawer-arrow" id="nextDrawerArrow">▲</span>
      </div>

      <div class="next-drawer-panel" id="nextAiDrawerPanel">
        <div class="next-drawer-header">
          <div style="display:flex;align-items:center;gap:12px">
            <div class="drawer-nav-tabs">
              <button class="drawer-tab-btn active" id="tabActivityBtn">📋 Activity Feed</button>
              <button class="drawer-tab-btn" id="tabTelemetryBtn">⚙️ AI Model Traces</button>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <button class="drawer-btn" id="nextDrawerRefreshBtn" title="Refresh">↻ Refresh</button>
            <button class="drawer-btn" id="nextDrawerCloseBtn" title="Close">✕</button>
          </div>
        </div>

        <!-- Scrollable List -->
        <div class="drawer-content-scroll" id="nextAiDrawerList">
          <div style="padding:20px;text-align:center;color:#64748b;font-size:12px">Loading activity log...</div>
        </div>
      </div>

      <!-- Raw Prompt & Response Inspection Modal -->
      <div class="next-inspector-overlay" id="nextInspectorOverlay" style="display:none">
        <div class="next-inspector-modal" role="dialog" aria-modal="true">
          <div class="inspector-header">
            <div>
              <div id="inspectorTitle" style="font-size:14px;font-weight:700;color:#fff">Model Execution Trace</div>
              <div id="inspectorMeta" style="font-size:11px;color:#94a3b8;margin-top:2px;font-family:'IBM Plex Mono'">gemini-2.5-flash · Latency: 0.8s</div>
            </div>
            <button class="drawer-btn" id="nextInspectorCloseBtn" style="font-size:14px">✕</button>
          </div>
          <div class="inspector-body">
            <div class="inspector-section">
              <div class="inspector-label">
                <span>FULL PROMPT INPUT</span>
                <button class="copy-btn" id="copyPromptBtn">Copy Prompt</button>
              </div>
              <pre class="inspector-code" id="inspectorPrompt">Loading...</pre>
            </div>
            <div class="inspector-section">
              <div class="inspector-label">
                <span>RAW MODEL OUTPUT</span>
                <button class="copy-btn" id="copyResponseBtn">Copy Response</button>
              </div>
              <pre class="inspector-code" id="inspectorResponse">Loading...</pre>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(drawer);

    // Event listeners
    const toggle = document.getElementById('nextAiDrawerToggle');
    const closeBtn = document.getElementById('nextDrawerCloseBtn');
    const refreshBtn = document.getElementById('nextDrawerRefreshBtn');
    const modalClose = document.getElementById('nextInspectorCloseBtn');
    const overlay = document.getElementById('nextInspectorOverlay');
    const tabActivity = document.getElementById('tabActivityBtn');
    const tabTelemetry = document.getElementById('tabTelemetryBtn');

    toggle.addEventListener('click', toggleDrawer);
    closeBtn.addEventListener('click', () => setDrawerState(false));
    refreshBtn.addEventListener('click', fetchAiLogs);

    tabActivity.addEventListener('click', () => {
      activeTab = 'activity';
      tabActivity.classList.add('active');
      tabTelemetry.classList.remove('active');
      renderLogs();
    });

    tabTelemetry.addEventListener('click', () => {
      activeTab = 'telemetry';
      tabTelemetry.classList.add('active');
      tabActivity.classList.remove('active');
      renderLogs();
    });

    modalClose.addEventListener('click', () => { overlay.style.display = 'none'; });
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.style.display = 'none'; });

    document.getElementById('copyPromptBtn').addEventListener('click', () => {
      navigator.clipboard.writeText(document.getElementById('inspectorPrompt').innerText);
      const btn = document.getElementById('copyPromptBtn');
      btn.innerText = 'Copied!';
      setTimeout(() => btn.innerText = 'Copy Prompt', 2000);
    });

    document.getElementById('copyResponseBtn').addEventListener('click', () => {
      navigator.clipboard.writeText(document.getElementById('inspectorResponse').innerText);
      const btn = document.getElementById('copyResponseBtn');
      btn.innerText = 'Copied!';
      setTimeout(() => btn.innerText = 'Copy Response', 2000);
    });

    initDrawerSSE();
  }

  function toggleDrawer() {
    setDrawerState(!drawerOpen);
  }

  function setDrawerState(open) {
    drawerOpen = open;
    const panel = document.getElementById('nextAiDrawerPanel');
    const arrow = document.getElementById('nextDrawerArrow');
    if (panel) panel.classList.toggle('open', drawerOpen);
    if (arrow) arrow.innerText = drawerOpen ? '▼' : '▲';
    if (drawerOpen) fetchAiLogs();
  }

  async function fetchAiLogs() {
    try {
      const res = await fetch('/api/ai-logs');
      if (!res.ok) return;
      const data = await res.json();
      if (data.logs) {
        logs = data.logs;
        renderLogs();
      }
    } catch (err) {
      console.warn('[Activity Log] Error fetching logs:', err);
    }
  }

  function renderLogs() {
    const list = document.getElementById('nextAiDrawerList');
    const count = document.getElementById('nextDrawerCount');
    if (!list) return;

    if (count) count.innerText = String(logs.length);

    if (logs.length === 0) {
      list.innerHTML = `<div style="padding:24px;text-align:center;color:#64748b;font-size:12px">No activity recorded yet. Run a What-If test, trigger a scan, or execute an action.</div>`;
      return;
    }

    if (activeTab === 'activity') {
      // User-friendly Activity Feed
      list.innerHTML = logs.map(l => {
        let icon = '⚡';
        let iconBg = '#1e293b';
        let iconColor = '#60a5fa';

        if (l.type === 'WHAT_IF_SIMULATION') {
          icon = '💬';
          iconBg = '#172554';
          iconColor = '#60a5fa';
        } else if (l.type === 'DECISION_DISPATCH') {
          icon = l.status === 'STOOD_DOWN' ? '🛑' : '🚀';
          iconBg = l.status === 'STOOD_DOWN' ? '#3b1c1c' : '#064e3b';
          iconColor = l.status === 'STOOD_DOWN' ? '#f87171' : '#34d399';
        } else if (l.type === 'RADAR_SCAN') {
          icon = '📡';
          iconBg = '#1e1b4b';
          iconColor = '#a855f7';
        } else if (l.type === 'LEDGER_AUDIT' || l.type === 'LEDGER_INIT') {
          icon = '🔒';
          iconBg = '#064e3b';
          iconColor = '#34d399';
        } else if (l.type === 'TAMPER_INJECTED') {
          icon = '⚠️';
          iconBg = '#450a0a';
          iconColor = '#ef4444';
        } else if (l.type === 'ROLE_SWITCH') {
          icon = '👤';
          iconBg = '#1f2937';
          iconColor = '#fbbf24';
        }

        const title = escapeHtml(l.title || l.promptName || 'Operation');
        const detail = escapeHtml(l.detail || l.summary || '');
        const time = escapeHtml(l.timeStr || (l.timestamp ? new Date(l.timestamp).toTimeString().slice(0, 8) : 'Just now'));
        const brand = l.brand ? `<span class="act-badge" style="color:#38bdf8">${escapeHtml(l.brand)}</span>` : '';
        const actor = l.actor ? `<span class="act-badge">${escapeHtml(l.actor)}</span>` : '';
        const status = l.status ? `<span class="act-badge" style="color:${l.ok ? '#34d399' : '#f87171'}">${escapeHtml(l.status)}</span>` : '';

        return `
          <div class="activity-card" data-log-id="${l.id}">
            <div class="activity-icon" style="background:${iconBg};color:${iconColor}">
              ${icon}
            </div>
            <div class="activity-main">
              <div class="activity-top">
                <span class="activity-title">${title}</span>
                <span class="activity-time">${time}</span>
              </div>
              <div class="activity-desc">${detail}</div>
              <div class="activity-badges">
                ${brand}
                ${actor}
                ${status}
                <button class="copy-btn" onclick="window.nextOpenInspectorById('${l.id}')" style="margin-left:auto">View AI Trace</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      // Technical AI Telemetry view
      list.innerHTML = logs.map(l => {
        const okIcon = l.ok ? `<span style="color:#10b981;font-weight:700">✓ OK</span>` : `<span style="color:#f87171;font-weight:700">✗ ERR</span>`;
        return `
          <div class="telemetry-row" onclick="window.nextOpenInspectorById('${l.id}')">
            <span style="color:#94a3b8;width:70px">${l.timeStr || '—'}</span>
            <span style="color:#38bdf8;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 8px">${escapeHtml(l.promptName || l.title || 'call')}</span>
            <span style="color:#94a3b8;width:110px">${escapeHtml(l.model || 'gemini-2.5-flash')}</span>
            <span style="color:#fbbf24;width:60px">${l.durationSec || (l.durationMs ? (l.durationMs/1000).toFixed(1)+'s' : '—')}</span>
            <span style="width:60px;text-align:right">${okIcon}</span>
          </div>
        `;
      }).join('');
    }
  }

  function openInspector(log) {
    const overlay = document.getElementById('nextInspectorOverlay');
    const title = document.getElementById('inspectorTitle');
    const meta = document.getElementById('inspectorMeta');
    const promptEl = document.getElementById('inspectorPrompt');
    const respEl = document.getElementById('inspectorResponse');

    title.innerText = `${log.title || log.promptName || 'Operation'} — Reasoning & Telemetry`;
    meta.innerText = `${log.model || 'gemini-2.5-flash'} · Latency: ${log.durationSec || (l.durationMs ? (l.durationMs/1000).toFixed(1)+'s' : '—')} · Citations: ${log.citationsCount || 0}`;

    promptEl.innerText = log.prompt || '(No prompt payload)';
    respEl.innerText = log.response || (log.error ? `ERROR: ${log.error}` : '(No response payload)');

    overlay.style.display = 'flex';
  }

  window.nextOpenInspectorById = function(id) {
    const item = logs.find(x => String(x.id) === String(id));
    if (item) openInspector(item);
  };

  function initDrawerSSE() {
    if (typeof EventSource === 'undefined') return;
    try {
      const es = new EventSource('/api/news/stream');
      es.addEventListener('ai_log', e => {
        try {
          const newLog = JSON.parse(e.data);
          logs.unshift(newLog);
          if (logs.length > 100) logs.length = 100;
          renderLogs();
        } catch {}
      });
    } catch {}
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createDrawer();
      fetchAiLogs();
    });
  } else {
    createDrawer();
    fetchAiLogs();
  }

  window.nextOpenInspector = openInspector;
  window.nextAddAiLog = function(log) {
    logs.unshift(log);
    renderLogs();
  };
})();
