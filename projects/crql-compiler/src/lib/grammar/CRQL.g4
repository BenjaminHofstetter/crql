grammar CRQL;

/*
 * ==================================================================== CRQL (Cascading RDF Query
 * Language) ANTLR4 Grammar (v1.0)
 * ====================================================================
 */

// --- PARSER RULES ---

crqlDocument:
	prefixDeclaration* (selectorDefinition | mixinDef | ruleBlock)* EOF;

prefixDeclaration: AT_PREFIX (IDENTIFIER COLON | COLON) IRI_REF SEMI;

selectorDefinition:
	(AT_CUSTOM_SELECTOR | AT_SELECTOR) selectorName LBRACE selectorBody RBRACE;

selectorName:
	CUSTOM_SELECTOR_NAME
	| COLON IDENTIFIER
	| IDENTIFIER;

selectorBody: (triplePattern | bindStmt | filterStmt)*;

mixinDef:
	AT_MIXIN MIXIN_NAME paramDefs? LBRACE bodyBlock RBRACE;

paramDefs: LPAREN (paramDef (COMMA paramDef)*)? RPAREN;

paramDef: (PARAM_VAR | SPARQL_VAR) (EQUALS expr)?;

ruleBlock: selectorExprList LBRACE bodyBlock RBRACE;

selectorExprList: selectorExpr (COMMA selectorExpr)*;

selectorExpr:
	selectorName attrFilter* (
		LPAREN (expr (COMMA expr)*)? RPAREN
	)?;

attrFilter:
	LBRACKET IDENTIFIER (
		EQUALS
		| NOT_EQUALS
		| GTE
		| LTE
		| GT
		| LT
	) expr RBRACKET;

bodyBlock: (bodyItem (SEMI | DOT)?)*;

bodyItem:
	propertyPattern
	| useDirective
	| nestedTraversal
	| whereModifier
	| langDirective
	| filterStmt
	| valuesBlock
	| bindStmt
	| subSelectBlock
	| pageDirective;

propertyPattern:
	AT_WHERE? SPARQL_VAR? predicate langAttrFilter? expr? (
		ARROW_RIGHT SPARQL_VAR? targetPredicate expr?
	)?;

predicate: CURIE | IDENTIFIER | IRI_REF;

targetPredicate: CURIE | IDENTIFIER | IRI_REF;

langAttrFilter:
	LBRACKET LANG_KEY EQUALS (PARAM_VAR | STRING_LITERAL | expr) RBRACKET;

useDirective:
	AT_USE MIXIN_NAME (LPAREN (expr (COMMA expr)*)? RPAREN)?;

nestedTraversal: CARET? IDENTIFIER GT? LBRACE bodyBlock RBRACE;

whereModifier: AT_WHERE LBRACE bodyBlock RBRACE;

langDirective:
	AT_LANG (
		LPAREN (SPARQL_VAR | PARAM_VAR)? COMMA? (
			PARAM_VAR
			| STRING_LITERAL
			| expr
		) RPAREN
		| PARAM_VAR
		| STRING_LITERAL+
	);

filterStmt: FILTER LPAREN filterExpr RPAREN;

filterExpr: (~RPAREN)+;

valuesBlock: (AT_VALUES | VALUES) (
		SPARQL_VAR
		| LPAREN SPARQL_VAR+ RPAREN
	) LBRACE valuesContent RBRACE;

valuesContent: (~RBRACE)+;

bindStmt: (AT_BIND | BIND) LPAREN expr AS SPARQL_VAR RPAREN;

subSelectBlock: (AT_SELECT | SELECT | LBRACE SELECT) (~RBRACE)+ RBRACE;

pageDirective:
	AT_LIMIT NUMBER_LITERAL
	| AT_OFFSET NUMBER_LITERAL
	| AT_ORDER_BY SPARQL_VAR (ASC | DESC)?;

triplePattern: SPARQL_VAR pathExpr objectExpr (SEMI | DOT)?;

pathExpr: (IDENTIFIER | CURIE) (
		SLASH IDENTIFIER
		| CARET IDENTIFIER
		| ASTERISK
		| PLUS
	)*;

objectExpr:
	SPARQL_VAR
	| CURIE
	| IRI_REF
	| STRING_LITERAL
	| NUMBER_LITERAL;

expr:
	functionCall
	| SPARQL_VAR
	| PARAM_VAR
	| CURIE
	| IRI_REF
	| STRING_LITERAL
	| NUMBER_LITERAL
	| BOOLEAN_LITERAL;

functionCall: IDENTIFIER LPAREN (expr (COMMA expr)*)? RPAREN;

// --- LEXER RULES ---

AT_PREFIX: '@prefix';
AT_CUSTOM_SELECTOR: '@custom-selector';
AT_SELECTOR: '@selector';
AT_MIXIN: '@mixin';
AT_USE: '@use';
AT_WHERE: '@where';
AT_LANG: '@lang';
AT_LIMIT: '@limit';
AT_OFFSET: '@offset';
AT_ORDER_BY: '@order-by';
AT_VALUES: '@values';
AT_BIND: '@bind';
AT_SELECT: '@select';

FILTER: [Ff][Ii][Ll][Tt][Ee][Rr];
VALUES: [Vv][Aa][Ll][Uu][Ee][Ss];
BIND: [Bb][Ii][Nn][Dd];
SELECT: [Ss][Ee][Ll][Ee][Cc][Tt];
AS: [Aa][Ss];
LANG_KEY: [Ll][Aa][Nn][Gg];
ASC: [Aa][Ss][Cc];
DESC: [Dd][Ee][Ss][Cc];

CUSTOM_SELECTOR_NAME: ':--' [a-zA-Z0-9_-]+;
MIXIN_NAME: '--' [a-zA-Z0-9_-]+;

SPARQL_VAR: '?' [a-zA-Z0-9_]+;
PARAM_VAR: '$' [a-zA-Z0-9_]+;

CURIE: [a-zA-Z0-9_-]+ ':' [a-zA-Z0-9_/-]+;
IRI_REF: '<' ~[>\r\n]+ '>';

NUMBER_LITERAL: [0-9]+ ('.' [0-9]+)?;
STRING_LITERAL: '"' ~["\r\n]* '"' | '\'' ~['\r\n]* '\'';
BOOLEAN_LITERAL: 'true' | 'false';

IDENTIFIER: [a-zA-Z_] [a-zA-Z0-9_-]*;

ARROW_RIGHT: '=>';
LBRACE: '{';
RBRACE: '}';
LPAREN: '(';
RPAREN: ')';
LBRACKET: '[';
RBRACKET: ']';
SEMI: ';';
DOT: '.';
COMMA: ',';
EQUALS: '=';
NOT_EQUALS: '!=';
GTE: '>=';
LTE: '<=';
GT: '>';
LT: '<';
COLON: ':';
SLASH: '/';
CARET: '^';
ASTERISK: '*';
PLUS: '+';

WS: [ \t\r\n]+ -> skip;
SL_COMMENT: '//' ~[\r\n]* -> skip;
ML_COMMENT: '/*' .*? '*/' -> skip;