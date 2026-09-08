export interface ResourceColumn {
  name: string;
  type: string;
}

export interface Resource {
  id: string;
  datasetId: string;
  filename: string;
  format: string;
  sizeBytes: number;
  storageKey: string;
  columns?: ResourceColumn[] | null;
  createdAt: string;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
}
