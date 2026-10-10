import React, { useState, useEffect, useRef } from "react";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const launchFireworks = () => {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => canvas.remove();

  const audio = new Audio("/audio/fireworks.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {});

  const colors = [
    "#FFD700",
    "#FF4500",
    "#00FF7F",
    "#FF1493",
    "#00BFFF",
    "#FF6347",
    "#7B68EE",
    "#FFE4B5",
    "#FF69B4",
    "#32CD32",
  ];
  const rockets: Array<{
    x: number;
    y: number;
    targetY: number;
    vy: number;
    color: string;
    exploded: boolean;
  }> = [];
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    life: number;
    maxLife: number;
    trail: Array<{ x: number; y: number }>;
    type: string;
  }> = [];

  let animId: number;
  let ticks = 0;
  const maxTicks = 300;

  const createRocket = () => {
    const x = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
    rockets.push({
      x,
      y: canvas.height,
      targetY: canvas.height * 0.15 + Math.random() * canvas.height * 0.3,
      vy: -12 - Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)] ?? "#ffffff",
      exploded: false,
    });
  };

  for (let i = 0; i < 5; i++) {
    setTimeout(createRocket, i * 250);
  }

  const explode = (rocket: { x: number; y: number; color: string }) => {
    const count = 80 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 3 + Math.random() * 4;
      particles.push({
        x: rocket.x,
        y: rocket.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: rocket.color,
        size: 2 + Math.random() * 2,
        life: 60 + Math.random() * 40,
        maxLife: 100,
        trail: [],
        type: Math.random() > 0.3 ? "spark" : "glow",
      });
    }
  };

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rockets.forEach((rocket) => {
      if (!rocket.exploded) {
        rocket.y += rocket.vy;
        rocket.vy += 0.1;
        ctx.beginPath();
        ctx.moveTo(rocket.x, rocket.y);
        ctx.lineTo(rocket.x, rocket.y + 15);
        ctx.strokeStyle = rocket.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (rocket.y <= rocket.targetY || rocket.vy >= -2) {
          rocket.exploded = true;
          explode(rocket);
        }
      }
    });

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (!p) continue;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 5) p.trail.shift();
      p.vy += 0.05;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.life <= 0) particles.splice(i, 1);
    }

    ticks++;
    if (ticks < maxTicks || particles.length > 0) {
      animId = requestAnimationFrame(render);
    } else {
      canvas.remove();
      audio.pause();
    }
  };

  render();

  return () => {
    cancelAnimationFrame(animId);
    canvas.remove();
    audio.pause();
  };
};

const leadOptions = [
  {
    image: "/assets/result-option-sim-CeTr9lC_.png",
    text: "Sim, seria incrível!",
    explanation:
      "Que ótimo! O Mapa Mental da Umbanda foi feito exatamente para pessoas como você, que querem aprender de forma organizada e clara.",
  },
  {
    image: "/assets/option-talvez-DPJvBUqf.png",
    text: "Talvez, se for direto e fácil de entender.",
    explanation:
      "Perfeito! O Mapa Mental foi desenvolvido para ser direto, visual e fácil de absorver, mesmo para quem está começando.",
  },
  {
    image: "/assets/option-incerteza-BRhgOzPW.png",
    text: "Não sei, preciso ver mais detalhes.",
    explanation:
      "Entendo! Vou te mostrar todos os detalhes para você decidir com calma se faz sentido para você.",
  },
];

interface ResultStepProps {
  score: number;
  totalQuestions: number;
  onNext: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({ score, totalQuestions, onNext }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const cleanupFireworksRef = useRef<(() => void) | null>(null);

  const targetScore = 60; // 60% default score gauge

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    cleanupFireworksRef.current = launchFireworks();

    const startTime = Date.now();
    const duration = 2000;
    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplayScore(Math.round(ease * targetScore));
      if (progress < 1) requestAnimationFrame(animateScore);
    };
    requestAnimationFrame(animateScore);

    return () => {
      cleanupFireworksRef.current?.();
    };
  }, []);

  const handleSelectOption = (idx: number) => {
    if (showExplanation || selectedIndex !== null) return;
    setSelectedIndex(idx);
    setShowExplanation(true);
    setTimeout(() => {
      onNext();
    }, 450);
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">
            SUA PONTUAÇÃO
          </p>
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-3xl font-black text-foreground">{displayScore}%</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <p className="text-xs font-bold text-foreground mb-2">Resultado: Bom 🤩</p>
          <img
            src="/assets/personagem-umbandista-novo-CFD7hGAP.png"
            alt="Personagem Umbandista"
            className="w-full h-28 object-contain rounded-xl"
          />
        </div>
      </div>

      <div className="mb-6 px-2">
        <p className="text-lg text-foreground leading-relaxed">
          <span className="font-bold">Parabéns!</span> Você já tem um bom conhecimento sobre a
          Umbanda, mas sempre há espaço para aprofundar e organizar melhor o que sabe.
        </p>
        <p className="text-lg text-foreground leading-relaxed mt-2">
          Com o{" "}
          <span className="text-primary font-bold underline decoration-2 underline-offset-4">
            Mapa Mental da Umbanda
          </span>
          , você pode expandir seus horizontes de forma fácil, didática, prática e clara.
        </p>
      </div>

      <div className="mb-6">
        <p className="text-xl font-extrabold text-foreground leading-tight">
          Você gostaria de ter acesso a um material que organizasse todo o conhecimento essencial da
          Umbanda em um só lugar?
        </p>
      </div>

      <div className="w-full space-y-3 mb-6">
        {leadOptions.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectOption(idx)}
            disabled={showExplanation}
            className={cn(
              "w-full flex items-center gap-4 p-4 bg-card rounded-2xl border-2 transition-all duration-200 text-left",
              selectedIndex === idx
                ? "border-primary bg-primary/5"
                : "border-primary/30 hover:border-primary hover:bg-primary/5",
              showExplanation && "cursor-default"
            )}
          >
            <img src={opt.image} alt="" className="w-12 h-12 object-contain flex-shrink-0" />
            <span className="text-lg font-semibold text-foreground flex-1">{opt.text}</span>
            {selectedIndex === idx && <Check className="w-5 h-5 text-primary shrink-0" />}
          </button>
        ))}
      </div>

      <div className="w-full mt-auto">
        <button onClick={onNext} className="btn-quiz w-full group">
          Ver Oferta Especial
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
