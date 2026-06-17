'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot, runTransaction, increment } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'

const VISIT_KEY = 'civilos-portfolio-visited'

/**
 * Live visitor pulse for the Hero HUD ("SIGNAL #1284").
 *
 * Reads + subscribes to `portfolioMeta/visitorPulse` in Firestore and,
 * once per browser session, increments it inside a transaction. Returns
 * `null` if Firebase isn't configured or a read hasn't resolved yet — the
 * Hero treats `null` as "hide this HUD line", so the feature is fully
 * optional and fails silently.
 *
 * See README.md for the recommended (additive) Firestore security rule.
 */
export function useVisitorPulse(): number | null {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return
    const firestore = db
    const ref = doc(firestore, 'portfolioMeta', 'visitorPulse')

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const value = snapshot.data()?.count
        setCount(typeof value === 'number' ? value : null)
      },
      () => setCount(null)
    )

    try {
      if (!sessionStorage.getItem(VISIT_KEY)) {
        sessionStorage.setItem(VISIT_KEY, '1')
        runTransaction(firestore, async (tx) => {
          const snap = await tx.get(ref)
          if (!snap.exists()) {
            tx.set(ref, { count: 1 })
          } else {
            tx.update(ref, { count: increment(1) })
          }
        }).catch(() => {})
      }
    } catch {
      // sessionStorage unavailable (e.g. private mode) — safe to ignore
    }

    return () => unsubscribe()
  }, [])

  return count
}
