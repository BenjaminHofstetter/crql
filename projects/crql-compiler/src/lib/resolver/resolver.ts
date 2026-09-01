import {
  BindNode,
  BodyItemNode,
  CustomSelectorNode,
  CustomSelectorPattern,
  DocumentNode,
  ExpressionNode,
  FilterNode,
  FunctionCallNode,
  UseDirectiveNode,
  LangDirectiveNode,
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
        const mixinCounter = { count: 1 };
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
            bindCounter,
            mixinCounter
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
    bodyItems: Array<PropertyPatternNode | UseDirectiveNode | NestedTraversalNode | ValuesBlockNode | SubSelectNode | BindNode | unknown>,
    definedVars: Set<string>
  ): void {
    for (const item of bodyItems) {
      const propItem = item as PropertyPatternNode;
      if (propItem.type === 'PropertyPatternNode') {
        if (propItem.subject) {
          definedVars.add(propItem.subject);
        }
        if (propItem.value && propItem.value.type === 'VariableNode') {
          definedVars.add(propItem.value.name);
        }
      }
      const useDir = item as UseDirectiveNode;
      if (useDir.type === 'UseDirectiveNode' && this.mixins.has(useDir.mixinName)) {
        const mixinDef = this.mixins.get(useDir.mixinName)!;
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
    item: PropertyPatternNode | UseDirectiveNode | NestedTraversalNode | ValuesBlockNode | SubSelectNode | BindNode | unknown,
    whereSubject: string,
    constructSubject: string,
    whereClauseLines: string[],
    constructTriples: Array<{ subject: string; predicate: string; object: string }>,
    definedVars: Set<string>,
    paramsMap?: Record<string, unknown>,
    ruleIdx = 1,
    bindCounter = { count: 1 },
    mixinCounter = { count: 1 }
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

    const langItem = item as LangDirectiveNode;
    if (langItem.type === 'LangDirectiveNode') {
      let targetVarStr = '?name';
      if (langItem.targetVarExpr) {
        targetVarStr = this.expressionToString(langItem.targetVarExpr, paramsMap);
      } else if (langItem.targetVar) {
        targetVarStr = langItem.targetVar;
      } else {
        targetVarStr = Array.from(definedVars).pop() || '?name';
      }

      if (paramsMap) {
        const rawKey = targetVarStr.replace(/^\$|^\?/, '');
        if (rawKey in paramsMap) {
          const mapped = String(paramsMap[rawKey]);
          targetVarStr = mapped.startsWith('?') ? mapped : `?${mapped}`;
        } else if (`$${rawKey}` in paramsMap) {
          const mapped = String(paramsMap[`$${rawKey}`]);
          targetVarStr = mapped.startsWith('?') ? mapped : `?${mapped}`;
        } else if (`?${rawKey}` in paramsMap) {
          const mapped = String(paramsMap[`?${rawKey}`]);
          targetVarStr = mapped.startsWith('?') ? mapped : `?${mapped}`;
        }
      }

      let langExpr = '';
      if (typeof langItem.languages === 'object' && !Array.isArray(langItem.languages)) {
        langExpr = this.expressionToString(langItem.languages, paramsMap);
      } else if (Array.isArray(langItem.languages)) {
        langExpr = langItem.languages.join(',');
      } else {
        langExpr = String(langItem.languages);
      }
      const langs = langExpr.replace(/^"|"$/g, '').split(',').map(s => `"${s.trim()}"`);
      whereClauseLines.push(`FILTER(LANG(${targetVarStr}) IN (${langs.join(', ')}))`);
      return;
    }

    const filterItem = item as FilterNode;
    if (filterItem.type === 'FilterNode') {
      let exprText = filterItem.expressionText;
      if (paramsMap) {
        Object.entries(paramsMap).forEach(([k, v]) => {
          const rawK = k.replace(/^\$|^\?/, '');
          const valStr = typeof v === 'string' && (v.startsWith('?') || v.startsWith('http') || v.includes(':'))
            ? String(v)
            : `"${v}"`;
          exprText = exprText.replace(new RegExp('\\$' + rawK + '\\b', 'g'), valStr);
          exprText = exprText.replace(new RegExp('\\?' + rawK + '\\b', 'g'), valStr);
        });
      }
      whereClauseLines.push(`FILTER(${exprText})`);
      return;
    }

    const propertyItem = item as PropertyPatternNode;

    if (propertyItem.type === 'PropertyPatternNode') {
      const targetPred = propertyItem.targetPredicate || propertyItem.predicate;
      const valExpr = propertyItem.value;

      let itemWhereSubject = whereSubject;
      if (propertyItem.subject) {
        itemWhereSubject = propertyItem.subject === '?focusNode' ? whereSubject : propertyItem.subject;
      }

      let itemConstructSubject = constructSubject;
      if (propertyItem.constructSubject) {
        itemConstructSubject = propertyItem.constructSubject === '?focusNode' ? constructSubject : propertyItem.constructSubject;
      } else if (propertyItem.subject && !propertyItem.targetPredicate) {
        itemConstructSubject = itemWhereSubject;
      }

      if (valExpr.type === 'VariableNode') {
        const varName = valExpr.name;
        whereClauseLines.push(`${itemWhereSubject} ${propertyItem.predicate} ${varName} .`);
        if (propertyItem.langFilter) {
          let langExpr = '';
          if (typeof propertyItem.langFilter === 'object' && !Array.isArray(propertyItem.langFilter)) {
            langExpr = this.expressionToString(propertyItem.langFilter, paramsMap);
          } else if (Array.isArray(propertyItem.langFilter)) {
            langExpr = propertyItem.langFilter.join(',');
          } else {
            langExpr = String(propertyItem.langFilter);
          }
          const langs = langExpr.replace(/^"|"$/g, '').split(',').map(s => `"${s.trim()}"`);
          whereClauseLines.push(`FILTER(LANG(${varName}) IN (${langs.join(', ')}))`);
        }
        if (!propertyItem.isWhereOnly) {
          constructTriples.push({ subject: itemConstructSubject, predicate: targetPred, object: varName });
        }
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
        if (!propertyItem.isWhereOnly) {
          constructTriples.push({ subject: itemConstructSubject, predicate: targetPred, object: boundVar });
        }
      } else {
        const objVal = this.expressionToString(valExpr, paramsMap);
        whereClauseLines.push(`${itemWhereSubject} ${propertyItem.predicate} ${objVal} .`);
        if (!propertyItem.isWhereOnly) {
          constructTriples.push({ subject: itemConstructSubject, predicate: targetPred, object: objVal });
        }
      }
      return;
    }

    const useDirective = item as UseDirectiveNode;
    if (useDirective.type === 'UseDirectiveNode') {
      if (this.mixins.has(useDirective.mixinName)) {
        const mixinDef = this.mixins.get(useDirective.mixinName)!;
        const mixinScopeId = `mx${mixinCounter.count++}`;
        const varMap = new Map<string, string>();

        const childParamsMap: Record<string, unknown> = { ...paramsMap };
        if (mixinDef.params && mixinDef.params.length > 0) {
          for (let i = 0; i < mixinDef.params.length; i++) {
            const paramDef = mixinDef.params[i];
            const paramKey = paramDef.name.replace(/^\$/, '');
            let paramVal: unknown = undefined;

            if (useDirective.args && i < useDirective.args.length) {
              const argExpr = useDirective.args[i];
              if (argExpr.type === 'VariableNode') {
                paramVal = argExpr.name;
              } else {
                paramVal = this.expressionToString(argExpr, paramsMap).replace(/^"|"$/g, '');
              }
            } else if (paramDef.defaultValue) {
              paramVal = this.expressionToString(paramDef.defaultValue, paramsMap).replace(/^"|"$/g, '');
            }

            if (paramVal !== undefined) {
              const rawKey = paramDef.name.replace(/^\$|^\?/, '');
              childParamsMap[rawKey] = paramVal;
              childParamsMap[`$${rawKey}`] = paramVal;
              childParamsMap[`?${rawKey}`] = paramVal;
              childParamsMap[paramDef.name] = paramVal;
            }
          }
        }

        const paramNames = new Set(mixinDef.params ? mixinDef.params.map(p => p.name) : []);
        const scopedBody = mixinDef.body.map(bItem => this.scopeBodyItem(bItem, mixinScopeId, varMap, paramNames));
        this.collectBodyVariables(scopedBody, definedVars);

        for (const mItem of scopedBody) {
          this.expandBodyItem(mItem, whereSubject, constructSubject, whereClauseLines, constructTriples, definedVars, childParamsMap, ruleIdx, bindCounter, mixinCounter);
        }
      }
      return;
    }

    const nestedTraversal = item as NestedTraversalNode;
    if (nestedTraversal.type === 'NestedTraversalNode') {
      let parentSubject = whereSubject;
      if (nestedTraversal.subject) {
        parentSubject = nestedTraversal.subject === '?focusNode' ? whereSubject : nestedTraversal.subject;
      }
      const childVar = `?child_${ruleIdx}_${nestedTraversal.path.replace(/[:/^-]/g, '_')}`;
      if (nestedTraversal.isInverse) {
        whereClauseLines.push(`${childVar} ${nestedTraversal.path} ${parentSubject} .`);
      } else {
        whereClauseLines.push(`${parentSubject} ${nestedTraversal.path} ${childVar} .`);
      }

      for (const childItem of nestedTraversal.body) {
        this.expandBodyItem(childItem, childVar, constructSubject, whereClauseLines, constructTriples, definedVars, paramsMap, ruleIdx, bindCounter, mixinCounter);
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

  private scopeVar(varName: string, mixinScopeId: string, varMap: Map<string, string>, paramNames?: Set<string>): string {
    if (!varName.startsWith('?') || varName === '?focusNode') return varName;
    if (paramNames && (paramNames.has(varName) || paramNames.has(varName.replace(/^\?/, '$')) || paramNames.has(varName.replace(/^\?/, '')))) {
      return varName;
    }
    if (!varMap.has(varName)) {
      varMap.set(varName, `${varName}_${mixinScopeId}`);
    }
    return varMap.get(varName)!;
  }

  private scopeBodyItem(item: BodyItemNode, mixinScopeId: string, varMap: Map<string, string>, paramNames?: Set<string>): BodyItemNode {
    if (item.type === 'PropertyPatternNode') {
      return {
        ...item,
        subject: item.subject ? this.scopeVar(item.subject, mixinScopeId, varMap, paramNames) : undefined,
        constructSubject: item.constructSubject ? this.scopeVar(item.constructSubject, mixinScopeId, varMap, paramNames) : undefined,
        value: this.scopeExpression(item.value, mixinScopeId, varMap, paramNames)
      };
    }
    if (item.type === 'ValuesBlockNode') {
      const scopedVars = item.variables.map(v => this.scopeVar(v, mixinScopeId, varMap, paramNames));
      let valuesText = item.valuesText;
      for (let i = 0; i < item.variables.length; i++) {
        const origVar = item.variables[i];
        const newVar = scopedVars[i];
        valuesText = valuesText.replace(new RegExp('\\' + origVar + '\\b', 'g'), newVar);
      }
      return {
        ...item,
        variables: scopedVars,
        valuesText
      };
    }
    if (item.type === 'BindNode') {
      return {
        ...item,
        variable: this.scopeVar(item.variable, mixinScopeId, varMap, paramNames)
      };
    }
    if (item.type === 'UseDirectiveNode') {
      return {
        ...item,
        args: item.args ? item.args.map(arg => this.scopeExpression(arg, mixinScopeId, varMap, paramNames)) : []
      };
    }
    if (item.type === 'NestedTraversalNode') {
      return {
        ...item,
        subject: item.subject ? this.scopeVar(item.subject, mixinScopeId, varMap, paramNames) : undefined,
        body: item.body.map(b => this.scopeBodyItem(b, mixinScopeId, varMap, paramNames))
      };
    }
    if (item.type === 'LangDirectiveNode') {
      return {
        ...item,
        targetVar: item.targetVar ? this.scopeVar(item.targetVar, mixinScopeId, varMap, paramNames) : undefined,
        targetVarExpr: item.targetVarExpr ? this.scopeExpression(item.targetVarExpr, mixinScopeId, varMap, paramNames) : undefined,
        languages: typeof item.languages === 'object' && !Array.isArray(item.languages)
          ? this.scopeExpression(item.languages, mixinScopeId, varMap, paramNames)
          : item.languages
      };
    }
    if (item.type === 'FilterNode') {
      let exprText = item.expressionText;
      varMap.forEach((scoped, orig) => {
        exprText = exprText.replace(new RegExp('\\' + orig + '\\b', 'g'), scoped);
      });
      return {
        ...item,
        expressionText: exprText
      };
    }
    return item;
  }

  private scopeExpression(expr: ExpressionNode, mixinScopeId: string, varMap: Map<string, string>, paramNames?: Set<string>): ExpressionNode {
    if (expr.type === 'VariableNode') {
      return { type: 'VariableNode', name: this.scopeVar(expr.name, mixinScopeId, varMap, paramNames) };
    }
    if (expr.type === 'FunctionCallNode') {
      return {
        ...expr,
        args: expr.args.map(a => this.scopeExpression(a, mixinScopeId, varMap, paramNames))
      };
    }
    return expr;
  }

  private ensureDefaultPrefix(prefixes: Array<{ prefix: string; iri: string }>, prefix: string, iri: string) {
    if (!prefixes.some(p => p.prefix === prefix)) {
      prefixes.unshift({ prefix, iri });
    }
  }
}
