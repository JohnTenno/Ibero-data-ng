import type { FilterSection } from '../components/shared/filters/Filters';
import { mapFilterOptions, type FilterOptionMeta } from './dataset-filters';

export const ORGANIZATION_FILTERS = {
  title: 'Filtros',
  sections: [
    {
      id: 'type',
      label: 'Tipo',
      subsections: [
        {
          id: 'classification',
          label: 'Clasificación',
          options: [
            { id: 'type-academia', label: 'Academia' },
            { id: 'type-osc', label: 'Sociedad civil' },
            { id: 'type-center', label: 'Centro de investigación' },
          ],
        },
      ],
    },
    {
      id: 'scope',
      label: 'Alcance',
      subsections: [
        {
          id: 'coverage',
          label: 'Cobertura',
          options: [
            { id: 'scope-national', label: 'Nacional' },
            { id: 'scope-local', label: 'Local' },
          ],
        },
      ],
    },
  ] satisfies FilterSection[],
};

export { mapFilterOptions };
export type { FilterOptionMeta };

type FilterableOrganization = {
  name?: string;
  type?: string;
  scope?: string;
};

function optionMatchesCard(card: FilterableOrganization, option: FilterOptionMeta): boolean {
  const value = String(option.label).toLowerCase();
  return (
    String(card.type ?? '').toLowerCase() === value ||
    String(card.scope ?? '').toLowerCase() === value ||
    String(card.name ?? '').toLowerCase().includes(value)
  );
}

export function organizationMatchesFilters(
  card: FilterableOrganization,
  selectedIds: string[],
  optionsById: Map<string, FilterOptionMeta>,
): boolean {
  if (!selectedIds.length) return true;

  const bySection = new Map<string, FilterOptionMeta[]>();
  for (const id of selectedIds) {
    const option = optionsById.get(id);
    if (!option) continue;
    const list = bySection.get(option.sectionId) ?? [];
    list.push(option);
    bySection.set(option.sectionId, list);
  }

  for (const [, options] of bySection) {
    if (!options.some((option) => optionMatchesCard(card, option))) return false;
  }

  return true;
}
