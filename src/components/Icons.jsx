// Small hand-drawn line-icon set (24x24, stroke=currentColor) used for the
// brand mark and the disease cards. Kept minimal/abstract rather than
// anatomically literal — they're navigational cues, not clinical illustrations.

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function SunIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.5 12H5M19 12h2.5M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

export function MoonIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" />
    </svg>
  );
}

export function DownloadIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

export function EyeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 3.5l17 17" />
      <path d="M10.6 5.7A10.4 10.4 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15.6 15.6 0 0 1-3.15 3.98M7.4 6.9C4.6 8.6 2.5 12 2.5 12s3.5 6.5 9.5 6.5a9.9 9.9 0 0 0 3.15-.52" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export function FileTextIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M8.5 12.5h7M8.5 15.5h7M8.5 9.5h2" />
    </svg>
  );
}

export function TrendingUpIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function PulseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}

function HeartIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20.5s-7.2-4.5-9.8-9.1C.6 8.6 1.6 5 4.7 3.9c2.1-.7 4.2.1 5.6 1.9l1.7 2.1 1.7-2.1c1.4-1.8 3.5-2.6 5.6-1.9 3.1 1.1 4.1 4.7 2.5 7.5-2.6 4.6-9.8 9.1-9.8 9.1z" />
    </svg>
  );
}

function DropletIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5s6.5 7.6 6.5 12.3a6.5 6.5 0 0 1-13 0C5.5 10.1 12 2.5 12 2.5z" />
    </svg>
  );
}

function TargetIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FunnelIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 4h16l-6.2 7.4v6.1l-3.6 2v-8.1z" />
    </svg>
  );
}

function FlaskIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10 3h4" />
      <path d="M10.5 3v5.8L5.8 17a2.2 2.2 0 0 0 1.9 3.3h8.6a2.2 2.2 0 0 0 1.9-3.3l-4.7-8.2V3" />
      <path d="M7.5 15h9" />
    </svg>
  );
}

export function ShieldIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v5.5c0 4.6-3 8.4-7 9.5-4-1.1-7-4.9-7-9.5V6z" />
      <path d="M9 12l2 2 4-4.5" />
    </svg>
  );
}

export function LayersIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l8 4.5-8 4.5-8-4.5z" />
      <path d="M4 12l8 4.5 8-4.5" />
      <path d="M4 16.5l8 4.5 8-4.5" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" />
    </svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h16" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

export function UploadIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 15V3" />
      <path d="M7 8l5-5 5 5" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function ClipboardIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 3.5h6a1 1 0 0 1 1 1V6H8V4.5a1 1 0 0 1 1-1z" />
      <path d="M8.5 11h7M8.5 15h7" />
    </svg>
  );
}

export function BookOpenIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 6.5c-1.6-1.2-3.8-1.8-6-1.8v13c2.2 0 4.4.6 6 1.8 1.6-1.2 3.8-1.8 6-1.8v-13c-2.2 0-4.4.6-6 1.8z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

export function SendIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 3L10.5 13.5" />
      <path d="M21 3l-6.5 18-4-8-8-4z" />
    </svg>
  );
}

export function DatabaseIcon(props) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
      <path d="M4.5 5.5v13c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13" />
      <path d="M4.5 12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8" />
    </svg>
  );
}

export function SparkleIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 3.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </svg>
  );
}

export function HomeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 11l8.5-7.5L20.5 11" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

export function LogOutIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function UserIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
    </svg>
  );
}

export function CheckCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.3l2.3 2.3 4.7-5.2" />
    </svg>
  );
}

export function AlertTriangleIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

export function HelpCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.4a2.7 2.7 0 0 1 5.2.9c0 1.9-2.5 1.8-2.5 3.6" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function BadgeCheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5l2.4 1.4 2.7-.4 1 2.5 2.5 1-.4 2.7 1.4 2.4-1.4 2.4.4 2.7-2.5 1-1 2.5-2.7-.4L12 21.5l-2.4-1.4-2.7.4-1-2.5-2.5-1 .4-2.7L2.4 12l1.4-2.4-.4-2.7 2.5-1 1-2.5 2.7.4z" />
      <path d="M9 12l2 2 4-4.5" />
    </svg>
  );
}

// Original line-art robot mascot for the chat assistant widget — rounded
// head with ear-like side bumps, a friendly face, and an antenna with a
// signal ping, echoing a "medical bot" without reproducing any specific
// stock illustration.
export function RobotIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v2.2" />
      <circle cx="12" cy="2.2" r="0.9" fill="currentColor" stroke="none" />
      <rect x="5" y="7" width="14" height="11" rx="5" />
      <path d="M3.5 11a2 2 0 0 1 0 4M20.5 11a2 2 0 0 1 0 4" />
      <circle cx="9" cy="12.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12.2" r="1" fill="currentColor" stroke="none" />
      <path d="M9 15.3c.9.7 2.1.7 3 0" />
      <path d="M12 18v2.3M9.3 20.3h5.4" />
    </svg>
  );
}

export function DoctorIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3v4.2a2.6 2.6 0 0 0 5.2 0V3" />
      <path d="M8.6 9.8V13a4.6 4.6 0 0 0 9.2 0v-2.3" />
      <circle cx="17.8" cy="9.3" r="1.7" />
      <circle cx="8.6" cy="18.7" r="2.3" />
    </svg>
  );
}

// Chatbot mascot — a small illustrative robot, not part of the base
// 24x24/currentColor line-icon set above. Uses its own gradients/fixed
// palette (glossy "3D" plastic look) since a single-stroke line icon reads
// as too flat/generic for a launcher button meant to feel like a character,
// not a navigational glyph.
export function ChatbotMascotIcon({ width = 64, height = 64, ...props }) {
  return (
    <svg viewBox="0 0 100 100" width={width} height={height} {...props}>
      <defs>
        <linearGradient id="mascotHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F1F0FE" />
          <stop offset="1" stopColor="#A7A2EE" />
        </linearGradient>
        <linearGradient id="mascotBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DDDAFB" />
          <stop offset="1" stopColor="#7A72E3" />
        </linearGradient>
        <linearGradient id="mascotFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A3A55" />
          <stop offset="1" stopColor="#191927" />
        </linearGradient>
        <radialGradient id="mascotRing" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#EF4444" stopOpacity="0" />
          <stop offset="0.75" stopColor="#EF4444" stopOpacity="0.9" />
          <stop offset="1" stopColor="#EF4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* antenna + signal rings */}
      <circle cx="50" cy="20" r="15" fill="url(#mascotRing)" opacity="0.7" />
      <circle cx="50" cy="20" r="9" fill="url(#mascotRing)" opacity="0.85" />
      <line x1="50" y1="20" x2="50" y2="34" stroke="#37374A" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="50" cy="18" r="4.2" fill="#EF4444" />
      <circle cx="48.5" cy="16.5" r="1.3" fill="#FCA5A5" />

      {/* ears */}
      <ellipse cx="18" cy="47" rx="7" ry="9" fill="url(#mascotHead)" stroke="#8B85D9" strokeWidth="1" />
      <ellipse cx="82" cy="47" rx="7" ry="9" fill="url(#mascotHead)" stroke="#8B85D9" strokeWidth="1" />

      {/* head */}
      <path d="M22 46a28 24 0 0 1 56 0v6a28 22 0 0 1-56 0z" fill="url(#mascotHead)" stroke="#7A72E3" strokeWidth="1.3" />
      <ellipse cx="38" cy="30" rx="11" ry="5" fill="#FFFFFF" opacity="0.45" />

      {/* face plate */}
      <path d="M32 44a18 13 0 0 1 36 0v4a18 12 0 0 1-36 0z" fill="url(#mascotFace)" />
      <ellipse cx="41" cy="46" rx="4.4" ry="5.6" fill="#8FF3E0" />
      <ellipse cx="59" cy="46" rx="4.4" ry="5.6" fill="#8FF3E0" />
      <ellipse cx="41" cy="44.3" rx="1.6" ry="2" fill="#FFFFFF" />
      <ellipse cx="59" cy="44.3" rx="1.6" ry="2" fill="#FFFFFF" />
      <path d="M43 55.5c4.2 3 9.8 3 14 0" stroke="#8FF3E0" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* arms */}
      <path d="M23 76c-6 1-10 5-10 11" stroke="#5B54C9" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="12.5" cy="88" r="5.4" fill="url(#mascotBody)" stroke="#7A72E3" strokeWidth="1" />
      <path d="M78 76c7-2 13-9 12-18" stroke="#5B54C9" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="90.5" cy="57" r="5.6" fill="url(#mascotBody)" stroke="#7A72E3" strokeWidth="1" />

      {/* body */}
      <path d="M27 72c0-5 10-10 23-10s23 5 23 10v6c0 12-10.3 21-23 21S27 90 27 78z"
            fill="url(#mascotBody)" stroke="#5B54C9" strokeWidth="1.3" />
      <ellipse cx="40" cy="70" rx="9" ry="3.4" fill="#FFFFFF" opacity="0.35" />
      <circle cx="63" cy="72" r="1.7" fill="#4B4498" opacity="0.6" />
      <circle cx="68" cy="76" r="1.7" fill="#4B4498" opacity="0.6" />

      {/* medical cross badge */}
      <rect x="41" y="76" width="18" height="18" rx="5" fill="#EF4444" />
      <rect x="48.3" y="79.3" width="3.4" height="11.4" rx="1.2" fill="#FFFFFF" />
      <rect x="44.3" y="83.3" width="11.4" height="3.4" rx="1.2" fill="#FFFFFF" />
    </svg>
  );
}

const DISEASE_ICONS = {
  heart: HeartIcon,
  diabetes: DropletIcon,
  breast_cancer: TargetIcon,
  kidney: FunnelIcon,
  liver: FlaskIcon,
};

export function DiseaseIcon({ disease, ...props }) {
  const Cmp = DISEASE_ICONS[disease] || HeartIcon;
  return <Cmp {...props} />;
}
