import {
  BindNode,
  BodyItemNode,
  CustomSelectorNode,
  CustomSelectorPattern,
  DocumentNode,
  ExpressionNode,
  FunctionCallNode,
  GetDirectiveNode,
  MixinNode,
  NestedTraversalNode,
  PageDirectiveNode,
  PropertyPatternNode,
  RuleBlockNode,
  SelectorExprNode,
  SubSelectNode,
  TriplePattern,
  ValuesBlockNode
} from '../types/ast';

export interface ResolvedRuleBlock {
  subjectVar: string;
  wherePatterns: string[];
  constructTriples: Array<{ subject: string; predicate: string; object: string }>;
  pageDirectives?: PageDirectiveNode;
}

export interface ResolvedDocument {
  prefixes: Array<{ prefix: string; iri: string }>;
  rules: ResolvedRuleBlock[];
}

export class Resolver {
  private customSelectors = new Map<string, CustomSelectorNode>();
  private mixins = new Map<string, MixinNode>();

  public resolve(ast: DocumentNode, paramsMap?: Record<string, unknown>): ResolvedDocument {
    // 1. Register custom selectors and mixins
    for (const cs of ast.customSelectors) {
      this.customSelectors.set(cs.name, cs);
    }
    for (const mx of ast.mixins) {
      this.mixins.set(mx.name, mx);
    }

    const prefixes = [...ast.prefixes];

    // Add common default prefixes if not present
    this.ensureDefaultPrefix(prefixes, 'rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
    this.ensureDefaultPrefix(prefixes, 'rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    this.ensureDefaultPrefix(prefixes, 'schema', 'https://schema.org/');
    this.ensureDefaultPrefix(prefixes, 'xsd', 'http://www.w3.org/2001/XMLSchema#');
    this.ensureDefaultPrefix(prefixes, 'ui', 'http://example.org/ui/vocab#');

    const resolvedRules: ResolvedRuleBlock[] = [];
    let ruleCounter = 1;

    for (const rule of ast.rules) {
      // Process each selector in rule block (comma-separated = UNION branches)
      const unionWherePatterns: string[] = [];
      const constructTriples: Array<{ subject: string; predicate: string; object: string }> = [];

      for (const selector of rule.selectors) {
        const subjectVar = `?focusNode_${ruleCounter}`;
        const whereClauseLines: string[] = [];

        // Resolve selector BGP pattern
        if (this.customSelectors.has(selector.name)) {
          const csDef = this.customSelectors.get(selector.name)!;
          for (const pattern of csDef.patterns) {
            const bindPattern = pattern as BindNode;
            if (bindPattern.type === 'BindNode') {
              const targetVar = bindPattern.variable === '?focusNode' ? subjectVar : bindPattern.variable;
              whereClauseLines.push(`BIND(${bindPattern.expressionText} AS ${targetVar})`);
            } else {
              const triplePattern = pattern as TriplePattern;
              const subj = triplePattern.subject === '?focusNode' ? subjectVar : triplePattern.subject;
              const obj = this.expressionToString(triplePattern.object, paramsMap);
              whereClauseLines.push(`${subj} ${triplePattern.predicate} ${obj} .`);
            }
          }
        } else if (!selector.name.startsWith(':--') && !selector.name.startsWith('--')) {
          // Direct type selector e.g. ex:Company or schema:Organization
          whereClauseLines.push(`${subjectVar} a ${selector.name} .`);
        }

        // Apply attribute filters
        for (const filter of selector.attributeFilters) {
          const filterVal = this.expressionToString(filter.value, paramsMap);
          if (filter.operator === '=') {
            whereClauseLines.push(`${subjectVar} ${filter.predicate} ${filterVal} .`);
          } else {
            const tempVar = `?filter_${ruleCounter}_${filter.predicate.replace(/[:/-]/g, '_')}`;
            whereClauseLines.push(`${subjectVar} ${filter.predicate} ${tempVar} .`);
            whereClauseLines.push(`FILTER(${tempVar} ${filter.operator} ${filterVal})`);
          }
        }

        // 1. Collect defined variables in scope for this selector & rule body
        const definedVars = new Set<string>([subjectVar, '?focusNode']);

        if (this.customSelectors.has(selector.name)) {
          const csDef = this.customSelectors.get(selector.name)!;
          for (const pattern of csDef.patterns) {
            const bindPattern = pattern as BindNode;
            if (bindPattern.type === 'BindNode') {
              definedVars.add(bindPattern.variable);
            } else {
              const triplePattern = pattern as TriplePattern;
              if (typeof triplePattern.subject === 'string' && triplePattern.subject.startsWith('?')) {
                definedVars.add(triplePattern.subject);
              }
              if (typeof triplePattern.object === 'object' && triplePattern.object && triplePattern.object.type === 'VariableNode') {
                definedVars.add(triplePattern.object.name);
              }
            }
          }
        }

        // Collect variables bound by property pattern lines in the rule body & mixins
        this.collectBodyVariables(rule.body, definedVars);

        // 2. Expand rule body items and validate variable scoping
        const bindCounter = { count: 1 };
        for (const item of rule.body) {
          this.expandBodyItem(
            item,
            subjectVar,
            subjectVar,
            whereClauseLines,
            constructTriples,
            definedVars,
            paramsMap,
            ruleCounter,
            bindCounter
          );
        }

        unionWherePatterns.push(whereClauseLines.join('\n    '));
      }

      resolvedRules.push({
        subjectVar: `?focusNode_${ruleCounter}`,
        wherePatterns: unionWherePatterns,
        constructTriples,
        pageDirectives: rule.pageDirectives
      });

      ruleCounter++;
    }

    return {
      prefixes,
      rules: resolvedRules
    };
  }

  private collectBodyVariables(
    bodyItems: Array<PropertyPatternNode | GetDirectiveNode | NestedTraversalNode | ValuesBlockNode | SubSelectNode | unknown>,
    definedVars: Set<string>
  ): void {
    for (const item of bodyItems) {
      const propItem = item as PropertyPatternNode;
      if (propItem.type === 'PropertyPatternNode' && propItem.value) {
        if (propItem.value.type === 'VariableNode') {
          definedVars.add(propItem.value.name);
        }
      }
      const getDir = item as GetDirectiveNode;
      if (getDir.type === 'GetDirectiveNode' && this.mixins.has(getDir.mixinName)) {
        const mixinDef = this.mixins.get(getDir.mixinName)!;
        this.collectBodyVariables(mixinDef.body, definedVars);
      }
      const nested = item as NestedTraversalNode;
      if (nested.type === 'NestedTraversalNode') {
        this.collectBodyVariables(nested.body, definedVars);
      }
      const valuesItem = item as ValuesBlockNode;
      if (valuesItem.type === 'ValuesBlockNode') {
        for (const v of valuesItem.variables) {
          definedVars.add(v);
        }
      }
      const subSelectItem = item as SubSelectNode;
      if (subSelectItem.type === 'SubSelectNode') {
        for (const v of subSelectItem.projectedVars) {
          definedVars.add(v);
        }
      }
      const bindItem = item as BindNode;
      if (bindItem.type === 'BindNode') {
        definedVars.add(bindItem.variable);
      }
    }
  }

  private extractVariables(expr: ExpressionNode): string[] {
    const vars: string[] = [];
    if (expr.type === 'VariableNode') {
      vars.push(expr.name);
    } else if (expr.type === 'FunctionCallNode') {
      for (const arg of expr.args) {
        vars.push(...this.extractVariables(arg));
      }
    }
    return vars;
  }

  private expandBodyItem(
    item: PropertyPatternNode | GetDirectiveNode | NestedTraversalNode | ValuesBlockNode | SubSelectNode | BindNode | unknown,
    whereSubject: string,
    constructSubject: string,
    whereClauseLines: string[],
    constructTriples: Array<{ subject: string; predicate: string; object: string }>,
    definedVars: Set<string>,
    paramsMap?: Record<string, unknown>,
    ruleIdx = 1,
    bindCounter = { count: 1 }
  ) {
    const bindItem = item as BindNode;
    if (bindItem.type === 'BindNode') {
      const targetVar = bindItem.variable === '?focusNode' ? whereSubject : bindItem.variable;
      whereClauseLines.push(`BIND(${bindItem.expressionText} AS ${targetVar})`);
      return;
    }

    const valuesItem = item as ValuesBlockNode;
    if (valuesItem.type === 'ValuesBlockNode') {
      const varStr = valuesItem.variables.join(' ');
      const formattedVars = valuesItem.variables.length > 1 ? `(${varStr})` : varStr;
      whereClauseLines.push(`VALUES ${formattedVars} { ${valuesItem.valuesText} }`);
      return;
    }

    const subSelectItem = item as SubSelectNode;
    if (subSelectItem.type === 'SubSelectNode') {
      whereClauseLines.push(`{\n    ${subSelectItem.queryText}\n  }`);
      return;
    }

    const propertyItem = item as PropertyPatternNode;

    if (propertyItem.type === 'PropertyPatternNode') {
      const targetPred = propertyItem.targetPredicate || propertyItem.predicate;
      const valExpr = propertyItem.value;

      if (valExpr.type === 'VariableNode') {
        const varName = valExpr.name;
        whereClauseLines.push(`${whereSubject} ${propertyItem.predicate} ${varName} .`);
        constructTriples.push({ subject: constructSubject, predicate: targetPred, object: varName });
      } else if (valExpr.type === 'FunctionCallNode') {
        const boundVar = `?auto_bound_${ruleIdx}_${bindCounter.count++}`;

        // Validate variable scope: all variables used in expressions must be defined
        const usedVars = this.extractVariables(valExpr);
        for (const v of usedVars) {
          if (!definedVars.has(v)) {
            const propHint = v.replace(/^\?/, '');
            throw new Error(
              `Undefined variable '${v}' referenced in '${valExpr.name}()' expression. ` +
              `Extract it in the block (e.g. 'ex:${propHint} ${v} ;') or define it in @custom-selector.`
            );
          }
        }

        const fnExprString = this.formatFunctionCall(valExpr, paramsMap);
        whereClauseLines.push(`BIND(${fnExprString} AS ${boundVar})`);
        constructTriples.push({ subject: constructSubject, predicate: targetPred, object: boundVar });
      } else {
        const objVal = this.expressionToString(valExpr, paramsMap);
        whereClauseLines.push(`${whereSubject} ${propertyItem.predicate} ${objVal} .`);
        constructTriples.push({ subject: constructSubject, predicate: targetPred, object: objVal });
      }
      return;
    }

    const getDirective = item as GetDirectiveNode;
    if (getDirective.type === 'GetDirectiveNode') {
      if (this.mixins.has(getDirective.mixinName)) {
        const mixinDef = this.mixins.get(getDirective.mixinName)!;
        for (const mItem of mixinDef.body) {
          this.expandBodyItem(mItem, whereSubject, constructSubject, whereClauseLines, constructTriples, definedVars, paramsMap, ruleIdx, bindCounter);
        }
      }
      return;
    }

    const nestedTraversal = item as NestedTraversalNode;
    if (nestedTraversal.type === 'NestedTraversalNode') {
      const childVar = `?child_${ruleIdx}_${nestedTraversal.path.replace(/[:/^-]/g, '_')}`;
      if (nestedTraversal.isInverse) {
        whereClauseLines.push(`${childVar} ${nestedTraversal.path} ${whereSubject} .`);
      } else {
        whereClauseLines.push(`${whereSubject} ${nestedTraversal.path} ${childVar} .`);
      }

      for (const childItem of nestedTraversal.body) {
        this.expandBodyItem(childItem, childVar, constructSubject, whereClauseLines, constructTriples, definedVars, paramsMap, ruleIdx, bindCounter);
      }
      return;
    }
  }

  private formatFunctionCall(fn: FunctionCallNode, paramsMap?: Record<string, unknown>): string {
    const formattedArgs = fn.args.map((a: ExpressionNode) => this.expressionToString(a, paramsMap));

    if (fn.name.toLowerCase() === 'concat') {
      return `CONCAT(${formattedArgs.join(', ')})`;
    }
    if (fn.name.toLowerCase() === 'iri') {
      return `IRI(CONCAT(${formattedArgs.join(', ')}))`;
    }
    if (fn.name.toLowerCase() === 'calc') {
      const calcArgs = formattedArgs.map((arg: string) =>
        arg === '"*"' || arg === '"+"' || arg === '"-"' || arg === '"/"' ? arg.replace(/^"|"$/g, '') : arg
      );
      return `(${calcArgs.join(' ')})`;
    }
    if (fn.name.toLowerCase() === 'ucase') {
      return `UCASE(${formattedArgs[0]})`;
    }
    if (fn.name.toLowerCase() === 'lcase') {
      return `LCASE(${formattedArgs[0]})`;
    }
    if (fn.name.toLowerCase() === 'coalesce') {
      return `COALESCE(${formattedArgs.join(', ')})`;
    }
    if (fn.name.includes(':')) {
      return `${fn.name}(${formattedArgs.join(', ')})`;
    }

    return `${fn.name.toUpperCase()}(${formattedArgs.join(', ')})`;
  }

  private expressionToString(expr: ExpressionNode | string, paramsMap?: Record<string, unknown>): string {
    if (typeof expr === 'string') return expr;

    switch (expr.type) {
      case 'VariableNode':
        return expr.name;
      case 'ParamVarNode': {
        const rawName = expr.name.replace(/^\$/, '');
        if (paramsMap && rawName in paramsMap) {
          const val = paramsMap[rawName];
          return typeof val === 'string' && !val.startsWith('http') && !val.includes(':')
            ? `"${val}"`
            : String(val);
        }
        return `?${rawName}`;
      }
      case 'StringLiteralNode':
        return expr.value.startsWith('http') || expr.value.startsWith('<')
          ? expr.value.startsWith('<') ? expr.value : `<${expr.value}>`
          : expr.value.includes(':') && !expr.value.includes(' ')
          ? expr.value
          : `"${expr.value}"`;
      case 'NumberLiteralNode':
        return String(expr.value);
      case 'BooleanLiteralNode':
        return String(expr.value);
      case 'TypedLiteralNode':
        return `"${expr.value}"^^${expr.datatype}`;
      default:
        return '';
    }
  }

  private ensureDefaultPrefix(prefixes: Array<{ prefix: string; iri: string }>, prefix: string, iri: string) {
    if (!prefixes.some(p => p.prefix === prefix)) {
      prefixes.unshift({ prefix, iri });
    }
  }
}
