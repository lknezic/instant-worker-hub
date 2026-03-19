import { useState, useEffect, useCallback, useRef } from "react";
import { scorecards, proof, guardian, judge as judgeApi, jobs as jobsApi } from "@/lib/api";

// --- Safety Guardian ---

export const Safety = () => {
  const [stats, setStats] = useState<{ total_reviewed: number; passed: number; pass_pct: number; edited: number; edit_pct: number; blocked: number; block_pct: number } | null>(null);
  const [reviews, setReviews] = useState<Array<{ id: string; agent_name: string; status: string; original_text: string; created_at: string; channel: string }>>([]);
  const [filter, setFilter] = useState<"all" | "PASS" | "PASS_WITH_EDITS" | "BLOCK">("all");

  useEffect(() => {
    guardian.stats()
      .then((d) => setStats(d as any))
      .catch(() => {});
    guardian.reviews({ limit: 20 })
      .then((d: any) => setReviews((d.reviews || []) as typeof reviews))
      .catch(() => {});
  }, []);

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  const statusColor = (s: string) =>
    s === "PASS" ? "text-success bg-success/10" :
    s === "PASS_WITH_EDITS" ? "text-warning bg-warning/10" :
    s === "BLOCK" ? "text-destructive bg-destructive/10" : "text-muted-foreground bg-muted";

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-5 pb-4 border-b border-border shrink-0">
        <h2 className="font-display text-lg font-bold">Safety Guardian</h2>
        <p className="text-sm text-muted-foreground mt-1">Every post is checked for compliance before publishing.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          {stats ? (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="glass-card rounded-xl p-4">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Reviewed</span>
                  <p className="text-2xl font-bold mt-1">{stats.total_reviewed}</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <span className="text-[10px] text-success uppercase tracking-wider">Passed</span>
                  <p className="text-2xl font-bold text-success mt-1">{stats.passed}</p>
                  <span className="text-[10px] text-muted-foreground">{stats.pass_pct}%</span>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <span className="text-[10px] text-warning uppercase tracking-wider">Edited</span>
                  <p className="text-2xl font-bold text-warning mt-1">{stats.edited}</p>
                  <span className="text-[10px] text-muted-foreground">{stats.edit_pct}%</span>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <span className="text-[10px] text-destructive uppercase tracking-wider">Blocked</span>
                  <p className="text-2xl font-bold text-destructive mt-1">{stats.blocked}</p>
                  <span className="text-[10px] text-muted-foreground">{stats.block_pct}%</span>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-2 mb-4">
                {(["all", "PASS", "PASS_WITH_EDITS", "BLOCK"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                      filter === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f === "all" ? "All" : f === "PASS_WITH_EDITS" ? "Edited" : f === "BLOCK" ? "Blocked" : "Passed"}
                  </button>
                ))}
              </div>

              {/* Reviews list */}
              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No reviews match this filter.</p>
                ) : (
                  filtered.map((r) => (
                    <div key={r.id} className="glass-card rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${statusColor(r.status)}`}>{r.status === "PASS_WITH_EDITS" ? "EDITED" : r.status}</span>
                          <span className="text-xs text-muted-foreground">{r.channel}</span>
                          <span className="text-xs text-muted-foreground">• {r.agent_name.replace(/-/g, " ")}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{r.original_text?.slice(0, 150)}{(r.original_text?.length || 0) > 150 ? "..." : ""}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <span className="text-2xl block mb-2">🛡️</span>
              <p className="text-sm text-muted-foreground">Loading safety data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Judge ---

export const Judge = () => {
  const [latestScorecard, setLatestScorecard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [judgeRunning, setJudgeRunning] = useState(false);
  const [judgeStatus, setJudgeStatus] = useState<string>("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCount = useRef(0);

  const fetchScorecard = useCallback(() => {
    scorecards.list({ limit: 1 })
      .then((d: any) => {
        if (d.scorecards?.length > 0) {
          const sc = d.scorecards[0];
          const parsed = { ...sc };
          for (const key of ["summary", "agent_scores", "global_insights", "spec_deltas"]) {
            if (typeof parsed[key] === "string") {
              try { parsed[key] = JSON.parse(parsed[key]); } catch { parsed[key] = null; }
            }
          }
          setLatestScorecard(parsed);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchScorecard();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchScorecard]);

  const handleRunJudge = async () => {
    setJudgeRunning(true);
    setJudgeStatus("Starting Judge analysis...");
    pollCount.current = 0;

    try {
      const res = await judgeApi.run();
      const jobId = res.job_id;
      if (res.status === "already_running") {
        setJudgeStatus("Judge is already running...");
      } else {
        setJudgeStatus("Judge queued — analyzing your content...");
      }

      // Poll every 3s, max ~120s (40 polls)
      pollRef.current = setInterval(async () => {
        pollCount.current += 1;
        if (pollCount.current > 40) {
          if (pollRef.current) clearInterval(pollRef.current);
          setJudgeRunning(false);
          setJudgeStatus("Judge is taking longer than expected. Check back in a minute.");
          return;
        }
        try {
          const job = await jobsApi.get(jobId);
          if (job.status === "complete") {
            if (pollRef.current) clearInterval(pollRef.current);
            setJudgeRunning(false);
            setJudgeStatus("Judge complete — refreshing...");
            fetchScorecard();
            setTimeout(() => setJudgeStatus(""), 3000);
          } else if (job.status === "failed") {
            if (pollRef.current) clearInterval(pollRef.current);
            setJudgeRunning(false);
            setJudgeStatus(`Judge failed: ${job.error || "unknown error"}`);
          } else {
            setJudgeStatus(`Judge running... (${pollCount.current * 3}s)`);
          }
        } catch {
          // Poll error — keep trying
        }
      }, 3000);
    } catch (e: any) {
      setJudgeRunning(false);
      const msg = e.message || "Unknown error";
      if (msg.toLowerCase().includes("rate limit")) {
        setJudgeStatus("⏳ " + msg);
      } else {
        setJudgeStatus(`Error: ${msg}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading Judge data...</p>
      </div>
    );
  }

  const runButton = (
    <button
      onClick={handleRunJudge}
      disabled={judgeRunning}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
        judgeRunning ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:opacity-90"
      }`}
    >
      {judgeRunning ? "Running..." : "Run Judge Now"}
    </button>
  );

  const statusBar = judgeStatus ? (
    <div className="px-6 py-2 border-b border-border bg-primary/5 text-xs text-primary font-medium">
      {judgeStatus}
    </div>
  ) : null;

  if (!latestScorecard) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-6 pt-5 pb-4 border-b border-border shrink-0 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">Judge</h2>
            <p className="text-sm text-muted-foreground mt-1">Weekly performance analysis for your AI workers.</p>
          </div>
          {runButton}
        </div>
        {statusBar}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <span className="text-3xl block mb-3">📊</span>
            <h3 className="font-display font-bold mb-2">No weekly report yet</h3>
            <p className="text-sm text-muted-foreground">The Judge runs every Monday morning, or you can run it manually. Once your posts have engagement metrics, the scorecard will appear here.</p>
          </div>
        </div>
      </div>
    );
  }

  const summary = latestScorecard.summary || {};
  const agentScores = latestScorecard.agent_scores || [];
  const specDeltas = latestScorecard.spec_deltas || [];
  const perChannel = summary.per_channel || {};

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-5 pb-4 border-b border-border shrink-0 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">Judge</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Week of {latestScorecard.week_start} → {latestScorecard.week_end}
          </p>
        </div>
        {runButton}
      </div>
      {statusBar}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass-card rounded-xl p-4">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Posts</span>
              <p className="text-2xl font-bold mt-1">{summary.total_actions || 0}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Impressions</span>
              <p className="text-2xl font-bold mt-1">{(summary.total_impressions || 0).toLocaleString()}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Score</span>
              <p className="text-2xl font-bold mt-1">{summary.avg_composite_score ? Math.round(summary.avg_composite_score) : "—"}</p>
            </div>
          </div>

          {/* Per-channel breakdown */}
          {Object.keys(perChannel).length > 0 && (
            <div className="glass-card rounded-xl p-5 mb-6">
              <h3 className="text-sm font-semibold mb-3">Channel Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(perChannel).map(([channel, data]: [string, any]) => (
                  <div key={channel} className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{channel}</span>
                    <span className="text-muted-foreground">{data.total_posts || 0} posts • avg score {data.avg_score ? Math.round(data.avg_score) : "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent scores */}
          {agentScores.length > 0 && (
            <div className="glass-card rounded-xl p-5 mb-6">
              <h3 className="text-sm font-semibold mb-3">Worker Performance</h3>
              <div className="space-y-2">
                {agentScores.map((agent: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{agent.agent_name?.replace(/-/g, " ")}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{agent.total_posts || 0} posts</span>
                      <span className="font-bold text-primary">{agent.score ? Math.round(agent.score) : "—"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spec deltas / learnings */}
          {specDeltas.length > 0 && (
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3">What the Judge Learned</h3>
              {specDeltas.map((delta: any, i: number) => (
                <div key={i} className="mb-3 last:mb-0">
                  <span className="text-xs font-medium">{delta.agent_name?.replace(/-/g, " ")}</span>
                  {(delta.add_do || delta.do_more_of)?.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {(delta.add_do || delta.do_more_of).map((item: string, j: number) => (
                        <li key={j} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="text-success">●</span> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {(delta.add_dont || delta.stop_doing)?.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {(delta.add_dont || delta.stop_doing).map((item: string, j: number) => (
                        <li key={j} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="text-destructive">●</span> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {agentScores.length === 0 && specDeltas.length === 0 && (
            <div className="glass-card rounded-xl p-5 text-center">
              <p className="text-sm text-muted-foreground">The Judge ran but doesn't have enough engagement data yet to grade individual workers. Once posts collect likes, replies, and bookmarks, detailed grades and learnings will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Proof Library ---

export const Proof = () => {
  const [stats, setStats] = useState<{ total: number; active: number; avg_score: number; by_type: Record<string, number>; top_tags: string[] } | null>(null);
  const [items, setItems] = useState<Array<{ id: string; type: string; headline: string; body: string; proof_score: number; created_at: string }>>([]);

  useEffect(() => {
    proof.stats()
      .then((d) => setStats(d as any))
      .catch(() => {});
    proof.items({ limit: 10 })
      .then((d: any) => setItems((d.items || []) as typeof items))
      .catch(() => {});
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-5 pb-4 border-b border-border shrink-0">
        <h2 className="font-display text-lg font-bold">Proof Library</h2>
        <p className="text-sm text-muted-foreground mt-1">Evidence that your AI workers are driving real results.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          {stats ? (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass-card rounded-xl p-4">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Items</span>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Active</span>
                  <p className="text-2xl font-bold text-success mt-1">{stats.active}</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Score</span>
                  <p className="text-2xl font-bold mt-1">{stats.avg_score > 0 ? Math.round(stats.avg_score) : "—"}</p>
                </div>
              </div>

              {items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="glass-card rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">{item.type}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-medium mb-1">{item.headline}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.body?.slice(0, 120)}</p>
                      {item.proof_score > 0 && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">Score:</span>
                          <span className="text-xs font-bold text-primary">{item.proof_score}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 glass-card rounded-xl">
                  <span className="text-3xl block mb-3">📸</span>
                  <h3 className="font-display font-bold mb-2">No proof items yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Proof items are auto-collected when your posts get strong engagement — high likes, upvotes, positive replies, or impressive metrics. The Proof Agent scans daily. Keep posting and the wins will show up here.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <span className="text-2xl block mb-2">📸</span>
              <p className="text-sm text-muted-foreground">Loading proof data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
