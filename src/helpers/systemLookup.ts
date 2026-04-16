import type { System } from "@/types";
import rawData from "../../sample_data.json";

let _systemMap: Map<string, System> | null = null;

/**
 * Returns the canonical system map, lazily built on first call
 * to avoid module-scope timing issues with JSON imports.
 */
function getSystemMap(): Map<string, System> {
  if (!_systemMap) {
    _systemMap = new Map();
    for (const s of rawData as System[]) {
      if (!_systemMap.has(s.fides_key)) {
        _systemMap.set(s.fides_key, s);
      }
    }
  }
  return _systemMap;
}

/**
 * Resolves a system by its fides_key from the canonical data source.
 *
 * @param fidesKey - The unique identifier of the system
 * @returns The system object, or undefined if not found
 */
export function resolveSystem(fidesKey: string): System | undefined {
  return getSystemMap().get(fidesKey);
}

/**
 * Returns the direct dependency System objects for a given system.
 *
 * @param fidesKey - The fides_key of the system to look up dependencies for
 * @returns Array of resolved dependency System objects
 */
export function getSystemDependencies(fidesKey: string): System[] {
  const system = resolveSystem(fidesKey);
  if (!system) return [];

  const results: System[] = [];
  for (const depKey of system.system_dependencies) {
    const dep = resolveSystem(depKey);
    if (dep) results.push(dep);
  }
  return results;
}

/**
 * Returns systems that list the given fidesKey in their system_dependencies (reverse lookup).
 *
 * @param fidesKey - The fides_key to find dependents for
 * @returns Array of systems that depend on the given system
 */
export function getSystemDependents(fidesKey: string): System[] {
  const results: System[] = [];
  for (const system of getSystemMap().values()) {
    if (system.fides_key !== fidesKey && system.system_dependencies.includes(fidesKey)) {
      results.push(system);
    }
  }
  return results;
}

/**
 * Returns all unique systems from the data source.
 */
export function getAllSystems(): System[] {
  return Array.from(getSystemMap().values());
}
