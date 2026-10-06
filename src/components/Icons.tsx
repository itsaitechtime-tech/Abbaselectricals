import type { IconKey } from "@/lib/catalog";

export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43m8.03-17.46A11.28 11.28 0 0 0 12.05.72C5.8.72.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.62l6.03-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.25 0 11.34-5.09 11.34-11.35 0-3.03-1.18-5.88-3.32-8.03" />
    </svg>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Simple line icons for product categories (used where no real photo exists). */
export function CategoryIcon({ icon, className = "h-12 w-12" }: { icon: IconKey; className?: string }) {
  const common = {
    viewBox: "0 0 48 48",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (icon) {
    case "downlight":
      return (
        <svg {...common}>
          <path d="M6 14h36" />
          <path d="M13 14v4a11 4 0 0 0 22 0v-4" />
          <ellipse cx="24" cy="18" rx="6" ry="2" />
          <path d="M18 24l-5 14M30 24l5 14M24 25v14" strokeDasharray="2 3" />
        </svg>
      );
    case "track":
      return (
        <svg {...common}>
          <path d="M4 10h40M4 13h40" />
          <path d="M14 13v5M34 13v5" />
          <rect x="9" y="18" width="10" height="14" rx="2" transform="rotate(-18 14 25)" />
          <rect x="29" y="18" width="10" height="14" rx="2" transform="rotate(18 34 25)" />
        </svg>
      );
    case "linear":
      return (
        <svg {...common}>
          <path d="M8 18h32v8H8z" />
          <path d="M8 22h32" />
          <path d="M11 26v2h26v-2" />
          <path d="M14 32l-2 6M24 32v6M34 32l2 6" strokeDasharray="2 3" />
        </svg>
      );
    case "strip":
      return (
        <svg {...common}>
          <path d="M6 30c6-10 12-10 18 0s12 10 18 0" />
          <path d="M6 24c6-10 12-10 18 0s12 10 18 0" />
          <circle cx="11" cy="22.5" r="1" />
          <circle cx="18" cy="19.5" r="1" />
          <circle cx="29" cy="30" r="1" />
          <circle cx="36" cy="30.5" r="1" />
        </svg>
      );
    case "pendant":
      return (
        <svg {...common}>
          <path d="M14 6v14M34 6v14" />
          <path d="M8 20h32v6H8z" />
          <path d="M14 30l-2 8M24 30v8M34 30l2 8" strokeDasharray="2 3" />
        </svg>
      );
    case "emergency":
      return (
        <svg {...common}>
          <rect x="6" y="14" width="36" height="18" rx="2" />
          <circle cx="17" cy="19" r="1.6" />
          <path d="M17 21l-2 4 3 2M17 21l3 3 3-1M15 25l-3 3" />
          <path d="M28 23h8M33 20l3 3-3 3" />
        </svg>
      );
    case "washer":
      return (
        <svg {...common}>
          <path d="M8 36h32v5H8z" />
          <path d="M12 34l-4-24M20 34l-2-24M28 34l2-24M36 34l4-24" strokeDasharray="2 3" />
        </svg>
      );
    case "inground":
      return (
        <svg {...common}>
          <path d="M4 32h40" />
          <path d="M18 32v5h12v-5" />
          <path d="M20 29l-5-18M28 29l5-18M24 29V9" strokeDasharray="2 3" />
        </svg>
      );
    case "bollard":
      return (
        <svg {...common}>
          <path d="M18 42h12M20 42V16h8v26" />
          <path d="M18 12h12v4H18z" />
          <path d="M12 10l-4-2M36 10l4-2M24 8V4" strokeDasharray="2 2" />
        </svg>
      );
    case "rgb":
      return (
        <svg {...common}>
          <circle cx="19" cy="20" r="8" />
          <circle cx="29" cy="20" r="8" />
          <circle cx="24" cy="29" r="8" />
        </svg>
      );
    case "neon":
      return (
        <svg {...common}>
          <path d="M8 34c0-14 8-20 16-20s16 6 16 20" />
          <path d="M12 34c0-11 6-16 12-16s12 5 12 16" />
          <path d="M8 34h4M36 34h4" />
        </svg>
      );
    case "driver":
      return (
        <svg {...common}>
          <rect x="6" y="14" width="36" height="20" rx="2" />
          <path d="M11 34v4M16 34v4M32 34v4M37 34v4" />
          <path d="M25 18l-4 7h6l-4 7" />
        </svg>
      );
    case "control":
      return (
        <svg {...common}>
          <rect x="8" y="10" width="32" height="28" rx="3" />
          <path d="M16 16v16M24 16v16M32 16v16" />
          <path d="M13.5 22h5M21.5 28h5M29.5 19h5" />
        </svg>
      );
    case "accessory":
      return (
        <svg {...common}>
          <path d="M10 20h18v8H10z" />
          <path d="M28 18h6v12h-6" />
          <path d="M34 22h6M34 26h6" />
          <path d="M14 20v8M18 20v8" />
        </svg>
      );
    case "breaker":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="32" height="32" rx="2" />
          <path d="M8 16h32M8 32h32" />
          <rect x="13" y="20" width="4" height="8" />
          <rect x="22" y="20" width="4" height="8" />
          <rect x="31" y="20" width="4" height="8" />
        </svg>
      );
    case "socket":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="32" height="32" rx="4" />
          <path d="M18 18v5M30 18v5M24 29v5" />
        </svg>
      );
    case "tap":
      return (
        <svg {...common}>
          <path d="M10 22h16a6 6 0 0 1 6 6v4" />
          <path d="M10 18v8M18 14h-4M16 14v8" />
          <path d="M32 36v2" />
        </svg>
      );
    case "shower":
      return (
        <svg {...common}>
          <path d="M10 40V14a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
          <path d="M20 16h12" />
          <path d="M22 22v2M26 22v2M30 22v2M24 28v2M28 28v2" />
        </svg>
      );
    case "basin":
      return (
        <svg {...common}>
          <path d="M8 22h32a16 12 0 0 1-32 0z" />
          <path d="M24 22v-8h6" />
          <path d="M20 34v6h8v-6" />
        </svg>
      );
    case "wc":
      return (
        <svg {...common}>
          <rect x="12" y="8" width="16" height="12" rx="2" />
          <path d="M10 20h28a14 12 0 0 1-14 12h-6l2 8h-8z" />
        </svg>
      );
    case "streetlight":
      return (
        <svg {...common}>
          <path d="M14 42V12a4 4 0 0 1 4-4h12" />
          <path d="M26 8h12l-2 5H28z" />
          <path d="M10 42h8" />
        </svg>
      );
    case "heater":
      return (
        <svg {...common}>
          <rect x="14" y="6" width="20" height="32" rx="6" />
          <path d="M20 42v-4M28 42v-4" />
          <circle cx="24" cy="16" r="2.5" />
        </svg>
      );
    case "cistern":
      return (
        <svg {...common}>
          <rect x="10" y="10" width="28" height="18" rx="2" />
          <rect x="18" y="15" width="5" height="8" rx="1" />
          <rect x="25" y="15" width="5" height="8" rx="1" />
          <path d="M24 28v12" />
        </svg>
      );
    case "towel":
      return (
        <svg {...common}>
          <path d="M8 12h32" />
          <path d="M14 12v24h20V12" />
          <path d="M14 30h20" />
        </svg>
      );
  }
}
