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
    window.location.href = "/login";
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
  list: (params?: { review_status?: string; limit?: number; offset?: number }) => {
    const sp = new URLSearchParams();
    if (params?.review_status) sp.set("review_status", params.review_status);
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
  beforeAfter: () => apiFetch<{ early_posts: unknown[]; recent_posts: unknown[]; early_avg_score: number; recent_avg_score: number; improvement_pct: number }>("/insights/before-after"),
  competitorWatch: () => apiFetch<{ competitors: unknown[]; total: number }>("/insights/competitor-watch"),
  weeklySummary: () => apiFetch<{ posts_this_week: number; total_impressions: number; avg_rating: number | null; top_post: unknown | null }>("/insights/weekly-summary"),
  workflowQuestions: () => apiFetch<{ questions: unknown[] }>("/insights/workflow-questions"),
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
