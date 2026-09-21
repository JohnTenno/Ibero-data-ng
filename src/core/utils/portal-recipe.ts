export interface RecipeStepParams {
  resourceId?: string;
  type?: string;
  onLeft?: string;
  onRight?: string;
  columns?: string[];
  func?: string;
  column?: string;
  distinct?: boolean;
  as?: string;
  left?: string;
  right?: string;
  of?: string;
  operator?: string;
  value?: string | number;
  dir?: 'asc' | 'desc';
  n?: number;
}

export interface RecipeStep {
  op: string;
  params?: RecipeStepParams;
}

export interface Recipe {
  steps?: RecipeStep[];
  joinResourceNames?: Record<string, string>;
  sourceResourceName?: string;
}

export interface DescribedStep {
  id: string;
  number: number;
  text: string;
}

function resourceName(id: string | undefined, joinResourceNames?: Record<string, string>): string {
  return (id && joinResourceNames?.[id]) ?? id ?? '';
}

const DESCRIPTORS: Record<
  string,
  (p: RecipeStepParams, joinResourceNames?: Record<string, string>) => string
> = {
  join: (p, joinResourceNames) =>
    `Cruza con "${resourceName(p.resourceId, joinResourceNames)}" (${p.type}) por ${p.onLeft} = ${p.onRight}`,
  group_by: (p) => `Agrupa por: ${(p.columns ?? []).join(', ')}`,
  aggregate: (p) =>
    `Calcula ${p.func}(${p.column}${p.distinct ? ', solo valores distintos' : ''}) como "${p.as}"`,
  compute: (p) => `Crea la columna "${p.as}" = ${p.left} × ${p.right}`,
  percentage: (p) => `Convierte "${p.of}" a porcentaje del total, como "${p.as}"`,
  filter: (p) => `Filtra filas donde ${p.column} ${p.operator} ${p.value}`,
  sort: (p) => `Ordena por ${p.column} (${p.dir === 'asc' ? 'ascendente' : 'descendente'})`,
  limit: (p) => `Limita a ${p.n} filas`,
};

export function describeSteps(recipe: Recipe | null | undefined): DescribedStep[] {
  if (!recipe?.steps?.length) return [];
  return recipe.steps.map((step, index) => {
    const describe = DESCRIPTORS[step.op];
    const text = describe ? describe(step.params ?? {}, recipe.joinResourceNames) : `Paso "${step.op}"`;
    return { id: `step-${index}`, number: index + 1, text };
  });
}
