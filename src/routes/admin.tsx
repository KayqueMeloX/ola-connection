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
} from "lucide-react";
import {
  getStoredEvents,
  clearStoredEvents,
  calculateFunnelMetrics,
  FUNNEL_STAGES,
} from "@/lib/analytics";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [metrics, setMetrics] = useState(() => calculateFunnelMetrics(getStoredEvents()));
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [filterPeriod, setFilterPeriod] = useState<"all" | "today">("all");

  const refreshData = () => {
    let events = getStoredEvents();
    if (filterPeriod === "today") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      events = events.filter((e) => e.timestamp >= todayStart.getTime());
    }
    setMetrics(calculateFunnelMetrics(events));
    setLastUpdate(new Date());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Live poll every 5s
    return () => clearInterval(interval);
  }, [filterPeriod]);

  const handleClear = () => {
    if (confirm("Tem certeza que deseja zerar os dados de rastreamento do funil?")) {
      clearStoredEvents();
      refreshData();
    }
  };

  const handleExportCSV = () => {
    const events = getStoredEvents();
    if (events.length === 0) {
      alert("Nenhum dado registrado para exportar.");
      return;
    }

    const headers = ["ID", "Session ID", "Data/Hora", "Evento", "Etapa", "Numero", "Dispositivo", "UTM Source", "UTM Campaign"];
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

  // Find the step with the highest drop-off rate among visited steps
  const validSteps = metrics.stepMetrics.filter((s) => s.visitors > 0 && s.stepNumber < 18);
  const highestDropoffStep = validSteps.reduce(
    (max, step) => (step.dropoffs > (max?.dropoffs || 0) ? step : max),
    validSteps[0]
  );

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
              📊 Métricas do Funil — Quiz Saravá
            </h1>
            <p className="text-sm text-slate-400">
              Acompanhamento exato de desistências e conversão por etapa do funil
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as "all" | "today")}
              className="bg-slate-900 border border-slate-700 text-xs font-semibold rounded-lg px-3 py-2 text-slate-200 outline-none"
            >
              <option value="all">Todo o Período</option>
              <option value="today">Apenas Hoje</option>
            </select>

            <button
              onClick={refreshData}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Atualizar
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>

            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-red-800/50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar
            </button>

            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-lg shadow-red-600/20"
            >
              Ver Quiz
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4 Cards Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total de Visitantes</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">{metrics.totalVisitors}</div>
            <p className="text-xs text-slate-400 mt-1">Sessões iniciadas no quiz</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Completaram o Quiz</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">
              {metrics.completionRate}%
            </div>
            <p className="text-xs text-slate-400 mt-1">Responderam todas as 9 perguntas</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Cliques no Checkout (IC)</span>
              <ShoppingCart className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">{metrics.totalCheckouts}</div>
            <p className="text-xs text-slate-400 mt-1">Cliques no botão Hotmart</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Conversão de IC</span>
              <TrendingDown className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-400">
              {metrics.checkoutRate}%
            </div>
            <p className="text-xs text-slate-400 mt-1">% visitantes que foram pro checkout</p>
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
                A etapa <strong className="text-white">{highestDropoffStep.label}</strong> teve a
                maior perda: <strong className="text-white">{highestDropoffStep.dropoffs} pessoas ({highestDropoffStep.dropoffRate}%)</strong> desistiram exatamente nesta tela.
              </p>
            </div>
          </div>
        )}

        {/* Funnel Visualization */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">
                🔍 Funil Etapa por Etapa (Onde as pessoas estão parando)
              </h2>
              <p className="text-xs text-slate-400">
                Acompanhe o volume de pessoas em cada etapa e a perda entre cada transição
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {metrics.stepMetrics.map((step) => {
              const isCritical = step.dropoffRate >= 30 && step.visitors > 0;
              const isCheckout = step.stepNumber === 18;

              return (
                <div
                  key={step.stepKey}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 transition-all hover:border-slate-700"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        #{step.stepNumber}
                      </span>
                      <span className="text-sm font-bold text-slate-100">{step.label}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-300 font-bold">
                        👥 {step.visitors} pessoas ({step.conversionRate}% do início)
                      </span>

                      {step.stepNumber < 18 && step.visitors > 0 && (
                        <span
                          className={`font-extrabold px-2 py-0.5 rounded ${
                            isCritical
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          🔻 Desistiram: {step.dropoffs} ({step.dropoffRate}%)
                        </span>
                      )}

                      {isCheckout && (
                        <span className="font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          🎯 Final Checkout
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCheckout
                          ? "bg-emerald-500"
                          : isCritical
                          ? "bg-red-500"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500"
                      }`}
                      style={{ width: `${Math.max(step.conversionRate, step.visitors > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <span>{metrics.inicianteCount}</span>
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
                  <span>{metrics.umbandistaCount}</span>
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
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <Smartphone className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <div className="text-2xl font-black text-white">{metrics.mobilePercentage}%</div>
                <span className="text-xs text-slate-400 font-semibold">Celular (Mobile)</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <Monitor className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-2xl font-black text-white">{metrics.desktopPercentage}%</div>
                <span className="text-xs text-slate-400 font-semibold">Computador (Desktop)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
