import { useEffect, useState, useCallback } from 'react';

interface TrailDot {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

/**
 * CursorTrail - Componente que cria um efeito de trilha do cursor
 * Adiciona um efeito visual elegante quando o cursor se move pela página
 */
const CursorTrail = () => {
  const [trails, setTrails] = useState<TrailDot[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newTrail: TrailDot = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      opacity: 1
    };

    setTrails(prev => [...prev.slice(-8), newTrail]);
  }, []);

  useEffect(() => {
    // Verifica se é um dispositivo touch (não mostra em mobile)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsVisible(false);
      return;
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // Remove trails antigos
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails(prev => 
        prev
          .map(trail => ({ ...trail, opacity: trail.opacity - 0.15 }))
          .filter(trail => trail.opacity > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="absolute rounded-full bg-[#4F98A7] pointer-events-none"
          style={{
            left: trail.x - 4,
            top: trail.y - 4,
            width: 8 - index * 0.5,
            height: 8 - index * 0.5,
            opacity: trail.opacity * 0.4,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.1s ease-out'
          }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;
