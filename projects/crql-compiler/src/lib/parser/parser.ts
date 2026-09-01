import { Lexer } from '../lexer/lexer';
import {
  ASTNode,
  AttributeFilterNode,
  BindNode,
  BodyItemNode,
  BooleanLiteralNode,
  CustomSelectorNode,
  CustomSelectorPattern,
  DocumentNode,
  ExpressionNode,
  FallbackBlockNode,
  FilterNode,
  FunctionCallNode,
  UseDirectiveNode,
  LangDirectiveNode,
  MixinNode,
  NestedTraversalNode,
  NumberLiteralNode,
  PageDirectiveNode,
  ParameterDef,
  ParamVarNode,
  PrefixDeclNode,
  PropertyPatternNode,
  RuleBlockNode,
  SelectorExprNode,
  StringLiteralNode,
  SubSelectNode,
  Token,
  TokenType,
  TriplePattern,
  TypedLiteralNode,
  ValuesBlockNode,
  VariableNode
} from '../types/ast';

export class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(input: string) {
    const lexer = new Lexer(input);
    this.tokens = lexer.tokenize();
  }

  public parse(): DocumentNode {
    const prefixes: PrefixDeclNode[] = [];
    const customSelectors: CustomSelectorNode[] = [];
    const mixins: MixinNode[] = [];
    const rules: RuleBlockNode[] = [];
    const langDirectives: LangDirectiveNode[] = [];

    while (!this.isAtEnd()) {
      const token = this.peek();

      if (token.type === 'AT_PREFIX') {
        prefixes.push(this.parsePrefixDecl());
      } else if (token.type === 'AT_CUSTOM_SELECTOR') {
        customSelectors.push(this.parseCustomSelectorDef());
      } else if (token.type === 'AT_MIXIN') {
        mixins.push(this.parseMixinDef());
      } else if (token.type === 'AT_LANG') {
        langDirectives.push(this.parseLangDirective());
      } else if (
        token.type === 'CUSTOM_SELECTOR_NAME' ||
        token.type === 'IDENTIFIER' ||
        token.type === 'COLON'
      ) {
        rules.push(this.parseRuleBlock());
      } else {
        // Skip unexpected tokens to prevent infinite loops
        this.advance();
      }
    }

    return {
      type: 'DocumentNode',
      prefixes,
      customSelectors,
      mixins,
      rules,
      langDirectives
    };
  }

  private parsePrefixDecl(): PrefixDeclNode {
    this.consume('AT_PREFIX', "Expected '@prefix'");
    const prefixToken = this.consume('IDENTIFIER', 'Expected prefix identifier');
    const prefix = prefixToken.value.replace(/:$/, '');

    let iri = '';
    if (this.check('STRING_LITERAL')) {
      iri = this.advance().value;
    } else {
      throw new Error(`Expected IRI string for prefix '${prefix}' at line ${prefixToken.line}`);
    }

    if (this.check('SEMICOLON')) {
      this.advance();
    }

    return {
      type: 'PrefixDeclNode',
      prefix,
      iri
    };
  }

  private parseCustomSelectorDef(): CustomSelectorNode {
    this.consume('AT_CUSTOM_SELECTOR', "Expected '@custom-selector'");
    const nameToken = this.consume('CUSTOM_SELECTOR_NAME', 'Expected custom selector name e.g. :--estoniaCompanies');

    let params: ParameterDef[] = [];
    if (this.check('LPAREN')) {
      params = this.parseParameterDefs();
    }

    this.consume('LBRACE', "Expected '{' to start custom selector block");

    const patterns: CustomSelectorPattern[] = [];
    let currentSubject = '?focusNode';

    while (!this.check('RBRACE') && !this.isAtEnd()) {
      const startPos = this.pos;
      if (
        this.check('AT_BIND') ||
        (this.check('IDENTIFIER') && this.peek().value.toUpperCase() === 'BIND')
      ) {
        patterns.push(this.parseBindNode());
        if (this.check('SEMICOLON') || this.check('DOT')) {
          this.advance();
        }
        if (this.pos === startPos) {
          this.advance();
        }
        continue;
      }
      if (this.check('VARIABLE')) {
        currentSubject = this.advance().value;
      }
      const predicateToken = this.consume('IDENTIFIER', 'Expected predicate identifier');

      let object: ExpressionNode | string;
      if (this.check('VARIABLE')) {
        object = this.advance().value;
      } else {
        object = this.parseExpression();
      }

      patterns.push({
        subject: currentSubject,
        predicate: predicateToken.value,
        object
      });

      if (this.check('SEMICOLON') || this.check('DOT')) {
        this.advance();
      }
      if (this.pos === startPos) {
        this.advance();
      }
    }

    this.consume('RBRACE', "Expected '}' at end of custom selector block");

    return {
      type: 'CustomSelectorNode',
      name: nameToken.value,
      params,
      patterns
    };
  }

  private parseMixinDef(): MixinNode {
    this.consume('AT_MIXIN', "Expected '@mixin'");
    const nameToken = this.consume('MIXIN_NAME', 'Expected mixin name e.g. --name-and-address');

    let params: ParameterDef[] = [];
    if (this.check('LPAREN')) {
      params = this.parseParameterDefs();
    }

    this.consume('LBRACE', "Expected '{' to start mixin block");

    const body = this.parseBodyBlockItems();

    this.consume('RBRACE', "Expected '}' at end of mixin block");

    return {
      type: 'MixinNode',
      name: nameToken.value,
      params,
      body
    };
  }

  private parseBodyBlockItems(pageDirectives?: PageDirectiveNode): BodyItemNode[] {
    const body: BodyItemNode[] = [];
    let activeSubject: string | undefined = undefined;

    while (!this.check('RBRACE') && !this.isAtEnd()) {
      if (this.check('DOT')) {
        this.advance();
        activeSubject = undefined;
        continue;
      }

      if (this.check('AT_LIMIT') || this.check('AT_OFFSET') || this.check('AT_ORDER_BY')) {
        if (pageDirectives) {
          this.parsePageDirectiveItem(pageDirectives);
        } else {
          this.advance();
        }
        if (this.check('SEMICOLON')) this.advance();
        continue;
      }

      const startPos = this.pos;
      const item = this.parseRuleBodyItem(activeSubject);

      if (item && item.type !== 'FallbackBlockNode') {
        body.push(item);
        if (item.type === 'PropertyPatternNode') {
          if (item.subject) {
            activeSubject = item.subject;
          }
        }
      }

      if (this.check('DOT')) {
        this.advance();
        activeSubject = undefined;
      } else if (this.check('SEMICOLON')) {
        this.advance();
      }

      if (this.pos === startPos) {
        this.advance();
      }
    }

    return body;
  }

  private parseParameterDefs(): ParameterDef[] {
    this.consume('LPAREN', "Expected '('");
    const params: ParameterDef[] = [];

    while (!this.check('RPAREN') && !this.isAtEnd()) {
      let paramToken: Token;
      if (this.check('PARAM_VAR') || this.check('VARIABLE')) {
        paramToken = this.advance();
      } else {
        paramToken = this.consume('PARAM_VAR', 'Expected parameter variable starting with $ or ?');
      }
      let defaultValue: ExpressionNode | undefined = undefined;

      if (this.check('EQUALS')) {
        this.advance();
        defaultValue = this.parseExpression();
      }

      params.push({ name: paramToken.value, defaultValue });

      if (this.check('COMMA')) {
        this.advance();
      }
    }

    this.consume('RPAREN', "Expected ')'");
    return params;
  }

  private parseTriplePattern(): TriplePattern {
    const subjectToken = this.consume('VARIABLE', 'Expected subject variable starting with ?');
    const predicateToken = this.consume('IDENTIFIER', 'Expected predicate identifier');

    let object: ExpressionNode | string;
    if (this.check('VARIABLE')) {
      object = this.advance().value;
    } else {
      object = this.parseExpression();
    }

    return {
      subject: subjectToken.value,
      predicate: predicateToken.value,
      object
    };
  }

  private parseRuleBlock(): RuleBlockNode {
    const selectors: SelectorExprNode[] = [];

    // Parse comma-separated selectors
    do {
      if (this.check('COMMA')) {
        this.advance();
      }
      selectors.push(this.parseSelectorExpr());
    } while (this.check('COMMA'));

    this.consume('LBRACE', "Expected '{' to start rule block");

    const pageDirectives: PageDirectiveNode = { type: 'PageDirectiveNode' };
    const body = this.parseBodyBlockItems(pageDirectives);

    this.consume('RBRACE', "Expected '}' at end of rule block");

    const hasDirectives = pageDirectives.limit !== undefined || pageDirectives.offset !== undefined || pageDirectives.orderBy !== undefined;

    return {
      type: 'RuleBlockNode',
      selectors,
      body,
      pageDirectives: hasDirectives ? pageDirectives : undefined
    };
  }

  private parseSelectorExpr(): SelectorExprNode {
    let name = '';
    if (this.check('CUSTOM_SELECTOR_NAME')) {
      name = this.advance().value;
    } else if (this.check('IDENTIFIER')) {
      name = this.advance().value;
    } else if (this.check('COLON')) {
      this.advance();
      const next = this.consume('IDENTIFIER', 'Expected identifier after colon');
      name = ':' + next.value;
    } else {
      throw new Error(`Unexpected token '${this.peek().value}' when parsing selector`);
    }

    let params: ExpressionNode[] | undefined = undefined;
    if (this.check('LPAREN')) {
      this.advance();
      params = [];
      while (!this.check('RPAREN') && !this.isAtEnd()) {
        const startPos = this.pos;
        params.push(this.parseExpression());
        if (this.check('COMMA')) this.advance();
        if (this.pos === startPos) this.advance();
      }
      this.consume('RPAREN', "Expected ')'");
    }

    const attributeFilters: AttributeFilterNode[] = [];
    while (this.check('LBRACKET')) {
      const startPos = this.pos;
      attributeFilters.push(this.parseAttributeFilter());
      if (this.pos === startPos) this.advance();
    }

    return {
      type: 'SelectorExprNode',
      name,
      params,
      attributeFilters
    };
  }

  private parseAttributeFilter(): AttributeFilterNode {
    this.consume('LBRACKET', "Expected '['");
    const predToken = this.consume('IDENTIFIER', 'Expected predicate identifier inside attribute filter');

    let op: '=' | '!=' | '>=' | '<=' | '>' | '<' = '=';
    if (this.check('EQUALS')) {
      this.advance();
      op = '=';
    } else if (this.check('NOT_EQUALS')) {
      this.advance();
      op = '!=';
    } else if (this.check('GTE')) {
      this.advance();
      op = '>=';
    } else if (this.check('LTE')) {
      this.advance();
      op = '<=';
    } else if (this.check('GT')) {
      this.advance();
      op = '>';
    } else if (this.check('LT')) {
      this.advance();
      op = '<';
    }

    const valExpr = this.parseExpression();
    this.consume('RBRACKET', "Expected ']' at end of attribute filter");

    return {
      type: 'AttributeFilterNode',
      predicate: predToken.value,
      operator: op,
      value: valExpr
    };
  }

  private parseRuleBodyItem(inheritedSubject?: string): BodyItemNode | null {
    const token = this.peek();

    if (token.type === 'AT_USE') {
      return this.parseUseDirective();
    }

    if (token.type === 'AT_FALLBACK') {
      return this.parseFallbackBlock();
    }

    if (token.type === 'AT_LANG') {
      return this.parseLangDirective();
    }

    if (token.type === 'IDENTIFIER' && token.value.toUpperCase() === 'FILTER') {
      return this.parseFilterNode();
    }

    if (token.type === 'AT_VALUES' || (token.type === 'IDENTIFIER' && token.value.toUpperCase() === 'VALUES')) {
      return this.parseValuesBlock();
    }

    if (token.type === 'AT_BIND' || (token.type === 'IDENTIFIER' && token.value.toUpperCase() === 'BIND')) {
      return this.parseBindNode();
    }

    if (
      token.type === 'AT_SELECT' ||
      (token.type === 'IDENTIFIER' && token.value.toUpperCase() === 'SELECT') ||
      (token.type === 'LBRACE' && this.peekAhead(1).type === 'IDENTIFIER' && this.peekAhead(1).value.toUpperCase() === 'SELECT')
    ) {
      return this.parseSubSelectBlock();
    }

    // Check for nested traversal e.g. ex:hasManager { ... }, ex:hasManager > { ... }, or ^ex:hasMember { ... }
    if (token.type === 'IDENTIFIER' || token.type === 'CARET') {
      let isInverse = false;
      if (token.type === 'CARET') {
        isInverse = true;
        this.advance();
      }
      const pathToken = this.peek();
      if (
        pathToken.type === 'IDENTIFIER' &&
        (this.peekAhead(1).type === 'GT' || this.peekAhead(1).type === 'LBRACE')
      ) {
        this.advance(); // consume pathToken
        if (this.check('GT')) {
          this.advance(); // consume '>' if present
        }
        this.consume('LBRACE', "Expected '{' for nested traversal block");

        const body = this.parseBodyBlockItems();

        this.consume('RBRACE', "Expected '}'");

        return {
          type: 'NestedTraversalNode',
          subject: inheritedSubject,
          path: pathToken.value,
          isInverse,
          body
        };
      }
    }

    let isWhereOnly = false;
    if (this.check('AT_WHERE')) {
      this.advance(); // consume '@where'
      isWhereOnly = true;
    }

    // Standard Property Pattern: [subjectVar] predicate [varOrExpr] [=> [?constructSubject] targetPredicate] [varOrExpr]
    let customSubject: string | undefined = undefined;
    if (this.check('VARIABLE') && this.peekAhead(1).type === 'IDENTIFIER') {
      customSubject = this.advance().value;
    }

    if (this.check('IDENTIFIER')) {
      const predicate = this.advance().value;

      let langFilter: ExpressionNode | string[] | undefined = undefined;
      if (this.check('LBRACKET')) {
        const startPos = this.pos;
        this.advance(); // consume '['
        const attrToken = this.peek();
        if (attrToken.type === 'IDENTIFIER' && attrToken.value.toLowerCase() === 'lang') {
          this.advance(); // consume 'lang'
          this.consume('EQUALS', "Expected '=' after lang");
          if (this.check('PARAM_VAR')) {
            langFilter = this.parseExpression();
          } else if (this.check('STRING_LITERAL')) {
            const rawVal = this.advance().value;
            langFilter = rawVal.split(',').map(s => s.trim());
          } else {
            langFilter = this.parseExpression();
          }
          this.consume('RBRACKET', "Expected ']' at end of lang filter");
        } else {
          this.pos = startPos; // rewind if not lang attribute
        }
      }

      let value: ExpressionNode | undefined = undefined;
      let targetPredicate: string | undefined = undefined;
      let constructSubject: string | undefined = undefined;

      // 1. Check if variable or expression comes before => (e.g. schema:name ?name => ui:name)
      if (
        this.check('VARIABLE') ||
        this.check('STRING_LITERAL') ||
        this.check('NUMBER_LITERAL') ||
        this.check('BOOLEAN_LITERAL') ||
        this.check('TYPED_LITERAL') ||
        (this.check('IDENTIFIER') && this.peekAhead(1).type === 'LPAREN')
      ) {
        value = this.parseExpression();
      }

      // 2. Check for => [?constructSubject] targetPredicate mapping
      if (this.check('ARROW_RIGHT')) {
        this.advance(); // consume '=>'
        if (this.check('VARIABLE')) {
          constructSubject = this.advance().value;
        }
        targetPredicate = this.consume('IDENTIFIER', 'Expected target predicate after =>').value;
      }

      // 3. If value was not provided before =>, check if it comes after => (e.g. schema:name => ui:name ?name)
      if (!value) {
        if (this.check('VARIABLE')) {
          value = { type: 'VariableNode', name: this.advance().value };
        } else if (this.check('SEMICOLON') || this.check('RBRACE')) {
          const defaultVarName = predicate.includes(':') ? predicate.split(':')[1] : predicate;
          value = { type: 'VariableNode', name: `?${defaultVarName}` };
        } else {
          value = this.parseExpression();
        }
      }

      return {
        type: 'PropertyPatternNode',
        subject: customSubject || inheritedSubject,
        predicate,
        targetPredicate,
        constructSubject,
        value,
        isWhereOnly,
        langFilter
      };
    }

    return null;
  }

  private parseValuesBlock(): ValuesBlockNode {
    if (this.check('AT_VALUES')) {
      this.advance();
    } else {
      this.consume('IDENTIFIER', "Expected 'VALUES'");
    }

    const variables: string[] = [];

    if (this.check('LPAREN')) {
      this.advance();
      while (this.check('VARIABLE')) {
        variables.push(this.advance().value);
      }
      this.consume('RPAREN', "Expected ')' after VALUES variables");
    } else {
      while (this.check('VARIABLE')) {
        variables.push(this.advance().value);
      }
    }

    this.consume('LBRACE', "Expected '{' for VALUES block");
    
    let depth = 1;
    let valuesText = '';
    while (depth > 0 && !this.isAtEnd()) {
      const tok = this.peek();
      if (tok.type === 'LBRACE') {
        depth++;
        valuesText += tok.value + ' ';
      } else if (tok.type === 'RBRACE') {
        depth--;
        if (depth > 0) valuesText += tok.value + ' ';
      } else {
        valuesText += tok.value + ' ';
      }
      this.advance();
    }

    return {
      type: 'ValuesBlockNode',
      variables,
      valuesText: valuesText.trim()
    };
  }

  private parseSubSelectBlock(): SubSelectNode {
    if (this.check('AT_SELECT')) {
      this.advance();
    }

    let hasBrace = false;
    if (this.check('LBRACE')) {
      this.advance();
      hasBrace = true;
    }

    let queryText = 'SELECT ';
    if (this.check('IDENTIFIER') && this.peek().value.toUpperCase() === 'SELECT') {
      this.advance();
    }

    const projectedVars: string[] = [];

    while (!this.isAtEnd() && this.peek().value.toUpperCase() !== 'WHERE' && !this.check('LBRACE')) {
      const tok = this.advance();
      queryText += tok.value + ' ';
      if (tok.type === 'VARIABLE') {
        projectedVars.push(tok.value);
      }
    }

    let depth = hasBrace ? 1 : 0;
    while (!this.isAtEnd()) {
      const tok = this.peek();
      if (tok.type === 'LBRACE') {
        depth++;
        queryText += tok.value + ' ';
      } else if (tok.type === 'RBRACE') {
        depth--;
        if (depth < 1 && hasBrace) {
          this.advance();
          break;
        }
        queryText += tok.value + ' ';
      } else if (tok.type === 'SEMICOLON' && depth === 0) {
        break;
      } else {
        queryText += tok.value + ' ';
      }
      this.advance();
    }

    return {
      type: 'SubSelectNode',
      queryText: queryText.trim(),
      projectedVars
    };
  }

  private parseBindNode(): BindNode {
    if (this.check('AT_BIND')) {
      this.advance();
    } else {
      this.consume('IDENTIFIER', "Expected 'BIND'");
    }

    this.consume('LPAREN', "Expected '(' after BIND");

    let exprText = '';
    while (!this.isAtEnd() && this.peek().value.toUpperCase() !== 'AS') {
      const tok = this.advance();
      exprText += tok.value + ' ';
    }

    if (this.peek().value.toUpperCase() === 'AS') {
      this.advance();
    }

    const varToken = this.consume('VARIABLE', 'Expected target variable after AS in BIND');
    this.consume('RPAREN', "Expected ')' at end of BIND expression");

    return {
      type: 'BindNode',
      expressionText: exprText.trim(),
      variable: varToken.value
    };
  }

  private parseLangDirective(): LangDirectiveNode {
    this.consume('AT_LANG', "Expected '@lang'");
    let targetVarExpr: ExpressionNode | undefined = undefined;

    if (this.check('LPAREN')) {
      this.advance();
      if (this.check('VARIABLE') || this.check('PARAM_VAR')) {
        targetVarExpr = this.parseExpression();
        if (this.check('COMMA')) this.advance();
      }
      const expr = this.parseExpression();
      this.consume('RPAREN', "Expected ')' after @lang");
      return {
        type: 'LangDirectiveNode',
        targetVarExpr,
        targetVar: targetVarExpr?.type === 'VariableNode' ? targetVarExpr.name : undefined,
        languages: expr
      };
    } else {
      if (this.check('PARAM_VAR')) {
        const expr = this.parseExpression();
        return {
          type: 'LangDirectiveNode',
          languages: expr
        };
      }
      const langs: string[] = [];
      while (this.check('STRING_LITERAL')) {
        langs.push(this.advance().value);
        if (this.check('COMMA')) this.advance();
      }
      return {
        type: 'LangDirectiveNode',
        languages: langs.length > 0 ? langs : ['de', 'en', 'fr', 'it']
      };
    }
  }

  private parseFilterNode(): FilterNode {
    this.consume('IDENTIFIER', "Expected 'FILTER'");
    this.consume('LPAREN', "Expected '(' after FILTER");

    let depth = 1;
    let exprText = '';
    while (depth > 0 && !this.isAtEnd()) {
      const tok = this.peek();
      if (tok.type === 'LPAREN') {
        depth++;
        const lastWord = exprText.trim().split(/\s+/).pop() || '';
        const isFnCall = /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(lastWord) && lastWord.toUpperCase() !== 'IN' && lastWord.toUpperCase() !== 'NOT';
        exprText += (isFnCall || exprText.length === 0 || exprText.endsWith('(') ? '' : ' ') + '(';
      } else if (tok.type === 'RPAREN') {
        depth--;
        if (depth > 0) exprText += ')';
      } else if (tok.type === 'STRING_LITERAL') {
        exprText += (exprText.length > 0 && !exprText.endsWith('(') && !exprText.endsWith(' ') ? ' ' : '') + `"${tok.value}"`;
      } else if (tok.type === 'COMMA') {
        exprText += ', ';
      } else {
        exprText += (exprText.length > 0 && !exprText.endsWith('(') && !exprText.endsWith(', ') && !exprText.endsWith(' ') ? ' ' : '') + tok.value;
      }
      this.advance();
    }

    return {
      type: 'FilterNode',
      expressionText: exprText.trim()
    };
  }

  private parseUseDirective(): UseDirectiveNode {
    this.consume('AT_USE', "Expected '@use'");
    const mixinNameToken = this.consume('MIXIN_NAME', 'Expected mixin name starting with --');

    const args: ExpressionNode[] = [];
    if (this.check('LPAREN')) {
      this.advance();
      while (!this.check('RPAREN') && !this.isAtEnd()) {
        args.push(this.parseExpression());
        if (this.check('COMMA')) this.advance();
      }
      this.consume('RPAREN', "Expected ')' after mixin args");
    }

    return {
      type: 'UseDirectiveNode',
      mixinName: mixinNameToken.value,
      args
    };
  }

  private parseFallbackBlock(): FallbackBlockNode {
    this.consume('AT_FALLBACK', "Expected '@fallback'");
    this.consume('LBRACE', "Expected '{' to start fallback block");

    const branches: BodyItemNode[][] = [];

    while (!this.check('RBRACE') && !this.isAtEnd()) {
      const startPos = this.pos;
      if (this.check('LBRACE')) {
        this.advance();
        const branchItems: BodyItemNode[] = [];
        while (!this.check('RBRACE') && !this.isAtEnd()) {
          const bStartPos = this.pos;
          const item = this.parseRuleBodyItem();
          if (item && item.type !== 'FallbackBlockNode') {
            branchItems.push(item);
          }
          if (this.check('SEMICOLON')) this.advance();
          if (this.pos === bStartPos) this.advance();
        }
        this.consume('RBRACE', "Expected '}'");
        branches.push(branchItems);
      } else {
        const item = this.parseRuleBodyItem();
        if (item && item.type !== 'FallbackBlockNode') {
          branches.push([item]);
        }
      }
      if (this.check('SEMICOLON')) this.advance();
      if (this.pos === startPos) this.advance();
    }

    this.consume('RBRACE', "Expected '}' at end of fallback block");

    return {
      type: 'FallbackBlockNode',
      branches
    };
  }

  private parsePageDirectiveItem(directives: PageDirectiveNode) {
    if (this.check('AT_LIMIT')) {
      this.advance();
      const num = this.consume('NUMBER_LITERAL', 'Expected number after @limit');
      directives.limit = parseInt(num.value, 10);
    } else if (this.check('AT_OFFSET')) {
      this.advance();
      const num = this.consume('NUMBER_LITERAL', 'Expected number after @offset');
      directives.offset = parseInt(num.value, 10);
    } else if (this.check('AT_ORDER_BY')) {
      this.advance();
      let varOrExpr = '';
      if (this.check('VARIABLE')) {
        varOrExpr = this.advance().value;
      } else {
        varOrExpr = this.parseExpression().type;
      }
      let direction: 'ASC' | 'DESC' = 'ASC';
      if (this.check('IDENTIFIER') && (this.peek().value === 'ASC' || this.peek().value === 'DESC')) {
        direction = this.advance().value as 'ASC' | 'DESC';
      }
      directives.orderBy = { variableOrExpr: varOrExpr, direction };
    }
  }

  private parseExpression(): ExpressionNode {
    const token = this.peek();

    if (token.type === 'VARIABLE') {
      return { type: 'VariableNode', name: this.advance().value };
    }

    if (token.type === 'PARAM_VAR') {
      return { type: 'ParamVarNode', name: this.advance().value };
    }

    if (token.type === 'STRING_LITERAL') {
      return { type: 'StringLiteralNode', value: this.advance().value };
    }

    if (token.type === 'NUMBER_LITERAL') {
      return { type: 'NumberLiteralNode', value: parseFloat(this.advance().value) };
    }

    if (token.type === 'BOOLEAN_LITERAL') {
      return { type: 'BooleanLiteralNode', value: this.advance().value === 'true' };
    }

    if (token.type === 'TYPED_LITERAL') {
      const raw = this.advance().value; // e.g. "2026-08-27"^^xsd:date
      const parts = raw.split('^^');
      const val = parts[0].replace(/^"|"$/g, '');
      const datatype = parts[1] || 'xsd:string';
      return { type: 'TypedLiteralNode', value: val, datatype };
    }

    if (token.type === 'IDENTIFIER') {
      const name = this.advance().value;

      // Function call e.g. concat(?a, " ", ?b) or iri(...) or calc(...) or xsd:dateTime(...)
      if (this.check('LPAREN')) {
        this.advance();
        const args: ExpressionNode[] = [];
        while (!this.check('RPAREN') && !this.isAtEnd()) {
          const startPos = this.pos;
          args.push(this.parseExpression());
          if (this.check('COMMA')) this.advance();
          if (this.pos === startPos) this.advance();
        }
        this.consume('RPAREN', "Expected ')'");
        return {
          type: 'FunctionCallNode',
          name,
          args
        };
      }

      return { type: 'StringLiteralNode', value: name };
    }

    if (
      token.type === 'STAR' ||
      token.type === 'PLUS' ||
      token.type === 'MINUS' ||
      token.type === 'SLASH'
    ) {
      return { type: 'StringLiteralNode', value: this.advance().value };
    }

    throw new Error(`Unexpected expression token '${token.value}' at line ${token.line}`);
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    const token = this.peek();
    throw new Error(`${message} (got '${token.value}' at line ${token.line}, column ${token.column})`);
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.pos++;
    return this.tokens[this.pos - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.pos] || { type: 'EOF', value: '', line: 0, column: 0 };
  }

  private peekAhead(offset: number): Token {
    return this.tokens[this.pos + offset] || { type: 'EOF', value: '', line: 0, column: 0 };
  }
}
