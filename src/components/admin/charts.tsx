"use client";

import * as React from "react";

/**
 * Zero-dependency SVG charts tuned to the Aether visual language.
 * Just what we need for the admin: area trend, bar, donut, sparkline.
 */

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function AreaChart({
  data,
  width = 560,
  height = 200,
  color = "#7C8CFF",
  secondary = "#5CE1E6",
  ariaLabel
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  secondary?: string;
  ariaLabel?: string;
}) {
  const pad = { top: 14, right: 12, bottom: 22, left: 28 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(1, max - min);
  const points = data.map((v, i) => ({
    x: pad.left + (i / Math.max(1, data.length - 1)) * w,
    y: pad.top + h - ((v - min) / range) * h
  }));
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${pad.left + w} ${pad.top + h} L ${pad.left} ${pad.top + h} Z`;
  const gradId = React.useId();

  // Axis values (quartiles)
  const qs = [0, 1, 2, 3, 4].map((i) => min + (range * i) / 4);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      role="img"
      aria-label={ariaLabel ?? "Area chart"}
      className="block"
    >
      <defs>
        <linearGradient id={`grad-${gradId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`stroke-${gradId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
      </defs>
      {/* Horizontal gridlines */}
      {qs.map((q, i) => {
        const y = pad.top + h - ((q - min) / range) * h;
        return (
          <g key={i}>
            <line
              x1={pad.left}
              x2={pad.left + w}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="2 3"
            />
            <text
              x={pad.left - 6}
              y={y + 3}
              fontSize="9"
              fill="rgba(156,163,175,0.7)"
              textAnchor="end"
            >
              {Math.round(q).toLocaleString()}
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill={`url(#grad-${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={`url(#stroke-${gradId})`}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Endpoint */}
      {points.length ? (
        <g>
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="4"
            fill={secondary}
          />
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="8"
            fill={secondary}
            opacity="0.2"
          />
        </g>
      ) : null}
    </svg>
  );
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  color = "#7C8CFF"
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(1, max - min);
  const points = data.map((v, i) => ({
    x: (i / Math.max(1, data.length - 1)) * width,
    y: height - ((v - min) / range) * height
  }));
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden>
      <path d={smoothPath(points)} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BarChart({
  labels,
  values,
  height = 200,
  color = "#7C8CFF"
}: {
  labels: string[];
  values: number[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(...values, 1);
  const gradId = React.useId();
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${labels.length * 50} ${height}`} width="100%" height={height}>
        <defs>
          <linearGradient id={`bar-${gradId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.25" />
          </linearGradient>
        </defs>
        {values.map((v, i) => {
          const h = (v / max) * (height - 32);
          const x = i * 50 + 12;
          const y = height - h - 18;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={26}
                height={h}
                rx="6"
                fill={`url(#bar-${gradId})`}
              />
              <text
                x={x + 13}
                y={height - 4}
                fontSize="9"
                fill="rgba(156,163,175,0.75)"
                textAnchor="middle"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Donut({
  value,
  max = 100,
  size = 132,
  stroke = 10,
  label,
  sub
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  label: string;
  sub?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  const dash = `${pct * c} ${c}`;
  const gradId = React.useId();
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          <linearGradient id={`donut-${gradId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C8CFF" />
            <stop offset="100%" stopColor="#5CE1E6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#donut-${gradId})`}
          strokeWidth={stroke}
          strokeDasharray={dash}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: "drop-shadow(0 0 10px rgba(124,140,255,0.35))" }}
        />
        <text
          x={size / 2}
          y={size / 2 + 2}
          textAnchor="middle"
          fontSize="18"
          fill="#F5F7FF"
          fontFamily="var(--font-space-grotesk)"
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <div className="text-[13px]">
        <div className="text-primary">{label}</div>
        {sub ? <div className="mt-0.5 text-[12px] text-primary/60">{sub}</div> : null}
      </div>
    </div>
  );
}
