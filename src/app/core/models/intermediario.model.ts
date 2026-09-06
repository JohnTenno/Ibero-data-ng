export interface IntermediarioDatasetSummary {
  id: number;
  name: string;
  year: number;
  rowCount: number;
  mappedColumns: number;
  totalColumns: number;
}

export interface IntermediarioSurveySummary {
  id: number;
  name: string;
  description: string | null;
  datasets: IntermediarioDatasetSummary[];
}
