"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Download,
  Edit3,
  FileText,
  Flag,
  GitBranch,
  GraduationCap,
  ListTodo,
  Plus,
  Save,
  Search,
  ShieldAlert,
  Trash2,
  Wrench,
  X
} from "lucide-react";
import { Button, Card, EmptyState, Input, ProgressBar, Select, Textarea, Badge } from "@/components/ui";
import type { FieldConfig, ModuleConfig } from "@/lib/module-config";

type Row = Record<string, unknown> & { id: string };
type Option = { id: string; label: string };
type Relations = {
  phases: Option[];
  weeklyPlans: Option[];
  projects: Option[];
  dailyLogs: Option[];
};

export function TrackerPage({
  module,
  initialRows,
  relations
}: {
  module: ModuleConfig;
  initialRows: Row[];
  relations: Relations;
}) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const pageSize = 12;

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery = module.searchable.some((field) =>
        String(row[field] ?? "")
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      const matchesStatus = status === "all" || String(row[module.statusField ?? "status"] ?? "") === status;
      return (!query || matchesQuery) && matchesStatus;
    });
  }, [module, query, rows, status]);

  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const statusOptions = Array.from(new Set(rows.map((row) => String(row[module.statusField ?? "status"] ?? "")).filter(Boolean)));
  const ModuleIcon = iconByName(module.iconName);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="flex items-center gap-3">
            <ModuleIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">{module.title}</h1>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{module.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" asChild>
            <a href={`/api/export/${module.key}`}>
              <Download className="h-4 w-4" />
              Export
            </a>
          </Button>
          <Button onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" />
            Add record
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className="pl-9"
              placeholder={`Search ${module.title.toLowerCase()}...`}
            />
          </div>
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            disabled={!module.statusField}
          >
            <option value="all">All statuses</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {visible.length ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  {module.tableFields.map((field) => (
                    <th key={field} className="px-4 py-3 font-medium">
                      {labelize(field)}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row.id} className="border-t">
                    {module.tableFields.map((field) => (
                      <td key={field} className="max-w-[320px] px-4 py-3 align-top">
                        <FieldValue value={row[field]} field={field} progress={field === module.progressField} />
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <InlineUpdate row={row} module={module} onRows={setRows} />
                        <Button variant="ghost" size="icon" onClick={() => setEditing(row)} aria-label="Edit">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <DeleteButton row={row} module={module} onRows={setRows} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>
              Showing {visible.length} of {filtered.length}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <EmptyState title="No records match this view" description="Create a record or adjust the search and filters." />
      )}

      {(editing || creating) && (
        <RecordForm
          module={module}
          record={editing}
          relations={relations}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={(record) => {
            setRows((current) =>
              editing ? current.map((row) => (row.id === record.id ? record : row)) : [record, ...current]
            );
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function iconByName(name: string) {
  const icons = {
    BookOpen,
    CalendarCheck,
    CheckCircle2,
    ClipboardCheck,
    Code2,
    FileText,
    Flag,
    GitBranch,
    GraduationCap,
    ListTodo,
    ShieldAlert,
    Wrench
  } as const;
  return icons[name as keyof typeof icons] ?? Flag;
}

function RecordForm({
  module,
  record,
  relations,
  onClose,
  onSaved
}: {
  module: ModuleConfig;
  record: Row | null;
  relations: Relations;
  onClose: () => void;
  onSaved: (record: Row) => void;
}) {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, formState } = useForm<Record<string, unknown>>({
    defaultValues: module.fields.reduce<Record<string, unknown>>((acc, field) => {
      acc[field.name] = formatDefault(record?.[field.name], field);
      return acc;
    }, {})
  });

  const submit = handleSubmit((data) => {
    startTransition(async () => {
      const response = await fetch(`/api/records/${module.model}`, {
        method: record ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(record ? { id: record.id, ...data } : data)
      });
      const payload = (await response.json()) as Row | { error?: string };
      if (!response.ok || "error" in payload) {
        toast.error("Save failed", {
          description: "error" in payload ? String(payload.error ?? "Check the form values.") : "Check the form values."
        });
        return;
      }
      toast.success("Record saved");
      onSaved(payload as Row);
    });
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg border bg-card shadow-command">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold">{record ? "Edit" : "Add"} {module.title}</h2>
            <p className="text-sm text-muted-foreground">Manual date fields remain blank unless you enter them.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={submit} className="max-h-[calc(90vh-73px)] overflow-y-auto p-5">
          <div className="grid gap-4 md:grid-cols-2">
            {module.fields.map((field) => (
              <label key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                <span className="mb-1.5 block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive"> *</span>}
                </span>
                <FieldInput field={field} register={register} relations={relations} />
                {formState.errors[field.name] && (
                  <span className="mt-1 block text-xs text-destructive">This field is required.</span>
                )}
              </label>
            ))}
          </div>
          <div className="sticky bottom-0 mt-5 flex justify-end gap-2 border-t bg-card pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={pending}>
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldInput({
  field,
  register,
  relations
}: {
  field: FieldConfig;
  register: ReturnType<typeof useForm<Record<string, unknown>>>["register"];
  relations: Relations;
}) {
  const validation = field.required ? { required: true } : undefined;
  if (field.type === "textarea") return <Textarea {...register(field.name, validation)} placeholder={field.placeholder} />;
  if (field.type === "select") {
    return (
      <Select {...register(field.name, validation)}>
        <option value="">Select...</option>
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    );
  }
  if (field.type === "relation") {
    const options =
      field.relation === "phase"
        ? relations.phases
        : field.relation === "project"
          ? relations.projects
          : field.relation === "dailyLog"
            ? relations.dailyLogs
            : relations.weeklyPlans;
    return (
      <Select {...register(field.name, validation)}>
        <option value="">None</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }
  if (field.type === "boolean") return <input type="checkbox" className="h-5 w-5 accent-primary" {...register(field.name)} />;
  return (
    <Input
      type={field.type === "date" ? "date" : field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
      step={field.type === "number" ? "0.1" : undefined}
      {...register(field.name, validation)}
    />
  );
}

function FieldValue({ value, field, progress }: { value: unknown; field: string; progress: boolean }) {
  if (typeof value === "boolean") return <Badge tone={value ? "default" : "muted"}>{value ? "Yes" : "No"}</Badge>;
  if (progress && typeof value === "number") {
    return (
      <div className="min-w-32 space-y-1">
        <div className="text-xs text-muted-foreground">{value}%</div>
        <ProgressBar value={value} />
      </div>
    );
  }
  if (field.toLowerCase().includes("date") || field === "createdAt") {
    return <span>{value ? new Date(String(value)).toLocaleDateString() : "Blank"}</span>;
  }
  if (field.toLowerCase().includes("url") && value) {
    const href = safeDisplayUrl(value);
    if (!href) return <Badge tone="danger">Unsafe URL</Badge>;
    return (
      <a className="text-primary underline-offset-4 hover:underline" href={href} target="_blank" rel="noreferrer">
        Open
      </a>
    );
  }
  const text = String(value ?? "Blank");
  const tone = text === "Blocked" || text === "Missing" || text === "Issue" ? "danger" : text === "Complete" || text === "Verified" || text === "Published" ? "default" : "muted";
  if (["status", "priority", "dailyProofStatus", "verificationStatus"].some((part) => field.includes(part) || field === part)) {
    return <Badge tone={tone}>{text}</Badge>;
  }
  return <span className="line-clamp-3 text-muted-foreground">{text}</span>;
}

function safeDisplayUrl(value: unknown) {
  try {
    const url = new URL(String(value));
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function InlineUpdate({
  row,
  module,
  onRows
}: {
  row: Row;
  module: ModuleConfig;
  onRows: React.Dispatch<React.SetStateAction<Row[]>>;
}) {
  const [pending, startTransition] = useTransition();
  if (!module.statusField && !module.progressField) return null;

  return (
    <Button
      variant="secondary"
      size="icon"
      loading={pending}
      aria-label="Advance status"
      onClick={() => {
        startTransition(async () => {
          const next = nextStatus(String(row[module.statusField ?? "status"] ?? ""));
          const response = await fetch(`/api/records/${module.model}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ...row, [module.statusField ?? "status"]: next })
          });
          const payload = (await response.json()) as Row;
          if (!response.ok) {
            toast.error("Status update failed");
            return;
          }
          onRows((rows) => rows.map((item) => (item.id === row.id ? payload : item)));
          toast.success("Status updated");
        });
      }}
    >
      <Save className="h-4 w-4" />
    </Button>
  );
}

function DeleteButton({
  row,
  module,
  onRows
}: {
  row: Row;
  module: ModuleConfig;
  onRows: React.Dispatch<React.SetStateAction<Row[]>>;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="icon"
      loading={pending}
      aria-label="Delete"
      onClick={() => {
        if (!window.confirm("Delete this record? This cannot be undone.")) return;
        startTransition(async () => {
          const response = await fetch(`/api/records/${module.model}?id=${row.id}`, { method: "DELETE" });
          if (!response.ok) {
            toast.error("Delete failed");
            return;
          }
          onRows((rows) => rows.filter((item) => item.id !== row.id));
          toast.success("Record deleted");
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

function formatDefault(value: unknown, field: FieldConfig) {
  if (field.type === "date") return value ? new Date(String(value)).toISOString().slice(0, 10) : "";
  if (field.type === "boolean") return Boolean(value);
  return value ?? "";
}

function nextStatus(current: string) {
  const order = ["Not Started", "Planned", "In Progress", "Review", "Testing", "Polishing", "Complete", "Published"];
  const index = order.indexOf(current);
  return index >= 0 ? order[Math.min(index + 1, order.length - 1)] : "In Progress";
}

function labelize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
