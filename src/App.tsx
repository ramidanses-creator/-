import { useEffect, useMemo, useState } from 'react'
import { CompsTable } from './components/CompsTable'
import { DealForm } from './components/DealForm'
import { ResultsPanel } from './components/ResultsPanel'
import { createDefaultDeal } from './defaultDeal'
import type { Deal } from './types'
import { calculateDeal } from './utils/calculations'

const STORAGE_KEY = 'flip-calculator-deals'

function loadDeals(): Deal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Deal[]
  } catch {
    return []
  }
}

function saveDeals(deals: Deal[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals))
  } catch {
    // ignore storage failures (private browsing, quota, etc.)
  }
}

export default function App() {
  const [deals, setDeals] = useState<Deal[]>(() => {
    const stored = loadDeals()
    return stored.length > 0 ? stored : [createDefaultDeal()]
  })
  const [activeId, setActiveId] = useState<string>(() => deals[0]?.id ?? '')

  useEffect(() => {
    saveDeals(deals)
  }, [deals])

  const activeDeal = useMemo(() => deals.find((d) => d.id === activeId) ?? deals[0], [deals, activeId])
  const results = useMemo(() => (activeDeal ? calculateDeal(activeDeal) : null), [activeDeal])

  function updateActiveDeal(updated: Deal) {
    setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
  }

  function addDeal() {
    const newDeal = createDefaultDeal()
    newDeal.name = `עסקה ${deals.length + 1}`
    setDeals((prev) => [...prev, newDeal])
    setActiveId(newDeal.id)
  }

  function removeDeal(id: string) {
    setDeals((prev) => {
      const next = prev.filter((d) => d.id !== id)
      if (next.length === 0) {
        const fresh = createDefaultDeal()
        setActiveId(fresh.id)
        return [fresh]
      }
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }

  function duplicateDeal(id: string) {
    const source = deals.find((d) => d.id === id)
    if (!source) return
    const copy: Deal = {
      ...source,
      id: crypto.randomUUID(),
      name: `${source.name} (עותק)`,
      comps: source.comps.map((c) => ({ ...c, id: crypto.randomUUID() })),
    }
    setDeals((prev) => [...prev, copy])
    setActiveId(copy.id)
  }

  if (!activeDeal || !results) return null

  return (
    <div className="min-h-screen bg-slate-100 pb-16" dir="rtl">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5">
          <h1 className="text-2xl font-bold text-slate-900">מחשבון עסקאות פליפ נדל״ן</h1>
          <p className="text-sm text-slate-500">
            הזן תקציב, מימון, שיפוץ ועסקאות דומות באזור — קבל ניתוח מלא של עלויות, מיסים ורווחיות צפויה.
          </p>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-6xl px-4">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {deals.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveId(d.id)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                d.id === activeDeal.id
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {d.name || 'עסקה ללא שם'}
            </button>
          ))}
          <button onClick={addDeal} className="rounded-full border border-dashed border-slate-400 px-4 py-1.5 text-sm text-slate-500 hover:bg-white">
            + עסקה חדשה
          </button>
          <button onClick={() => duplicateDeal(activeDeal.id)} className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-500 hover:bg-white">
            שכפל
          </button>
          <button onClick={() => removeDeal(activeDeal.id)} className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-red-500 hover:bg-white">
            מחק עסקה
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <DealForm deal={activeDeal} onChange={updateActiveDeal} />
            <CompsTable comps={activeDeal.comps} onChange={(comps) => updateActiveDeal({ ...activeDeal, comps })} />
          </div>
          <div className="lg:sticky lg:top-4 lg:self-start">
            <ResultsPanel results={results} cashAvailable={activeDeal.cashAvailable} />
          </div>
        </div>
      </main>
    </div>
  )
}
