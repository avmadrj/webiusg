import { useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { INITIAL_RESOURCES } from "@/lib/initial-resources"
import type { Resource } from "@/lib/types"

export function DataInitializer() {
  const [resources, setResources] = useLocalStorage<Resource[]>("resources", [])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized && (!resources || resources.length === 0)) {
      setResources(INITIAL_RESOURCES)
      setInitialized(true)
    }
  }, [initialized, resources, setResources])

  return null
}
