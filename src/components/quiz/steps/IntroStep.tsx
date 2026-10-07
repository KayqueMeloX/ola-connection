import React from "react";

interface IntroStepProps {
  selectedRole: "iniciante" | "umbandista" | null;
  onSelectRole: (role: "iniciante" | "umbandista") => void;
}

export const IntroStep: React.FC<IntroStepProps> = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="flex-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight mb-4">
        Descubra o quanto você realmente sabe sobre a Umbanda!
      </h1>

      <p className="text-base sm:text-lg text-foreground leading-relaxed mb-4">
        Responda algumas perguntas simples e descubra se conhece os fundamentos da religião ou se ainda tem muito a aprender.
      </p>

      <p className="text-base sm:text-lg font-bold text-foreground leading-relaxed mb-6">
        No final, tenha acesso a um <span className="text-primary font-extrabold">APP</span> fácil, didático e prático para aprofundar seus conhecimentos sobre a Umbanda.
      </p>

      <div className="flex flex-col items-center text-center mb-8 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
        <p className="text-foreground text-sm sm:text-base font-bold leading-snug">
          <span>⚠️</span> Continue apenas se você tem interesse e respeito genuíno pela religião.
        </p>
      </div>

      <p className="text-xl font-bold text-primary mb-6">
        Você é iniciante ou já é Umbandista?
      </p>

      <div className="flex gap-4 mb-8 w-full justify-center">
        <button
          type="button"
          onClick={() => onSelectRole("iniciante")}
          disabled={selectedRole !== null}
          className={`quiz-card flex flex-col items-center gap-4 w-full max-w-[180px] transition-all duration-200 cursor-pointer ${
            selectedRole === "iniciante" ? "selected ring-4 ring-primary/40 scale-[1.02]" : ""
          } ${selectedRole !== null ? "pointer-events-none" : "active:scale-95"}`}
        >
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
            <img
              src="/assets/personagem-iniciante-novo-CPEGKlyv.png"
              alt="Iniciante"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-bold text-foreground">Iniciante</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectRole("umbandista")}
          disabled={selectedRole !== null}
          className={`quiz-card flex flex-col items-center gap-4 w-full max-w-[180px] transition-all duration-200 cursor-pointer ${
            selectedRole === "umbandista" ? "selected ring-4 ring-primary/40 scale-[1.02]" : ""
          } ${selectedRole !== null ? "pointer-events-none" : "active:scale-95"}`}
        >
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
            <img
              src="/assets/personagem-umbandista-novo-CFD7hGAP.png"
              alt="Umbandista"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-bold text-foreground">Umbandista</span>
        </button>
      </div>
    </div>
  );
};
