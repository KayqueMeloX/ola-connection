import React, { useEffect } from "react";

interface OfferIntroStepProps {
  onNext: () => void;
}

export const OfferIntroStep: React.FC<OfferIntroStepProps> = ({ onNext }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 px-2">
      <p className="text-xl font-extrabold text-foreground leading-tight mb-8">
        Independente do seu nível de conhecimento, uma coisa é certa: para dominar os fundamentos da
        Umbanda, você precisa de um material que seja prático, visual e direto ao ponto.
      </p>

      <p className="text-xl font-extrabold text-foreground leading-tight mb-8">
        O{" "}
        <span className="text-primary underline decoration-2 underline-offset-4">
          Aplicativo do Mapa Mental da Umbanda
        </span>{" "}
        é mais do que um guia — é a maneira mais fácil e eficaz de organizar tudo o que você precisa
        saber sobre a religião.
      </p>

      <p className="text-lg text-muted-foreground leading-relaxed mb-8">
        Imagine aprender sobre os Orixás, rituais, pontos riscados e fundamentos espirituais sem se
        perder em informações soltas ou confusas?
      </p>

      <button onClick={onNext} className="btn-quiz w-full max-w-md mb-4 shadow-xl">
        Interessante, eu quero! Mas como vou receber?
      </button>
    </div>
  );
};
