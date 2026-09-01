# CRQL Language Specification (v1.0)

**Cascading RDF Query Language (CRQL)** is a declarative, CSS-inspired query abstraction language built on top of **SPARQL 1.1**. It allows developers to define reusable, modular RDF query templates using selectors, mixins, nested block traversals, and property mappings, which compile cleanly into optimized SPARQL `CONSTRUCT` queries.

---

## Table of Contents

1. [Lexical Structure & Grammar](#1-lexical-structure--grammar)
2. [Prefix Declarations](#2-prefix-declarations)
3. [Custom Selectors (`@custom-selector`)](#3-custom-selectors-custom-selector)
4. [Mixins (`@mixin` and `@use`)](#4-mixins-mixin-and-use)
5. [Rule Blocks (`:--selector`)](#5-rule-blocks---selector)
6. [Turtle-Style Predicate List Chaining](#6-turtle-style-predicate-list-chaining)
7. [Nested Block Traversals](#7-nested-block-traversals)
8. [CONSTRUCT vs. WHERE Resolution Rules](#8-construct-vs-where-resolution-rules)
9. [Filtering & Language Directives](#9-filtering--language-directives)
10. [Pagination & Ordering Directives](#10-pagination--ordering-directives)
11. [Inline SPARQL Constructs](#11-inline-sparql-constructs)
12. [Compiler Architecture & AST](#12-compiler-architecture--ast)

---

## 1. Lexical Structure & Grammar

### 1.1 Tokens & Identifiers
- **Prefixes / CURIEs**: `schema:name`, `ex:Company`, `psm:ParallelImport`
- **Full URIs**: `<http://schema.org/name>`, `<https://agriculture.ld.admin.ch/...>`
- **SPARQL Variables**: Start with `?` (e.g. `?name`, `?focusNode`, `?ingredient`). Reserved variable `?focusNode` refers to the query's root subject.
- **Mixin Parameters**: Start with `$` or `?` (e.g. `$langs`, `$allowedLangs`, `?var`).
- **Directives**: Start with `@` (e.g. `@prefix`, `@custom-selector`, `@mixin`, `@use`, `@where`, `@lang`, `@limit`, `@offset`, `@order-by`).
- **Custom Selectors**: Start with `:--` (e.g. `:--product`, `:--estoniaCompanies`).
- **Mixin Names**: Start with `--` (e.g. `--permissionType`, `--localizedName`).

### 1.2 Comments
- Single-line comments: `// comment`
- Multi-line comments: `/* comment */`

---

## 2. Prefix Declarations

Prefixes are declared at the top of a CRQL document and map directly to SPARQL `PREFIX` statements:

```css
@prefix schema: <http://schema.org/>;
@prefix psm: <https://agriculture.ld.admin.ch/plant-protection/>;
@prefix ui: <https://myapp>;
```

---

## 3. Custom Selectors (`@custom-selector`)

A `@custom-selector` defines the target entity pattern (matching graph constraints in `WHERE`):

```css
@custom-selector :--estoniaCompanies {
  ?focusNode a/rdfs:subClassOf* ex:Company .
  ?focusNode ex:headQuarterCountry ex:Estonia .
}
```

When evaluated, statements inside `@custom-selector` bind constraints to `?focusNode_N` in the generated SPARQL `WHERE` clause.

---

## 4. Mixins (`@mixin` and `@use`)

### 4.1 Basic Mixins
Mixins define reusable blocks of query patterns:

```css
@mixin --name-and-address {
  schema:name ?companyName ;
  schema:address ?companyAddress ;
}
```

Included into rule blocks using `@use`:

```css
:--company {
  @use --name-and-address ;
}
```

### 4.2 Parameterized Mixins
Mixins accept default values and passed arguments:

```css
@mixin --country($allowedLangs = "de,fr") {
  schema:countryOfOrigin {
    schema:name[lang=$allowedLangs] ?countryName => ui:country ;
  }
}

:--product {
  @use --country("de,it") ;
}
```

### 4.3 Automatic Mixin Variable Scoping
To prevent variable collision across multiple `@use` invocations, local mixin variables (excluding parameters and `?focusNode`) are automatically assigned unique instance suffixes during expansion (e.g., `?share_mx1`, `?share_mx2`).

### 4.4 Mixin Composition & Forwarding
Mixins can invoke other mixins and recursively forward parameters:

```css
@mixin --subMixin($langs) {
  schema:name[lang=$langs] ?name => ui:name ;
}

@mixin --parentMixin($pLangs = "de,en") {
  @use --subMixin($pLangs) ;
}
```

### 4.5 Document-Level Constants (`@const`)
Constants allow defining document-scoped configuration values (strings, numbers, IRIs, language lists) once at the top of the stylesheet and referencing them throughout rule blocks and mixins:

```css
@prefix schema: <http://schema.org/>;
@prefix ui: <https://myapp>;

/* Document-level Constants */
@const $defaultLangs = "de,en,fr" ;
@const $activeStatus = "Active" ;
@const $estoniaUri = ex:Estonia ;

@custom-selector :--targetCompanies {
  ?focusNode a ex:Company .
  ?focusNode ex:country $estoniaUri .
}

:--targetCompanies {
  ex:status $activeStatus ;
  schema:name[lang=$defaultLangs] ?name => ui:name ;
}
```

---

## 5. Rule Blocks (`:--selector`)

Rule blocks apply property patterns and transformations to selected target entities:

```css
:--product {
  schema:name ?name => ui:name ;
  schema:price ?price ;
}
```

### Property Renaming / Predicate Mapping (`=>`)
- **Default (Focus Node Mapping)**: `schema:legalName => ui:title` maps `ui:title` to `?focusNode_N` in `CONSTRUCT`, while querying `schema:legalName` in `WHERE`.
- **Explicit Target Subject Attachment**: `schema:name ?name => ?productType ui:name` attaches `ui:name` to `?productType` in `CONSTRUCT`.

---

## 6. Turtle-Style Predicate List Chaining

CRQL natively supports **Turtle / SPARQL predicate-list semicolon chaining** (`;`) and period termination (`.`):

```css
@mixin --substance {
  psm:ingredient ?substance .

  ?substance psm:share ?share .
  ?share a ?shareType ;
    schema:unitCode ?unit ;
    qudt:symbol ?symbol ;
    schema:value ?value ;
  .

  ?substance a ?substanceType ;
    schema:name ?name ;
    psm:iupacName ?iupacName ;
  .
}
```

- When a statement starts with an explicit subject (e.g. `?share a ?shareType ;`), subsequent lines inherit `?share` as active subject until a period (`.`) or block end is encountered.

---

## 7. Nested Block Traversals

Traverse RDF object relationships cleanly using nested syntax:

### 7.1 Direct Nested Traversal (`path { ... }` or `path > { ... }`)
```css
:--company {
  schema:address {
    schema:addressCountry ?country => ui:country ;
  }
}
```

### 7.2 Inverse Nested Traversal (`^path { ... }`)
```css
:--classMetadata {
  ^ex:iconForClass {
    ex:icon => ui:icon ;
  }
}
```

---

## 8. CONSTRUCT vs. WHERE Resolution Rules

1. **Focus Node Property Mapping (`=> ui:predicate`)**:
   - `schema:name ?name => ui:name` outputs `?focusNode_N ui:name ?name .` in `CONSTRUCT`.
2. **Unmapped Graph Statements**:
   - `?share a ?shareType ; schema:unitCode ?unit ;` retains `?share` as the subject in both `CONSTRUCT` and `WHERE`.
3. **CONSTRUCT Output Suppression (`@where`)**:
   - `@where ?focusNode a ?productType .` includes the constraint strictly in `WHERE`, omitting it from `CONSTRUCT`.
   - Block modifier: `@where { ... }` suppresses all contained statements from `CONSTRUCT`.

---

## 9. Filtering & Language Directives

### 9.1 Property Attribute Language Filter (`[lang=...]`)
```css
schema:name[lang="de,en"] ?name => ui:name ;
schema:name[lang=$langs] ?name => ui:name ;
```
Compiles to `FILTER(LANG(?name) IN ("de", "en"))` targeted strictly to the property's string variable.

### 9.2 `@lang` Directive
```css
@lang(?premissionName, "de,en") ;
```
Compiles to `FILTER(LANG(?premissionName) IN ("de", "en"))`.

### 9.3 Standalone Reusable Language Filter Mixin
```css
@mixin --langFilter(?var, $langs = "de,en,fr,it") {
  @lang(?var, $langs) ;
}

:--product {
  @use --langFilter(?productName, "de,fr") ;
}
```

### 9.4 Native SPARQL `FILTER(...)` Statements
```css
FILTER(?employeeCount >= 10)
FILTER(LANG(?countryName) IN ("de", "en"))
```

---

## 10. Pagination & Ordering Directives

Declare query pagination directly inside rule blocks:

```css
:--paginatedCompany {
  schema:name ?name ;
  @order-by ?name ASC ;
  @limit 10 ;
  @offset 20 ;
}
```

Compiles to SPARQL `ORDER BY ASC(?name) LIMIT 10 OFFSET 20`.

---

## 11. Inline SPARQL Constructs

### 11.1 `VALUES` Blocks
```css
VALUES ?productType {
  psm:ParallelImport
  psm:SalePermission
  psm:RegularProduct
}
```

### 11.2 `BIND(...)` Expressions
```css
BIND(<https://agriculture.ld.admin.ch/plant-protection/product/D-7463> AS ?focusNode)
BIND(CONCAT(?firstName, " ", ?lastName) AS ?fullName)
```

### 11.3 Sub-`SELECT` Blocks
```css
{
  SELECT ?focusNode (COUNT(?order) AS ?orderCount)
  WHERE { ?focusNode ex:hasOrder ?order }
  GROUP BY ?focusNode
}
```

---

## 12. Compiler Architecture & AST

The CRQL Compiler pipeline consists of 4 decoupled stages:

```
[CRQL Source] -> Lexer -> Parser -> AST -> Resolver -> Generator -> [SPARQL Query]
```

1. **Lexer (`lexer.ts`)**: Tokenizes source code into typed tokens.
2. **Parser (`parser.ts`)**: Builds Abstract Syntax Tree (`ASTNode`).
3. **Resolver (`resolver.ts`)**: Performs mixin expansion, variable scoping, subject inheritance, and CONSTRUCT/WHERE triple partitioning.
4. **Generator (`sparql-generator.ts`)**: Renders clean, formatted SPARQL 1.1 query text.

---

## 13. Formal ANTLR4 Grammar (`CRQL.g4`)

The formal ANTLR4 grammar for CRQL is defined in [`projects/crql-compiler/src/lib/grammar/CRQL.g4`](file:///Users/benjaminhofstetter/code/benjamin/rdf-query-language/projects/crql-compiler/src/lib/grammar/CRQL.g4):

```antlr
grammar CRQL;

// --- PARSER RULES ---

document
    : prefixDecl* (selectorDefinition | mixinDef | ruleBlock)* EOF
    ;

prefixDecl
    : AT_PREFIX (IDENTIFIER COLON | COLON) IRI_REF SEMI
    ;

selectorDefinition
    : (AT_CUSTOM_SELECTOR | AT_SELECTOR) selectorName LBRACE selectorBody RBRACE
    ;

selectorName
    : CUSTOM_SELECTOR_NAME
    | COLON IDENTIFIER
    | IDENTIFIER
    ;

selectorBody
    : (triplePattern | bindStmt | filterStmt)*
    ;

mixinDef
    : AT_MIXIN MIXIN_NAME paramDefs? LBRACE bodyBlock RBRACE
    ;

paramDefs
    : LPAREN (paramDef (COMMA paramDef)*)? RPAREN
    ;

paramDef
    : (PARAM_VAR | SPARQL_VAR) (EQUALS expr)?
    ;

ruleBlock
    : selectorExprList LBRACE bodyBlock RBRACE
    ;

selectorExprList
    : selectorExpr (COMMA selectorExpr)*
    ;

selectorExpr
    : selectorName attrFilter* (LPAREN (expr (COMMA expr)*)? RPAREN)?
    ;

attrFilter
    : LBRACKET IDENTIFIER (EQUALS | NOT_EQUALS | GTE | LTE | GT | LT) expr RBRACKET
    ;

bodyBlock
    : (bodyItem (SEMI | DOT)?)*
    ;

bodyItem
    : propertyPattern
    | getDirective
    | nestedTraversal
    | whereModifier
    | langDirective
    | filterStmt
    | valuesBlock
    | bindStmt
    | subSelectBlock
    | pageDirective
    ;

propertyPattern
    : AT_WHERE? subjectVar? predicate langAttrFilter? objectExpr? (
        ARROW_RIGHT targetSubject? targetPredicate targetObject?
    )
    ;

subjectVar      : SPARQL_VAR ;
targetSubject   : SPARQL_VAR ;
objectExpr      : expr ;
targetObject    : expr ;

predicate
    : CURIE
    | IDENTIFIER
    | IRI_REF
    ;

targetPredicate
    : CURIE
    | IDENTIFIER
    | IRI_REF
    ;

langAttrFilter
    : LBRACKET LANG_KEY EQUALS (PARAM_VAR | STRING_LITERAL | expr) RBRACKET
    ;

getDirective
    : AT_GET MIXIN_NAME (LPAREN (expr (COMMA expr)*)? RPAREN)?
    ;

nestedTraversal
    : CARET? IDENTIFIER GT? LBRACE bodyBlock RBRACE
    ;

whereModifier
    : AT_WHERE LBRACE bodyBlock RBRACE
    ;

langDirective
    : AT_LANG (LPAREN (SPARQL_VAR | PARAM_VAR)? COMMA? (PARAM_VAR | STRING_LITERAL | expr) RPAREN | PARAM_VAR | STRING_LITERAL+)
    ;

filterStmt
    : FILTER LPAREN filterExpr RPAREN
    ;

filterExpr
    : (~RPAREN)+
    ;

valuesBlock
    : (AT_VALUES | VALUES) (SPARQL_VAR | LPAREN SPARQL_VAR+ RPAREN) LBRACE valuesContent RBRACE
    ;

valuesContent
    : (~RBRACE)+
    ;

bindStmt
    : (AT_BIND | BIND) LPAREN expr AS SPARQL_VAR RPAREN
    ;

subSelectBlock
    : (AT_SELECT | SELECT | LBRACE SELECT) (~RBRACE)+ RBRACE
    ;

pageDirective
    : AT_LIMIT NUMBER_LITERAL
    | AT_OFFSET NUMBER_LITERAL
    | AT_ORDER_BY SPARQL_VAR (ASC | DESC)?
    ;

triplePattern
    : SPARQL_VAR pathExpr objectExpr (SEMI | DOT)?
    ;

pathExpr
    : (IDENTIFIER | CURIE) (SLASH IDENTIFIER | CARET IDENTIFIER | ASTERISK | PLUS)*
    ;

objectExpr
    : SPARQL_VAR
    | CURIE
    | IRI_REF
    | STRING_LITERAL
    | NUMBER_LITERAL
    ;

expr
    : functionCall
    | SPARQL_VAR
    | PARAM_VAR
    | CURIE
    | IRI_REF
    | STRING_LITERAL
    | NUMBER_LITERAL
    | BOOLEAN_LITERAL
    ;

functionCall
    : IDENTIFIER LPAREN (expr (COMMA expr)*)? RPAREN
    ;

// --- LEXER RULES ---

AT_PREFIX          : '@prefix' ;
AT_CUSTOM_SELECTOR : '@custom-selector' ;
AT_MIXIN           : '@mixin' ;
AT_USE             : '@use' ;
AT_WHERE           : '@where' ;
AT_LANG            : '@lang' ;
AT_LIMIT           : '@limit' ;
AT_OFFSET          : '@offset' ;
AT_ORDER_BY        : '@order-by' ;
AT_VALUES          : '@values' ;
AT_BIND            : '@bind' ;
AT_SELECT          : '@select' ;

FILTER             : [Ff][Ii][Ll][Tt][Ee][Rr] ;
VALUES             : [Vv][Aa][Ll][Uu][Ee][Ss] ;
BIND               : [Bb][Ii][Nn][Dd] ;
SELECT             : [Ss][Ee][Ll][Ee][Cc][Tt] ;
AS                 : [Aa][Ss] ;
LANG_KEY           : [Ll][Aa][Nn][Gg] ;
ASC                : [Aa][Ss][Cc] ;
DESC               : [Dd][Ee][Ss][Cc] ;

CUSTOM_SELECTOR_NAME : ':--' [a-zA-Z0-9_-]+ ;
MIXIN_NAME           : '--' [a-zA-Z0-9_-]+ ;

SPARQL_VAR         : '?' [a-zA-Z0-9_]+ ;
PARAM_VAR          : '$' [a-zA-Z0-9_]+ ;

CURIE              : [a-zA-Z0-9_-]+ ':' [a-zA-Z0-9_/-]+ ;
IRI_REF            : '<' ~[>\r\n]+ '>' ;

NUMBER_LITERAL     : [0-9]+ ('.' [0-9]+)? ;
STRING_LITERAL     : '"' ~["\r\n]* '"' | '\'' ~['\r\n]* '\'' ;
BOOLEAN_LITERAL    : 'true' | 'false' ;

IDENTIFIER         : [a-zA-Z_] [a-zA-Z0-9_-]* ;

ARROW_RIGHT        : '=>' ;
LBRACE             : '{' ;
RBRACE             : '}' ;
LPAREN             : '(' ;
RPAREN             : ')' ;
LBRACKET           : '[' ;
RBRACKET           : ']' ;
SEMI               : ';' ;
DOT                : '.' ;
COMMA              : ',' ;
EQUALS             : '=' ;
NOT_EQUALS         : '!=' ;
GTE                : '>=' ;
LTE                : '<=' ;
GT                 : '>' ;
LT                 : '<' ;
COLON              : ':' ;
SLASH              : '/' ;
CARET              : '^' ;
ASTERISK           : '*' ;
PLUS               : '+' ;

WS                 : [ \t\r\n]+ -> skip ;
SL_COMMENT         : '//' ~[\r\n]* -> skip ;
ML_COMMENT         : '/*' .*? '*/' -> skip ;
```
