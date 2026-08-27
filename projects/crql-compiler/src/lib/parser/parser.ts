import { Lexer } from '../lexer/lexer';
import {
  ASTNode,
  AttributeFilterNode,
  BooleanLiteralNode,
  CustomSelectorNode,
  DocumentNode,
  ExpressionNode,
  FallbackBlockNode,
  FunctionCallNode,
  GetDirectiveNode,
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
  Token,
  TokenType,
  TriplePattern,
  TypedLiteralNode,
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

    while (!this.isAtEnd()) {
      const token = this.peek();

      if (token.type === 'AT_PREFIX') {
        prefixes.push(this.parsePrefixDecl());
      } else if (token.type === 'AT_CUSTOM_SELECTOR') {
        customSelectors.push(this.parseCustomSelectorDef());
      } else if (token.type === 'AT_MIXIN') {
        mixins.push(this.parseMixinDef());
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
      rules
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

    const patterns: TriplePattern[] = [];
    let currentSubject = '?focusNode';

    while (!this.check('RBRACE') && !this.isAtEnd()) {
      const startPos = this.pos;
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

    const body: Array<PropertyPatternNode | GetDirectiveNode | NestedTraversalNode | FallbackBlockNode> = [];
    while (!this.check('RBRACE') && !this.isAtEnd()) {
      const startPos = this.pos;
      const item = this.parseRuleBodyItem();
      if (item) body.push(item);
      if (this.check('SEMICOLON')) {
        this.advance();
      }
      if (this.pos === startPos) {
        this.advance();
      }
    }

    this.consume('RBRACE', "Expected '}' at end of mixin block");

    return {
      type: 'MixinNode',
      name: nameToken.value,
      params,
      body
    };
  }

  private parseParameterDefs(): ParameterDef[] {
    this.consume('LPAREN', "Expected '('");
    const params: ParameterDef[] = [];

    while (!this.check('RPAREN') && !this.isAtEnd()) {
      const paramToken = this.consume('PARAM_VAR', 'Expected parameter variable starting with $');
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

    const body: Array<PropertyPatternNode | GetDirectiveNode | NestedTraversalNode | FallbackBlockNode> = [];
    let pageDirectives: PageDirectiveNode | undefined = undefined;

    while (!this.check('RBRACE') && !this.isAtEnd()) {
      const startPos = this.pos;
      const token = this.peek();

      if (token.type === 'AT_LIMIT' || token.type === 'AT_OFFSET' || token.type === 'AT_ORDER_BY') {
        if (!pageDirectives) pageDirectives = { type: 'PageDirectiveNode' };
        this.parsePageDirectiveItem(pageDirectives);
      } else {
        const item = this.parseRuleBodyItem();
        if (item) body.push(item);
      }

      if (this.check('SEMICOLON')) {
        this.advance();
      }

      if (this.pos === startPos) {
        this.advance();
      }
    }

    this.consume('RBRACE', "Expected '}' at end of rule block");

    return {
      type: 'RuleBlockNode',
      selectors,
      body,
      pageDirectives
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

  private parseRuleBodyItem(): PropertyPatternNode | GetDirectiveNode | NestedTraversalNode | FallbackBlockNode | null {
    const token = this.peek();

    if (token.type === 'AT_GET') {
      return this.parseGetDirective();
    }

    if (token.type === 'AT_FALLBACK') {
      return this.parseFallbackBlock();
    }

    // Check for nested traversal e.g. ex:hasManager > { ... } or ^ex:hasMember > { ... }
    if (token.type === 'IDENTIFIER' || token.type === 'CARET') {
      let isInverse = false;
      if (token.type === 'CARET') {
        isInverse = true;
        this.advance();
      }
      const pathToken = this.peek();
      if (pathToken.type === 'IDENTIFIER' && this.peekAhead(1).type === 'GT') {
        this.advance(); // consume pathToken
        this.advance(); // consume '>'
        this.consume('LBRACE', "Expected '{' for nested traversal block");

        const body: Array<PropertyPatternNode | GetDirectiveNode | NestedTraversalNode> = [];
        while (!this.check('RBRACE') && !this.isAtEnd()) {
          const startPos = this.pos;
          const item = this.parseRuleBodyItem();
          if (item && item.type !== 'FallbackBlockNode') {
            body.push(item);
          }
          if (this.check('SEMICOLON')) this.advance();
          if (this.pos === startPos) this.advance();
        }
        this.consume('RBRACE', "Expected '}'");

        return {
          type: 'NestedTraversalNode',
          path: pathToken.value,
          isInverse,
          body
        };
      }
    }

    // Standard Property Pattern: predicate [=> targetPredicate] value
    if (token.type === 'IDENTIFIER') {
      const predicate = this.advance().value;

      let targetPredicate: string | undefined = undefined;
      if (this.check('ARROW_RIGHT')) {
        this.advance(); // consume '=>'
        targetPredicate = this.consume('IDENTIFIER', 'Expected target predicate after =>').value;
      }

      let value: ExpressionNode;
      if (this.check('VARIABLE')) {
        value = { type: 'VariableNode', name: this.advance().value };
      } else if (this.check('SEMICOLON') || this.check('RBRACE')) {
        const defaultVarName = predicate.includes(':') ? predicate.split(':')[1] : predicate;
        value = { type: 'VariableNode', name: `?${defaultVarName}` };
      } else {
        value = this.parseExpression();
      }

      return {
        type: 'PropertyPatternNode',
        predicate,
        targetPredicate,
        value
      };
    }

    return null;
  }

  private parseGetDirective(): GetDirectiveNode {
    this.consume('AT_GET', "Expected '@get'");
    const mixinNameToken = this.consume('MIXIN_NAME', 'Expected mixin name starting with --');

    const args: ExpressionNode[] = [];
    if (this.check('LPAREN')) {
      this.advance();
      while (!this.check('RPAREN') && !this.isAtEnd()) {
        const startPos = this.pos;
        args.push(this.parseExpression());
        if (this.check('COMMA')) this.advance();
        if (this.pos === startPos) this.advance();
      }
      this.consume('RPAREN', "Expected ')'");
    }

    return {
      type: 'GetDirectiveNode',
      mixinName: mixinNameToken.value,
      args
    };
  }

  private parseFallbackBlock(): FallbackBlockNode {
    this.consume('AT_FALLBACK', "Expected '@fallback'");
    this.consume('LBRACE', "Expected '{' to start fallback block");

    const branches: Array<Array<PropertyPatternNode | GetDirectiveNode | NestedTraversalNode>> = [];

    while (!this.check('RBRACE') && !this.isAtEnd()) {
      const startPos = this.pos;
      if (this.check('LBRACE')) {
        this.advance();
        const branchItems: Array<PropertyPatternNode | GetDirectiveNode | NestedTraversalNode> = [];
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
