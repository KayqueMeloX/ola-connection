import React, { useEffect, useRef } from "react";
import { Check, ShieldCheck, Zap, Star, ArrowRight, Gift, Mail, CheckCircle, Sparkles, MessageCircle, Heart } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useBackgroundMusic } from "../BackgroundMusicProvider";

const CHECKOUT_URL = "https://pay.hotmart.com/G106783622L?checkoutMode=10";

const bonuses = [
  {
    src: "/assets/bonus-1-C8Q0zK5Z.png",
    title: "Bônus 1: Formação Fundamental da Doutrina Umbandista",
    normalPrice: "€ 27,00",
  },
  {
    src: "/assets/bonus-2-C4A5njPY.png",
    title: "Bônus 2: Audiobook Experience - Imersão Guiada",
    normalPrice: "€ 19,00",
  },
  {
    src: "/assets/bonus-3-Cm0f-TZ4.png",
    title: "Bônus 3: Biblioteca dos Tronos e Regências Divinas",
    normalPrice: "€ 17,00",
  },
  {
    src: "/assets/bonus-4-Be6u0da-.png",
    title: "Bônus 4: Atlas Energético das 95 Ervas Sagradas",
    normalPrice: "€ 22,00",
  },
  {
    src: "/assets/bonus-6-mais-B82pbZGs.png",
    title: "+6 Bônus Exclusivos de Firmezas, Defumação e Pontos",
    normalPrice: "€ 45,00",
  },
];

const testimonials = [
  {
    name: "Mariana Silva",
    role: "Iniciante no Terreiro",
    comment: "Sensacional! Como iniciante, eu sempre me perdia nos nomes dos Orixás e suas regências. O mapa mental clareou tudo na minha mente em menos de 3 dias!",
    rating: 5,
  },
  {
    name: "Carlos Eduardo Mendes",
    role: "Médium de Terreiro",
    comment: "Material riquíssimo, direto ao ponto e muito visual. O guia de ervas e pontos cantados eu consulto toda semana no meu celular.",
    rating: 5,
  },
  {
    name: "Juliana Moreira",
    role: "Praticante de Umbanda",
    comment: "Vale cada centavo! Só os bônus com o manual de firmezas e banhos já valem muito mais do que os 20 euros cobrados. Recomendo de olhos fechados.",
    rating: 5,
  },
];

const mainFeatures = [
  { text: "APP Mapa Mental da Umbanda ™ (iOS e Android)" },
  { text: "Acesso Vitalício sem qualquer mensalidade" },
  { text: "Combo Completo com todos os 10 Super Bônus" },
  { text: "Material em PDF de Alta Resolução para Estudo e Impressão" },
  { text: "60 Dias de Garantia Incondicional de Devolução" },
];

export const UnifiedOfferStep: React.FC = () => {
  const videoRef1 = useRef<HTMLIFrameElement>(null);
  const videoRef2 = useRef<HTMLIFrameElement>(null);
  const { pauseForVideo, resumeAfterVideo } = useBackgroundMusic();

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

      if (!isMounted || !win.Vimeo) return;
      [videoRef1.current, videoRef2.current].forEach((iframe) => {
        if (!iframe || !win.Vimeo) return;
        try {
          const player = new win.Vimeo.Player(iframe);
          player.on("play", () => pauseForVideo());
          player.on("pause", () => resumeAfterVideo());
          player.on("ended", () => resumeAfterVideo());
        } catch {}
      });
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

  return (
    <div className="flex-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full px-2">
      {/* 1. Headline de Alto Impacto */}
      <div className="w-full mb-8 pt-10 sm:pt-14 mt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-3">
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          <span className="text-xs font-black text-primary uppercase tracking-wider">
            OFERTA ESPECIAL EXCLUSIVA
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground leading-tight mb-3">
          Domine os Fundamentos, Rituais e Guias da Umbanda na Palma da Sua Mão!
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
          Aprenda de forma simples, visual e prática com o <strong className="text-foreground font-bold">Aplicativo do Mapa Mental da Umbanda</strong>, feito sob medida para iniciantes e praticantes.
        </p>
      </div>

      {/* 2. Demonstração do Produto em Vídeo */}
      <div className="w-full mb-10 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-6 h-6 text-accent" />
          <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
            Veja como funciona o Aplicativo por dentro:
          </h2>
        </div>

        <div className="w-full max-w-sm mx-auto mb-6">
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-border"
            style={{ paddingTop: "216.67%" }}
          >
            <iframe
              ref={videoRef1}
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

        <div className="w-full max-w-sm mx-auto mb-8">
          <p className="text-sm font-bold text-foreground mb-2 text-center">
            📖 Versão para Impressão e Estudo:
          </p>
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-border"
            style={{ paddingTop: "216.67%" }}
          >
            <iframe
              ref={videoRef2}
              src="https://player.vimeo.com/video/1180197942?badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute top-0 left-0 w-full h-full"
              title="impresso"
            />
          </div>
        </div>
      </div>

      {/* 3. Como Você Irá Receber */}
      <div className="w-full bg-card rounded-2xl p-6 border border-border shadow-md text-left mb-10">
        <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Como vou receber o material?
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-foreground">
              <strong>Acesso Imediato por E-mail:</strong> Assim que a compra for aprovada na Hotmart, seus dados de acesso chegam instantaneamente no seu e-mail.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-foreground">
              <strong>No Celular, Tablet e Computador:</strong> Baixe o Aplicativo ou estude em PDF de onde preferir.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Combo dos 10 Bônus com Ancoragem de Preço */}
      <div className="w-full mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-6 h-6 text-primary" />
          <h3 className="text-xl sm:text-2xl font-black text-foreground">
            Você também leva <span className="text-primary">10 Super Bônus</span> de Presente:
          </h3>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          Mais de <span className="line-through font-bold text-red-500 text-base">€ 130,00</span> em materiais que você recebe <strong className="text-green-600 font-black uppercase">100% GRÁTIS</strong> no seu combo!
        </p>

        <div className="w-full max-w-md mx-auto space-y-6 mb-8">
          {bonuses.map((bonus, idx) => (
            <div key={idx} className="w-full bg-card rounded-2xl p-3.5 border border-border shadow-lg text-left">
              <img
                src={bonus.src}
                alt={bonus.title}
                className="w-full h-auto rounded-xl shadow mb-3 border border-border/50"
              />
              <p className="text-sm sm:text-base font-black text-foreground mb-3 px-1 leading-snug">
                {bonus.title}
              </p>
              
              {/* Barra de Preço em Destaque */}
              <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2 px-1">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Valor individual:</span>
                  <span className="text-base sm:text-lg font-black text-red-500 line-through decoration-2">
                    {bonus.normalPrice}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md uppercase tracking-wider">
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                  <span>100% GRÁTIS</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Depoimentos e Prova Social */}
      <div className="w-full mb-10 text-left">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MessageCircle className="w-6 h-6 text-accent" />
          <h3 className="text-xl sm:text-2xl font-black text-foreground text-center">
            O que dizem os Umbandistas que já usam:
          </h3>
        </div>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Depoimentos de quem já transformou seu aprendizado com o Mapa Mental.
        </p>

        <div className="w-full space-y-4">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-bold text-base text-foreground">{t.name}</p>
                  <p className="text-xs text-primary font-semibold">{t.role}</p>
                </div>
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "{t.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Caixa de Oferta Final / Preço */}
      <div className="w-full bg-gradient-to-b from-card via-card to-primary/5 rounded-3xl p-6 sm:p-8 border-2 border-primary shadow-2xl mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4">
          <Star className="w-4 h-4 text-primary fill-current" />
          <span className="text-xs font-black text-primary tracking-wide uppercase">
            OFERTA PROMOCIONAL HOJE
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-2 leading-tight">
          Combo Completo do Mapa Mental da Umbanda
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
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
            De: <span className="line-through text-red-500 font-bold">€ 67,00</span>
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
        <div className="mt-4 pt-3 flex justify-center">
          <img
            src="/assets/hotmart-secure-checkout.png"
            alt="Ambiente Seguro Hotmart"
            className="w-full max-w-[260px] object-contain opacity-90"
          />
        </div>
      </div>

      {/* 7. Garantia Incondicional de 60 Dias */}
      <div className="w-full bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col sm:flex-row items-center gap-4 text-left mb-8">
        <ShieldCheck className="w-16 h-16 text-green-600 shrink-0" />
        <div>
          <h4 className="text-lg font-black text-foreground mb-1">Garantia Incondicional de 60 Dias</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Se você não gostar do aplicativo ou achar que ele não agregou conhecimento à sua caminhada espiritual, basta nos enviar um e-mail e devolvemos 100% do seu dinheiro sem perguntas.
          </p>
        </div>
      </div>
    </div>
  );
};
