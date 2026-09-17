import type { FilterOption, FilterSection } from '../components/shared/filters/Filters';
import type { MockDatasetCard } from './mock-datasets';

export const DATASET_FILTERS = {
  title: 'Filtros',
  sections: [
    {
      id: 'topic',
      label: 'Tema',
      subsections: [
        {
          id: 'education',
          label: 'Educación',
          options: [
            { id: 'topic-education', label: 'Educación' },
            { id: 'topic-literacy', label: 'Alfabetismo' },
            { id: 'topic-dropout', label: 'Abandono escolar' },
          ],
        },
        {
          id: 'economy',
          label: 'Economía y sociedad',
          options: [
            { id: 'topic-economy', label: 'Economía' },
            { id: 'topic-civil', label: 'Sociedad civil' },
          ],
        },
      ],
    },
    {
      id: 'year',
      label: 'Año',
      subsections: [
        {
          id: 'recent-period',
          label: 'Periodo reciente',
          options: [
            { id: 'year-2025', label: '2025' },
            { id: 'year-2023', label: '2023' },
            { id: 'year-2022', label: '2022' },
          ],
        },
      ],
    },
    {
      id: 'institution',
      label: 'Institución',
      subsections: [
        {
          id: 'producers',
          label: 'Productores de datos',
          options: [
            { id: 'inst-inegi', label: 'INEGI' },
            { id: 'inst-conapred', label: 'CONAPRED' },
            { id: 'inst-cndh', label: 'CNDH' },
            { id: 'inst-sdi', label: 'Social Data Ibero' },
          ],
        },
      ],
    },
  ] satisfies FilterSection[],
};

export type FilterOptionMeta = FilterOption & { sectionId: string };

export function mapFilterOptions(sections: FilterSection[] = []): Map<string, FilterOptionMeta> {
  const map = new Map<string, FilterOptionMeta>();
  for (const section of sections) {
    for (const sub of section.subsections ?? []) {
      for (const option of sub.options ?? []) {
        map.set(option.id, { ...option, sectionId: section.id });
      }
    }
  }
  return map;
}

function optionMatchesCard(card: MockDatasetCard, option: FilterOptionMeta): boolean {
  const value = String(option.label).toLowerCase();
  return (
    String(card.label ?? '').toLowerCase() === value ||
    String(card.year ?? '').toLowerCase() === value ||
    String(card.institution ?? '').toLowerCase().includes(value) ||
    String(card.source ?? '').toLowerCase().includes(value) ||
    String(card.title ?? '').toLowerCase().includes(value)
  );
}

export function cardMatchesFilters(
  card: MockDatasetCard,
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
