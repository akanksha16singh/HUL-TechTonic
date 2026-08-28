# NEXT — Cultural Decision Infrastructure for Hindustan Unilever

NEXT is an operational decision infrastructure for Hindustan Unilever (HUL). When a cultural signal arrives, seven specialist agents evaluate it from distinct domain perspectives, an Arbiter synthesizes the multi-agent consensus, a decision-rights engine determines authorization, a human approves, and a cryptographically chained SHA-256 ledger records the immutable outcome.

## Architecture

```
                                  ┌─────────────────────────────┐
                                  │   Real-Time Cultural Wire   │
                                  │   (Search Grounded / News)  │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                           7 Specialist Agent Mesh + 1 Arbiter                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │Cultural Trend│ │ Brand Voice  │ │ Legal & ASCI │ │Commercial ROAS││Channel Fit (Blinkit)│ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘ │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐                              │
│  │   PR & Safety Resilience    │ │    Supply Chain & Ops       │                              │
│  └─────────────────────────────┘ └─────────────────────────────┘                              │
│                                                │                                              │
│                                                ▼                                              │
│                                 ┌─────────────────────────────┐                               │
│                                 │   Arbiter Consensus Agent   │                               │
│                                 └─────────────────────────────┘                               │
└────────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │    DECISION_MATRIX Engine   │
                                  │    (Reversibility & Rights) │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │    Human Approval & Audit   │
                                  │  (Command Centre / War Room)│
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │   Append-Only Ledger DB     │
                                  │ (SHA-256 Block Verification)│
                                  └─────────────────────────────┘
```

## Key Capabilities

1. **7+1 Specialist Agent Mesh**: Parallel domain evaluations (Culture, Brand, Legal/ASCI, Commercial, Channel Fit, PR Resilience, Supply Chain) synthesized by a dedicated Arbiter agent.
2. **Cryptographic SHA-256 Ledger**: Every decision produces an append-only block chained to the previous block's SHA-256 hash. Real-time integrity validation via `/api/ledger/verify`.
3. **Live FMCG Grounding**: Server-side Google Gemini models with Google Search Grounding for real-time market signals across Indian social and commercial platforms (Instagram Reels, YouTube Shorts, Moj, ShareChat, Blinkit, Zepto).
4. **Dynamic Reasoning Mind Map**: SVG vector visualization rendering live multi-agent tension, weights, and trade-offs.
5. **Universal Telemetry & AI Drawer**: Global status bar and inspectable drawer showing agent logs, model latency, token metrics, and provenance.

## Application Surfaces

| View | Route | Purpose |
|---|---|---|
| **Executive Landing** | `/` | Portfolio overview, live metric strip, active agent mesh |
| **Command Centre** | `/command-centre/` | Multi-role decision dashboard, signal queues, execution loop |
| **Cultural War Room** | `/war-room/` | High-pressure single-moment evaluation with dynamic mind map |

## Running the Application

```bash
npm install
npm run dev
# Or with explicit environment file:
node --env-file=.env server.js
# Server runs on port 3000 (http://localhost:3000)
```

### Environment Configuration (.env)

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Key configuration options:
- `GEMINI_API_KEY`: Google Gemini API key for live multi-agent intelligence
- `GEMINI_MODEL`: Primary Gemini model (default: `gemini-3.7-flash`)
- `GEMINI_ARBITER_MODEL`: Dedicated Arbiter model (default: `gemini-3.7-flash`)
- `GEMINI_RPM_LIMIT`: Rate limit calls per minute (default: `10`)
- `GEMINI_RPD_LIMIT`: Daily budget limit (default: `250`)
- `NEWS_REFRESH_MS`: Ingestion cycle interval (default: `600000` / 10m)
- `DEMO_MODE`: Enable tamper demo simulator (default: `true`)

## API Endpoints

- `GET /api/signals`: Live FMCG signals and evaluation states
- `POST /api/signals/refresh`: Trigger grounded search refresh
- `GET /api/news/stream`: Server-Sent Events (SSE) live telemetry stream
- `POST /api/decision/execute`: Authorize and seal a decision block
- `GET /api/ledger`: Fetch the immutable decision ledger
- `GET /api/ledger/verify`: Verify SHA-256 cryptographic chain integrity
- `POST /api/ledger/tamper-demo`: Simulate block tampering and test verification
- `GET /api/diagnostics`: System health, agent mesh state, and model latency
- `GET /api/ai-logs`: Real-time AI interaction logs and provenance

