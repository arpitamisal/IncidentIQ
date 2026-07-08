# IncidentIQ

**AI Incident Investigator powered by Gemini and Google Cloud.**

IncidentIQ helps developers upload logs, Kubernetes YAML files, screenshots, and architecture diagrams. Gemini analyzes the evidence together and generates a structured incident investigation with root cause, severity, timeline, fixes, and a postmortem report.

## Inspiration

Production incidents are stressful because the evidence needed to diagnose them is scattered across logs, configuration files, screenshots, dashboards, and documentation. IncidentIQ explores how Gemini's multimodal reasoning can simplify incident response by turning messy evidence into a clear investigation.

## What it does

- Upload incident evidence files
- Analyze logs, YAML, screenshots, and diagrams together
- Generate an incident summary
- Reconstruct an incident timeline
- Identify the most likely root cause
- Estimate severity and confidence
- Recommend fixes and prevention steps
- Generate a professional postmortem report

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- FastAPI
- Python
- Gemini API
- Google GenAI SDK
- Docker
- Google Cloud Run

## How Gemini API Was Used

Gemini is used as the reasoning engine. The backend sends uploaded evidence to Gemini with a structured SRE investigation prompt. Gemini returns JSON containing the root cause, timeline, findings, severity, confidence score, recommended fixes, kubectl commands, and a postmortem report.

## Project Structure

```text
IncidentIQ/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── app/
│   ├── package.json
│   ├── Dockerfile
│   └── tailwind.config.ts
├── sample-incidents/
├── docker-compose.yml
└── README.md
```

## Hosted Website Link

https://incidentiq-web-662488458944.us-central1.run.app/

## Run Locally

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your Gemini API key to .env
uvicorn main:app --reload --port 8000
```

Backend runs on:

```text
http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

### 3. Test the app

Upload the files from `sample-incidents/`:

- `pod_logs.txt`
- `deployment.yaml`
- `dashboard.txt`
- `architecture.md`
- `dashboard.png`

Then click **Analyze Incident**.

## Environment Variables

Backend `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
ALLOWED_ORIGINS=http://localhost:3000
```

Frontend `.env.local` if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Docker

```bash
docker compose up --build
```

## Deploy to Google Cloud Run

### Backend

```bash
cd backend
gcloud run deploy incidentiq-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY,ALLOWED_ORIGINS=https://YOUR_FRONTEND_URL
```

### Frontend

```bash
cd frontend
gcloud run deploy incidentiq-web \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-build-env-vars NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL
```

## Devpost Project Story

### Inspiration

As a software engineering graduate, I've spent countless hours debugging projects by jumping between logs, configuration files, screenshots, dashboards, and documentation. Whether it's a Kubernetes deployment failure or an application crash, the information needed to identify the root cause is often scattered across multiple sources.

I wanted to explore how Gemini's multimodal reasoning could simplify this process by analyzing different types of evidence together and producing a clear, structured incident investigation instead of making developers manually piece everything together.

### What it does

IncidentIQ is an AI-powered incident investigation assistant for developers and DevOps engineers.

Users can upload application logs, Kubernetes YAML files, screenshots, and architecture diagrams. Gemini analyzes all of the uploaded evidence together to generate an incident summary, reconstruct the incident timeline, identify the most likely root cause, assess severity and confidence, highlight affected services, recommend fixes, and generate a professional postmortem report.

### How I built it

I built IncidentIQ using Next.js, React, TypeScript, Tailwind CSS, and FastAPI. The backend integrates with the Gemini API using Google's GenAI SDK. Gemini processes logs, screenshots, YAML files, and diagrams together, then returns structured JSON that powers the dashboard.

The application is designed for deployment on Google Cloud Run.

### Challenges I ran into

One of the biggest challenges was designing prompts that encouraged Gemini to reason across multiple types of evidence instead of treating each input separately. Another challenge was designing a dashboard that presents complex technical information in a way that is both simple and useful during incident response.

### Accomplishments that I'm proud of

- Built a complete full-stack AI application as a solo developer
- Used Gemini's multimodal capabilities for real incident investigation workflows
- Created a structured SRE-style root-cause analysis dashboard
- Designed a polished UI that turns scattered evidence into actionable insights

### What I learned

This project reinforced that successful AI applications are about designing intelligent workflows, not just generating text. I learned how to build multimodal AI pipelines, design prompts for structured reasoning, work with JSON-based AI outputs, and integrate Gemini into a real-world engineering workflow.

### What's next for IncidentIQ

Future improvements include GitHub integration, Kubernetes and Google Cloud Logging integrations, Slack alerts, real-time incident monitoring, historical incident search, AI-generated architecture diagrams, team collaboration, and support for more cloud providers.

## Built With Tags

`gemini-api` `gemini` `google-ai-studio` `google-cloud-run` `google-cloud` `FastAPI` `Python` `Next.js` `React` `TypeScript` `Tailwind CSS` `Docker` `Kubernetes` `Firebase` `GitHub` `generative-ai` `machine-learning` `json` `multimodal-ai` `cloud-computing` `devops` `observability` `incident-response` `root-cause-analysis` `site-reliability-engineering`
