"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Brain, CheckCircle2, Clipboard, Cloud, FileText, Loader2, ShieldAlert, Upload, Wrench } from "lucide-react";

type TimelineEvent = { time: string; event: string; evidence: string };
type Finding = { issue: string; evidence: string; impact: string; fix: string };
type IncidentReport = {
  incident_title: string;
  summary: string;
  severity: "low" | "medium" | "high" | "critical";
  root_cause: string;
  confidence_score: number;
  affected_services: string[];
  timeline: TimelineEvent[];
  findings: Finding[];
  recommended_fixes: string[];
  prevention_steps: string[];
  kubectl_commands: string[];
  incident_report: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://incidentiq-api-662488458944.us-central1.run.app";

function severityClass(severity?: string) {
  if (severity === "critical") return "border-red-500/40 bg-red-500/10 text-red-200";
  if (severity === "high") return "border-orange-500/40 bg-orange-500/10 text-orange-200";
  if (severity === "medium") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-100";
  return "border-green-500/40 bg-green-500/10 text-green-200";
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-borderSoft bg-panel/80 p-5 shadow-2xl shadow-black/20 ${className}`}>{children}</div>;
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileSummary = useMemo(() => files.map((f) => f.name).join(", "), [files]);

  async function analyze() {
    if (!files.length) {
      setError("Upload at least one evidence file first.");
      return;
    }
    setLoading(true);
    setError("");
    setReport(null);
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    try {
      const res = await fetch(`${API_URL}/analyze`, { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      setReport(await res.json());
    } catch (e: any) {
      setError(e.message || "Analysis failed. Check your backend and API key.");
    } finally {
      setLoading(false);
    }
  }

  function copyReport() {
    if (!report) return;
    navigator.clipboard.writeText(report.incident_report || JSON.stringify(report, null, 2));
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1d2b53_0%,#09090B_45%)] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2"><ShieldAlert className="h-6 w-6" /></div>
            <div>
              <h1 className="text-xl font-bold">IncidentIQ</h1>
              <p className="text-xs text-zinc-400">AI SRE Copilot powered by Gemini</p>
            </div>
          </div>
          <div className="hidden rounded-full border border-borderSoft px-4 py-2 text-sm text-zinc-300 md:block">Gemini API + Google Cloud Run</div>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-200">
              <Brain className="h-4 w-4" /> Multimodal incident investigation
            </div>
            <h2 className="max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">Turn messy outage evidence into a root-cause report.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Upload logs, Kubernetes YAML, screenshots, and architecture diagrams. IncidentIQ uses Gemini to reconstruct the timeline, identify the likely root cause, and generate fixes.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Logs", "Screenshots", "Kubernetes YAML", "Architecture diagrams"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-borderSoft bg-zinc-950/50 p-3 text-zinc-200">
                  <CheckCircle2 className="h-5 w-5 text-green-400" /> {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="h-fit">
            <div className="mb-4 flex items-center gap-3">
              <Upload className="h-5 w-5 text-blue-300" />
              <h3 className="text-xl font-semibold">Upload incident evidence</h3>
            </div>
            <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-600 bg-zinc-950/60 p-8 text-center hover:border-blue-400">
              <Upload className="mb-4 h-10 w-10 text-zinc-400" />
              <span className="text-lg font-medium">Drop files or click to browse</span>
              <span className="mt-2 text-sm text-zinc-400">.txt, .log, .yaml, .json, .png, .jpg</span>
              <input
                type="file"
                multiple
                className="hidden"
                accept=".txt,.log,.yaml,.yml,.json,.md,.png,.jpg,.jpeg,.webp"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </label>
            {files.length > 0 && <p className="mt-4 text-sm text-zinc-300"><span className="text-zinc-500">Selected:</span> {fileSummary}</p>}
            {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
            <button
              onClick={analyze}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Brain className="h-5 w-5" />}
              {loading ? "Investigating..." : "Analyze Incident"}
            </button>
          </Card>
        </section>

        {report && (
          <section className="mt-12 space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Investigation Result</p>
                <h2 className="mt-2 text-3xl font-bold">{report.incident_title}</h2>
              </div>
              <button onClick={copyReport} className="flex items-center gap-2 rounded-xl border border-borderSoft px-4 py-2 text-sm hover:bg-zinc-800">
                <Clipboard className="h-4 w-4" /> Copy report
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className={severityClass(report.severity)}>
                <AlertTriangle className="mb-3 h-6 w-6" />
                <p className="text-sm opacity-80">Severity</p>
                <p className="mt-1 text-3xl font-bold capitalize">{report.severity}</p>
              </Card>
              <Card>
                <Brain className="mb-3 h-6 w-6 text-blue-300" />
                <p className="text-sm text-zinc-400">Confidence</p>
                <p className="mt-1 text-3xl font-bold">{report.confidence_score}%</p>
              </Card>
              <Card>
                <Cloud className="mb-3 h-6 w-6 text-purple-300" />
                <p className="text-sm text-zinc-400">Affected services</p>
                <p className="mt-1 text-lg font-semibold">{report.affected_services?.join(", ") || "Unknown"}</p>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
              <Card>
                <h3 className="mb-2 text-xl font-semibold">Root cause</h3>
                <p className="leading-7 text-zinc-300">{report.root_cause}</p>
                <h3 className="mb-2 mt-6 text-xl font-semibold">Summary</h3>
                <p className="leading-7 text-zinc-300">{report.summary}</p>
              </Card>

              <Card>
                <h3 className="mb-4 text-xl font-semibold">Incident timeline</h3>
                <div className="space-y-4">
                  {report.timeline?.map((t, i) => (
                    <div key={i} className="border-l border-blue-500/40 pl-4">
                      <p className="text-sm font-semibold text-blue-200">{t.time}</p>
                      <p className="mt-1 text-zinc-200">{t.event}</p>
                      <p className="mt-1 text-xs text-zinc-500">Evidence: {t.evidence}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold"><FileText className="h-5 w-5" /> Evidence-based findings</h3>
                <div className="space-y-4">
                  {report.findings?.map((f, i) => (
                    <div key={i} className="rounded-xl border border-borderSoft bg-zinc-950/50 p-4">
                      <p className="font-semibold">{f.issue}</p>
                      <p className="mt-2 text-sm text-zinc-400">Impact: {f.impact}</p>
                      <p className="mt-2 text-sm text-zinc-400">Evidence: {f.evidence}</p>
                      <p className="mt-2 text-sm text-green-200">Fix: {f.fix}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Wrench className="h-5 w-5" /> Recommended fixes</h3>
                <ul className="space-y-3">
                  {report.recommended_fixes?.map((fix, i) => <li key={i} className="rounded-xl bg-zinc-950/50 p-3 text-zinc-300">{fix}</li>)}
                </ul>
                {!!report.kubectl_commands?.length && (
                  <>
                    <h4 className="mt-6 font-semibold">Suggested commands</h4>
                    <div className="mt-3 space-y-2">
                      {report.kubectl_commands.map((cmd, i) => <code key={i} className="block rounded-lg bg-black p-3 text-sm text-green-300">{cmd}</code>)}
                    </div>
                  </>
                )}
              </Card>
            </div>

            <Card>
              <h3 className="mb-4 text-xl font-semibold">Postmortem report</h3>
              <pre className="whitespace-pre-wrap rounded-xl bg-black/60 p-5 text-sm leading-7 text-zinc-300">{report.incident_report}</pre>
            </Card>
          </section>
        )}
      </div>
    </main>
  );
}
