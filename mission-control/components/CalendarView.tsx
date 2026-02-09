"use client";
import { useEffect, useState } from "react";

type Job = { jobId: string; name?: string; enabled?: boolean; schedule?: unknown };

export function CalendarView() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetch("/api/calendar").then(r => r.json()).then(d => setJobs(d.jobs ?? []));
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Calendar (Scheduled Tasks)</h2>
      <div className="space-y-2 max-h-[380px] overflow-auto">
        {jobs.map((j) => (
          <div key={j.jobId} className="text-sm border border-zinc-800 rounded p-2">
            <div className="font-medium">{j.name || j.jobId}</div>
            <div className="text-zinc-400">enabled: {String(j.enabled)}</div>
            <pre className="text-xs text-zinc-300 overflow-auto">{JSON.stringify(j.schedule, null, 2)}</pre>
          </div>
        ))}
        {!jobs.length && <div className="text-zinc-500 text-sm">No scheduled jobs found.</div>}
      </div>
    </section>
  );
}
