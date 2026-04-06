import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function ReactiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme !== "light") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let mouseX = width / 2;
    let mouseY = height / 2;

    const gridSize = 40;
    const maxDistance = 200;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Extract colors from theme
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').split(' ').join('');
      const primaryHSL = `hsl(${primaryColor})`;

      ctx.lineWidth = 0.5;

      for (let x = 0; x <= width; x += gridSize) {
        for (let y = 0; y <= height; y += gridSize) {
          const dx = mouseX - x;
          const dy = mouseY - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const intensity = (1 - distance / maxDistance) * 0.15;
            ctx.strokeStyle = `hsla(${primaryColor}, ${intensity})`;
            
            // Distort slightly towards mouse
            const offsetX = (dx / distance) * (intensity * 20);
            const offsetY = (dy / distance) * (intensity * 20);

            ctx.beginPath();
            ctx.moveTo(x + offsetX, y + offsetY - 5);
            ctx.lineTo(x + offsetX, y + offsetY + 5);
            ctx.moveTo(x + offsetX - 5, y + offsetY);
            ctx.lineTo(x + offsetX + 5, y + offsetY);
            ctx.stroke();
          } else {
            ctx.strokeStyle = `hsla(${primaryColor}, 0.03)`;
            ctx.beginPath();
            ctx.moveTo(x, y - 2);
            ctx.lineTo(x, y + 2);
            ctx.moveTo(x - 2, y);
            ctx.lineTo(x + 2, y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  if (theme !== "light") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] opacity-50"
    />
  );
}
