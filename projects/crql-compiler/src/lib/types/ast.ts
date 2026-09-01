export type TokenType =
  | 'AT_PREFIX'
  | 'AT_CUSTOM_SELECTOR'
  | 'AT_MIXIN'
  | 'AT_USE'
  | 'AT_FALLBACK'
  | 'AT_IMPORT'
  | 'AT_LIMIT'
  | 'AT_OFFSET'
  | 'AT_ORDER_BY'
  | 'AT_VALUES'
  | 'AT_SELECT'
  | 'AT_BIND'
  | 'AT_WHERE'
  | 'AT_LANG'
  | 'AT_FILTER'
  | 'CUSTOM_SELECTOR_NAME' // e.g. :--estoniaCompanies
  | 'MIXIN_NAME'           // e.g. --name-and-address
  | 'IDENTIFIER'           // e.g. schema:name, ex:Company, concat
  | 'VARIABLE'             // e.g. ?focusNode, ?companyName
  | 'PARAM_VAR'            // e.g. $country, $minEmployees
  | 'STRING_LITERAL'       // e.g. "Estonia", 'business'
  | 'NUMBER_LITERAL'       // e.g. 10, 50.5
  | 'BOOLEAN_LITERAL'      // e.g. true, false
  | 'TYPED_LITERAL'        // e.g. "2026-08-27"^^xsd:date
  | 'ARROW_RIGHT'          // =>
  | 'CHEVRON_RIGHT'        // >
  | 'CARET'                // ^ (inverse path)
  | 'SLASH'                // / (property path)
  | 'COLON'                // :
  | 'SEMICOLON'            // ;
  | 'COMMA'                // ,
  | 'DOT'                  // .
  | 'LBRACE'               // {
  | 'RBRACE'               // }
  | 'LPAREN'               // (
  | 'RPAREN'               // )
  | 'LBRACKET'             // [
  | 'RBRACKET'             // ]
  | 'EQUALS'               // =
  | 'NOT_EQUALS'           // !=
  | 'GTE'                  // >=
  | 'LTE'                  // <=
  | 'GT'                   // >
  | 'LT'                   // <
  | 'PLUS'                 // +
  | 'MINUS'                // -
  | 'STAR'                 // *
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export type ASTNode =
  | DocumentNode
  | PrefixDeclNode
  | CustomSelectorNode
  | MixinNode
  | RuleBlockNode
  | SelectorExprNode
  | AttributeFilterNode
  | PropertyPatternNode
  | NestedTraversalNode
  | FallbackBlockNode
  | ValuesBlockNode
  | SubSelectNode
  | BindNode
  | LangDirectiveNode
  | FilterNode
  | ExpressionNode
  | PageDirectiveNode;

export interface DocumentNode {
  type: 'DocumentNode';
  prefixes: PrefixDeclNode[];
  customSelectors: CustomSelectorNode[];
  mixins: MixinNode[];
  rules: RuleBlockNode[];
  langDirectives?: LangDirectiveNode[];
}

export interface PrefixDeclNode {
  type: 'PrefixDeclNode';
  prefix: string;
  iri: string;
}

export interface ParameterDef {
  name: string; // e.g. "$country"
  defaultValue?: ExpressionNode;
}

export interface BindNode {
  type: 'BindNode';
  expressionText: string; // e.g. "<https://agriculture.ld.admin.ch/plant-protection/product/D-7463>"
  variable: string;       // e.g. "?focusNode"
}

export type CustomSelectorPattern = TriplePattern | BindNode;

export interface CustomSelectorNode {
  type: 'CustomSelectorNode';
  name: string; // e.g. ":--estoniaCompanies"
  params: ParameterDef[];
  patterns: CustomSelectorPattern[];
}

export interface ValuesBlockNode {
  type: 'ValuesBlockNode';
  variables: string[]; // e.g. ["?productType"]
  valuesText: string;  // e.g. "psm:ParallelImport psm:SalePermission psm:RegularProduct"
}

export interface SubSelectNode {
  type: 'SubSelectNode';
  queryText: string;       // Raw inner SPARQL sub-query e.g. "SELECT ?focusNode (COUNT(?review) AS ?reviewCount) WHERE { ... } GROUP BY ?focusNode"
  projectedVars: string[]; // Variables projected in SELECT clause e.g. ["?focusNode", "?reviewCount"]
}

export interface LangDirectiveNode {
  type: 'LangDirectiveNode';
  targetVar?: string;                   // Optional e.g. "?countryOfOriginName"
  targetVarExpr?: ExpressionNode;       // Optional e.g. VariableNode or ParamVarNode
  languages: ExpressionNode | string[]; // e.g. ["de", "en", "fr", "it"] or ParamVarNode ($langs)
}

export interface FilterNode {
  type: 'FilterNode';
  expressionText: string; // e.g. "LANG(?countryOfOriginName) IN (\"de\", \"en\")"
}

export type BodyItemNode =
  | PropertyPatternNode
  | UseDirectiveNode
  | NestedTraversalNode
  | FallbackBlockNode
  | ValuesBlockNode
  | SubSelectNode
  | BindNode
  | LangDirectiveNode
  | FilterNode;

export interface MixinNode {
  type: 'MixinNode';
  name: string; // e.g. "--name-and-address"
  params: ParameterDef[];
  body: BodyItemNode[];
}

export interface TriplePattern {
  subject: string; // e.g. "?focusNode"
  predicate: string; // e.g. "a/rdfs:subClassOf*"
  object: ExpressionNode | string;
}

export interface AttributeFilterNode {
  type: 'AttributeFilterNode';
  predicate: string; // e.g. "ex:employeeCount" or "ex:status"
  operator: '=' | '!=' | '>=' | '<=' | '>' | '<';
  value: ExpressionNode;
}

export interface SelectorExprNode {
  type: 'SelectorExprNode';
  name: string; // e.g. ":--estoniaCompanies" or "ex:Company"
  params?: ExpressionNode[];
  attributeFilters: AttributeFilterNode[];
  isNegated?: boolean; // e.g. :not(...)
}

export interface UseDirectiveNode {
  type: 'UseDirectiveNode';
  mixinName: string; // e.g. "--name-and-address"
  args: ExpressionNode[];
}

export interface PropertyPatternNode {
  type: 'PropertyPatternNode';
  subject?: string;          // Optional custom subject e.g. "?productType" or "?focusNode"
  predicate: string;         // e.g. "schema:name"
  targetPredicate?: string;  // for mapping e.g. schema:name => ui:title
  constructSubject?: string; // Optional target subject in CONSTRUCT e.g. "?productType" or "?focusNode"
  value: ExpressionNode;
  isWhereOnly?: boolean;     // If true, omitted from CONSTRUCT template
  langFilter?: ExpressionNode | string[]; // e.g. [lang="de,en"] or [lang=$langs]
}

export interface NestedTraversalNode {
  type: 'NestedTraversalNode';
  subject?: string;
  path: string; // e.g. "ex:hasManager" or "^ex:hasMember"
  isInverse?: boolean;
  body: BodyItemNode[];
}

export interface FallbackBlockNode {
  type: 'FallbackBlockNode';
  branches: BodyItemNode[][];
}

export interface RuleBlockNode {
  type: 'RuleBlockNode';
  selectors: SelectorExprNode[]; // comma separated selectors (OR / UNION)
  body: BodyItemNode[];
  pageDirectives?: PageDirectiveNode;
}

export interface PageDirectiveNode {
  type: 'PageDirectiveNode';
  limit?: number;
  offset?: number;
  orderBy?: { variableOrExpr: string; direction: 'ASC' | 'DESC' };
}

export type ExpressionNode =
  | VariableNode
  | ParamVarNode
  | StringLiteralNode
  | NumberLiteralNode
  | BooleanLiteralNode
  | TypedLiteralNode
  | FunctionCallNode
  | BinaryOpNode;

export interface VariableNode {
  type: 'VariableNode';
  name: string; // e.g. "?companyName"
}

export interface ParamVarNode {
  type: 'ParamVarNode';
  name: string; // e.g. "$country"
}

export interface StringLiteralNode {
  type: 'StringLiteralNode';
  value: string;
}

export interface NumberLiteralNode {
  type: 'NumberLiteralNode';
  value: number;
}

export interface BooleanLiteralNode {
  type: 'BooleanLiteralNode';
  value: boolean;
}

export interface TypedLiteralNode {
  type: 'TypedLiteralNode';
  value: string;
  datatype: string; // e.g. "xsd:date" or "xsd:integer"
}

export interface FunctionCallNode {
  type: 'FunctionCallNode';
  name: string; // e.g. "concat", "iri", "calc", "uCase", "xsd:dateTime", "coalesce"
  args: ExpressionNode[];
}

export interface BinaryOpNode {
  type: 'BinaryOpNode';
  operator: '+' | '-' | '*' | '/';
  left: ExpressionNode;
  right: ExpressionNode;
}
