import { Signal, computed } from '@angular/core';
import { compileCrql, CrqlCompileOptions } from '@rdf-query/crql-compiler';

export function toSparqlQuery(
  crqlSignal: Signal<string>,
  optionsSignal?: Signal<CrqlCompileOptions>
): Signal<string> {
  return computed(() => {
    const query = crqlSignal();
    const opts = optionsSignal ? optionsSignal() : {};
    try {
      return compileCrql(query, opts);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return `# Compilation Error:\n# ${msg}`;
    }
  });
}
