"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  DataTable,
  Field,
  Modal,
  PageHeader,
  Section,
  Select,
  TextArea,
  TextInput,
  Toolbar,
  ToggleRow,
  type Column
} from "@/components/admin/primitives";
import { Badge } from "@/components/ui/Badge";
import { useContentStore } from "@/lib/store/content-store";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { toast } from "@/components/ui/Toaster";
import type { Course } from "@/lib/ecosystem";
import { sanitizeText } from "@/lib/security/sanitize";

export default function AdminCoursesPage() {
  const courses = useContentStore((s) => s.courses);
  const upsert = useContentStore((s) => s.upsertCourse);
  const remove = useContentStore((s) => s.removeCourse);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<Course | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [confirming, setConfirming] = React.useState<Course | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) =>
      q ? [c.title, c.subtitle, c.instructor].some((v) => v.toLowerCase().includes(q)) : true
    );
  }, [courses, query]);

  const columns: Column<Course>[] = [
    {
      key: "title",
      label: "Course",
      render: (c) => (
        <div className="flex items-center gap-3">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[10px] font-medium text-white"
            style={{
              background: `linear-gradient(135deg, ${c.gradient[0]}55, ${c.gradient[1]}33)`
            }}
          >
            {c.title.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium text-primary">{c.title}</span>
              {c.isNew ? <Badge tone="secondary">New</Badge> : null}
            </div>
            <div className="mt-0.5 truncate text-[12px] text-primary/60">{c.subtitle}</div>
          </div>
        </div>
      )
    },
    { key: "level", label: "Level", render: (c) => <Badge tone="mute">{c.level}</Badge> },
    { key: "lessons", label: "Lessons", render: (c) => <span className="text-primary/80">{c.lessons}</span> },
    { key: "duration", label: "Duration", render: (c) => <span className="text-primary-muted">{c.duration}</span> },
    { key: "instructor", label: "Instructor", render: (c) => <span className="text-primary/80">{c.instructor}</span> },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(c);
            }}
            title="Edit"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-white/[0.14] hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(c);
            }}
            title="Delete"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-red-400/30 hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Content · Courses"
        title="Courses"
        description="Publish and curate the Aether learning path."
        actions={
          <button
            onClick={() => setCreating(true)}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-grad-cta px-4 text-[13px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" />
            New course
          </button>
        }
      />

      <Section title="All courses">
        <Toolbar search={query} onSearch={setQuery} placeholder="Search courses…" />
        <div className="mt-5">
          <DataTable columns={columns} rows={filtered} onRowClick={(c) => setEditing(c)} />
        </div>
      </Section>

      <CourseEditor
        open={creating || !!editing}
        mode={creating ? "create" : "edit"}
        initial={editing ?? undefined}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={(c) => {
          const clean: Course = {
            ...c,
            title: sanitizeText(c.title, 120),
            subtitle: sanitizeText(c.subtitle, 280),
            instructor: sanitizeText(c.instructor, 80)
          };
          upsert(clean);
          logEvent({
            actor,
            action: `${creating ? "Added" : "Updated"} course: ${clean.title}`,
            severity: "info"
          });
          toast({ title: creating ? "Course added" : "Course updated", tone: "success" });
          setCreating(false);
          setEditing(null);
        }}
      />

      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title="Delete this course?"
        footer={
          <>
            <button
              onClick={() => setConfirming(null)}
              className="h-10 rounded-full border border-white/[0.08] bg-transparent px-5 text-[13px] text-primary-muted hover:text-primary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!confirming) return;
                remove(confirming.id);
                logEvent({ actor, action: `Deleted course: ${confirming.title}`, severity: "warn" });
                toast({ title: "Course deleted", tone: "warn" });
                setConfirming(null);
              }}
              className="h-10 rounded-full bg-red-500/15 px-5 text-[13px] font-medium text-red-200 hover:bg-red-500/25"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="text-[13px] text-primary/70">
          <span className="font-medium text-primary">{confirming?.title}</span>
        </div>
      </Modal>
    </div>
  );
}

function CourseEditor({
  open,
  mode,
  initial,
  onClose,
  onSubmit
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Course;
  onClose: () => void;
  onSubmit: (c: Course) => void;
}) {
  const empty: Course = {
    id: `c-${Date.now().toString(36)}`,
    title: "",
    subtitle: "",
    level: "Beginner",
    duration: "2h 30m",
    lessons: 12,
    instructor: "Aether Research",
    gradient: ["#7C8CFF", "#5CE1E6"],
    isNew: true
  };
  const [c, setC] = React.useState<Course>(empty);
  React.useEffect(() => {
    if (!open) return;
    setC(initial ? { ...initial } : { ...empty, id: `c-${Date.now().toString(36)}` });
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  function patch<K extends keyof Course>(k: K, v: Course[K]) {
    setC((prev) => ({ ...prev, [k]: v }));
  }

  const canSave = c.title.length >= 4 && c.subtitle.length >= 8;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New course" : "Edit course"}
      size="md"
      footer={
        <>
          <button
            onClick={onClose}
            className="h-10 rounded-full border border-white/[0.08] bg-transparent px-5 text-[13px] text-primary-muted hover:text-primary"
          >
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={() => onSubmit(c)}
            className={
              "h-10 rounded-full px-5 text-[13px] font-medium " +
              (canSave
                ? "bg-grad-cta text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
                : "cursor-not-allowed bg-white/[0.05] text-primary-muted")
            }
          >
            {mode === "create" ? "Add" : "Save"}
          </button>
        </>
      }
    >
      <Field label="Title">
        <TextInput value={c.title} onChange={(e) => patch("title", e.target.value)} />
      </Field>
      <div className="mt-4">
        <Field label="Subtitle">
          <TextArea rows={2} value={c.subtitle} onChange={(e) => patch("subtitle", e.target.value)} />
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Level">
          <Select value={c.level} onChange={(e) => patch("level", e.target.value as Course["level"])}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </Select>
        </Field>
        <Field label="Duration">
          <TextInput value={c.duration} onChange={(e) => patch("duration", e.target.value)} />
        </Field>
        <Field label="Lessons">
          <TextInput
            type="number"
            value={c.lessons}
            onChange={(e) => patch("lessons", Number(e.target.value))}
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Instructor">
          <TextInput value={c.instructor} onChange={(e) => patch("instructor", e.target.value)} />
        </Field>
      </div>
      <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5">
        <ToggleRow
          label="New"
          description="Shows a New badge in the catalogue."
          checked={!!c.isNew}
          onChange={(v) => patch("isNew", v)}
        />
      </div>
    </Modal>
  );
}
