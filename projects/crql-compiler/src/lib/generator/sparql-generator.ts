import { ResolvedDocument } from '../resolver/resolver';

export interface SparqlGeneratorOptions {
  queryType?: 'CONSTRUCT' | 'SELECT';
}

export class SparqlGenerator {
  public generate(resolved: ResolvedDocument, options: SparqlGeneratorOptions = {}): string {
    const queryType = options.queryType || 'CONSTRUCT';
    const lines: string[] = [];

    // 1. Output Prefixes
    for (const p of resolved.prefixes) {
      lines.push(`PREFIX ${p.prefix}: <${p.iri.replace(/^<|>$/g, '')}>`);
    }

    if (lines.length > 0) lines.push('');

    // Collect all construct triples across all rules
    const allConstructTriples: Array<{ subject: string; predicate: string; object: string }> = [];
    for (const rule of resolved.rules) {
      allConstructTriples.push(...rule.constructTriples);
    }

    if (queryType === 'CONSTRUCT') {
      lines.push('CONSTRUCT {');
      for (const triple of allConstructTriples) {
        lines.push(`  ${triple.subject} ${triple.predicate} ${triple.object} .`);
      }
      lines.push('}');
    } else {
      // SELECT query
      const selectVars = new Set<string>();
      for (const t of allConstructTriples) {
        if (t.subject.startsWith('?')) selectVars.add(t.subject);
        if (t.object.startsWith('?')) selectVars.add(t.object);
      }
      lines.push(`SELECT ${Array.from(selectVars).join(' ')}`);
    }

    lines.push('WHERE {');

    // Combine rules into WHERE clause
    const ruleWhereBlocks: string[] = [];

    for (const rule of resolved.rules) {
      if (rule.wherePatterns.length > 1) {
        // Multi-selector UNION
        const unionBranches = rule.wherePatterns
          .map(pattern => `  {\n    ${pattern.split('\n').join('\n    ')}\n  }`)
          .join(' UNION\n');
        ruleWhereBlocks.push(unionBranches);
      } else if (rule.wherePatterns.length === 1) {
        ruleWhereBlocks.push(`  ${rule.wherePatterns[0].split('\n').join('\n  ')}`);
      }
    }

    if (ruleWhereBlocks.length > 1) {
      // Multiple separate rule blocks merged via UNION
      lines.push('  {');
      lines.push(ruleWhereBlocks.map(b => `  ${b}`).join('\n  }\n  UNION\n  {\n'));
      lines.push('  }');
    } else if (ruleWhereBlocks.length === 1) {
      lines.push(ruleWhereBlocks[0]);
    }

    lines.push('}');

    // Page Directives (Limit, Offset, Order By)
    for (const rule of resolved.rules) {
      if (rule.pageDirectives) {
        if (rule.pageDirectives.orderBy) {
          lines.push(`ORDER BY ${rule.pageDirectives.orderBy.direction}(${rule.pageDirectives.orderBy.variableOrExpr})`);
        }
        if (rule.pageDirectives.limit !== undefined) {
          lines.push(`LIMIT ${rule.pageDirectives.limit}`);
        }
        if (rule.pageDirectives.offset !== undefined) {
          lines.push(`OFFSET ${rule.pageDirectives.offset}`);
        }
      }
    }

    return lines.join('\n');
  }
}
