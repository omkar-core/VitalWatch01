import type { SVGProps } from "react";

export function VitalWatchLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3.5 16.5A2.5 2.5 0 0 1 6 19a2.5 2.5 0 0 1 2.5-2.5" />
      <path d="M3.5 16.5A2.5 2.5 0 0 0 1 19a2.5 2.5 0 0 0 2.5-2.5" />
      <path d="M15 4.5A2.5 2.5 0 0 1 17.5 7a2.5 2.5 0 0 1 2.5-2.5" />
      <path d="M15 4.5A2.5 2.5 0 0 0 12.5 7a2.5 2.5 0 0 0 2.5-2.5" />
      <path d="M8.5 19V7" />
      <path d="M17.5 7v10" />
      <path d="M6 9.5h3" />
      <path d="M15 11.5h3" />
      <path d="M6 14.5h3" />
      <path d="M15 16.5h3" />
    </svg>
  );
}
