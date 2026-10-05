import React, { useEffect } from "react";
import { Check, Sparkles } from "lucide-react";
import { useBackgroundMusic } from "../BackgroundMusicProvider";

const mainFeatures = [
  { text: "APP Mapa Mental da Umbanda ™" },
  { text: "Pagamento Único" },
  { text: "Acesso Vitalício ao Aplicativo" },
  { text: "60 dias de Garantia" },
];

const bonusList = [
  { text: "Bônus 1: Formação Fundamental da Doutrina Umbandista" },
  { text: "Bônus 2: Audiobook Experience - Imersão Guiada de todo o conteúdo" },
  { text: "Bônus 3: Biblioteca Hierárquica dos Tronos e Regências Divinas" },
  { text: "Bônus 4: Atlas Energético das 95 Ervas Sagradas" },
  { text: "Bônus 5: Manual Vibracional do Reino Mineral e Pedras Sagradas" },
  { text: "Bônus 6: Ritual Guiado de Defumação para Limpeza e Proteção Espiritual" },
  { text: "Bônus 7: Compêndio Estruturado de Práticas Ritualísticas Conscientes" },
  { text: "Bônus 8: Coletânea Curada de Pontos Cantados Essenciais" },
  { text: "Bônus 9: Coleção Oficial de Iconografia Sagrada da Umbanda" },
  { text: "Bônus 10: Círculo Fechado de Estudos Umbandistas - Whatsapp" },
];

export const CheckoutOfferStep: React.FC = () => {
  const { pauseForVideo } = useBackgroundMusic();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 px-2">
      <h2 className="text-xl md:text-2xl font-black text-foreground leading-tight mb-6">
        <span className="text-primary font-black">SOMENTE HOJE:</span> Você vai evoluir investindo
        no <span className="text-primary">Aplicativo do Mapa Mental da Umbanda</span> com o{" "}
        <span className="underline decoration-2 underline-offset-2">material completo</span> pelo
        valor promocional:
      </h2>

      <div className="w-full max-w-sm mb-8">
        <img
          src="/assets/preco-1990.png"
          alt="De R$297 por apenas R$19,90"
          className="w-full h-auto"
        />
      </div>

      <p className="text-lg md:text-xl font-black text-foreground mb-6 leading-relaxed">
        Além disso, você receberá também{" "}
        <span className="text-primary font-black">10 BÔNUS ESPECIAIS</span> para melhorar o seu
        aprendizado e fortalecer a sua fé.
      </p>

      <div className="inline-flex items-center gap-2 mb-5 px-5 py-2 bg-foreground/90 rounded-full shadow-lg">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs md:text-sm font-semibold text-background tracking-wide uppercase">
          O mais vendido
        </span>
      </div>

      <div className="w-full max-w-lg mb-6">
        <img
          src="/assets/super-mockup-oferta-ZDvK5T8y.png"
          alt="Oferta Completa - Mapa Mental da Umbanda com Bônus"
          className="w-full h-auto"
        />
      </div>

      <p className="text-sm font-semibold text-foreground/80 mb-2 italic">
        *97% das pessoas optam por esta oferta*
      </p>

      <p className="text-sm mb-6" style={{ color: "#8c8c8c" }}>
        <span className="font-black italic">ÚLTIMO DIA:</span> Aproveite agora! Você não verá essa
        oportunidade em outro momento.
      </p>

      <div className="w-full max-w-md space-y-2 mb-2">
        {mainFeatures.map((feat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-gradient-to-r from-card to-muted/50 rounded-xl py-3 px-4 backdrop-blur-sm border border-border shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground text-left">{feat.text}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md space-y-2 mb-8">
        {bonusList.map((bonus, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-gradient-to-r from-card to-muted/50 rounded-xl py-3 px-4 backdrop-blur-sm border border-border shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground text-left">{bonus.text}</span>
          </div>
        ))}
      </div>

      <a
        href="https://pay.wiapy.com/ANIyBmA8dQ"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => pauseForVideo()}
        className="w-full max-w-md mb-4 py-4 px-6 bg-[#4CAF82] hover:bg-[#3d9970] text-white font-extrabold text-base md:text-lg rounded-2xl shadow-xl transition-all animate-pulse-scale-strong flex items-center justify-center gap-3"
      >
        <div className="w-12 h-12 bg-[#6BC9A0] rounded-xl flex items-center justify-center flex-shrink-0">
          <Check className="w-7 h-7 text-white" strokeWidth={3} />
        </div>
        <span className="text-center leading-tight">
          Quero comprar o Material Completo e receber agora!
        </span>
      </a>

      <div className="w-full max-w-sm mb-6">
        <img
          src="/assets/wiapy-secure-checkout.png"
          alt="Ambiente 100% seguro - Visa, Mastercard, Elo, PIX, AMEX, Hiper, Boleto - Wiapy"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};
