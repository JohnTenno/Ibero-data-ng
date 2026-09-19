import { useCallback, useSyncExternalStore } from 'react';
import type { HarmonizerSurvey } from '../models/harmonizer.model';
import { MOCK_HARMONIZER_SURVEYS } from '../../data/mock-harmonizer';

let surveys: HarmonizerSurvey[] = structuredClone(MOCK_HARMONIZER_SURVEYS);
const listeners = new Set<() => void>();
let mockIdSeq = 100;

function emit() {
  for (const listener of listeners) listener();
}

function getSurveys(): HarmonizerSurvey[] {
  return surveys;
}

function setSurveys(next: HarmonizerSurvey[]): void {
  surveys = next;
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function nextId(prefix: string): string {
  mockIdSeq += 1;
  return `${prefix}-${mockIdSeq}`;
}

export const harmonizerService = {
  listSurveys: async (): Promise<HarmonizerSurvey[]> => getSurveys(),
  getSurveys,
  setSurveys,
  subscribe,
  nextId,
};

export function useHarmonizerSurveys() {
  const current = useSyncExternalStore(subscribe, getSurveys, getSurveys);

  const updateSurveys = useCallback((updater: (prev: HarmonizerSurvey[]) => HarmonizerSurvey[]) => {
    setSurveys(updater(getSurveys()));
  }, []);

  return { surveys: current, updateSurveys };
}
