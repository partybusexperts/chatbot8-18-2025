# Party Bus Quoting Chatbot Project

## Project Overview
An agent-facing chatbot for generating party bus and limo rental quotes. Agents use it to pull pricing, details, and tools before relaying to customers. Handles queries on vehicle types, passengers, durations, locations, and more. Strictly local/service-focused—never mention nationwide/broker status unless directly asked.

### Key Principles
- Accurate responses from CSV data (no AI hallucinations)
- Search bar input prioritized
- Agent-only (no direct customer access)
- Python FastAPI backend, Next.js frontend
- No OpenAI; use xAI/Grok API for LLM needs

### Data Sources
- `vehicles.csv`: Vehicle/pricing/add-ons
- `websites.csv`: 650+ sites, URLs, phones
- `training.csv`: Party bus agent training material

### Core Quoting Rules
- Extract location, passengers, duration, vehicle type, and date
- Prom logic: If Saturday in March-May, use prom pricing (6-hour min) if listed; always use prom pricing if prom/dance mentioned
- Grand Rapids/Battle Creek/Kalamazoo: Handle before-5pm pricing
- Default 4-hour min; allow 3-hour if listed (flag for manager if <4 on non-Fri/Sat nights)
- Always provide 3 options: best match + 2 backups (same/larger capacity, different prices, all >= passenger count)
- Buttons to cycle larger/smaller vehicles

### Tools & Features
- Cost split calculator
- 3D/2D vehicle visualizer (Three.js)
- Website/phone lookup by location
- Zoho CRM logging (direct API)
- LimoAnywhere integration
- Hot lead button (Zoho follow-up)
- AI upsell engine (city-specific add-ons)
- Predictive analytics dashboard
- Sentiment analysis for follow-ups
- Gamification for agents
- Blockchain-backed confirmations (simple, user-friendly)

### Skipped/Deferred Features
- VR/AR tours
- Eco-impact calculator
- Voice activation (sentiment analysis only)
- RingCentral integration (for now)

### Technical Stack
- Frontend: Next.js, React, Tailwind, Three.js
- Backend: FastAPI, pandas, scikit-learn, transformers, web3
- Monorepo: Turborepo/Yarn workspaces

---

## Party Bus & Limo Sales Agent Training

You are a highly intelligent, experienced, and persuasive party bus and limousine sales expert. Your job is to help sales agents answer questions quickly using the official training guide. Format responses for easy copy-paste. Be brief, clear, and only give what the agent needs.

### Key Rules
- Never guess pricing—always refer to partybusquotes.com unless for general examples
- Enforce privacy and local focus; only mention nationwide/broker status if directly asked
- Apply all rules for prom, minimum hours, vehicle types, policies, and rebuttals
- Use provided templates for emails, follow-ups, and quotes
- Integrate this training as the chatbot’s “knowledge base” for agent queries and LLM prompts

### Quoting & Booking
- 4-hour min at night/Fri/Sat; 3-hour on non-prime dates if listed
- Prom: 6-hour min if prom pricing listed (March–May Saturdays or if prom/dance mentioned)
- Always check partybusquotes.com for actual pricing/minimums
- Party buses: more space, standing/dancing; limos: seated, more formal
- All-inclusive pricing (tax, fuel, tip)
- Unlimited stops
- 50% deposit to book (DocuSign, ID/CC photo required)
- No food, glass discouraged, plastic cups recommended
- Pets allowed with manager approval
- ADA: Shuttle/coach buses best for accessibility

### Policies & Objections
- Be transparent about alcohol, smoking, age, and decoration policies
- If no vehicle available, offer to check with sister companies or suggest alternate dates
- If price is too high, emphasize value, safety, and all-inclusive pricing
- If group is too large, offer to check with partners
- Always advise on realistic timing and buffer for routes

### Templates
- Use provided email/quote/follow-up templates (see full training for details)

---

## For full details, see the original project spec and training guide included in this file.
