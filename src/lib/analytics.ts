// Analytics & Funnel Tracking Engine (Streamlined 7-Stage Funnel)

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
  conversionRate: number;
  status: "great" | "warning" | "danger" | "checkout";
}

export interface QuestionBreakdown {
  id: number;
  question: string;
  totalAnswers: number;
  options: { text: string; count: number; percentage: number; isCorrect?: boolean }[];
}

export interface FunnelMetricsResult {
  totalVisitors: number;
  totalCheckouts: number;
  completionRate: number;
  checkoutRate: number;
  mobilePercentage: number;
  desktopPercentage: number;
  inicianteCount: number;
  umbandistaCount: number;
  stepMetrics: FunnelStepMetric[];
  questionBreakdown: QuestionBreakdown[];
  recentEvents: AnalyticsEvent[];
}

const STORAGE_KEY = "umbanda_quiz_events_v2";
const SESSION_KEY = "umbanda_quiz_session_v2";
const CLOUD_STORE_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a126a835f536f2";

// Broadcast channel for real-time live tabs
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    broadcastChannel = new BroadcastChannel("quiz_analytics_channel");
  }
} catch {}

// 7 exact stages of the current streamlined funnel
export const FUNNEL_STAGES = [
  { key: "intro", label: "1. Página Inicial (Apresentação & Perfil)", number: 1 },
  { key: "q1", label: "2. Pergunta 1 (Fundamento da Umbanda)", number: 2 },
  { key: "q2", label: "3. Pergunta 2 (Entidades Espirituais)", number: 3 },
  { key: "q3", label: "4. Pergunta 3 (Interesse no Aplicativo)", number: 4 },
  { key: "analyzing", label: "5. Diagnóstico (Análise de Respostas)", number: 5 },
  { key: "offer_view", label: "6. Página de Vendas (Oferta + 10 Bônus)", number: 6 },
  { key: "checkout_click", label: "7. Checkout Hotmart (€ 19,90)", number: 7 },
];

export const getSessionId = (): string => {
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
    if (typeof window === "undefined") return {};
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

export const normalizeEventStepNumber = (ev: AnalyticsEvent): number => {
  // If explicitly 1 to 7
  if (ev.stepNumber >= 1 && ev.stepNumber <= 7) {
    // If it was old step 2 (role_selected) map to 1
    if (ev.stepName === "role_selected" && ev.stepNumber === 2) return 1;
    return ev.stepNumber;
  }

  // Handle old 8-stage mapping
  if (ev.stepNumber === 8) return 7;

  const name = (ev.stepName || "").toLowerCase();
  if (name === "intro" || name === "page_view" || name === "role_selected") return 1;
  if (name === "q1" || name === "question_1") return 2;
  if (name === "q2" || name === "question_2") return 3;
  if (name === "q3" || name === "question_3") return 4;
  if (name === "analyzing" || name === "analyzing_view" || name === "result") return 5;
  if (
    name === "offer_view" ||
    name === "offer" ||
    name === "checkout_offer" ||
    name === "offer_intro" ||
    name === "bonus" ||
    name === "how_to_receive"
  )
    return 6;
  if (name === "checkout_click" || name === "checkout" || name === "initiate_checkout") return 7;
  return 1;
};

// Sync events to cloud store in background
const syncToCloud = async (event: AnalyticsEvent) => {
  try {
    // Fire and forget
    fetch(CLOUD_STORE_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          lastPing: Date.now(),
          latestEvent: event,
        },
      }),
    }).catch(() => {});
  } catch {}
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

    // 1. Local Storage
    const existing = getStoredEvents();
    existing.push(event);
    if (existing.length > 5000) {
      existing.splice(0, existing.length - 5000);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    // 2. Broadcast Channel
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: "NEW_EVENT", event });
      } catch {}
    }

    // 3. Cloud Store Sync
    syncToCloud(event);

    // 4. Meta Pixel (fbq)
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
    if (typeof localStorage === "undefined") return [];
    // Read both v2 and legacy keys if present
    const rawV2 = localStorage.getItem(STORAGE_KEY);
    if (rawV2) {
      return JSON.parse(rawV2);
    }
    const legacy = localStorage.getItem("umbanda_quiz_analytics_events_v1");
    if (legacy) {
      const parsed = JSON.parse(legacy);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
};

export const clearStoredEvents = () => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("umbanda_quiz_analytics_events_v1");
    }
  } catch {}
};

// Simulate a test visitor for validation
export const simulateVisitorSession = (dropAtStep: number = 7) => {
  const testSid = "test_sess_" + Math.random().toString(36).substring(2, 8);
  const now = Date.now();
  const isMobile = Math.random() > 0.3;
  const role = Math.random() > 0.4 ? "iniciante" : "umbandista";

  const newEvents: AnalyticsEvent[] = [];

  // Step 1: Intro
  newEvents.push({
    id: "sim_" + Math.random().toString(36).substring(2, 9),
    sessionId: testSid,
    timestamp: now - 35000,
    eventName: "page_view",
    stepName: "intro",
    stepNumber: 1,
    userAgent: "Simulator/1.0",
    isMobile,
  });

  newEvents.push({
    id: "sim_" + Math.random().toString(36).substring(2, 9),
    sessionId: testSid,
    timestamp: now - 30000,
    eventName: "role_selected",
    stepName: "intro",
    stepNumber: 1,
    data: { role },
    userAgent: "Simulator/1.0",
    isMobile,
  });

  // Step 2: Q1
  if (dropAtStep >= 2) {
    const q1Answers = [
      { text: "A Caridade", isCorrect: true },
      { text: "Os Orixás", isCorrect: false },
      { text: "Os Preto Velhos", isCorrect: false },
    ];
    const pickedQ1 = q1Answers[Math.floor(Math.random() * q1Answers.length)];
    newEvents.push({
      id: "sim_" + Math.random().toString(36).substring(2, 9),
      sessionId: testSid,
      timestamp: now - 25000,
      eventName: "question_answered",
      stepName: "q1",
      stepNumber: 2,
      data: { questionId: 1, questionText: "Você sabe qual é o principal fundamento da religião da Umbanda?", answerText: pickedQ1.text, isCorrect: pickedQ1.isCorrect },
      userAgent: "Simulator/1.0",
      isMobile,
    });
  }

  // Step 3: Q2
  if (dropAtStep >= 3) {
    const q2Answers = ["Sim, todas!", "Conheço algumas.", "Ainda estou aprendendo."];
    const pickedQ2 = q2Answers[Math.floor(Math.random() * q2Answers.length)];
    newEvents.push({
      id: "sim_" + Math.random().toString(36).substring(2, 9),
      sessionId: testSid,
      timestamp: now - 20000,
      eventName: "question_answered",
      stepName: "q2",
      stepNumber: 3,
      data: { questionId: 2, questionText: "Você conhece as principais entidades espirituais que trabalham nos terreiros?", answerText: pickedQ2, isCorrect: true },
      userAgent: "Simulator/1.0",
      isMobile,
    });
  }

  // Step 4: Q3
  if (dropAtStep >= 4) {
    const q3Answers = ["Sim, seria incrível!", "Talvez, dependendo do material."];
    const pickedQ3 = q3Answers[Math.floor(Math.random() * q3Answers.length)];
    newEvents.push({
      id: "sim_" + Math.random().toString(36).substring(2, 9),
      sessionId: testSid,
      timestamp: now - 15000,
      eventName: "question_answered",
      stepName: "q3",
      stepNumber: 4,
      data: { questionId: 3, questionText: "Você gostaria de ter acesso a um APLICATIVO que explica de forma prática e visual todos os fundamentos da Umbanda?", answerText: pickedQ3, isCorrect: true },
      userAgent: "Simulator/1.0",
      isMobile,
    });
  }

  // Step 5: Analyzing
  if (dropAtStep >= 5) {
    newEvents.push({
      id: "sim_" + Math.random().toString(36).substring(2, 9),
      sessionId: testSid,
      timestamp: now - 10000,
      eventName: "analyzing_view",
      stepName: "analyzing",
      stepNumber: 5,
      userAgent: "Simulator/1.0",
      isMobile,
    });
  }

  // Step 6: Offer View
  if (dropAtStep >= 6) {
    newEvents.push({
      id: "sim_" + Math.random().toString(36).substring(2, 9),
      sessionId: testSid,
      timestamp: now - 5000,
      eventName: "offer_view",
      stepName: "offer_view",
      stepNumber: 6,
      userAgent: "Simulator/1.0",
      isMobile,
    });
  }

  // Step 7: Checkout Click
  if (dropAtStep >= 7) {
    newEvents.push({
      id: "sim_" + Math.random().toString(36).substring(2, 9),
      sessionId: testSid,
      timestamp: now - 1000,
      eventName: "checkout_click",
      stepName: "checkout_click",
      stepNumber: 7,
      data: { source: "test_simulator", price: 19.9, currency: "EUR" },
      userAgent: "Simulator/1.0",
      isMobile,
    });
  }

  const existing = getStoredEvents();
  const merged = [...existing, ...newEvents];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return newEvents;
};

export const calculateFunnelMetrics = (events: AnalyticsEvent[]): FunnelMetricsResult => {
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
        status: s.number === 7 ? ("checkout" as const) : ("great" as const),
      })),
      questionBreakdown: [],
      recentEvents: [],
    };
  }

  // Session state maps
  const sessionMaxStep = new Map<string, number>();
  const sessionRoles = new Map<string, string>();
  const sessionDevices = new Map<string, boolean>();

  // Question answer counters: qId -> Map<answerText, count>
  const qAnswersMap = new Map<number, Map<string, number>>();

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

    if (ev.eventName === "question_answered" && ev.data?.answerText) {
      const qId = ev.data.questionId || (stepNum - 1);
      if (!qAnswersMap.has(qId)) {
        qAnswersMap.set(qId, new Map());
      }
      const ansMap = qAnswersMap.get(qId)!;
      ansMap.set(ev.data.answerText, (ansMap.get(ev.data.answerText) || 0) + 1);
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

    const dropoffRate =
      visitors > 0 && k < FUNNEL_STAGES.length ? Math.round((dropoffs / visitors) * 100) : 0;
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
  // Completed quiz = reached analyzing or offer step (step 5 or 6)
  const finishedQuiz = stepMetrics[4]?.visitors || stepMetrics[5]?.visitors || 0;

  // Build question breakdown
  const questionTitles: Record<number, string> = {
    1: "Qual é o principal fundamento da religião da Umbanda?",
    2: "Você conhece as principais entidades espirituais?",
    3: "Gostaria de ter acesso a um Aplicativo com mapa mental?",
  };

  const questionBreakdown: QuestionBreakdown[] = [1, 2, 3].map((qId) => {
    const ansMap = qAnswersMap.get(qId) || new Map();
    let totalQAnswers = 0;
    ansMap.forEach((cnt) => (totalQAnswers += cnt));

    const options: { text: string; count: number; percentage: number }[] = [];
    ansMap.forEach((count, text) => {
      options.push({
        text,
        count,
        percentage: totalQAnswers > 0 ? Math.round((count / totalQAnswers) * 100) : 0,
      });
    });

    options.sort((a, b) => b.count - a.count);

    return {
      id: qId,
      question: questionTitles[qId] || `Pergunta ${qId}`,
      totalAnswers: totalQAnswers,
      options,
    };
  });

  // Recent 20 events sorted by timestamp
  const recentEvents = [...events].sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);

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
    questionBreakdown,
    recentEvents,
  };
};
