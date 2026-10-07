import React, { useEffect } from "react";

interface BonusStepProps {
  onNext: () => void;
}

const bonuses = [
  { src: "/assets/bonus-1-C8Q0zK5Z.png", alt: "Bônus 1 - Curso de Doutrina Umbandista" },
  { src: "/assets/bonus-2-C4A5njPY.png", alt: "Bônus 2 - Guia Tronos Divinos e os Orixás" },
  { src: "/assets/bonus-3-Cm0f-TZ4.png", alt: "Bônus 3 - Guia de Oferendas e Rituais" },
  { src: "/assets/bonus-4-Be6u0da-.png", alt: "Bônus 4 - Áudiobooks do Conteúdo" },
  { src: "/assets/bonus-6-mais-B82pbZGs.png", alt: "+6 Bônus Exclusivos" },
];

export const BonusStep: React.FC<BonusStepProps> = ({ onNext }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full px-2">
      <div className="mb-8 px-2">
        <p className="text-lg md:text-xl text-foreground leading-relaxed">
          <span className="font-black text-foreground">SEU COMBO COMPLETO:</span> Além do{" "}
          <span className="font-bold text-[#ef4444] underline decoration-[#ef4444] decoration-2 underline-offset-4">
            Aplicativo do Mapa Mental da Umbanda
          </span>
          , você receberá também de presente{" "}
          <span className="font-bold text-foreground">10</span>{" "}
          <span className="font-black text-[#ef4444]">BÔNUS ESPECIAIS</span>!
        </p>
        <div className="mt-4 text-3xl">👇</div>
      </div>

      <div className="w-full max-w-md space-y-6 mb-8">
        {bonuses.map((bonus, idx) => (
          <div
            key={idx}
            className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <img
              src={bonus.src}
              alt={bonus.alt}
              className="w-full h-auto rounded-2xl shadow-lg border border-border"
            />
          </div>
        ))}
      </div>

      <div className="mb-8 px-2">
        <p className="text-lg md:text-xl text-foreground leading-relaxed">
          Com a vantagem do <span className="font-black text-foreground">SEU COMBO COMPLETO:</span>{" "}
          Você tem <span className="font-black text-[#ef4444]">ACESSO À TODOS</span> os materiais{" "}
          <span className="font-black text-foreground">ACIMA!</span>
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-md mb-4 py-4 px-6 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-extrabold text-base md:text-lg rounded-2xl shadow-xl transition-all animate-pulse-scale leading-tight flex flex-col items-center justify-center gap-1"
      >
        <span>Ótimo eu quero!</span>
        <span className="text-sm md:text-base font-bold opacity-90">
          Mas quanto custa o COMPLETO?
        </span>
      </button>
    </div>
  );
};
