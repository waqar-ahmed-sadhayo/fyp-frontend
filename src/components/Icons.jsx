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

export function DownloadIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
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
