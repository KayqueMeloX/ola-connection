import React from "react";

interface IntroStepProps {
  selectedRole: "iniciante" | "umbandista" | null;
  onSelectRole: (role: "iniciante" | "umbandista") => void;
}

export const IntroStep: React.FC<IntroStepProps> = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="flex-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight mb-6">
        Entenda o quanto você sabe sobre a religião da Umbanda e o que falta aprender para se tornar
        um Umbandista honrado!
      </h1>

      <p className="text-lg font-bold text-foreground leading-relaxed mb-2">
        No final, você irá <span className="text-primary">APRENDER TUDO</span> sobre a religião com
        um <span className="text-primary">APP</span> fácil, didático e prático.
      </p>

      <p className="text-lg font-bold text-foreground mb-8">
        Com uma condição super especial e{" "}
        <span className="text-primary underline decoration-2 underline-offset-4">
          totalmente acessível para você.
        </span>
      </p>

      <p className="text-foreground text-base leading-relaxed mb-8">
        Você está pronto(a) para testar seu conhecimento sobre a Umbanda? Responda algumas perguntas
        simples e descubra se você conhece os fundamentos da religião ou ainda tem muito para
        aprender.
      </p>

      <div className="flex flex-col items-center text-center mb-6">
        <p className="text-foreground text-lg font-bold leading-snug">
          <span className="text-2xl">⚠️</span>{" "}
          <span className="text-primary">Mas atenção!</span> Continue apenas se você tem o interesse
          e respeito genuíno em aprender sobre a religião.
        </p>
      </div>

      <p className="text-xl font-semibold text-primary mb-6">
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
