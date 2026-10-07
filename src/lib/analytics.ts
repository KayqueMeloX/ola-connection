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
  dropoffs: number;
  dropoffRate: number;
  conversionRate: number; // relative to initial visitors
}

const STORAGE_KEY = "umbanda_quiz_analytics_events_v1";
const SESSION_KEY = "umbanda_quiz_current_session_v1";

const getSessionId = (): string => {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "sess_" + Math.random().toString(36).substring(2, 9);
  }
};

const getUtms = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
    };
  } catch {
    return {};
  }
};

export const trackEvent = (
  eventName: string,
  stepName: string,
  stepNumber: number,
  data?: Record<string, any>
) => {
  try {
    const sessionId = getSessionId();
    const isMobile =
      typeof window !== "undefined" &&
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768);

    const utms = getUtms();

    const event: AnalyticsEvent = {
      id: "ev_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now(),
      sessionId,
      timestamp: Date.now(),
      eventName,
      stepName,
      stepNumber,
      data,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      isMobile,
      ...utms,
    };

    const existingJson = localStorage.getItem(STORAGE_KEY);
    const events: AnalyticsEvent[] = existingJson ? JSON.parse(existingJson) : [];
    events.push(event);

    // Keep last 10,000 events
    if (events.length > 10000) {
      events.splice(0, events.length - 10000);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

    // Dispatch to Meta Pixel fbq if present
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", eventName, {
        stepName,
        stepNumber,
        ...data,
      });
    }
  } catch (err) {
    console.error("Tracking error:", err);
  }
};

export const getStoredEvents = (): AnalyticsEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const clearStoredEvents = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
};

// Funnel steps list
export const FUNNEL_STAGES = [
  { key: "intro", label: "1. Acessou o Quiz (Intro)", number: 1 },
  { key: "role_selected", label: "2. Escolheu Perfil (Iniciante/Umbandista)", number: 2 },
  { key: "q1", label: "3. Pergunta 1 (Fundamento / Caridade)", number: 3 },
  { key: "q2", label: "4. Pergunta 2 (Entidades / Guias)", number: 4 },
  { key: "q3", label: "5. Pergunta 3 (Desejo do Aplicativo)", number: 5 },
  { key: "analyzing", label: "6. Tela Analisando / Diagnóstico", number: 6 },
  { key: "offer_view", label: "7. Visualizou Oferta Unificada Completa", number: 7 },
  { key: "checkout_click", label: "8. Clicou no Botão Hotmart (€ 19,90)", number: 8 },
];

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
        dropoffs: 0,
        dropoffRate: 0,
        conversionRate: 0,
      })),
    };
  }

  // Group events by session
  const sessions = new Map<string, Set<string>>();
  const sessionRoles = new Map<string, string>();
  const sessionDevices = new Map<string, boolean>();

  events.forEach((ev) => {
    if (!sessions.has(ev.sessionId)) {
      sessions.set(ev.sessionId, new Set());
    }
    sessions.get(ev.sessionId)!.add(ev.stepName);
    sessionDevices.set(ev.sessionId, ev.isMobile);

    if (ev.data?.role) {
      sessionRoles.set(ev.sessionId, ev.data.role);
    }
  });

  const totalSessions = sessions.size;
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

  // Calculate visitors per stage
  const countsPerStage = FUNNEL_STAGES.map((stage) => {
    let count = 0;
    sessions.forEach((reachedSteps) => {
      if (reachedSteps.has(stage.key)) {
        count++;
      }
    });
    return count;
  });

  const baseVisitors = countsPerStage[0] || totalSessions || 1;

  const stepMetrics: FunnelStepMetric[] = FUNNEL_STAGES.map((stage, idx) => {
    const visitors = countsPerStage[idx];
    const nextVisitors = idx < countsPerStage.length - 1 ? countsPerStage[idx + 1] : visitors;
    const dropoffs = Math.max(0, visitors - nextVisitors);
    const dropoffRate = visitors > 0 ? Math.round((dropoffs / visitors) * 100) : 0;
    const conversionRate = Math.round((visitors / baseVisitors) * 100);

    return {
      stepKey: stage.key,
      label: stage.label,
      stepNumber: stage.number,
      visitors,
      dropoffs,
      dropoffRate,
      conversionRate,
    };
  });

  const totalCheckouts = countsPerStage[countsPerStage.length - 1];
  const finishedQuiz = countsPerStage[11]; // analyzing step

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
