import { Token, TokenType } from '../types/ast';

function isAlphaNumericOrSpecial(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (
    (code >= 97 && code <= 122) || // a-z
    (code >= 65 && code <= 90) ||  // A-Z
    (code >= 48 && code <= 57) ||  // 0-9
    code === 95 || code === 58 || code === 45 || code === 47 || code === 42 || code === 94 // _ : - / * ^
  );
}

function isDirectiveChar(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (
    (code >= 97 && code <= 122) ||
    (code >= 65 && code <= 90) ||
    (code >= 48 && code <= 57) ||
    code === 95 || code === 45
  );
}

function isCustomSelectorChar(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (
    (code >= 97 && code <= 122) ||
    (code >= 65 && code <= 90) ||
    (code >= 48 && code <= 57) ||
    code === 95 || code === 58 || code === 45
  );
}

function isVarChar(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (
    (code >= 97 && code <= 122) ||
    (code >= 65 && code <= 90) ||
    (code >= 48 && code <= 57) ||
    code === 95
  );
}

export class Lexer {
  private input: string;
  private pos = 0;
  private line = 1;
  private column = 1;

  constructor(input: string) {
    this.input = input;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.pos < this.input.length) {
      this.skipWhitespaceAndComments();
      if (this.pos >= this.input.length) break;

      const char = this.input[this.pos];
      const startLine = this.line;
      const startCol = this.column;

      // Handle Directives starting with '@'
      if (char === '@') {
        tokens.push(this.readDirective(startLine, startCol));
        continue;
      }

      // Handle Custom Selectors starting with ':--'
      if (this.input.startsWith(':--', this.pos)) {
        tokens.push(this.readCustomSelectorName(startLine, startCol));
        continue;
      }

      // Handle Variables starting with '?'
      if (char === '?') {
        tokens.push(this.readVariable(startLine, startCol));
        continue;
      }

      // Handle Param Variables starting with '$'
      if (char === '$') {
        tokens.push(this.readParamVariable(startLine, startCol));
        continue;
      }

      // Handle Mixin Names starting with '--'
      if (this.input.startsWith('--', this.pos)) {
        tokens.push(this.readMixinName(startLine, startCol));
        continue;
      }

      // Handle Strings ("..." or '...')
      if (char === '"' || char === "'") {
        tokens.push(this.readStringOrTypedLiteral(startLine, startCol));
        continue;
      }

      // Handle Numbers
      if (this.isDigit(char) || (char === '-' && this.isDigit(this.peek(1)))) {
        tokens.push(this.readNumber(startLine, startCol));
        continue;
      }

      // Handle Operators and Punctuation
      if (this.input.startsWith('=>', this.pos)) {
        this.advance(2);
        tokens.push({ type: 'ARROW_RIGHT', value: '=>', line: startLine, column: startCol });
        continue;
      }

      if (this.input.startsWith('>=', this.pos)) {
        this.advance(2);
        tokens.push({ type: 'GTE', value: '>=', line: startLine, column: startCol });
        continue;
      }

      if (this.input.startsWith('<=', this.pos)) {
        this.advance(2);
        tokens.push({ type: 'LTE', value: '<=', line: startLine, column: startCol });
        continue;
      }

      if (this.input.startsWith('!=', this.pos)) {
        this.advance(2);
        tokens.push({ type: 'NOT_EQUALS', value: '!=', line: startLine, column: startCol });
        continue;
      }

      switch (char) {
        case '{':
          this.advance();
          tokens.push({ type: 'LBRACE', value: '{', line: startLine, column: startCol });
          break;
        case '}':
          this.advance();
          tokens.push({ type: 'RBRACE', value: '}', line: startLine, column: startCol });
          break;
        case '(':
          this.advance();
          tokens.push({ type: 'LPAREN', value: '(', line: startLine, column: startCol });
          break;
        case ')':
          this.advance();
          tokens.push({ type: 'RPAREN', value: ')', line: startLine, column: startCol });
          break;
        case '[':
          this.advance();
          tokens.push({ type: 'LBRACKET', value: '[', line: startLine, column: startCol });
          break;
        case ']':
          this.advance();
          tokens.push({ type: 'RBRACKET', value: ']', line: startLine, column: startCol });
          break;
        case ';':
          this.advance();
          tokens.push({ type: 'SEMICOLON', value: ';', line: startLine, column: startCol });
          break;
        case '.':
          this.advance();
          tokens.push({ type: 'DOT', value: '.', line: startLine, column: startCol });
          break;
        case ',':
          this.advance();
          tokens.push({ type: 'COMMA', value: ',', line: startLine, column: startCol });
          break;
        case ':':
          this.advance();
          tokens.push({ type: 'COLON', value: ':', line: startLine, column: startCol });
          break;
        case '=':
          this.advance();
          tokens.push({ type: 'EQUALS', value: '=', line: startLine, column: startCol });
          break;
        case '>':
          this.advance();
          tokens.push({ type: 'GT', value: '>', line: startLine, column: startCol });
          break;
        case '<':
          if (
            this.input.startsWith('<http://', this.pos) ||
            this.input.startsWith('<https://', this.pos) ||
            this.input.startsWith('<urn:', this.pos)
          ) {
            tokens.push(this.readIdentifierOrKeyword(startLine, startCol));
          } else {
            this.advance();
            tokens.push({ type: 'LT', value: '<', line: startLine, column: startCol });
          }
          break;
        case '/':
          this.advance();
          tokens.push({ type: 'SLASH', value: '/', line: startLine, column: startCol });
          break;
        case '^':
          this.advance();
          tokens.push({ type: 'CARET', value: '^', line: startLine, column: startCol });
          break;
        case '+':
          this.advance();
          tokens.push({ type: 'PLUS', value: '+', line: startLine, column: startCol });
          break;
        case '-':
          this.advance();
          tokens.push({ type: 'MINUS', value: '-', line: startLine, column: startCol });
          break;
        case '*':
          this.advance();
          tokens.push({ type: 'STAR', value: '*', line: startLine, column: startCol });
          break;
        default:
          if (this.isIdentStart(char)) {
            tokens.push(this.readIdentifierOrKeyword(startLine, startCol));
          } else {
            throw new Error(`Unexpected character '${char}' at line ${this.line}, column ${this.column}`);
          }
      }
    }

    tokens.push({ type: 'EOF', value: '', line: this.line, column: this.column });
    return tokens;
  }

  private skipWhitespaceAndComments() {
    while (this.pos < this.input.length) {
      const char = this.input[this.pos];

      if (char === ' ' || char === '\t' || char === '\r') {
        this.advance();
      } else if (char === '\n') {
        this.pos++;
        this.line++;
        this.column = 1;
      } else if (char === '#' || (char === '/' && this.peek(1) === '/')) {
        // Line comment (# or //)
        while (this.pos < this.input.length && this.input[this.pos] !== '\n') {
          this.advance();
        }
      } else if (char === '/' && this.peek(1) === '*') {
        // Block comment /* ... */
        this.advance(2);
        while (this.pos < this.input.length) {
          if (this.input[this.pos] === '*' && this.peek(1) === '/') {
            this.advance(2);
            break;
          }
          if (this.input[this.pos] === '\n') {
            this.line++;
            this.column = 1;
            this.pos++;
          } else {
            this.advance();
          }
        }
      } else {
        break;
      }
    }
  }

  private readDirective(line: number, column: number): Token {
    let value = '@';
    this.advance(); // skip '@'
    while (this.pos < this.input.length && isDirectiveChar(this.input[this.pos])) {
      value += this.input[this.pos];
      this.advance();
    }

    switch (value) {
      case '@prefix':
        return { type: 'AT_PREFIX', value, line, column };
      case '@custom-selector':
        return { type: 'AT_CUSTOM_SELECTOR', value, line, column };
      case '@mixin':
        return { type: 'AT_MIXIN', value, line, column };
      case '@get':
        return { type: 'AT_GET', value, line, column };
      case '@fallback':
        return { type: 'AT_FALLBACK', value, line, column };
      case '@import':
        return { type: 'AT_IMPORT', value, line, column };
      case '@limit':
        return { type: 'AT_LIMIT', value, line, column };
      case '@offset':
        return { type: 'AT_OFFSET', value, line, column };
      case '@order-by':
        return { type: 'AT_ORDER_BY', value, line, column };
      case '@values':
        return { type: 'AT_VALUES', value, line, column };
      case '@select':
        return { type: 'AT_SELECT', value, line, column };
      case '@bind':
        return { type: 'AT_BIND', value, line, column };
      default:
        return { type: 'IDENTIFIER', value, line, column };
    }
  }

  private readCustomSelectorName(line: number, column: number): Token {
    let name = '';
    while (this.pos < this.input.length && isCustomSelectorChar(this.input[this.pos])) {
      name += this.input[this.pos];
      this.advance();
    }
    return { type: 'CUSTOM_SELECTOR_NAME', value: name, line, column };
  }

  private readMixinName(line: number, column: number): Token {
    let name = '';
    while (this.pos < this.input.length && isDirectiveChar(this.input[this.pos])) {
      name += this.input[this.pos];
      this.advance();
    }
    return { type: 'MIXIN_NAME', value: name, line, column };
  }

  private readVariable(line: number, column: number): Token {
    this.advance(); // skip '?'
    let name = '?';
    while (this.pos < this.input.length && isVarChar(this.input[this.pos])) {
      name += this.input[this.pos];
      this.advance();
    }
    return { type: 'VARIABLE', value: name, line, column };
  }

  private readParamVariable(line: number, column: number): Token {
    this.advance(); // skip '$'
    let name = '$';
    while (this.pos < this.input.length && isVarChar(this.input[this.pos])) {
      name += this.input[this.pos];
      this.advance();
    }
    return { type: 'PARAM_VAR', value: name, line, column };
  }

  private readStringOrTypedLiteral(line: number, column: number): Token {
    const quote = this.input[this.pos];
    this.advance(); // skip opening quote
    let strVal = '';

    while (this.pos < this.input.length && this.input[this.pos] !== quote) {
      if (this.input[this.pos] === '\\') {
        this.advance();
        if (this.pos >= this.input.length) break;
      }
      strVal += this.input[this.pos];
      this.advance();
    }

    if (this.pos < this.input.length && this.input[this.pos] === quote) {
      this.advance(); // skip closing quote
    }

    // Check for typed literal ^^datatype
    if (this.pos + 1 < this.input.length && this.input.startsWith('^^', this.pos)) {
      this.advance(2);
      let datatype = '';
      while (this.pos < this.input.length && isCustomSelectorChar(this.input[this.pos])) {
        datatype += this.input[this.pos];
        this.advance();
      }
      return { type: 'TYPED_LITERAL', value: `"${strVal}"^^${datatype}`, line, column };
    }

    return { type: 'STRING_LITERAL', value: strVal, line, column };
  }

  private readNumber(line: number, column: number): Token {
    let numStr = '';
    if (this.input[this.pos] === '-') {
      numStr += '-';
      this.advance();
    }
    while (this.pos < this.input.length && (this.isDigit(this.input[this.pos]) || this.input[this.pos] === '.')) {
      numStr += this.input[this.pos];
      this.advance();
    }
    return { type: 'NUMBER_LITERAL', value: numStr, line, column };
  }

  private readIdentifierOrKeyword(line: number, column: number): Token {
    let ident = '';
    // Allow prefixes e.g. schema:name, ex:Company, a/rdfs:subClassOf*, <http://...>, true, false
    if (this.input[this.pos] === '<') {
      // IRI literal e.g. <http://example.org/Estonia>
      while (this.pos < this.input.length && this.input[this.pos] !== '>') {
        ident += this.input[this.pos];
        this.advance();
      }
      if (this.pos < this.input.length) {
        ident += '>';
        this.advance();
      }
      return { type: 'STRING_LITERAL', value: ident, line, column };
    }

    while (
      this.pos < this.input.length &&
      isAlphaNumericOrSpecial(this.input[this.pos])
    ) {
      ident += this.input[this.pos];
      this.advance();
    }

    if (ident === 'true' || ident === 'false') {
      return { type: 'BOOLEAN_LITERAL', value: ident, line, column };
    }

    return { type: 'IDENTIFIER', value: ident, line, column };
  }

  private isDigit(char: string): boolean {
    if (!char) return false;
    const code = char.charCodeAt(0);
    return code >= 48 && code <= 57;
  }

  private isIdentStart(char: string): boolean {
    if (!char) return false;
    const code = char.charCodeAt(0);
    return (code >= 97 && code <= 122) || (code >= 65 && code <= 90) || char === '_' || char === '<';
  }

  private peek(offset = 0): string {
    return this.input[this.pos + offset] || '';
  }

  private advance(count = 1) {
    for (let i = 0; i < count; i++) {
      if (this.input[this.pos] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.pos++;
    }
  }
}
