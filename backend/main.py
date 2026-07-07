import json
import os
import re
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

try:
    from google import genai
    from google.genai import types
except Exception:  # allows app to boot even before dependencies are installed
    genai = None
    types = None


class TimelineEvent(BaseModel):
    time: str = "Unknown"
    event: str
    evidence: str = ""


class Finding(BaseModel):
    issue: str
    evidence: str = ""
    impact: str = ""
    fix: str = ""


class IncidentReport(BaseModel):
    incident_title: str = "Incident Investigation"
    summary: str = ""
    severity: str = Field(default="medium", pattern="^(low|medium|high|critical)$")
    root_cause: str = ""
    confidence_score: int = Field(default=75, ge=0, le=100)
    affected_services: List[str] = []
    timeline: List[TimelineEvent] = []
    findings: List[Finding] = []
    recommended_fixes: List[str] = []
    prevention_steps: List[str] = []
    kubectl_commands: List[str] = []
    incident_report: str = ""


app = FastAPI(title="IncidentIQ API", version="1.0.0")

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """
You are IncidentIQ, a senior Site Reliability Engineer and incident commander.
Analyze all uploaded incident evidence together: logs, YAML/configuration files,
screenshots, diagrams, dashboards, and notes.

Your job:
1. Reconstruct what happened.
2. Identify the most likely root cause.
3. Cite evidence from the uploaded files.
4. Recommend specific fixes and prevention steps.
5. Return only valid JSON matching the requested schema.

Be practical, concise, and developer-friendly. If evidence is incomplete, say so clearly.
Do not invent file names or facts that are not supported by the evidence.
"""

JSON_SCHEMA_HINT = """
Return only JSON with this shape:
{
  "incident_title": "string",
  "summary": "string",
  "severity": "low | medium | high | critical",
  "root_cause": "string",
  "confidence_score": 0-100,
  "affected_services": ["string"],
  "timeline": [{"time":"string", "event":"string", "evidence":"string"}],
  "findings": [{"issue":"string", "evidence":"string", "impact":"string", "fix":"string"}],
  "recommended_fixes": ["string"],
  "prevention_steps": ["string"],
  "kubectl_commands": ["string"],
  "incident_report": "string"
}
"""

TEXT_EXTENSIONS = {".txt", ".log", ".yaml", ".yml", ".json", ".md", ".csv", ".conf", ".env"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


def _fallback_report(files: List[UploadFile]) -> Dict[str, Any]:
    names = [f.filename or "uploaded-file" for f in files]
    return IncidentReport(
        incident_title="Sample Kubernetes Application Outage Investigation",
        summary=(
            "Gemini API key was not configured, so IncidentIQ returned a local demo report. "
            "The uploaded evidence appears to describe a Kubernetes-style application incident."
        ),
        severity="high",
        root_cause="Likely application startup failure caused by missing or incorrect runtime configuration, such as database credentials, service URL, or Kubernetes Secret reference.",
        confidence_score=72,
        affected_services=["web-api", "database", "kubernetes deployment"],
        timeline=[
            TimelineEvent(time="T+0", event="Deployment or configuration change was introduced.", evidence=", ".join(names)),
            TimelineEvent(time="T+1", event="Application pods began failing health checks or restarting.", evidence="Logs/config files"),
            TimelineEvent(time="T+2", event="User-facing service became unavailable or degraded.", evidence="Dashboard/screenshot evidence"),
        ],
        findings=[
            Finding(
                issue="Possible configuration mismatch",
                evidence="Uploaded YAML/log evidence",
                impact="Application cannot connect to a required dependency.",
                fix="Verify environment variables, Secrets, ConfigMaps, and service names used by the deployment.",
            ),
            Finding(
                issue="Missing production readiness checks",
                evidence="Incident evidence set",
                impact="Issue was detected only after deployment.",
                fix="Add startup probes, readiness probes, and pre-deployment validation checks.",
            ),
        ],
        recommended_fixes=[
            "Run kubectl describe pod to inspect events and failed mounts/env references.",
            "Validate Kubernetes Secrets and ConfigMaps referenced by the deployment.",
            "Check service DNS names and database connection strings.",
            "Roll back to the last known-good deployment if customer impact is ongoing.",
        ],
        prevention_steps=[
            "Add CI checks for Kubernetes manifests.",
            "Use health checks and alerting on CrashLoopBackOff and readiness failures.",
            "Document required environment variables and secret dependencies.",
        ],
        kubectl_commands=[
            "kubectl get pods -n <namespace>",
            "kubectl describe pod <pod-name> -n <namespace>",
            "kubectl logs <pod-name> -n <namespace> --previous",
            "kubectl rollout undo deployment/<deployment-name> -n <namespace>",
        ],
        incident_report="This demo report summarizes a likely Kubernetes deployment incident. Configure GEMINI_API_KEY to enable real Gemini multimodal analysis.",
    ).model_dump()


def _extract_json(text: str) -> Dict[str, Any]:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?", "", cleaned, flags=re.IGNORECASE).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise


async def _build_gemini_parts(files: List[UploadFile]) -> List[Any]:
    parts: List[Any] = [SYSTEM_PROMPT, JSON_SCHEMA_HINT]

    for file in files:
        filename = file.filename or "uploaded-file"
        suffix = Path(filename).suffix.lower()
        raw = await file.read()
        if not raw:
            continue

        if suffix in TEXT_EXTENSIONS:
            text = raw.decode("utf-8", errors="replace")[:50000]
            parts.append(f"\n--- FILE: {filename} ---\n{text}\n--- END FILE ---")
        elif suffix in IMAGE_EXTENSIONS and types is not None:
            mime_type = file.content_type or f"image/{suffix.replace('.', '')}"
            parts.append(f"\n--- IMAGE FILE: {filename} ---")
            parts.append(types.Part.from_bytes(data=raw, mime_type=mime_type))
        else:
            parts.append(f"\n--- FILE: {filename} ---\nUnsupported file type for direct parsing. Filename included as evidence.\n")

    return parts


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "service": "IncidentIQ API"}


@app.post("/analyze", response_model=IncidentReport)
async def analyze(files: List[UploadFile] = File(...)) -> Dict[str, Any]:
    if not files:
        raise HTTPException(status_code=400, detail="Upload at least one evidence file.")

    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    if not api_key or genai is None:
        return _fallback_report(files)

    try:
        client = genai.Client(api_key=api_key)
        parts = await _build_gemini_parts(files)
        response = client.models.generate_content(
            model=model,
            contents=parts,
            config={
                "temperature": 0.2,
                "response_mime_type": "application/json",
            },
        )
        data = _extract_json(response.text or "{}")
        return IncidentReport(**data).model_dump()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Gemini analysis failed: {exc}")
