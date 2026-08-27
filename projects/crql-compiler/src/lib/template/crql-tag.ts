import { SparqlGenerator, SparqlGeneratorOptions } from '../generator/sparql-generator';
import { Parser } from '../parser/parser';
import { Resolver } from '../resolver/resolver';

export interface CrqlCompileOptions extends SparqlGeneratorOptions {
  params?: Record<string, unknown>;
}

export function compileCrql(source: string, options: CrqlCompileOptions = {}): string {
  const parser = new Parser(source);
  const ast = parser.parse();
  const resolver = new Resolver();
  const resolved = resolver.resolve(ast, options.params);
  const generator = new SparqlGenerator();
  return generator.generate(resolved, options);
}

export function mergeCrql(...queries: string[]): string {
  const combinedSource = queries.join('\n\n');
  return compileCrql(combinedSource);
}

export interface CrqlTag {
  (strings: TemplateStringsArray, ...values: unknown[]): string;
  compile: (source: string, options?: CrqlCompileOptions) => string;
  merge: (...queries: string[]) => string;
}

export const crql: CrqlTag = Object.assign(
  (strings: TemplateStringsArray, ...values: unknown[]): string => {
    let result = '';
    strings.forEach((str, i) => {
      result += str;
      if (i < values.length) {
        const val = values[i];
        if (typeof val === 'string' && (val.startsWith('?') || val.startsWith('$') || val.includes(':'))) {
          result += val;
        } else if (typeof val === 'string') {
          result += `"${val}"`;
        } else {
          result += String(val);
        }
      }
    });
    return compileCrql(result);
  },
  {
    compile: compileCrql,
    merge: mergeCrql
  }
);
