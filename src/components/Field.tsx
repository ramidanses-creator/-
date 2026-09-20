import type { ReactNode } from 'react'

interface NumberFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  suffix?: string
  step?: number
  min?: number
  hint?: string
}

export function NumberField({ label, value, onChange, suffix, step = 1, min = 0, hint }: NumberFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
          value={Number.isFinite(value) ? value : 0}
          step={step}
          min={min}
          onChange={(e) => onChange(e.target.valueAsNumber || 0)}
        />
        {suffix && <span className="whitespace-nowrap text-slate-500">{suffix}</span>}
      </div>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </label>
  )
}

interface SelectFieldProps<T extends string> {
  label: string
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
  hint?: string
}

export function SelectField<T extends string>({ label, value, onChange, options, hint }: SelectFieldProps<T>) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <select
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </label>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TextField({ label, value, onChange, placeholder }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        type="text"
        className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      {subtitle && <p className="mb-3 mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}
