const API_BASE = "/api";

// --- Auth token management ---
let _token: string | null = localStorage.getItem("iw_token");

export function setToken(token: string) {
  _token = token;
  localStorage.setItem("iw_token", token);
}

export function getToken(): string | null {
  return _token;
}

export function clearToken() {
  _token = null;
  localStorage.removeItem("iw_token");
}

export function isLoggedIn(): boolean {
  return !!_token;
}

// --- Base fetch wrapper ---
async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (_token) {
    headers["Authorization"] = `Bearer ${_token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    // Don't redirect if already on login/verify/pricing pages
    const path = window.location.pathname;
    if (!path.startsWith("/login") && !path.startsWith("/auth/") && !path.startsWith("/pricing")) {
      window.location.href = "/login";
    }
    throw new Error("Not authenticated");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `API error: ${res.status}`);
  }

  return res.json();
}

// --- Auth ---
export const auth = {
  sendMagicLink: (email: string) =>
    apiFetch("/auth/magic-link", { method: "POST", body: JSON.stringify({ email }) }),

  verify: (email: string, token: string) =>
    apiFetch<{ ok: boolean; access_token: string; user: { id: string; email: string; name: string; plan: string; status: string; trial_ends_at?: string } }>("/auth/verify", {
      method: "POST", body: JSON.stringify({ email, token }),
    }),

  me: () => apiFetch<{ id: string; email: string; name: string; plan: string; status: string; trial_ends_at?: string }>("/auth/me"),
};

// --- Events (content) ---
export const events = {
  list: (params?: { review_status?: string; agent_name?: string; channel?: string; limit?: number; offset?: number }) => {
    const sp = new URLSearchParams();
    if (params?.review_status) sp.set("review_status", params.review_status);
    if (params?.agent_name) sp.set("agent_name", params.agent_name);
    if (params?.channel) sp.set("channel", params.channel);
    if (params?.limit) sp.set("limit", String(params.limit));
    if (params?.offset) sp.set("offset", String(params.offset));
    return apiFetch<{ events: unknown[]; total: number }>(`/events?${sp}`);
  },

  get: (id: string) => apiFetch(`/events/${id}`),

  update: (id: string, data: { review_status?: string; review_edited_text?: string; scheduled_at?: string }) =>
    apiFetch(`/events/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  rate: (id: string, rating: number, feedback?: string) =>
    apiFetch(`/events/${id}/rate`, { method: "POST", body: JSON.stringify({ rating, feedback }) }),
};

// --- Agents ---
export const agents = {
  catalog: () => apiFetch<{ agents: unknown[] }>("/agents/catalog"),
  mine: () => apiFetch<{ agents: unknown[] }>("/agents/mine"),
  timeline: (agentName: string, weeks?: number) => {
    const sp = new URLSearchParams({ agent_name: agentName });
    if (weeks) sp.set("weeks", String(weeks));
    return apiFetch<{ agent_name: string; weeks: Array<{ week: string; week_start: string; week_end: string; posts: number; avg_rating: number | null; avg_score: number | null; impressions: number }> }>(`/agents/timeline?${sp}`);
  },
  enable: (slug: string) => apiFetch(`/agents/${slug}/enable`, { method: "POST" }),
  disable: (slug: string) => apiFetch(`/agents/${slug}/disable`, { method: "POST" }),
  config: (slug: string, data: Record<string, unknown>) =>
    apiFetch(`/agents/${slug}/config`, { method: "PATCH", body: JSON.stringify(data) }),
};

// --- Onboarding ---
export const onboarding = {
  research: (data: { website_url: string; x_handle?: string; description?: string }) =>
    apiFetch("/onboarding/research", { method: "POST", body: JSON.stringify(data) }),

  findings: () => apiFetch("/onboarding/findings"),

  confirm: (field: string, value: unknown) =>
    apiFetch("/onboarding/confirm", { method: "POST", body: JSON.stringify({ field, value }) }),

  status: () => apiFetch("/onboarding/status"),

  complete: () => apiFetch("/clients/me/complete-onboarding", { method: "POST" }),
};

// --- Connections ---
export const connections = {
  list: () => apiFetch<{ connections: unknown[] }>("/connections"),
  connectX: (keys: { consumer_key: string; consumer_secret: string; access_token: string; access_token_secret: string; handle?: string }) =>
    apiFetch("/connections/x", { method: "POST", body: JSON.stringify(keys) }),
  authorizeX: () => apiFetch<{ authorize_url: string }>("/connections/x/authorize"),
  disconnect: (channel: string) => apiFetch(`/connections/${channel}`, { method: "DELETE" }),
};

// --- Jobs ---
export const jobs = {
  get: (jobId: string) =>
    apiFetch<{ id: string; client_id: string; job_type: string; status: string; result: unknown; error: string | null; created_at: string; completed_at: string | null }>(`/jobs/${jobId}`),
};

// --- Judge ---
export const judge = {
  run: () =>
    apiFetch<{ status: string; job_id: string }>("/agents/judge/run", { method: "POST" }),
};

// --- Notifications ---
export const notificationsApi = {
  list: (limit?: number) => {
    const sp = new URLSearchParams();
    if (limit) sp.set("limit", String(limit));
    return apiFetch<{ notifications: Array<{ id: string; client_id: string; type: string; title: string; body: string; read: boolean; created_at: string }>; unread_count: number }>(`/notifications?${sp}`);
  },
  readAll: () => apiFetch("/notifications/read-all", { method: "POST" }),
  readOne: (id: string) => apiFetch(`/notifications/${id}/read`, { method: "POST" }),
};

// --- Billing ---
export const billing = {
  checkout: (plan: string) =>
    apiFetch<{ checkout_url: string }>("/billing/checkout", { method: "POST", body: JSON.stringify({ plan }) }),
  subscription: () => apiFetch("/billing/subscription"),
};

// --- Scorecards (Judge) ---
export const scorecards = {
  list: (params?: { limit?: number }) => {
    const sp = new URLSearchParams();
    if (params?.limit) sp.set("limit", String(params.limit));
    return apiFetch<{ scorecards: unknown[]; total: number }>(`/scorecards?${sp}`);
  },
};

// --- Proof ---
export const proof = {
  items: (params?: { type?: string; limit?: number }) => {
    const sp = new URLSearchParams();
    if (params?.type) sp.set("type", params.type);
    if (params?.limit) sp.set("limit", String(params.limit));
    return apiFetch(`/proof/items?${sp}`);
  },
  stats: () => apiFetch("/proof/stats"),
};

// --- Guardian ---
export const guardian = {
  reviews: (params?: { limit?: number }) => {
    const sp = new URLSearchParams();
    if (params?.limit) sp.set("limit", String(params.limit));
    return apiFetch(`/guardian/reviews?${sp}`);
  },
  stats: () => apiFetch("/guardian/stats"),
};

// --- Settings ---
export const settings = {
  get: () => apiFetch("/clients/me/settings"),
  update: (data: Record<string, unknown>) =>
    apiFetch("/clients/me/settings", { method: "PATCH", body: JSON.stringify({ data }) }),
};

// --- Clients ---
export const clients = {
  list: () => apiFetch<{ clients: unknown[] }>("/clients"),
  validate: () => apiFetch("/clients/me/validate"),
};

// --- Insights (time saved, before/after, competitor watch, weekly summary) ---
export const insights = {
  timeSaved: () => apiFetch<{ total_hours: number; total_minutes: number; breakdown: Record<string, unknown>; human_readable: string; breakdown_display?: string[] }>("/insights/time-saved"),
  dashboardStats: () => apiFetch<{ posts_this_week: number; posts_posted: number; pending: number; engagement_pct: number; grade: string }>("/insights/dashboard-stats"),
  beforeAfter: () => apiFetch<{ early_posts: unknown[]; recent_posts: unknown[]; early_avg_score: number; recent_avg_score: number; improvement_pct: number }>("/insights/before-after"),
  competitorWatch: () => apiFetch<{ competitors: unknown[]; total: number }>("/insights/competitor-watch"),
  weeklySummary: () => apiFetch<{ posts_this_week: number; total_impressions: number; avg_rating: number | null; top_post: unknown | null }>("/insights/weekly-summary"),
  workflowQuestions: () => apiFetch<{ questions: unknown[] }>("/insights/workflow-questions"),
  dashboardStats: () => apiFetch<{ posts_this_week: number; posts_posted: number; pending: number; engagement_pct: number; grade: string }>("/insights/dashboard-stats"),
};

// --- Demo (public, no auth) ---
export const demo = {
  research: (data: { website_url: string; x_handle?: string; description?: string }) =>
    apiFetch("/onboarding/demo-research", { method: "POST", body: JSON.stringify(data) }),
};

// --- Voice Analysis ---
export const voice = {
  analyze: (transcript: string) =>
    apiFetch("/onboarding/analyze-voice", { method: "POST", body: JSON.stringify({ transcript }) }),
};

// --- Clone Rules ---
export const cloneRules = {
  clone: (sourceSlug: string, targetSlug: string) =>
    apiFetch(`/agents/${sourceSlug}/clone-rules/${targetSlug}`, { method: "POST" }),
};

// --- Public Proof ---
export const publicProof = {
  get: (shareId: string) => apiFetch(`/proof/public/${shareId}`),
};

// --- Email ---
export const email = {
  run: (params?: { client_id?: string; agent_type?: string; count?: number }) => {
    const sp = new URLSearchParams();
    if (params?.client_id) sp.set("client_id", params.client_id);
    if (params?.agent_type) sp.set("agent_type", params.agent_type);
    if (params?.count) sp.set("count", String(params.count));
    return apiFetch<{ status: string; agent_type: string; generated: number; events: Array<{ id: string; agent_name: string; email_type: string; subject: string; review_status: string; guardian_status: string }> }>(
      `/agents/email/run?${sp}`, { method: "POST" },
    );
  },

  send: (eventId: string) =>
    apiFetch<{ ok: boolean; delivery_status: string; recipient: string; subject: string }>(
      `/agents/email/send/${eventId}`, { method: "POST" },
    ),
};

// --- Strategist ---
export const strategist = {
  chat: (message: string) =>
    apiFetch<{ response: string; profile_updates: Record<string, string> | null; message_id: string }>("/strategist/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  messages: (limit?: number) => {
    const sp = new URLSearchParams();
    if (limit) sp.set("limit", String(limit));
    return apiFetch<{
      messages: Array<{
        id: string;
        role: "user" | "assistant";
        content: string;
        profile_updates: Record<string, string> | null;
        created_at: string;
      }>;
      count: number;
    }>(`/strategist/messages?${sp}`);
  },

  profile: () => apiFetch<{
    profile: {
      company_id: string;
      user_id: string;
      company_core: { business_name?: string; website?: string; description?: string };
      company_profile: { audience?: string; regions?: string; pain_points?: string; topics?: string; voice_style?: string; features?: string; competitors?: string };
      company_compliance: { regulated_industry?: string; forbidden_topics?: string; required_disclaimers?: string };
      offers: Array<{ name?: string; description?: string }>;
      channels: Array<{ channel?: string; handle?: string }>;
      strategy_state: { current_goal?: string; primary_constraint?: string; stage?: string; current_play?: string; ninety_day_outcome?: string };
      strategy_loop_state: { latest_scorecard_id?: string };
    };
    changes: Array<{
      id: string;
      field_name: string;
      old_value?: string;
      new_value?: string;
      source?: string;
      created_at: string;
    }>;
  }>("/strategist/profile"),

  updateField: (field: string, value: unknown) =>
    apiFetch("/strategist/profile", {
      method: "PATCH",
      body: JSON.stringify({ field, value }),
    }),

  proposals: () =>
    apiFetch<Array<{
      id: string;
      field_name: string;
      proposed_changes: Record<string, unknown>;
      reason?: string;
      status: string;
      created_at: string;
    }>>("/strategist/proposals"),

  acceptProposal: (id: string) =>
    apiFetch(`/strategist/proposals/${id}/accept`, { method: "POST" }),

  rejectProposal: (id: string) =>
    apiFetch(`/strategist/proposals/${id}/reject`, { method: "POST" }),
};
