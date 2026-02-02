import { useEffect, useRef } from "react";

interface LottiePlayerProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

/**
 * LottiePlayer - Componente para renderizar animações Lottie
 * Usa o pacote @dotlottie/player-component
 */
const LottiePlayer = ({
  src,
  className = "",
  loop = true,
  autoplay = true,
}: LottiePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carrega o script do DotLottie Player se ainda não estiver carregado
    const scriptId = "dotlottie-player-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
      script.type = "module";
      document.head.appendChild(script);
    }

    // Cria o elemento dotlottie-player
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      const player = document.createElement("dotlottie-player");
      player.setAttribute("src", src);
      player.setAttribute("background", "transparent");
      player.setAttribute("speed", "1");
      player.style.width = "100%";
      player.style.height = "100%";

      if (loop) {
        player.setAttribute("loop", "");
      }
      if (autoplay) {
        player.setAttribute("autoplay", "");
      }

      containerRef.current.appendChild(player);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [src, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center ${className}`}
    />
  );
};

export default LottiePlayer;
