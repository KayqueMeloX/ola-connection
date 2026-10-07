import React, { useEffect, useRef, useState } from "react";
import { Check, ShieldCheck, Zap, Star, ArrowRight, Gift, Sparkles, MessageCircle, ChevronLeft, ChevronRight, UserCheck, Timer, HelpCircle, ChevronDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useBackgroundMusic } from "../BackgroundMusicProvider";

const CHECKOUT_URL = "https://pay.hotmart.com/G106783622L?checkoutMode=10";

const feedbacks = [
  {
    name: "Mariana Silva",
    role: "Iniciante no Terreiro",
    comment: "Sensacional! Como iniciante, eu sempre me perdia nos nomes dos Orixás e suas regências. O mapa mental clareou tudo na minha mente em menos de 3 dias!",
    rating: 5,
    tag: "Verificada",
  },
  {
    name: "Carlos Eduardo Mendes",
    role: "Médium de Terreiro",
    comment: "Material riquíssimo, direto ao ponto e muito visual. O guia de ervas e pontos cantados eu consulto toda semana no meu celular.",
    rating: 5,
    tag: "Verificado",
  },
  {
    name: "Juliana Moreira",
    role: "Praticante de Umbanda",
    comment: "Vale cada centavo! Só os bônus com o manual de firmezas e banhos já valem muito mais do que os 20 euros cobrados. Recomendo de olhos fechados.",
    rating: 5,
    tag: "Verificada",
  },
  {
    name: "Rodrigo Vasconcelos",
    role: "Filho de Santo",
    comment: "Muito didático e organizado! Tirou dúvidas que eu tinha há anos sobre hierarquia e linhas de trabalho. A melhor compra que fiz!",
    rating: 5,
    tag: "Verificado",
  },
];

const faqs = [
  {
    q: "Como vou receber o meu acesso?",
    a: "O acesso chega imediatamente no seu e-mail logo após a confirmação do pagamento pela Hotmart. Você recebe o link para baixar o App e os arquivos em PDF.",
  },
  {
    q: "Funciona em qualquer celular (Android e iPhone)?",
    a: "Sim! O Aplicativo roda perfeitamente em todos os celulares Android e iPhone (iOS), além de computadores e tablets.",
  },
  {
    q: "O pagamento é único ou tem mensalidade?",
    a: "É um pagamento único de apenas € 19,90. Você não paga mensalidades e tem acesso vitalício a todo o conteúdo e atualizações.",
  },
  {
    q: "E se eu não gostar do conteúdo?",
    a: "Você tem 60 dias de Garantia Incondicional. Se por qualquer motivo achar que o material não te ajudou, basta enviar uma mensagem e devolvemos 100% do seu dinheiro sem burocracia.",
  },
];

const mainFeatures = [
  { text: "APP Mapa Mental da Umbanda ™ (iOS e Android)" },
  { text: "Acesso Vitalício sem qualquer mensalidade" },
  { text: "Combo Completo com todos os 10 Super Bônus Inclusos" },
  { text: "Material Didático em PDF para Estudo e Impressão" },
  { text: "Acesso Imediato no seu E-mail após a compra" },
];

export const UnifiedOfferStep: React.FC = () => {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const { pauseForVideo, resumeAfterVideo } = useBackgroundMusic();
  const [activeFeedback, setActiveFeedback] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(899); // 14:59

  // Cronômetro regressivo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Auto-scroll loop para a direita a cada 3.5 segundos
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveFeedback((prev) => (prev + 1) % feedbacks.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {}

    const win = window as unknown as {
      Vimeo?: {
        Player: new (el: HTMLIFrameElement) => {
          on: (event: string, cb: () => void) => void;
          destroy: () => Promise<void>;
        };
      };
    };

    let isMounted = true;
    (async () => {
      if (!win.Vimeo) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://player.vimeo.com/api/player.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject();
          document.head.appendChild(script);
        });
      }

      if (!isMounted || !win.Vimeo || !videoRef.current) return;
      try {
        const player = new win.Vimeo.Player(videoRef.current);
        player.on("play", () => pauseForVideo());
        player.on("pause", () => resumeAfterVideo());
        player.on("ended", () => resumeAfterVideo());
      } catch {}
    })().catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [pauseForVideo, resumeAfterVideo]);

  const handleCheckoutClick = () => {
    pauseForVideo();
    trackEvent("checkout_click", "checkout_click", 8, {
      price: 19.9,
      currency: "EUR",
    });

    if (typeof window !== "undefined") {
      if ((window as any).fbq) {
        (window as any).fbq("track", "InitiateCheckout", {
          value: 19.9,
          currency: "EUR",
          content_name: "Mapa Mental da Umbanda + 10 Bonus",
        });
      }
      window.location.href = CHECKOUT_URL;
    }
  };

  const nextFeedback = () => {
    setActiveFeedback((prev) => (prev + 1) % feedbacks.length);
  };

  const prevFeedback = () => {
    setActiveFeedback((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full px-2">
      {/* 1. Headline de Alto Impacto */}
      <div className="w-full mb-6 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-3">
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          <span className="text-xs font-black text-primary uppercase tracking-wider">
            OFERTA ESPECIAL EXCLUSIVA
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground leading-tight mb-3">
          Domine os Fundamentos, Rituais e Guias da Umbanda na Palma da Sua Mão!
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
          Aprenda de forma simples, visual e prática com o <strong className="text-foreground font-bold">Aplicativo do Mapa Mental da Umbanda</strong>, feito sob medida para iniciantes e praticantes.
        </p>
      </div>

      {/* 2. Demonstração do Produto em Vídeo */}
      <div className="w-full mb-8 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-accent shrink-0" />
          <h2 className="text-lg sm:text-xl font-black text-foreground leading-tight">
            Veja como funciona o Aplicativo por dentro:
          </h2>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-border"
            style={{ paddingTop: "216.67%" }}
          >
            <iframe
              ref={videoRef}
              src="https://player.vimeo.com/video/1232523229?badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute top-0 left-0 w-full h-full"
              title="APP Mapa - Apresentaçao"
            />
          </div>
        </div>
      </div>

      {/* 3. Super Combo dos 10 Bônus (Unificado e Compacto) */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <Gift className="w-5 h-5 text-primary" />
          <h3 className="text-lg sm:text-xl font-black text-foreground">
            Você também leva <span className="text-primary">10 Super Bônus</span> de Presente:
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          Materiais de aprofundamento, firmezas, ervas sagradas e áudios guiados.
        </p>

        <div className="w-full max-w-md mx-auto bg-card rounded-2xl p-3 border border-border shadow-lg text-left">
          <img
            src="/assets/super-mockup-oferta-ZDvK5T8y.png"
            alt="Combo Completo com 10 Super Bônus"
            className="w-full h-auto rounded-xl shadow mb-3 border border-border/50"
          />
          
          {/* Barra de Valor dos Bônus */}
          <div className="pt-2.5 border-t border-border/70 flex items-center justify-between gap-2 px-1">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Valor individual:</span>
              <span
                className="text-base sm:text-lg font-black"
                style={{ color: "#ef4444", textDecoration: "line-through" }}
              >
                € 130,00
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md uppercase tracking-wider"
              style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
            >
              <Check className="w-4 h-4 stroke-[3]" style={{ color: "#ffffff" }} />
              <span>100% GRÁTIS NO COMBO</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Carrossel de 4 Feedbacks com Rolagem Automática para a Direita */}
      <div
        className="w-full mb-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <MessageCircle className="w-5 h-5 text-accent" />
          <h3 className="text-lg sm:text-xl font-black text-foreground">
            O que dizem os Umbandistas que já usam:
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          Avaliações reais de praticantes e iniciantes no terreiro.
        </p>

        <div className="w-full max-w-md mx-auto relative">
          {/* Container com transição deslizante para a direita */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeFeedback * 100}%)` }}
            >
              {feedbacks.map((f, idx) => (
                <div key={idx} className="w-full shrink-0 px-1">
                  <div className="bg-card rounded-2xl p-5 border border-border shadow-md text-left flex flex-col justify-between min-h-[160px]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-sm sm:text-base text-foreground">{f.name}</p>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-green-500/15 text-green-700 flex items-center gap-0.5">
                              <UserCheck className="w-3 h-3" />
                              {f.tag}
                            </span>
                          </div>
                          <p className="text-xs text-primary font-semibold">{f.role}</p>
                        </div>
                        <div className="flex gap-0.5 text-amber-500">
                          {Array.from({ length: f.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">
                        "{f.comment}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles de Navegação e Indicadores (Bolinhas) */}
          <div className="flex items-center justify-between mt-3 px-2">
            <button
              onClick={prevFeedback}
              className="p-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer"
              aria-label="Feedback anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {feedbacks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFeedback(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeFeedback === i ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Ver feedback ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextFeedback}
              className="p-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer"
              aria-label="Próximo feedback"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Caixa de Oferta Final / Preço */}
      <div className="w-full bg-gradient-to-b from-card via-card to-primary/5 rounded-3xl p-6 sm:p-8 border-2 border-primary shadow-2xl mb-8">
        {/* Temporizador de Escassez / Urgência em Destaque Vermelho */}
        <div
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl mb-4 font-black tracking-wide shadow-md animate-pulse"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            color: "#ef4444",
            border: "1.5px solid rgba(239, 68, 68, 0.45)",
          }}
        >
          <Timer className="w-5 h-5 shrink-0" style={{ color: "#ef4444" }} />
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center">
            DESCONTO RESERVADO POR:
            <span
              className="font-mono text-sm sm:text-base px-2 py-0.5 rounded-lg font-black ml-1.5 text-white shadow-sm"
              style={{ backgroundColor: "#ef4444" }}
            >
              {formatTimer(timeLeft)}
            </span>
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-1.5 leading-tight">
          Combo Completo do Mapa Mental da Umbanda
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
          Aplicativo + PDF Completo + 10 Bônus Exclusivos + Acesso Vitalício
        </p>

        {/* Lista de Recursos */}
        <div className="w-full space-y-2.5 mb-6 text-left">
          {mainFeatures.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm sm:text-base font-bold text-foreground">{feat.text}</span>
            </div>
          ))}
        </div>

        {/* Preço */}
        <div className="my-6 p-4 rounded-2xl bg-muted/40 border border-border">
          <p className="text-sm text-muted-foreground mb-1">
            De:{" "}
            <span className="font-bold" style={{ color: "#ef4444", textDecoration: "line-through" }}>
              € 67,00
            </span>
          </p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-sm font-bold text-foreground">Por apenas</span>
            <span className="text-4xl sm:text-5xl font-black text-primary">€ 19,90</span>
          </div>
          <p className="text-xs font-semibold text-green-600 mt-1">
            ✓ Pagamento único • Sem mensalidades • Acesso Vitalício
          </p>
        </div>

        {/* CTA Principal */}
        <button
          onClick={handleCheckoutClick}
          className="w-full py-5 px-6 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-black text-xl sm:text-2xl rounded-2xl shadow-2xl transition-all animate-pulse-scale flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>QUERO COMPRAR AGORA</span>
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Selo Hotmart */}
        <div className="mt-4 pt-2 flex justify-center">
          <img
            src="/assets/hotmart-secure-checkout.png"
            alt="Ambiente Seguro Hotmart"
            className="w-full max-w-[240px] object-contain opacity-90"
          />
        </div>

        {/* Garantia Incondicional Integrada */}
        <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-3 text-left">
          <ShieldCheck className="w-9 h-9 text-green-600 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground font-bold">Garantia Incondicional de 60 Dias:</strong> Se não gostar ou achar que não agregou à sua jornada espiritual, devolvemos 100% do seu dinheiro.
          </p>
        </div>
      </div>

      {/* 6. FAQ - Perguntas Frequentes em Acordeão */}
      <div className="w-full mb-10 text-left max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg sm:text-xl font-black text-foreground text-center">
            Perguntas Frequentes
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left font-bold text-sm sm:text-base text-foreground flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
