import React, { useEffect, useRef, useState } from "react";
import { Check, ShieldCheck, Zap, Star, ArrowRight, Gift, Sparkles, MessageCircle, ChevronLeft, ChevronRight, UserCheck, Timer, HelpCircle, ChevronDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useBackgroundMusic } from "../BackgroundMusicProvider";

const CHECKOUT_URL = "https://pay.hotmart.com/G106783622L?checkoutMode=10";

const offerItems = [
  { text: "APP Mapa Mental da Umbanda ™", isCore: true },
  { text: "Pagamento Único", isCore: true },
  { text: "Acesso Vitalício ao Aplicativo", isCore: true },
  { text: "60 dias de Garantia", isCore: true },
  { text: "Bônus 1: Formação Fundamental de Doutrina Umbandista", isCore: false, normalPrice: "€ 27,00" },
  { text: "Bônus 2: Audiobook Experience - Imersão Guiada de todo o conteúdo", isCore: false, normalPrice: "€ 19,00" },
  { text: "Bônus 3: Biblioteca Hierárquica dos Tronos e Regências Divinas", isCore: false, normalPrice: "€ 17,00" },
  { text: "Bônus 4: Atlas Energético das 95 Ervas Sagradas", isCore: false, normalPrice: "€ 22,00" },
  { text: "Bônus 5: Manual Vibracional do Reino Mineral e Pedras Sagradas", isCore: false, normalPrice: "€ 15,00" },
  { text: "Bônus 6: Ritual Guiado de Defumação para Limpeza e Proteção Espiritual", isCore: false, normalPrice: "€ 19,00" },
  { text: "Bônus 7: Compêndio Estruturado de Práticas Ritualísticas Conscientes", isCore: false, normalPrice: "€ 14,00" },
  { text: "Bônus 8: Coletânea Curada de Pontos Cantados Essenciais", isCore: false, normalPrice: "€ 12,00" },
  { text: "Bônus 9: Coleção Oficial de Iconografia Sagrada da Umbanda", isCore: false, normalPrice: "€ 16,00" },
  { text: "Bônus 10: Círculo Fechado de Estudos Umbandistas - Whatsapp", isCore: false, normalPrice: "€ 29,00" },
];

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
      {/* 1. Temporizador de Escassez + Headline + Preço Inicial */}
      <div className="w-full mb-6 pt-1 max-w-md mx-auto">
        {/* Temporizador de Escassez / Urgência em Destaque Vermelho */}
        <div
          className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-2xl mb-3 font-black tracking-wide shadow-md animate-pulse"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            color: "#ef4444",
            border: "1.5px solid rgba(239, 68, 68, 0.45)",
          }}
        >
          <Timer className="w-4 h-4 shrink-0" style={{ color: "#ef4444" }} />
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center">
            DESCONTO RESERVADO POR:
            <span
              className="font-mono text-xs sm:text-sm px-2 py-0.5 rounded-lg font-black ml-1.5 text-white shadow-sm"
              style={{ backgroundColor: "#ef4444" }}
            >
              {formatTimer(timeLeft)}
            </span>
          </span>
        </div>

        <h1 className="text-lg sm:text-xl md:text-2xl font-black text-foreground leading-snug mb-4">
          <span style={{ color: "#ef4444" }} className="font-extrabold uppercase">SOMENTE HOJE:</span> Você vai evoluir investindo no{" "}
          <span style={{ color: "#ef4444" }} className="font-extrabold">Aplicativo do Mapa Mental da Umbanda</span> com o{" "}
          <span className="underline font-bold decoration-foreground decoration-2">material completo</span> pelo valor promocional:
        </h1>

        {/* Caixa de Preço Inicial (Igual no Print) */}
        <div className="flex flex-col items-center justify-center my-3">
          <div className="text-sm sm:text-base font-black text-foreground flex items-center gap-1.5">
            <span>DE:</span>
            <span style={{ color: "#ef4444", textDecoration: "line-through" }} className="font-black text-base sm:text-lg">
              € 97,00
            </span>
          </div>

          <div className="flex items-center gap-2 w-full max-w-[200px] my-1">
            <div className="h-[2px] bg-green-500/50 flex-1" />
            <span className="text-[11px] font-black text-green-600 tracking-wider uppercase">POR APENAS</span>
            <div className="h-[2px] bg-green-500/50 flex-1" />
          </div>

          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg sm:text-xl font-black text-green-600">€</span>
            <span className="text-4xl sm:text-5xl font-black text-green-600 tracking-tight">19,90</span>
          </div>
        </div>
      </div>

      {/* 2. Primeiro Vídeo (Apresentação do App) */}
      <div className="w-full max-w-sm mx-auto mb-6">
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

      {/* 3. Texto "Além disso..." + Super Mockup + Oferta dos 10 Bônus (Igual no Print) */}
      <div className="w-full max-w-md mx-auto mb-8">
        <p className="text-base sm:text-lg font-bold text-foreground leading-snug mb-4">
          Além disso, você receberá também{" "}
          <strong style={{ color: "#ef4444" }} className="font-black uppercase">10 BÔNUS ESPECIAIS</strong> para melhorar o seu aprendizado e fortalecer a sua fé.
        </p>

        {/* Badge "O MAIS VENDIDO" */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider mb-4 shadow-md"
          style={{ backgroundColor: "#27272a", color: "#ffffff" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#22c55e" }} />
          <span>O MAIS VENDIDO</span>
        </div>

        {/* Imagem do Super Mockup */}
        <div className="w-full mb-4">
          <img
            src="/assets/super-mockup-oferta-ZDvK5T8y.png"
            alt="Super Mockup Oferta Completa com 10 Bônus"
            className="w-full h-auto drop-shadow-xl"
          />
        </div>

        {/* Subtítulos de persuasão */}
        <p className="text-xs sm:text-sm italic text-muted-foreground font-semibold mb-1">
          "97% das pessoas optam por esta oferta"
        </p>
        <p className="text-[11px] sm:text-xs font-bold text-foreground mb-4">
          <strong className="text-primary font-black uppercase">ÚLTIMO DIA:</strong> Aproveite agora! Você não verá essa oportunidade em outro momento.
        </p>

        {/* Lista de Recursos / Bônus (Pills Verticais com Ícone Amarelo, Preço Riscado e Tag Grátis) */}
        <div className="space-y-2.5 mb-6 text-left">
          {offerItems.map((item, idx) => (
            <div
              key={idx}
              className="w-full bg-card rounded-2xl p-3 border border-border/80 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                  style={
                    item.isCore
                      ? { backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#16a34a" }
                      : { backgroundColor: "#fef3c7", color: "#d97706", border: "1px solid #fde68a" }
                  }
                >
                  {item.isCore ? (
                    <Check className="w-4 h-4 stroke-[3]" style={{ color: "#16a34a" }} />
                  ) : (
                    <span className="text-sm leading-none select-none">🎁</span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground leading-tight">
                  {item.text}
                </span>
              </div>

              {!item.isCore && item.normalPrice && (
                <div className="flex items-center gap-1.5 shrink-0 pl-1">
                  <span
                    style={{ color: "#ef4444", textDecoration: "line-through" }}
                    className="text-[11px] sm:text-xs font-black"
                  >
                    {item.normalPrice}
                  </span>
                  <span
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.15)",
                      color: "#16a34a",
                      border: "1px solid rgba(34, 197, 94, 0.35)",
                    }}
                    className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                  >
                    GRÁTIS
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botão de Compra Principal Grande (Igual no Print) */}
        <button
          onClick={handleCheckoutClick}
          className="w-full py-4 sm:py-5 px-6 bg-[#4CAF82] hover:bg-[#3d9970] text-white font-black text-lg sm:text-xl rounded-2xl shadow-2xl transition-all animate-pulse-scale flex items-center justify-center gap-3 cursor-pointer mb-3"
        >
          <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-white stroke-[3]" />
          </div>
          <span>Quero comprar o Material Completo e receber agora!</span>
        </button>

        {/* Selo Hotmart & Ambiente 100% Seguro */}
        <div className="flex flex-col items-center justify-center gap-2 mb-6">
          <img
            src="/assets/hotmart-secure-checkout.png"
            alt="Ambiente Seguro Hotmart"
            className="w-full max-w-[240px] object-contain opacity-95"
          />
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

      {/* 5. FAQ - Perguntas Frequentes em Acordeão */}
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
