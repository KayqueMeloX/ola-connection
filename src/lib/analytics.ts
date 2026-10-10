// Analytics & Funnel Tracking Engine

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  timestamp: number;
  eventName: string;
  stepName: string;
  stepNumber: number;
  data?: Record<string, any>;
  userAgent: string;
  isMobile: boolean;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
}

export interface FunnelStepMetric {
  stepKey: string;
  label: string;
  stepNumber: number;
  visitors: number;
  advances: number;
  dropoffs: number;
  dropoffRate: number;
  advanceRate: number;
  conversionRate: number; // relative to initial visitors
  status: "great" | "warning" | "danger" | "checkout";
}

// Funnel steps list (Updated for current 8-step structure)
export const FUNNEL_STAGES = [
  { key: "intro", label: "1. Página Inicial (Intro)", number: 1 },
  { key: "role_selected", label: "2. Escolha de Perfil (Iniciante / Umbandista)", number: 2 },
  { key: "q1", label: "3. Pergunta 1 (Fundamento / Caridade)", number: 3 },
  { key: "q2", label: "4. Pergunta 2 (Entidades Espirituais)", number: 4 },
  { key: "q3", label: "5. Pergunta 3 (Interesse no Aplicativo)", number: 5 },
  { key: "analyzing", label: "6. Diagnóstico / Analisando Respostas", number: 6 },
  { key: "offer_view", label: "7. Página de Vendas (Oferta + 10 Bônus)", number: 7 },
  { key: "checkout_click", label: "8. Checkout Hotmart (€ 19,90)", number: 8 },
];

const normalizeEventStepNumber = (ev: AnalyticsEvent): number => {
  if (ev.stepNumber >= 1 && ev.stepNumber <= 8) {
    return ev.stepNumber;
  }
  const name = (ev.stepName || "").toLowerCase();
  if (name === "intro" || name === "page_view") return 1;
  if (name === "role_selected" || name === "role") return 2;
  if (name === "q1" || name === "question_1") return 3;
  if (name === "q2" || name === "question_2") return 4;
  if (name === "q3" || name === "question_3") return 5;
  if (name === "analyzing" || name === "analyzing_view" || name === "result") return 6;
  if (
    name === "offer_view" ||
    name === "offer" ||
    name === "checkout_offer" ||
    name === "offer_intro" ||
    name === "bonus" ||
    name === "how_to_receive"
  )
    return 7;
  if (name === "checkout_click" || name === "checkout" || name === "initiate_checkout") return 8;
  return 1;
};

export const calculateFunnelMetrics = (events: AnalyticsEvent[]) => {
  if (!events || events.length === 0) {
    return {
      totalVisitors: 0,
      totalCheckouts: 0,
      completionRate: 0,
      checkoutRate: 0,
      mobilePercentage: 0,
      desktopPercentage: 0,
      inicianteCount: 0,
      umbandistaCount: 0,
      stepMetrics: FUNNEL_STAGES.map((s) => ({
        stepKey: s.key,
        label: s.label,
        stepNumber: s.number,
        visitors: 0,
        advances: 0,
        dropoffs: 0,
        dropoffRate: 0,
        advanceRate: 0,
        conversionRate: 0,
        status: s.number === 8 ? ("checkout" as const) : ("great" as const),
      })),
    };
  }

  // Map each session to its maximum reached stage
  const sessionMaxStep = new Map<string, number>();
  const sessionRoles = new Map<string, string>();
  const sessionDevices = new Map<string, boolean>();

  events.forEach((ev) => {
    const stepNum = normalizeEventStepNumber(ev);
    const currentMax = sessionMaxStep.get(ev.sessionId) || 0;
    if (stepNum > currentMax) {
      sessionMaxStep.set(ev.sessionId, stepNum);
    }

    sessionDevices.set(ev.sessionId, ev.isMobile);

    if (ev.data?.["role"]) {
      sessionRoles.set(ev.sessionId, String(ev.data["role"]));
    }
  });

  const totalSessions = sessionMaxStep.size;
  let totalMobile = 0;
  sessionDevices.forEach((isMob) => {
    if (isMob) totalMobile++;
  });

  let iniciantes = 0;
  let umbandistas = 0;
  sessionRoles.forEach((r) => {
    if (r === "iniciante") iniciantes++;
    if (r === "umbandista") umbandistas++;
  });

  // Calculate visitors, advances, and exact dropoffs per stage
  const stepMetrics: FunnelStepMetric[] = FUNNEL_STAGES.map((stage) => {
    const k = stage.number;
    let visitors = 0;
    let advances = 0;
    let dropoffs = 0;

    sessionMaxStep.forEach((maxStep) => {
      if (maxStep >= k) {
        visitors++;
      }
      if (maxStep > k) {
        advances++;
      }
      if (maxStep === k && k < FUNNEL_STAGES.length) {
        dropoffs++;
      }
    });

    const dropoffRate = visitors > 0 && k < FUNNEL_STAGES.length ? Math.round((dropoffs / visitors) * 100) : 0;
    const advanceRate = visitors > 0 ? Math.round((advances / visitors) * 100) : 0;
    const conversionRate = totalSessions > 0 ? Math.round((visitors / totalSessions) * 100) : 0;

    let status: "great" | "warning" | "danger" | "checkout" = "great";
    if (k === FUNNEL_STAGES.length) {
      status = "checkout";
    } else if (dropoffRate >= 35) {
      status = "danger";
    } else if (dropoffRate >= 15) {
      status = "warning";
    }

    return {
      stepKey: stage.key,
      label: stage.label,
      stepNumber: stage.number,
      visitors,
      advances: k === FUNNEL_STAGES.length ? visitors : advances,
      dropoffs,
      dropoffRate,
      advanceRate,
      conversionRate,
      status,
    };
  });

  const totalCheckouts = stepMetrics[stepMetrics.length - 1]?.visitors || 0;
  // Completed quiz = reached analyzing or offer step (step 6 or 7)
  const finishedQuiz = stepMetrics[5]?.visitors || 0;

  return {
    totalVisitors: totalSessions,
    totalCheckouts,
    completionRate: totalSessions > 0 ? Math.round((finishedQuiz / totalSessions) * 100) : 0,
    checkoutRate: totalSessions > 0 ? Math.round((totalCheckouts / totalSessions) * 100) : 0,
    mobilePercentage: totalSessions > 0 ? Math.round((totalMobile / totalSessions) * 100) : 0,
    desktopPercentage: totalSessions > 0 ? Math.round(((totalSessions - totalMobile) / totalSessions) * 100) : 0,
    inicianteCount: iniciantes,
    umbandistaCount: umbandistas,
    stepMetrics,
  };
};

// ---- Local event storage (browser localStorage) ----
const STORAGE_KEY = "quiz_funnel_events";
const SESSION_KEY = "quiz_session_id";
const MAX_EVENTS = 5000;

const isBrowser = (): boolean => typeof window !== "undefined" && typeof localStorage !== "undefined";

export const getStoredEvents = (): AnalyticsEvent[] => {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
};

export const clearStoredEvents = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
};

const getSessionId = (): string => {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

export const trackEvent = (
  eventName: string,
  stepName: string,
  stepNumber: number,
  data?: Record<string, any>,
): void => {
  if (!isBrowser()) return;
  try {
    const params = new URLSearchParams(window.location.search);
    const ev: AnalyticsEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sessionId: getSessionId(),
      timestamp: Date.now(),
      eventName,
      stepName,
      stepNumber,
      userAgent: navigator.userAgent,
      isMobile: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent),
    };
    if (data) ev.data = data;
    const s = params.get("utm_source");
    const c = params.get("utm_campaign");
    const m = params.get("utm_medium");
    if (s) ev.utmSource = s;
    if (c) ev.utmCampaign = c;
    if (m) ev.utmMedium = m;
    const events = getStoredEvents();
    events.push(ev);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // ignore storage errors
  }
};
