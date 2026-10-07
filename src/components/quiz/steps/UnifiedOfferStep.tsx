import React, { useEffect, useRef } from "react";
import { Check, ShieldCheck, Zap, Star, ArrowRight, Gift, Mail, Sparkles, CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useBackgroundMusic } from "../BackgroundMusicProvider";

const CHECKOUT_URL = "https://pay.hotmart.com/G106783622L?checkoutMode=10";

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

      {/* 4. Caixa de Oferta Final / Preço */}
      <div className="w-full bg-gradient-to-b from-card via-card to-primary/5 rounded-3xl p-6 sm:p-8 border-2 border-primary shadow-2xl mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4">
          <Star className="w-4 h-4 text-primary fill-current" />
          <span className="text-xs font-black text-primary tracking-wide uppercase">
            OFERTA PROMOCIONAL HOJE
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
    </div>
  );
};
