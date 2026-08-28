// NEXT Global AI Status Bar Component
(function() {
  function createStatusBar() {
    if (document.getElementById('nextGlobalStatusBar')) return;

    const bar = document.createElement('div');
    bar.id = 'nextGlobalStatusBar';
    bar.className = 'next-global-status-bar';
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-live', 'polite');

    const currentRole = localStorage.getItem('next_operator_role') || 'Brand Manager';
    const isObserver = currentRole === 'Viewing Only';

    bar.innerHTML = `
      <div class="next-status-container">
        <div class="next-status-left">
          <div id="nextStatusChip" class="next-status-chip chip-demo">
            <span class="next-status-dot"></span>
            <span id="nextStatusChipText">DEMO FIXTURES</span>
          </div>
          <div id="nextStatusDetail" class="next-status-detail">
            <span id="nextStatusBannerText">Checking AI telemetry...</span>
          </div>
        </div>
        <div class="next-status-right">
          <div class="next-status-meta" id="nextStatusMeta">
            <span class="meta-item" id="nextQuotaMeta">
              <span class="meta-label">Calls Left:</span> <b id="nextCallsRemaining">— / 1500</b>
              <button id="nextResetQuotaBtn" title="Reset API Calls Quota" style="background:#1e293b;border:1px solid #334155;color:#38bdf8;font-size:10px;font-family:inherit;padding:1px 6px;border-radius:3px;cursor:pointer;margin-left:4px;transition:all 0.15s ease">↻ Reset</button>
              <span id="nextQuotaReset" style="color:#8a9098;font-size:10px;margin-left:4px"></span>
            </span>
            <span class="meta-separator">·</span>
            <span class="meta-item">
              <span class="meta-label">Mode:</span> 
              <button id="nextModeToggleBtn" style="background:#171b22;border:1px solid #2a313d;color:#cbd5e1;font-size:11px;font-family:inherit;padding:1px 6px;border-radius:3px;cursor:pointer">LIVE</button>
            </span>
            <span class="meta-separator">·</span>
            <span class="meta-item" id="nextRoleMetaItem">
              <span class="meta-label">Viewing as:</span> <b id="nextCurrentRoleBadge" style="color:${isObserver ? '#9ca3af' : '#60a5fa'}">${currentRole}</b>
              <a href="javascript:void(0)" id="nextRoleSwitchLink" style="color:#38bdf8;margin-left:4px;text-decoration:underline;font-size:11px">Switch</a>
            </span>
          </div>
        </div>
      </div>
    `;

    // Insert at top of document
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(bar, body.firstChild);
    } else {
      body.appendChild(bar);
    }

    // Reset Quota event
    const resetBtn = document.getElementById('nextResetQuotaBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        resetBtn.disabled = true;
        resetBtn.innerText = '...';
        try {
          const res = await fetch('/api/quota/reset', { method: 'POST' });
          const data = await res.json();
          if (data && data.quota) {
            renderStatus(data.quota);
          }
          await updateStatusBar();
          if (window.nextFetchAiLogs) {
            window.nextFetchAiLogs();
          }
        } catch (err) {
          console.warn('[NEXT Status Bar] Reset quota error:', err);
        } finally {
          resetBtn.disabled = false;
          resetBtn.innerText = '↻ Reset';
        }
      });
    }

    // Role switch event
    const switchLink = document.getElementById('nextRoleSwitchLink');
    if (switchLink) {
      switchLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.showRoleGateModal) {
          window.showRoleGateModal();
        } else {
          window.location.href = '/war-room/?switchRole=true';
        }
      });
    }

    // Mode toggle event
    const modeBtn = document.getElementById('nextModeToggleBtn');
    if (modeBtn) {
      modeBtn.addEventListener('click', async () => {
        const currentText = modeBtn.innerText.trim();
        const nextMode = currentText === 'LIVE' ? 'replay' : 'live';
        try {
          const res = await fetch('/api/mode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: nextMode })
          });
          const data = await res.json();
          if (data.success) {
            updateStatusBar();
          }
        } catch {}
      });
    }
  }

  async function updateStatusBar() {
    try {
      const res = await fetch('/api/diagnostics');
      if (!res.ok) return;
      const data = await res.json();
      renderStatus(data);
    } catch (err) {
      console.warn('[NEXT Status Bar] Error fetching diagnostics:', err);
    }
  }

  function renderStatus(diag) {
    const chip = document.getElementById('nextStatusChip');
    const chipText = document.getElementById('nextStatusChipText');
    const detail = document.getElementById('nextStatusDetail');
    const bannerText = document.getElementById('nextStatusBannerText');
    const callsRemainingEl = document.getElementById('nextCallsRemaining');
    const quotaResetEl = document.getElementById('nextQuotaReset');
    const modeBtn = document.getElementById('nextModeToggleBtn');
    const roleBadge = document.getElementById('nextCurrentRoleBadge');

    if (!chip || !chipText || !bannerText) return;

    const currentRole = localStorage.getItem('next_operator_role') || 'Brand Manager';
    if (roleBadge) {
      roleBadge.innerText = currentRole;
      roleBadge.style.color = currentRole === 'Viewing Only' ? '#9ca3af' : '#60a5fa';
    }

    const isKey = diag.apiKeyPresent;
    const isScanning = diag.isScanning;
    const isReplay = diag.operatingMode === 'replay';
    let mode = diag.mode;

    // Mode button
    if (modeBtn) {
      modeBtn.innerText = isReplay ? 'REPLAY' : 'LIVE';
      modeBtn.style.color = isReplay ? '#f59e0b' : '#34d399';
      modeBtn.style.borderColor = isReplay ? '#d97706' : '#059669';
    }

    // Reset classes
    chip.className = 'next-status-chip';

    if (isReplay) {
      chip.classList.add('chip-demo');
      chip.style.background = 'rgba(245, 158, 11, 0.15)';
      chip.style.borderColor = '#d97706';
      chip.style.color = '#f59e0b';
      chipText.innerText = 'DEMO MODE';
      bannerText.innerHTML = `<span style="color:#f59e0b">Demo mode — replaying a real session at realistic pacing (0 API calls used).</span>`;
    } else if (isScanning) {
      chip.classList.add('chip-scanning');
      chipText.innerText = 'SCANNING…';
      bannerText.innerHTML = `<span style="color:#3B82F6">Live market search scanning 6 intelligence lanes...</span>`;
    } else if (!isKey || mode === 'demo') {
      chip.classList.add('chip-demo');
      chipText.innerText = 'DEMO MODE';
      bannerText.innerHTML = `<span class="demo-warning-text">No API key detected — showing sample intelligence data.</span>`;
    } else if (mode === 'live-grounded') {
      chip.classList.add('chip-grounded');
      chipText.innerText = 'LIVE · SEARCH CONNECTED';
      const downshiftStr = diag.isDownshifted ? ' <span style="color:#f59e0b">(Optimized model mode active)</span>' : '';
      bannerText.innerHTML = `<span style="color:#0E9F6E;font-weight:600">AI live with real-time web verification${downshiftStr}</span>`;
    } else {
      chip.classList.add('chip-ungrounded');
      chipText.innerText = 'LIVE · DIRECT';
      bannerText.innerHTML = `<span style="color:#B8770A">AI responding in direct mode</span>`;
    }

    // Live Recovery Toast
    if (diag.liveRecoveryToast) {
      showRecoveryToast(diag.liveRecoveryToast);
    }

    if (callsRemainingEl) {
      const remaining = diag.remainingRPD !== undefined ? diag.remainingRPD : 250;
      const total = diag.rpdLimit || 250;
      callsRemainingEl.innerText = `${remaining.toLocaleString('en-IN')} / ${total.toLocaleString('en-IN')} calls left`;
      if (remaining < 30) {
        callsRemainingEl.style.color = '#f87171';
      } else {
        callsRemainingEl.style.color = '#e2e8f0';
      }
    }

    if (quotaResetEl && diag.resetTimeString) {
      quotaResetEl.innerText = `(${diag.resetTimeString})`;
    }
  }

  function showRecoveryToast(msg) {
    let toast = document.getElementById('nextRecoveryToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'nextRecoveryToast';
      toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#064e3b;color:#34d399;border:1px solid #059669;padding:12px 18px;border-radius:8px;font-family:"IBM Plex Sans",sans-serif;font-size:13px;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,0.5);z-index:99999;transition:all 0.3s ease;transform:translateY(0);opacity:1';
      document.body.appendChild(toast);
    }
    toast.innerText = `✓ ${msg}`;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { if (toast) toast.style.display = 'none'; }, 300);
    }, 4000);
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createStatusBar();
      updateStatusBar();
      setInterval(updateStatusBar, 10000);
    });
  } else {
    createStatusBar();
    updateStatusBar();
    setInterval(updateStatusBar, 10000);
  }

  window.nextUpdateStatusBar = updateStatusBar;
})();
