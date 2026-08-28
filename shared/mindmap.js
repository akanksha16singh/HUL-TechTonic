// NEXT 7-Agent Mesh Radial Reasoning Mindmap & Topology
window.renderMeshMindmap = function(containerId, signalData, meshResults) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const agents = [
    { id: 'trend', name: 'Trend & Culture', icon: '📡', angle: 0, status: 'VERIFIED', color: '#3B82F6' },
    { id: 'brand', name: 'Brand Twin', icon: '🛡️', angle: 51, status: 'ALIGNED', color: '#10B981' },
    { id: 'asci', name: 'ASCI & Legal', icon: '⚖️', angle: 103, status: 'CLEARED', color: '#6366F1' },
    { id: 'roi', name: 'Commercial & ROI', icon: '📈', angle: 154, status: 'POSITIVE', color: '#F59E0B' },
    { id: 'channel', name: 'Channel & Creative', icon: '🎨', angle: 206, status: 'READY', color: '#EC4899' },
    { id: 'pr', name: 'PR & Community', icon: '📢', angle: 257, status: 'MONITORED', color: '#8B5CF6' },
    { id: 'devil', name: "Devil's Advocate", icon: '⚠️', angle: 308, status: 'CHALLENGED', color: '#EF4444' }
  ];

  const width = container.clientWidth || 500;
  const height = 340;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.38;

  let nodesHtml = '';
  let linesSvg = `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">`;

  agents.forEach(agent => {
    const rad = (agent.angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);

    // Draw line from center Arbiter to agent
    linesSvg += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="${agent.color}" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6"/>`;

    nodesHtml += `
      <div style="position:absolute;left:${x}px;top:${y}px;transform:translate(-50%, -50%);background:#0F172A;border:1px solid ${agent.color};border-radius:8px;padding:6px 10px;display:flex;align-items:center;gap:6px;box-shadow:0 4px 12px rgba(0,0,0,0.4);font-family:'IBM Plex Mono',monospace;font-size:10px;white-space:nowrap;z-index:2">
        <span>${agent.icon}</span>
        <span style="color:#F1F5F9;font-weight:600">${agent.name}</span>
        <span style="background:${agent.color}22;color:${agent.color};padding:1px 5px;border-radius:4px;font-size:9px">${agent.status}</span>
      </div>
    `;
  });

  linesSvg += `</svg>`;

  container.style.position = 'relative';
  container.style.height = `${height}px`;
  container.style.overflow = 'hidden';
  container.style.background = '#080D1A';
  container.style.borderRadius = '12px';
  container.style.border = '1px solid #1E293B';

  container.innerHTML = `
    ${linesSvg}
    <!-- Center Arbiter Node -->
    <div style="position:absolute;left:${centerX}px;top:${centerY}px;transform:translate(-50%, -50%);background:#1E1B4B;border:2px solid #6366F1;border-radius:50%;width:80px;height:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(99,102,241,0.4);z-index:3;text-align:center">
      <span style="font-size:18px">🏛️</span>
      <span style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:10px;color:#EEF2FF">ARBITER</span>
      <span style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:#A5B4FC">SYNTHESIS</span>
    </div>
    ${nodesHtml}
  `;
};
