import React, { useEffect, useRef } from "react";
import { Mail, FileText, CheckCircle } from "lucide-react";
import { useBackgroundMusic } from "../BackgroundMusicProvider";

interface HowToReceiveStepProps {
  onNext: () => void;
}

export const HowToReceiveStep: React.FC<HowToReceiveStepProps> = ({ onNext }) => {
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
        } catch {
          // ignore
        }
      });
    })().catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [pauseForVideo, resumeAfterVideo]);

  return (
    <div className="flex-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 px-2">
      <h2 className="text-2xl font-black text-foreground mb-8">COMO VOU RECEBER?</h2>

      <div className="w-full space-y-4 mb-8">
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm text-left">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
            <p className="text-base font-semibold text-foreground leading-relaxed">
              Após confirmação do pagamento, um{" "}
              <span className="text-primary underline decoration-2 underline-offset-2">
                acesso individual será enviado ao seu e-mail para você baixar o seu aplicativo
              </span>{" "}
              e ter acesso ao conteúdo. Verifique CAIXA DE SPAM E LIXO ELETRÔNICO.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm text-left">
          <div className="flex items-start gap-4">
            <FileText className="w-6 h-6 text-primary shrink-0 mt-1" />
            <p className="text-base font-semibold text-foreground leading-relaxed">
              <span className="text-primary">O material é DIGITAL e em PDF.</span> Realize a
              impressão e encaderne ou estude nos seus dispositivos, como Computador, Tablet e
              Celular.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm text-left">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
            <p className="text-base font-semibold text-foreground leading-relaxed">
              <span className="text-primary">Pronto!</span> Agora inicie sua Jornada de conhecimento
              na Umbanda.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full mt-8 mb-8">
        <h3 className="text-xl font-black text-foreground mb-6 leading-tight">
          Veja abaixo uma{" "}
          <span className="underline decoration-2 underline-offset-2">PRÉVIA</span>: O Aplicativo do
          Mapa Mental da Umbanda que você irá OBTER ACESSO!
        </h3>

        <div className="w-full max-w-sm mx-auto mb-8">
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-lg"
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

        <h3 className="text-xl font-black text-black mb-6 leading-tight">
          Mapa Mental Impresso e Encadernado
        </h3>

        <div className="w-full max-w-sm mx-auto mb-6">
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-lg"
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

        <button onClick={onNext} className="btn-quiz w-full max-w-md mx-auto block">
          OK, entendi! Mas quanto custa?
        </button>
      </div>
    </div>
  );
};
