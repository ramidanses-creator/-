import type { ChangeEvent } from 'react'
import type { Comp } from '../types'

interface CompsTableProps {
  comps: Comp[]
  onChange: (comps: Comp[]) => void
}

function emptyComp(): Comp {
  return {
    id: crypto.randomUUID(),
    address: '',
    soldPrice: 0,
    sqft: 0,
    soldDate: '',
    notes: '',
  }
}

export function CompsTable({ comps, onChange }: CompsTableProps) {
  function updateComp(id: string, patch: Partial<Comp>) {
    onChange(comps.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  function removeComp(id: string) {
    onChange(comps.filter((c) => c.id !== id))
  }

  function addComp() {
    onChange([...comps, emptyComp()])
  }

  function handleCsvImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
      const dataLines = lines[0]?.toLowerCase().includes('address') ? lines.slice(1) : lines
      const imported: Comp[] = dataLines.map((line) => {
        const [address = '', soldPrice = '0', sqft = '0', soldDate = '', notes = ''] = line
          .split(',')
          .map((s) => s.trim())
        return {
          id: crypto.randomUUID(),
          address,
          soldPrice: Number(soldPrice) || 0,
          sqft: Number(sqft) || 0,
          soldDate,
          notes,
        }
      })
      onChange([...comps, ...imported])
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">מכירות דומות (Comps)</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            הזן ידנית עסקאות שנסגרו לאחרונה באזור, בתנאים דומים (גודל, מצב, שכונה). הממוצע ל־מ״ר משמש להערכת שווי המכירה (ARV).
          </p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
            ייבוא CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleCsvImport} />
          </label>
          <button
            type="button"
            onClick={addComp}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
          >
            + הוסף עסקה
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right text-slate-500">
              <th className="py-2 pl-2">כתובת</th>
              <th className="py-2 pl-2">מחיר מכירה ($)</th>
              <th className="py-2 pl-2">שטח (sqft)</th>
              <th className="py-2 pl-2">תאריך מכירה</th>
              <th className="py-2 pl-2">הערות</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {comps.map((c) => (
              <tr key={c.id} className="border-b border-slate-100">
                <td className="py-1.5 pl-2">
                  <input
                    className="w-full rounded border border-slate-200 px-2 py-1"
                    value={c.address}
                    onChange={(e) => updateComp(c.id, { address: e.target.value })}
                  />
                </td>
                <td className="py-1.5 pl-2">
                  <input
                    type="number"
                    className="w-28 rounded border border-slate-200 px-2 py-1"
                    value={c.soldPrice}
                    onChange={(e) => updateComp(c.id, { soldPrice: e.target.valueAsNumber || 0 })}
                  />
                </td>
                <td className="py-1.5 pl-2">
                  <input
                    type="number"
                    className="w-24 rounded border border-slate-200 px-2 py-1"
                    value={c.sqft}
                    onChange={(e) => updateComp(c.id, { sqft: e.target.valueAsNumber || 0 })}
                  />
                </td>
                <td className="py-1.5 pl-2">
                  <input
                    type="date"
                    className="rounded border border-slate-200 px-2 py-1"
                    value={c.soldDate}
                    onChange={(e) => updateComp(c.id, { soldDate: e.target.value })}
                  />
                </td>
                <td className="py-1.5 pl-2">
                  <input
                    className="w-full rounded border border-slate-200 px-2 py-1"
                    value={c.notes}
                    onChange={(e) => updateComp(c.id, { notes: e.target.value })}
                  />
                </td>
                <td className="py-1.5 text-left">
                  <button
                    type="button"
                    onClick={() => removeComp(c.id)}
                    className="text-slate-400 hover:text-red-500"
                    aria-label="הסר"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {comps.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400">
                  אין עדיין עסקאות דומות. הוסף ידנית או ייבא CSV (כתובת, מחיר, שטח, תאריך, הערות).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
