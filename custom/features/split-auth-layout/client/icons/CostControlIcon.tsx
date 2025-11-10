/**
 * CUSTOM: gptchina fork
 * Cost Control Icon
 * Represents cost savings and financial control
 */

export function CostControlIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 6v12M15 9h-4.5a1.5 1.5 0 000 3h3a1.5 1.5 0 010 3H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
