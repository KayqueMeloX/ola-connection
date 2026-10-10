import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  ShoppingCart,
  TrendingDown,
  RefreshCw,
  Trash2,
  Download,
  Smartphone,
  Monitor,
  ArrowRight,
  AlertTriangle,
  Flame,
  Globe,
  Sparkles,
  HelpCircle,
  Clock,
  Check,
} from "lucide-react";
import {
  getStoredEvents,
  clearStoredEvents,
  calculateFunnelMetrics,
  simulateVisitorSession,
  FUNNEL_STAGES,
  type AnalyticsEvent,
  type FunnelMetricsResult,
} from "@/lib/analytics";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => getStoredEvents());
  const [metrics, setMetrics] = useState<FunnelMetricsResult>(() =>
    calculateFunnelMetrics(getStoredEvents())
  );
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [filterPeriod, setFilterPeriod] = useState<"all" | "today">("all");
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const refreshData = () => {
    let raw = getStoredEvents();
    if (filterPeriod === "today") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      raw = raw.filter((e: AnalyticsEvent) => e.timestamp >= todayStart.getTime());
    }
    setEvents(raw);
    setMetrics(calculateFunnelMetrics(raw));
    setLastUpdate(new Date());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000); // Live poll every 3s
    return () => clearInterval(interval);
  }, [filterPeriod]);

  const handleSimulate = (step: number = 7) => {
    simulateVisitorSession(step);
    refreshData();
    setSimulationToast(`✅ Visitante teste simulado até a Etapa #${step}!`);
    setTimeout(() => setSimulationToast(null), 3000);
  };

  const handleClear = () => {
    if (confirm("Tem certeza que deseja zerar os dados de rastreamento do funil?")) {
      clearStoredEvents();
      refreshData();
    }
  };

  const handleExportCSV = () => {
    if (events.length === 0) {
      alert("Nenhum dado registrado para exportar.");
      return;
    }

    const headers = [
      "ID",
      "Session ID",
      "Data/Hora",
      "Evento",
      "Etapa",
      "Numero",
      "Dispositivo",
      "UTM Source",
      "UTM Campaign",
      "Detalhes",
    ];
    const rows = events.map((e) => [
      e.id,
      e.sessionId,
      new Date(e.timestamp).toLocaleString("pt-BR"),
      e.eventName,
      e.stepName,
      e.stepNumber,
      e.isMobile ? "Mobile" : "Desktop",
      e.utmSource || "-",
      e.utmCampaign || "-",
      e.data ? JSON.stringify(e.data).replace(/,/g, ";") : "-",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `metricas_funil_quiz_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find the step with highest drop-off rate among visited steps (excluding the final checkout)
  const validSteps = metrics.stepMetrics.filter(
    (s) => s.visitors > 0 && s.stepNumber < FUNNEL_STAGES.length
  );
  const highestDropoffStep = validSteps.reduce(
    (max, step) => (step.dropoffs > (max?.dropoffs || 0) ? step : max),
    validSteps[0]
  );

  // Compute UTM source aggregates
  const utmMap: Record<string, number> = {};
  events.forEach((ev: AnalyticsEvent) => {
    if (ev.utmSource) {
      utmMap[ev.utmSource] = (utmMap[ev.utmSource] || 0) + 1;
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-red-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                Tempo Real
              </span>
              <span className="text-xs text-slate-400">
                Atualizado às {lastUpdate.toLocaleTimeString("pt-BR")}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">
              📊 Painel Administrativo — Funil Umbanda
            </h1>
            <p className="text-sm text-slate-400">
              Métricas exatas das {FUNNEL_STAGES.length} etapas do funil ativo (Quiz + Página de Vendas)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as "all" | "today")}
              className="bg-slate-900 border border-slate-700 text-xs font-semibold rounded-lg px-3 py-2 text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">Todo o Período</option>
              <option value="today">Apenas Hoje</option>
            </select>

            <button
              onClick={() => handleSimulate(7)}
              title="Gera um visitante de teste simulando a jornada completa"
              className="inline-flex items-center gap-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-indigo-700/60 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Simular Teste
            </button>

            <button
              onClick={refreshData}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-slate-700 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Atualizar
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>

            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-red-800/50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Zerar
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-lg shadow-green-600/20"
            >
              Abrir Quiz
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Simulation Feedback Alert */}
        {simulationToast && (
          <div className="bg-indigo-950/80 border border-indigo-700 rounded-xl p-3 text-sm font-bold text-indigo-200 flex items-center justify-between animate-in fade-in">
            <span>{simulationToast}</span>
            <span className="text-xs text-indigo-300">As métricas abaixo foram atualizadas.</span>
          </div>
        )}

        {/* 4 Cards Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total de Visitantes</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">{metrics.totalVisitors}</div>
            <p className="text-xs text-slate-400 mt-1">Sessões únicas no quiz</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Chegaram à Oferta</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">
              {metrics.completionRate}%
            </div>
            <p className="text-xs text-slate-400 mt-1">Responderam as 3 perguntas</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Cliques no Checkout (IC)</span>
              <ShoppingCart className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">{metrics.totalCheckouts}</div>
            <p className="text-xs text-slate-400 mt-1">Cliques no botão Hotmart (€ 19,90)</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Conversão de IC</span>
              <TrendingDown className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-400">
              {metrics.checkoutRate}%
            </div>
            <p className="text-xs text-slate-400 mt-1">% de visitantes no checkout</p>
          </div>
        </div>

        {/* Alert for Highest Drop-off point */}
        {highestDropoffStep && highestDropoffStep.dropoffs > 0 && (
          <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-300">
                🚨 Principal Ponto de Desistência Identificado:
              </h3>
              <p className="text-xs text-amber-200/80 mt-0.5">
                A etapa <strong className="text-white">{highestDropoffStep.label}</strong> teve a maior perda:{" "}
                <strong className="text-white">
                  {highestDropoffStep.dropoffs} pessoas ({highestDropoffStep.dropoffRate}%)
                </strong>{" "}
                abandonaram o site nesta tela.
              </p>
            </div>
          </div>
        )}

        {/* Main Drop-Off & Conversion Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                📋 Tabela de Abandono e Retenção do Funil ({FUNNEL_STAGES.length} Etapas)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Acompanhe exatamente quantas pessoas entram, avançam ou desistem em cada tela
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-400" /> &gt;35% Perda Crítica
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 15-35% Atenção
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> &lt;15% Ótimo
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-3">Etapa</th>
                  <th className="py-3 px-3">Tela / Pergunta</th>
                  <th className="py-3 px-3 text-center">Visitantes</th>
                  <th className="py-3 px-3 text-center">Avançaram</th>
                  <th className="py-3 px-3 text-center">Saíram Aqui (Perda)</th>
                  <th className="py-3 px-3 text-center">Taxa de Abandono</th>
                  <th className="py-3 px-3 text-center">Retenção Total</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {metrics.stepMetrics.map((step) => {
                  const isCheckout = step.stepNumber === FUNNEL_STAGES.length;

                  return (
                    <tr key={step.stepKey} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-400">
                        <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          #{step.stepNumber}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-slate-100">{step.label}</td>

                      <td className="py-3.5 px-3 text-center font-bold text-slate-200">
                        {step.visitors}
                      </td>

                      <td className="py-3.5 px-3 text-center font-bold text-emerald-400">
                        {isCheckout ? "-" : `${step.advances} (${step.advanceRate}%)`}
                      </td>

                      <td className="py-3.5 px-3 text-center font-extrabold">
                        {isCheckout ? (
                          <span className="text-slate-500">-</span>
                        ) : step.dropoffs > 0 ? (
                          <span
                            className={`px-2 py-0.5 rounded ${
                              step.status === "danger"
                                ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                : step.status === "warning"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            🔻 {step.dropoffs} pessoas
                          </span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center font-black">
                        {isCheckout ? (
                          <span className="text-emerald-400">0%</span>
                        ) : (
                          <span
                            className={
                              step.status === "danger"
                                ? "text-red-400"
                                : step.status === "warning"
                                ? "text-amber-400"
                                : "text-slate-400"
                            }
                          >
                            {step.dropoffRate}%
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-bold text-slate-200 min-w-[32px]">
                            {step.conversionRate}%
                          </span>
                          <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                isCheckout
                                  ? "bg-emerald-400"
                                  : "bg-gradient-to-r from-green-500 to-emerald-400"
                              }`}
                              style={{ width: `${step.conversionRate}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center font-bold">
                        {isCheckout ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            🎯 Checkout Hotmart
                          </span>
                        ) : step.status === "danger" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-red-500/20 text-red-400 border border-red-500/40">
                            🔴 Alta Perda
                          </span>
                        ) : step.status === "warning" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
                            🟡 Atenção
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            🟢 Bom
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Funnel Visual Progression Bars */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <span>📊</span> Fluxo Visual da Jornada do Usuário
          </h2>
          <div className="space-y-3">
            {metrics.stepMetrics.map((step) => {
              const isCheckout = step.stepNumber === FUNNEL_STAGES.length;

              return (
                <div
                  key={step.stepKey}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5 text-xs">
                    <span className="font-bold text-slate-200">{step.label}</span>
                    <div className="flex items-center gap-3 text-slate-400 font-semibold">
                      <span>👥 {step.visitors} visitantes</span>
                      <span>({step.conversionRate}% do início)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCheckout
                          ? "bg-emerald-400"
                          : step.status === "danger"
                          ? "bg-red-500"
                          : step.status === "warning"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.max(step.conversionRate, step.visitors > 0 ? 3 : 0)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Responses Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            📝 O que os Visitantes Estão Respondendo nas Perguntas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.questionBreakdown.map((q) => (
              <div
                key={q.id}
                className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-mono text-indigo-400 font-bold uppercase mb-1">
                    Pergunta #{q.id}
                  </div>
                  <h4 className="text-xs font-bold text-white mb-3 leading-snug">{q.question}</h4>

                  {q.options.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">
                      Nenhuma resposta registrada ainda.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                            <span className="truncate max-w-[170px]">{opt.text}</span>
                            <span className="font-bold text-white">
                              {opt.count} ({opt.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-500 h-full rounded-full"
                              style={{ width: `${opt.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
                  <span>Total respondido:</span>
                  <span className="font-bold text-slate-200">{q.totalAnswers} respostas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profiles */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Perfil Selecionado no Início
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Iniciantes</span>
                  <span>
                    {metrics.inicianteCount} (
                    {metrics.totalVisitors > 0
                      ? Math.round((metrics.inicianteCount / metrics.totalVisitors) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{
                      width: `${
                        metrics.totalVisitors > 0
                          ? Math.round((metrics.inicianteCount / metrics.totalVisitors) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Já Umbandistas</span>
                  <span>
                    {metrics.umbandistaCount} (
                    {metrics.totalVisitors > 0
                      ? Math.round((metrics.umbandistaCount / metrics.totalVisitors) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{
                      width: `${
                        metrics.totalVisitors > 0
                          ? Math.round((metrics.umbandistaCount / metrics.totalVisitors) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Devices */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              Dispositivos dos Visitantes
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <Smartphone className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-2xl font-black text-white">{metrics.mobilePercentage}%</div>
                <span className="text-[11px] text-slate-400 font-semibold">Mobile (Celular)</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <Monitor className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-2xl font-black text-white">{metrics.desktopPercentage}%</div>
                <span className="text-[11px] text-slate-400 font-semibold">Desktop (PC)</span>
              </div>
            </div>
          </div>

          {/* UTM / Traffic Sources */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Origem de Tráfego (UTMs)
            </h3>
            {Object.keys(utmMap).length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Nenhum parâmetro UTM registrado ainda (Tráfego Direto).
              </p>
            ) : (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {Object.entries(utmMap).map(([src, count]) => (
                  <div
                    key={src}
                    className="flex justify-between items-center text-xs bg-slate-950 p-2 rounded-lg border border-slate-800"
                  >
                    <span className="font-mono text-slate-300 truncate max-w-[140px]">{src}</span>
                    <span className="font-bold text-emerald-400">{count} eventos</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Event Stream (Last 20 events) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Últimos Eventos Registrados em Tempo Real
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              Total de {events.length} eventos no histórico
            </span>
          </div>

          {metrics.recentEvents.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              Nenhum evento registrado ainda. Clique em "Simular Teste" acima para testar!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-400 font-bold">
                    <th className="py-2 px-2">Data/Hora</th>
                    <th className="py-2 px-2">Evento</th>
                    <th className="py-2 px-2">Etapa</th>
                    <th className="py-2 px-2">Dispositivo</th>
                    <th className="py-2 px-2">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-mono text-[11px]">
                  {metrics.recentEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-800/30">
                      <td className="py-2 px-2 text-slate-400">
                        {new Date(ev.timestamp).toLocaleTimeString("pt-BR")}
                      </td>
                      <td className="py-2 px-2 font-bold text-indigo-300">{ev.eventName}</td>
                      <td className="py-2 px-2 text-slate-300">
                        #{ev.stepNumber} ({ev.stepName})
                      </td>
                      <td className="py-2 px-2 text-slate-400">
                        {ev.isMobile ? "📱 Mobile" : "💻 Desktop"}
                      </td>
                      <td className="py-2 px-2 text-slate-400 truncate max-w-[200px]">
                        {ev.data ? JSON.stringify(ev.data) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
