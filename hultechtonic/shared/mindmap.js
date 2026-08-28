// NEXT Radial 4-Ring Reasoning Mind Map & Topology Engine
// Pure functional SVG renderer for Live Signal Ingestion & 7-Agent Mesh Dissent Topology

(function() {
  const PALETTE = {
    go: "#0E9F6E",
    hold: "#B8770A",
    stop: "#C13A4C",
    neutral: "#5A6884",
    brandBlue: "#1F44D6",
    cyanAccent: "#0284C7",
    tensionRed: "#F43F5E",
    darkBg: "#07090E",
    darkCardBg: "#0F141F",
    lightBg: "#FFFFFF",
    lightCardBg: "#F0F4FF"
  };

  class NextMindMap {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.getElementById(container) : container;
      this.options = {
        theme: options.theme || 'dark', // 'dark' or 'light'
        width: options.width || 960,
        height: options.height || 400,
        compact: !!options.compact,
        interactive: options.interactive !== false,
        onNodeClick: options.onNodeClick || null,
        ...options
      };

      this.graph = {
        query: { label: "HUL Live Radar · India", startedAt: new Date().toISOString(), status: "resolved" },
        candidates: [],
        agents: [],
        arbiter: { verdict: "ACT FAST", score: 91, dissent: [], addressedDevilsAdvocate: "", status: "resolved" },
        scenarioConstraint: "",
        events: []
      };

      this.isFrozen = false;
      this.isThinking = false;
      this.activeCandidateIndex = 0;
      this.initDom();
    }

    initDom() {
      if (!this.container) return;
      this.container.innerHTML = '';
      this.container.classList.add('next-mindmap-container');

      // Top control bar if interactive
      if (this.options.interactive) {
        const isDark = this.options.theme === 'dark';
        const controls = document.createElement('div');
        controls.className = 'mindmap-controls';
        controls.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid ${isDark ? '#1a2234' : '#e2e8f0'};
          background: ${isDark ? '#0b0f19' : '#f8faff'};
          border-radius: 8px 8px 0 0;
          font-family: 'IBM Plex Sans', sans-serif;
        `;
        controls.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px">
            <span style="display:inline-flex;align-items:center;gap:6px;font:700 11px/1 'IBM Plex Mono',monospace;color:${isDark ? '#38bdf8' : '#1F44D6'}">
              <span class="live-pulse" style="width:7px;height:7px;border-radius:50%;background:${isDark ? '#34d399' : '#0E9F6E'};display:inline-block"></span>
              AI REASONING TOPOLOGY · 7-AGENT MESH
            </span>
            <span id="mmScenarioBadge" style="display:none;font:600 10px/1 'IBM Plex Mono',monospace;background:rgba(245,158,11,0.15);color:#f59e0b;padding:3px 8px;border-radius:4px;border:1px solid rgba(245,158,11,0.3)">
              SCENARIO SIMULATED
            </span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <button class="mm-btn" id="mmBtnReplay" style="background:${isDark ? '#141c2b' : '#ffffff'};border:1px solid ${isDark ? '#26354d' : '#cbd5e1'};color:${isDark ? '#cbd5e1' : '#334155'};font:600 11px/1 'IBM Plex Sans',sans-serif;padding:5px 10px;border-radius:5px;cursor:pointer">▶ Animate Flow</button>
            <button class="mm-btn" id="mmBtnFreeze" style="background:${isDark ? '#141c2b' : '#ffffff'};border:1px solid ${isDark ? '#26354d' : '#cbd5e1'};color:${isDark ? '#cbd5e1' : '#334155'};font:600 11px/1 'IBM Plex Sans',sans-serif;padding:5px 10px;border-radius:5px;cursor:pointer">⏸ Freeze</button>
            <button class="mm-btn" id="mmBtnExplain" style="background:${isDark ? '#1e293b' : '#e0e7ff'};border:1px solid ${isDark ? '#334155' : '#c7d2fe'};color:${isDark ? '#38bdf8' : '#1d4ed8'};font:600 11px/1 'IBM Plex Sans',sans-serif;padding:5px 10px;border-radius:5px;cursor:pointer">ℹ How It Thinks</button>
          </div>
        `;
        this.container.appendChild(controls);

        controls.querySelector('#mmBtnFreeze')?.addEventListener('click', (e) => {
          this.isFrozen = !this.isFrozen;
          e.target.innerText = this.isFrozen ? '▶ Unfreeze' : '⏸ Freeze';
        });

        controls.querySelector('#mmBtnReplay')?.addEventListener('click', () => {
          this.triggerThinkingAnimation();
        });

        controls.querySelector('#mmBtnExplain')?.addEventListener('click', () => {
          this.showExplanationModal();
        });
      }

      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.setAttribute("viewBox", `0 0 ${this.options.width} ${this.options.height}`);
      this.svg.setAttribute("class", `mindmap-svg-canvas theme-${this.options.theme}`);
      this.svg.setAttribute("style", "width:100%;height:auto;display:block;border-radius:0 0 8px 8px");
      this.svg.setAttribute("role", "img");
      this.svg.setAttribute("aria-label", "AI Specialist Agent Reasoning Mind Map");
      this.container.appendChild(this.svg);

      // Tooltip popover
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'mindmap-tooltip';
      this.tooltip.style.cssText = "display:none;position:absolute;z-index:90;padding:10px 14px;background:#030508;border:1px solid #38bdf8;border-radius:6px;color:#fff;font-family:'IBM Plex Sans',sans-serif;font-size:12px;box-shadow:0 10px 25px rgba(0,0,0,0.6);pointer-events:none;max-width:300px;";
      this.container.style.position = 'relative';
      this.container.appendChild(this.tooltip);

      this.render();
    }

    setThinking(thinking) {
      this.isThinking = !!thinking;
      this.render();
    }

    triggerThinkingAnimation() {
      this.isThinking = true;
      this.render();
      setTimeout(() => {
        this.isThinking = false;
        this.render();
      }, 2400);
    }

    updateData(newGraph) {
      if (this.isFrozen) return;
      this.graph = {
        ...this.graph,
        ...newGraph,
        events: [...(this.graph.events || []), ...(newGraph.events || [])]
      };
      
      const badge = this.container.querySelector('#mmScenarioBadge');
      if (badge) {
        if (this.graph.scenarioConstraint) {
          badge.style.display = 'inline-block';
          badge.innerText = `SCENARIO: ${this.graph.scenarioConstraint.slice(0, 24)}…`;
        } else {
          badge.style.display = 'none';
        }
      }

      this.render();
    }

    showExplanationModal() {
      const modal = document.createElement('div');
      modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);";
      modal.innerHTML = `
        <div style="background:#0c1017;border:1px solid #28354b;border-radius:12px;max-width:620px;width:100%;color:#fff;padding:24px;box-shadow:0 20px 40px rgba(0,0,0,0.8);font-family:'IBM Plex Sans',sans-serif">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;border-bottom:1px solid #1a2332;padding-bottom:12px">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:20px">🧠</span>
              <b style="font-size:16px;color:#38bdf8">How the 7-Agent Reasoning Mind Map Works</b>
            </div>
            <button id="closeMmExp" style="background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer">✕</button>
          </div>
          <div style="font-size:13px;line-height:1.6;color:#cbd5e1;display:flex;flex-direction:column;gap:12px">
            <div style="background:#131b29;padding:10px 12px;border-radius:6px;border-left:3px solid #3b82f6">
              <b style="color:#60a5fa">1. Multi-Lane Signal Ingestion (Ring 0):</b> The system scans 6 live channels (National news, Social Reels, Search surges, Quick Commerce dark stores, Vernacular wires, Weather/Civic events).
            </div>
            <div style="background:#131b29;padding:10px 12px;border-radius:6px;border-left:3px solid #10b981">
              <b style="color:#34d399">2. Brand Constitution Gate (Ring 1):</b> The signal is matched against the Living Brand Twin (e.g. Dove Rule 4.2 anti-filter charter). Irrelevant or off-brand noise is pruned.
            </div>
            <div style="background:#131b29;padding:10px 12px;border-radius:6px;border-left:3px solid #f59e0b">
              <b style="color:#fbbf24">3. 7 Specialized Model Deliberation (Ring 2):</b> Culture, Brand, Legal/ASCI, Commercial ROI, Creative DAM, PR Resilience, and Devil's Advocate vote independently.
            </div>
            <div style="background:#131b29;padding:10px 12px;border-radius:6px;border-left:3px solid #f43f5e">
              <b style="color:#f87171">4. Dissent Tension Analysis (Arcs):</b> Disagreements (e.g. high viral surge vs devil's advocate backlash concern) are surfaced as glowing red/amber tension arcs.
            </div>
            <div style="background:#131b29;padding:10px 12px;border-radius:6px;border-left:3px solid #34d399">
              <b style="color:#34d399">5. Arbiter Consensus & Multi-Rail Dispatch (Ring 3 & 4):</b> Synthesizes the final verdict and dispatches reversible actions to Meta Ads & Blinkit rails.
            </div>
          </div>
          <button id="closeMmExpBtn" style="margin-top:18px;width:100%;background:#1d4ed8;border:none;color:#fff;font-weight:700;padding:10px;border-radius:6px;cursor:pointer">Got it, close</button>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('#closeMmExp').onclick = () => modal.remove();
      modal.querySelector('#closeMmExpBtn').onclick = () => modal.remove();
      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    render() {
      if (!this.svg) return;
      const g = this.graph;
      const w = this.options.width;
      const h = this.options.height;
      const isDark = this.options.theme === 'dark';
      const bgLine = isDark ? '#1C273C' : '#E2E8F0';
      const textColor = isDark ? '#FFFFFF' : '#0E1B33';
      const subColor = isDark ? '#94A3B8' : '#64748B';

      let html = `
        <defs>
          <linearGradient id="gradFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${PALETTE.brandBlue}" stop-opacity="0.9"/>
            <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="${PALETTE.go}" stop-opacity="0.9"/>
          </linearGradient>
          <filter id="glowDissent" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      `;

      // Background subtle grid
      html += `<rect x="0" y="0" width="${w}" height="${h}" fill="${isDark ? PALETTE.darkBg : PALETTE.lightBg}" />`;

      // Draw subtle column lanes
      const colLanes = [
        { label: "01 · RADAR FEED", x: 80 },
        { label: "02 · BRAND FIT", x: 260 },
        { label: "03 · 7-AGENT DELIBERATION", x: 540 },
        { label: "04 · ARBITER", x: 770 },
        { label: "05 · DISPATCH", x: 890 }
      ];

      colLanes.forEach(col => {
        html += `
          <line x1="${col.x}" y1="18" x2="${col.x}" y2="${h - 15}" stroke="${isDark ? '#101726' : '#f1f5f9'}" stroke-width="1" stroke-dasharray="4,4" />
          <text x="${col.x}" y="20" fill="${isDark ? '#475569' : '#94a3b8'}" font-family="'IBM Plex Mono', monospace" font-size="9" font-weight="700" text-anchor="middle">${col.label}</text>
        `;
      });

      // Ring 0: Radar Query Node
      const r0 = {
        x: 80,
        y: h / 2,
        label: g.query?.label || "HUL · India · Live",
        lanes: "6 Surveillance Lanes"
      };

      // Ring 1: Candidates
      const rawCandidates = (g.candidates && g.candidates.length > 0) ? g.candidates : [
        { id: "C1", brand: "Dove", headline: "Filter Backlash Surge", relevance: 92, status: "resolved" },
        { id: "C2", brand: "Surf Excel", headline: "Monsoon Mud Sports", relevance: 88, status: "resolved" },
        { id: "C3", brand: "Pond's", headline: "Generic Category Chatter", relevance: 31, status: "pruned" }
      ];

      const r1X = 260;
      const cSpacing = (h - 60) / (rawCandidates.length + 1);
      const candNodes = rawCandidates.map((c, i) => ({
        ...c,
        x: r1X,
        y: 40 + cSpacing * (i + 1),
        isPruned: c.status === 'pruned' || (c.relevance !== undefined && c.relevance < 45)
      }));

      const activeCand = candNodes[this.activeCandidateIndex] || candNodes.find(c => !c.isPruned) || candNodes[0];

      // Ring 2: 7 Specialist Agents
      const rawAgents = (g.agents && g.agents.length > 0) ? g.agents : [
        { name: "Culture", score: 92, verdict: "Go", line: "Discussion velocity +320% across Tier-1 metros" },
        { name: "Brand Voice", score: 96, verdict: "Go", line: "100% alignment with Dove Real Beauty charter Rule 4.2" },
        { name: "Legal / ASCI", score: 94, verdict: "Go", line: "ASCI consumer representation pre-cleared, zero misleading claim risk" },
        { name: "Commercial ROI", score: 86, verdict: "Go", line: "₹1.8 Cr earned media value forecast vs ₹25L deployment" },
        { name: "Creative DAM", score: 90, verdict: "Go", line: "UGC video assets ready in DAM for instant multi-adapter dispatch" },
        { name: "PR Resilience", score: 88, verdict: "Go", line: "94% safe sentiment; crisis playbook ready" },
        { name: "Devil's Advocate", score: 74, verdict: "Hold", line: "Risk of competitor ambush accusing HUL of moral posturing" }
      ];

      const r2X = 540;
      const aSpacing = (h - 60) / (rawAgents.length + 1);
      const agentNodes = rawAgents.map((a, i) => {
        const scoreNum = parseInt(a.score, 10) || 85;
        let v = a.verdict || (scoreNum >= 85 ? 'Go' : scoreNum >= 70 ? 'Hold' : 'Stop');
        return {
          ...a,
          scoreNum,
          verdict: v,
          x: r2X,
          y: 35 + aSpacing * (i + 1),
          radius: 14
        };
      });

      // Ring 3: Arbiter Node
      const r3 = {
        x: 770,
        y: h / 2,
        verdict: g.arbiter?.verdict || "ACT FAST",
        score: g.arbiter?.score || 91
      };

      // Ring 4: Execution Node
      const r4 = {
        x: 890,
        y: h / 2,
        label: r3.verdict === "ACT FAST" ? "DISPATCHED" : "HELD"
      };

      // ----------------------------------------------------
      // DRAW CONNECTOR EDGES
      // ----------------------------------------------------

      // Edges: R0 -> R1
      candNodes.forEach(c => {
        const isPruned = c.isPruned;
        const stroke = isPruned ? '#475569' : PALETTE.cyanAccent;
        const strokeDash = isPruned ? '4,4' : 'none';
        const opacity = isPruned ? 0.35 : 0.85;
        const d = `M ${r0.x + 35} ${r0.y} C ${(r0.x + c.x) / 2} ${r0.y}, ${(r0.x + c.x) / 2} ${c.y}, ${c.x - 45} ${c.y}`;
        html += `<path d="${d}" stroke="${stroke}" stroke-width="${isPruned ? 1 : 2}" stroke-dasharray="${strokeDash}" fill="none" opacity="${opacity}" />`;
      });

      // Edges: Active Candidate -> Ring 2 (7 Specialists)
      if (activeCand) {
        agentNodes.forEach(a => {
          const color = a.verdict === 'Go' ? PALETTE.go : (a.verdict === 'Stop' ? PALETTE.stop : PALETTE.hold);
          const d = `M ${activeCand.x + 45} ${activeCand.y} C ${(activeCand.x + a.x) / 2} ${activeCand.y}, ${(activeCand.x + a.x) / 2} ${a.y}, ${a.x - 70} ${a.y}`;
          const isPulse = this.isThinking;
          html += `<path d="${d}" stroke="${color}" stroke-width="1.8" stroke-dasharray="${isPulse ? '4,4' : 'none'}" fill="none" opacity="0.8">
            ${isPulse ? '<animate attributeName="stroke-dashoffset" values="20;0" dur="0.8s" repeatCount="indefinite" />' : ''}
          </path>`;
        });
      }

      // Edges: Ring 2 -> Arbiter
      agentNodes.forEach(a => {
        const color = a.verdict === 'Go' ? PALETTE.go : (a.verdict === 'Stop' ? PALETTE.stop : PALETTE.hold);
        const weight = a.name.includes("Devil") ? 2.5 : 1.5;
        const d = `M ${a.x + 70} ${a.y} C ${(a.x + r3.x) / 2} ${a.y}, ${(a.x + r3.x) / 2} ${r3.y}, ${r3.x - 35} ${r3.y}`;
        html += `<path d="${d}" stroke="${color}" stroke-width="${weight}" fill="none" opacity="0.65" />`;
      });

      // Tension Arc: Disagreement between Go agent & Devil's Advocate
      const daAgent = agentNodes.find(a => a.name.includes("Devil") || a.verdict === "Hold" || a.verdict === "Stop");
      const topGoAgent = agentNodes.find(a => a.verdict === "Go");
      if (daAgent && topGoAgent && daAgent !== topGoAgent) {
        const tensionD = `M ${topGoAgent.x + 30} ${topGoAgent.y} C ${topGoAgent.x - 120} ${(topGoAgent.y + daAgent.y) / 2}, ${daAgent.x - 120} ${(topGoAgent.y + daAgent.y) / 2}, ${daAgent.x + 30} ${daAgent.y}`;
        html += `
          <path d="${tensionD}" stroke="${PALETTE.tensionRed}" stroke-width="2.5" stroke-dasharray="5,3" fill="none" opacity="0.9" filter="url(#glowDissent)">
            <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
          </path>
          <rect x="${(topGoAgent.x + daAgent.x) / 2 - 130}" y="${(topGoAgent.y + daAgent.y) / 2 - 10}" width="105" height="18" rx="4" fill="#2a0808" stroke="#f43f5e" stroke-width="1"/>
          <text x="${(topGoAgent.x + daAgent.x) / 2 - 78}" y="${(topGoAgent.y + daAgent.y) / 2 + 2}" fill="#fca5a5" font-family="'IBM Plex Mono',monospace" font-size="8" font-weight="700" text-anchor="middle">⚡ DISSENT TENSION</text>
        `;
      }

      // Edge: Arbiter -> Final Dispatch
      html += `<path d="M ${r3.x + 35} ${r3.y} L ${r4.x - 35} ${r4.y}" stroke="${r3.verdict === 'ACT FAST' ? PALETTE.go : PALETTE.brandBlue}" stroke-width="3" fill="none" />`;

      // ----------------------------------------------------
      // DRAW NODES & LABELS
      // ----------------------------------------------------

      // R0: Radar Query Node
      html += `
        <g transform="translate(${r0.x}, ${r0.y})">
          <rect x="-35" y="-24" width="70" height="48" rx="8" fill="${isDark ? '#0c1322' : '#e0e7ff'}" stroke="${PALETTE.cyanAccent}" stroke-width="1.5" />
          <circle cx="0" cy="-6" r="6" fill="${PALETTE.cyanAccent}" />
          <text x="0" y="12" fill="${textColor}" font-family="'IBM Plex Sans',sans-serif" font-size="9" font-weight="700" text-anchor="middle">LIVE RADAR</text>
          <text x="0" y="32" fill="${subColor}" font-family="'IBM Plex Mono',monospace" font-size="7.5" text-anchor="middle">6 INGEST LANES</text>
        </g>
      `;

      // R1: Candidates
      candNodes.forEach(c => {
        const isPruned = c.isPruned;
        const bg = isDark ? (isPruned ? '#080c14' : '#0e182a') : (isPruned ? '#f1f5f9' : '#eef2ff');
        const stroke = isPruned ? '#334155' : PALETTE.brandBlue;
        html += `
          <g transform="translate(${c.x}, ${c.y})" style="cursor:pointer">
            <rect x="-48" y="-18" width="96" height="36" rx="6" fill="${bg}" stroke="${stroke}" stroke-width="${isPruned ? 1 : 1.5}" />
            <text x="0" y="-3" fill="${isPruned ? subColor : textColor}" font-family="'IBM Plex Sans',sans-serif" font-size="10" font-weight="700" text-anchor="middle">${c.brand}</text>
            <text x="0" y="10" fill="${isPruned ? '#ef4444' : PALETTE.go}" font-family="'IBM Plex Mono',monospace" font-size="8" font-weight="600" text-anchor="middle">
              ${isPruned ? 'PRUNED (31%)' : `FIT: ${c.relevance || 92}%`}
            </text>
          </g>
        `;
      });

      // R2: 7 Specialist Agents
      agentNodes.forEach(a => {
        const isGo = a.verdict === 'Go';
        const isStop = a.verdict === 'Stop';
        const stroke = isGo ? PALETTE.go : (isStop ? PALETTE.stop : PALETTE.hold);
        const badgeBg = isGo ? '#064e3b' : (isStop ? '#450a0a' : '#451a03');
        const badgeColor = isGo ? '#34d399' : (isStop ? '#f87171' : '#fbbf24');
        const nodeBg = isDark ? '#0b111c' : '#ffffff';

        html += `
          <g transform="translate(${a.x}, ${a.y})" style="cursor:pointer">
            <rect x="-70" y="-15" width="140" height="30" rx="6" fill="${nodeBg}" stroke="${stroke}" stroke-width="1.5" />
            <text x="-60" y="3" fill="${textColor}" font-family="'IBM Plex Sans',sans-serif" font-size="10" font-weight="600" text-anchor="start">${a.name}</text>
            
            <rect x="25" y="-9" width="38" height="18" rx="4" fill="${badgeBg}" />
            <text x="44" y="3" fill="${badgeColor}" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="700" text-anchor="middle">${a.scoreNum || a.score}</text>
          </g>
        `;
      });

      // R3: Arbiter Synthesis Node
      html += `
        <g transform="translate(${r3.x}, ${r3.y})">
          <circle cx="0" cy="0" r="32" fill="${isDark ? '#06281b' : '#dcfce7'}" stroke="${PALETTE.go}" stroke-width="2.5" />
          <text x="0" y="-8" fill="${textColor}" font-family="'IBM Plex Sans',sans-serif" font-size="8" font-weight="700" text-anchor="middle">ARBITER</text>
          <text x="0" y="6" fill="${PALETTE.go}" font-family="'IBM Plex Mono',monospace" font-size="13" font-weight="800" text-anchor="middle">${r3.score}</text>
          <text x="0" y="18" fill="${PALETTE.go}" font-family="'IBM Plex Mono',monospace" font-size="7.5" font-weight="700" text-anchor="middle">${r3.verdict}</text>
        </g>
      `;

      // R4: Dispatch Gate Node
      html += `
        <g transform="translate(${r4.x}, ${r4.y})">
          <rect x="-35" y="-20" width="70" height="40" rx="6" fill="${isDark ? '#081c12' : '#e6f7f0'}" stroke="${PALETTE.go}" stroke-width="1.5" />
          <text x="0" y="-3" fill="${PALETTE.go}" font-family="'IBM Plex Sans',sans-serif" font-size="8" font-weight="800" text-anchor="middle">GATEWAY</text>
          <text x="0" y="11" fill="#34d399" font-family="'IBM Plex Mono',monospace" font-size="8" font-weight="700" text-anchor="middle">DISPATCHED</text>
        </g>
      `;

      this.svg.innerHTML = html;
    }
  }

  window.NextMindMap = NextMindMap;
})();
