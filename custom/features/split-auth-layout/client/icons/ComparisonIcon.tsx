/**
 * CUSTOM: gptchina fork
 * ComparisonIcon Component
 * Icon for Model Comparison feature - represents side-by-side comparison
 */

export function ComparisonIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v12a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18V6z"
      />
    </svg>
  );
}
