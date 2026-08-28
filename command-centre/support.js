// NEXT Command Centre Support Engine
let currentCategory = 'Personal Care';
let activeSignal = null;
let currentRole = 'Brand Director';

document.addEventListener('DOMContentLoaded', () => {
  loadCategorySignals();
  initSSE();
});

window.addEventListener('next:role_changed', e => {
  currentRole = e.detail.role;
  const roleEl = document.getElementById('ccUserRole');
  if (roleEl) roleEl.innerText = `${currentRole}`;
  if (activeSignal) renderSignalCockpit(activeSignal);
});

async function loadCategorySignals() {
  try {
    const res = await fetch('/api/signals');
    const data = await res.json();
    if (data.signals && data.signals.length > 0) {
      const match = data.signals.find(s => s.category === currentCategory) || data.signals[0];
      activeSignal = match;
      renderSignalCockpit(match);
    } else {
      document.getElementById('activeSignalCockpit').innerHTML = `
        <div class="card" style="text-align:center;padding:40px;color:#5A6884">
          <h3>No Pending Signals for ${currentCategory}</h3>
          <p>The 7-agent mesh is continuously monitoring live channels.</p>
        </div>
      `;
    }
  } catch (err) {
    console.error('Failed to load signals:', err);
  }
}

function selectCategory(catName, el) {
  currentCategory = catName;
  document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');
  loadCategorySignals();
}

function renderSignalCockpit(sig) {
  const container = document.getElementById('activeSignalCockpit');
  if (!container) return;

  const isExecuted = sig.executed;
  const budgetINR = 2500000;

  container.innerHTML = `
    <!-- Top Signal Summary Header -->
    <div class="card" style="border-left:4px solid var(--blue)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="background:var(--blue);color:#fff;font-weight:800;font-size:11px;padding:4px 10px;border-radius:6px;font-family:'IBM Plex Mono'">${sig.brand}</span>
          <span style="background:#EAF0FF;color:var(--blue);font-weight:700;font-size:11px;padding:4px 10px;border-radius:6px;font-family:'IBM Plex Mono'">${sig.category}</span>
          <span style="color:#5A6884;font-size:12px">${sig.source}</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <div style="text-align:right">
            <div style="font-size:10px;color:#5A6884;font-family:'IBM Plex Mono'">OPPORTUNITY SCORE</div>
            <div style="font-size:18px;font-weight:800;color:var(--green);font-family:'IBM Plex Mono'">${sig.opportunityScore}/100</div>
          </div>
          <span style="background:${sig.verdictBg || '#E8F8F0'};color:${sig.verdictColor || '#0E9F6E'};font-weight:800;font-size:12px;padding:6px 12px;border-radius:8px;font-family:'IBM Plex Mono'">${sig.verdict}</span>
        </div>
      </div>

      <h1 style="font-size:24px;font-weight:800;margin:0 0 10px;line-height:1.3">${sig.headline}</h1>
      <p style="font-size:15px;line-height:1.6;color:#5A6884;margin:0 0 16px">${sig.summary}</p>

      <!-- Arbiter Synthesis Box -->
      <div style="background:#F0F5FF;border:1px solid #C7D6FF;border-radius:12px;padding:16px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="font-size:16px">🏛️</span>
          <strong style="font-size:13px;color:var(--blue-deep)">Arbiter Consensus & Recommendation</strong>
        </div>
        <div style="font-size:13px;line-height:1.6;color:#1E293B">${sig.arbiterSummary || 'Specialist agents recommend an immediate reactive campaign on Instagram Reels countering AI beauty filters, coupled with high-priority dark store quick-commerce placement.'}</div>
      </div>
    </div>

    <!-- 7 Specialist Agents Grid -->
    <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5A6884;text-transform:uppercase;margin:0 0 12px">7-Agent Specialist Deliberation</div>
    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:16px;margin-bottom:24px">
      <div class="agent-card">
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:13px">
          <span>01. Trend & Culture</span>
          <span style="color:var(--blue);font-size:10px;font-family:'IBM Plex Mono'">SCORE: 94</span>
        </div>
        <div style="font-size:12px;color:#5A6884">Viral peak expected in next 3-4 hours across Gen-Z creator circles. High organic receptivity.</div>
      </div>

      <div class="agent-card">
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:13px">
          <span>02. Brand Living Twin</span>
          <span style="color:var(--green);font-size:10px;font-family:'IBM Plex Mono'">ALIGNED 98%</span>
        </div>
        <div style="font-size:12px;color:#5A6884">Perfect alignment with Dove's Self-Esteem Project and #RealBeauty charter. Zero brand hypocrisy.</div>
      </div>

      <div class="agent-card">
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:13px">
          <span>03. ASCI & Legal</span>
          <span style="color:var(--green);font-size:10px;font-family:'IBM Plex Mono'">CLEARED</span>
        </div>
        <div style="font-size:12px;color:#5A6884">No comparative disparagement. DPDP compliance and standard disclaimer pre-attached.</div>
      </div>

      <div class="agent-card">
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:13px">
          <span>04. Commercial & ROI</span>
          <span style="color:var(--amber);font-size:10px;font-family:'IBM Plex Mono'">3.8x ROAS</span>
        </div>
        <div style="font-size:12px;color:#5A6884">Allocated ₹25,00,000 for top metro quick commerce (Blinkit & Zepto) boost. Projected +14% lift.</div>
      </div>

      <div class="agent-card">
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:13px">
          <span>05. Channel & Creative</span>
          <span style="color:var(--blue);font-size:10px;font-family:'IBM Plex Mono'">READY</span>
        </div>
        <div style="font-size:12px;color:#5A6884">Pre-cleared 9:16 vertical creator assets ready for immediate dispatch across 25 top creators.</div>
      </div>

      <div class="agent-card">
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:13px">
          <span>06. PR & Community</span>
          <span style="color:var(--blue);font-size:10px;font-family:'IBM Plex Mono'">LOW RISK</span>
        </div>
        <div style="font-size:12px;color:#5A6884">Anticipated positive creator solidarity. Defense holding lines prepped for potential trolls.</div>
      </div>

      <div class="agent-card" style="grid-column:1 / -1;background:#FFFBEB;border-color:#FDE68A">
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:13px;color:#92400E">
          <span>07. Devil's Advocate & Risk Skeptic</span>
          <span style="font-size:10px;font-family:'IBM Plex Mono'">OBJECTION ADDRESSED</span>
        </div>
        <div style="font-size:12px;color:#78350F">
          "Risk: Competitors might claim HUL uses digital touch-ups in legacy print. Counter: All digital assets strictly mandate 100% unretouched real skin disclosure."
        </div>
      </div>
    </div>

    <!-- Governance & Human Decision Card -->
    <div class="card" style="border: 2px solid ${isExecuted ? '#0E9F6E' : '#C7D6FF'}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div>
          <h3 style="margin:0;font-size:18px;font-weight:800">Executive Decision Rights & Multi-Adapter Dispatch</h3>
          <div style="font-size:12px;color:#5A6884">Governed under HUL Policy Level 2 (Brand Director / Up to ₹25,00,000)</div>
        </div>
        <span style="font-family:'IBM Plex Mono';font-size:12px;font-weight:700;color:var(--blue)">PROPOSED BUDGET: ₹25,00,000</span>
      </div>

      ${isExecuted ? `
        <div style="background:#E8F8F0;border:1px solid #0E9F6E;border-radius:12px;padding:20px;display:flex;flex-direction:column;gap:10px">
          <div style="display:flex;align-items:center;gap:8px;color:#0E9F6E;font-weight:800;font-size:16px">
            <span>✅</span>
            <span>DECISION EXECUTED & SEALED INTO IMMUTABLE LEDGER</span>
          </div>
          <div style="font-size:13px;color:#1E293B">Dispatched across Meta Ads Manager, Instagram Creator Marketplace, and Blinkit dark stores.</div>
          <div style="font-family:'IBM Plex Mono';font-size:11px;color:#0E9F6E;background:#FFFFFF;padding:8px 12px;border-radius:6px;border:1px solid #C4EBD8">
            SHA-256 LEDGER HASH: ${sig.executionRecord?.hash || '9ff93bfe845b7c2993429a995e437d10d366329d853ae65b1d000ab9d4d4fc4a'}
          </div>
        </div>
      ` : `
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;background:#F8FAFC;padding:16px;border-radius:12px;border:1px solid #E2E8F0">
          <div style="font-size:13px;color:#334155;max-width:560px">
            By authorizing, ₹25,00,000 will be deployed to Meta Ads and quick-commerce dark stores. An immutable SHA-256 block will be minted into the ledger.
          </div>
          <div style="display:flex;gap:12px">
            <button class="btn-stand-down" onclick="executeDecision('STAND_DOWN')">Stand Down</button>
            <button class="btn-action" onclick="executeDecision('APPROVE_DISPATCH')">
              <span>🚀 Authorize & Dispatch</span>
            </button>
          </div>
        </div>
      `}
    </div>
  `;
}

async function executeDecision(choice) {
  if (!activeSignal) return;
  try {
    const res = await fetch('/api/decision/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signalId: activeSignal.id,
        choice,
        operatorRole: currentRole,
        allocBudgetINR: 2500000,
        targetBrand: activeSignal.brand
      })
    });
    const data = await res.json();
    if (data.success) {
      activeSignal.executed = true;
      activeSignal.executionRecord = data.record;
      renderSignalCockpit(activeSignal);
    } else {
      alert(`Authorization notice: ${data.reason || 'Failed to execute decision'}`);
    }
  } catch (err) {
    console.error('Execution error:', err);
  }
}

async function triggerCCRefresh() {
  try {
    await fetch('/api/signals/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandQuery: currentCategory })
    });
    loadCategorySignals();
  } catch (e) {}
}

function initSSE() {
  if (typeof EventSource === 'undefined') return;
  try {
    const es = new EventSource('/api/news/stream');
    es.addEventListener('new_signal', () => loadCategorySignals());
    es.addEventListener('decision_executed', () => loadCategorySignals());
    es.addEventListener('heartbeat', e => {
      try {
        const d = JSON.parse(e.data);
        if (d.nextRefreshInSec !== undefined) {
          const mins = String(Math.floor(d.nextRefreshInSec / 60)).padStart(2, '0');
          const secs = String(d.nextRefreshInSec % 60).padStart(2, '0');
          const el = document.getElementById('ccCountdown');
          if (el) el.innerText = `${mins}:${secs}`;
        }
      } catch {}
    });
  } catch {}
}
