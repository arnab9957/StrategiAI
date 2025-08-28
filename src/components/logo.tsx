import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 28"
      aria-label="StrategiAI logo"
      {...props}
    >
      <text
        x="0"
        y="22"
        fontFamily="'Inter', sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="currentColor"
      >
        Strategi
        <tspan fill="hsl(var(--primary))">AI</tspan>
      </text>
    </svg>
  );
}
