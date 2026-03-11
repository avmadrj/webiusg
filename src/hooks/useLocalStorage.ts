import { useState, useCallback } from "react"

/**
 * A hook that works similarly to React.useState, but persists the value
 * using the browser's localStorage. Designed as a drop-in replacement
 * for the Spark-specific `useKV` hook when deploying outside the Spark runtime.
 *
 * @param key - The localStorage key under which to store the value.
 * @param initialValue - The initial value to use if no stored value is found.
 * @returns An array containing the current value, a setter function, and a delete function.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): readonly [T | undefined, (newValue: T | ((oldValue?: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T | undefined>(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
    } catch {
      // ignore parse errors
    }
    return initialValue
  })

  const setter = useCallback(
    (newValue: T | ((oldValue?: T) => T)) => {
      setValue((currentValue) => {
        const nextValue =
          typeof newValue === "function"
            ? (newValue as (old?: T) => T)(currentValue)
            : newValue
        try {
          localStorage.setItem(key, JSON.stringify(nextValue))
        } catch {
          // ignore storage errors (e.g. private browsing quota exceeded)
        }
        return nextValue
      })
    },
    [key]
  )

  const deleter = useCallback(() => {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
    setValue(undefined)
  }, [key])

  return [value, setter, deleter] as const
}
