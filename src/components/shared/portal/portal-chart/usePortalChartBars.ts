import { stack } from 'd3-shape';
import { useMemo } from 'react';
import type { ChartVariable } from '../../../../core/utils/portal-charts';

export function usePortalChartBars({
  data,
  variables,
}: {
  data: Record<string, unknown>[];
  variables: ChartVariable[];
}) {
  const colorById = useMemo(() => {
    const map = new Map<string, string>();
    variables.forEach((v) => {
      if (v.color) map.set(v.id, v.color);
    });
    return map;
  }, [variables]);

  const stackedData = useMemo(() => {
    if (!data.length || !variables.length) return [];
    return stack<Record<string, unknown>, string>().keys(variables.map((v) => v.id))(data);
  }, [data, variables]);

  return { colorById, stackedData };
}
