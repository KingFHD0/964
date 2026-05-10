"use client";

import { motion } from "framer-motion";
import { GraduationCap, PlayCircle, Sparkles } from "lucide-react";
import { COURSES } from "@/lib/ecosystem";
import { Badge } from "@/components/ui/Badge";

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Courses</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        Learn the craft, quietly.
      </h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        From prompt craft to production systems, paced for operators who ship.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c, i) => (
          <motion.article
            id={c.id}
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: Math.min(i, 8) * 0.04,
              ease: [0.2, 0.8, 0.2, 1]
            }}
            className="card-premium group relative flex h-full flex-col overflow-hidden lift ring-accent-hover"
          >
            <div className="relative h-36 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${c.gradient[0]}4A 0%, ${c.gradient[1]}22 60%, #0B1020 100%)`
                }}
              />
              <svg
                className="absolute -right-10 -top-10 h-[240px] w-[240px] opacity-45 transition-opacity duration-700 group-hover:opacity-80"
                viewBox="0 0 400 400"
                fill="none"
                aria-hidden
              >
                <circle cx="200" cy="200" r="170" stroke={c.gradient[0]} strokeOpacity="0.4" />
                <circle cx="200" cy="200" r="110" stroke={c.gradient[1]} strokeOpacity="0.35" />
                <circle cx="360" cy="200" r="3" fill={c.gradient[1]} />
              </svg>
              <div className="absolute left-5 top-5 flex items-center gap-2">
                <Badge tone="mute">{c.level}</Badge>
                {c.isNew ? <Badge tone="secondary">New</Badge> : null}
              </div>
              <div className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full border border-white/[0.15] bg-black/35 text-primary/90 backdrop-blur-md transition-colors group-hover:border-accent/60 group-hover:text-accent">
                <PlayCircle className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-[18px] font-medium leading-snug tracking-tight text-primary">
                {c.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-primary/60">{c.subtitle}</p>

              <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-[12px] text-primary-muted">
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {c.lessons} lessons
                </span>
                <span>{c.duration}</span>
              </div>
              <div className="mt-3 text-[12px] text-primary/70">
                <Sparkles className="mr-1 inline h-3 w-3 text-accent-secondary" />
                {c.instructor}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
