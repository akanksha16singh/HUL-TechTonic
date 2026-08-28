// NEXT Global Status Bar Component
(function() {
  let statusState = {
    mode: 'demo',
    signalsCount: 0,
    ledgerCount: 0,
    role: 'Brand Director',
    sseConnected: true,
    lastLatency: '420ms'
  };

  function initStatusBar() {
    if (document.getElementById('nextGlobalStatusBar')) return;

    const bar = document.createElement('div');
    bar.id = 'nextGlobalStatusBar';
    bar.className = 'next-status-bar';
    bar.innerHTML = `
      <div class="next-status-bar-item">
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#10B981;box-shadow:0 0 6px #10B981"></span>
        <span style="color:#E2E8F0;font-weight:700">NEXT KERNEL v2.5</span>
        <span style="color:#64748B">|</span>
        <span style="color:#94A3B8">MODE:</span>
        <span id="sbModeBadge" style="color:#38BDF8;font-weight:600">DEMO</span>
        <span style="color:#64748B">|</span>
        <span style="color:#94A3B8">SIGNALS:</span>
        <span id="sbSignalsCount" style="color:#FBBF24;font-weight:700">0</span>
        <span style="color:#64748B">|</span>
        <span style="color:#94A3B8">LEDGER:</span>
        <span id="sbLedgerCount" style="color:#34D399;font-weight:700">0</span>
      </div>

      <div class="next-status-bar-item">
        <span style="color:#94A3B8">ROLE:</span>
        <select id="sbRoleSelect" onchange="window.switchExecutiveRole(this.value)" style="background:#0F172A;color:#38BDF8;border:1px solid #334155;border-radius:4px;font-family:'IBM Plex Mono',monospace;font-size:10px;padding:2px 6px;cursor:pointer">
          <option value="Social Lead">Social Lead (₹50k)</option>
          <option value="Brand Manager">Brand Manager (₹5L)</option>
          <option value="Category Lead">Category Lead (₹5L)</option>
          <option value="Brand Director" selected>Brand Director (₹25L)</option>
          <option value="Marketing VP">Marketing VP (Unlimited)</option>
          <option value="Executive Committee / MD">Executive Committee (Unlimited)</option>
        </select>
        <button onclick="window.toggleAIDrawer && window.toggleAIDrawer()" style="background:#1E293B;color:#CBD5E1;border:1px solid #334155;border-radius:4px;font-family:'IBM Plex Mono',monospace;font-size:10px;padding:2px 8px;cursor:pointer;display:flex;align-items:center;gap:4px">
          <span>⚡ AI Telemetry</span>
        </button>
      </div>
    `;

    document.body.appendChild(bar);
    updateStatusBarMetrics();
    setInterval(updateStatusBarMetrics, 10000);
  }

  async function updateStatusBarMetrics() {
    try {
      const [diag, sig, led] = await Promise.all([
        fetch('/api/diagnostics').then(r => r.json()).catch(() => ({})),
        fetch('/api/signals').then(r => r.json()).catch(() => ({ count: 0 })),
        fetch('/api/ledger').then(r => r.json()).catch(() => ({ count: 0 }))
      ]);

      const modeEl = document.getElementById('sbModeBadge');
      if (modeEl && diag.mode) modeEl.innerText = diag.mode.toUpperCase();

      const sigEl = document.getElementById('sbSignalsCount');
      if (sigEl && sig.count !== undefined) sigEl.innerText = sig.count;

      const ledEl = document.getElementById('sbLedgerCount');
      if (ledEl && led.count !== undefined) ledEl.innerText = led.count;
    } catch (e) {
      console.warn('Status bar update error:', e);
    }
  }

  window.switchExecutiveRole = async function(roleName) {
    statusState.role = roleName;
    try {
      await fetch('/api/role/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleName })
      });
      // Broadcast to window listeners
      window.dispatchEvent(new CustomEvent('next:role_changed', { detail: { role: roleName } }));
    } catch (e) {
      console.warn('Role switch failed:', e);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatusBar);
  } else {
    initStatusBar();
  }
})();
