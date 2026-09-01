// Generated from /Users/benjaminhofstetter/code/benjamin/rdf-query-language/projects/crql-compiler/src/lib/grammar/CRQL.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue"})
public class CRQLParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.13.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		AT_PREFIX=1, AT_CUSTOM_SELECTOR=2, AT_MIXIN=3, AT_GET=4, AT_WHERE=5, AT_LANG=6, 
		AT_LIMIT=7, AT_OFFSET=8, AT_ORDER_BY=9, AT_VALUES=10, AT_BIND=11, AT_SELECT=12, 
		FILTER=13, VALUES=14, BIND=15, SELECT=16, AS=17, LANG_KEY=18, ASC=19, 
		DESC=20, CUSTOM_SELECTOR_NAME=21, MIXIN_NAME=22, SPARQL_VAR=23, PARAM_VAR=24, 
		CURIE=25, IRI_REF=26, NUMBER_LITERAL=27, STRING_LITERAL=28, BOOLEAN_LITERAL=29, 
		IDENTIFIER=30, ARROW_RIGHT=31, LBRACE=32, RBRACE=33, LPAREN=34, RPAREN=35, 
		LBRACKET=36, RBRACKET=37, SEMI=38, DOT=39, COMMA=40, EQUALS=41, NOT_EQUALS=42, 
		GTE=43, LTE=44, GT=45, LT=46, COLON=47, SLASH=48, CARET=49, ASTERISK=50, 
		PLUS=51, WS=52, SL_COMMENT=53, ML_COMMENT=54;
	public static final int
		RULE_crqlDocument = 0, RULE_prefixDeclaration = 1, RULE_customSelectorDef = 2, 
		RULE_selectorName = 3, RULE_selectorBody = 4, RULE_mixinDef = 5, RULE_paramDefs = 6, 
		RULE_paramDef = 7, RULE_ruleBlock = 8, RULE_selectorExprList = 9, RULE_selectorExpr = 10, 
		RULE_attrFilter = 11, RULE_bodyBlock = 12, RULE_bodyItem = 13, RULE_propertyPattern = 14, 
		RULE_predicate = 15, RULE_targetPredicate = 16, RULE_langAttrFilter = 17, 
		RULE_getDirective = 18, RULE_nestedTraversal = 19, RULE_whereModifier = 20, 
		RULE_langDirective = 21, RULE_filterStmt = 22, RULE_filterExpr = 23, RULE_valuesBlock = 24, 
		RULE_valuesContent = 25, RULE_bindStmt = 26, RULE_subSelectBlock = 27, 
		RULE_pageDirective = 28, RULE_triplePattern = 29, RULE_pathExpr = 30, 
		RULE_objectExpr = 31, RULE_expr = 32, RULE_functionCall = 33;
	private static String[] makeRuleNames() {
		return new String[] {
			"crqlDocument", "prefixDeclaration", "customSelectorDef", "selectorName", 
			"selectorBody", "mixinDef", "paramDefs", "paramDef", "ruleBlock", "selectorExprList", 
			"selectorExpr", "attrFilter", "bodyBlock", "bodyItem", "propertyPattern", 
			"predicate", "targetPredicate", "langAttrFilter", "getDirective", "nestedTraversal", 
			"whereModifier", "langDirective", "filterStmt", "filterExpr", "valuesBlock", 
			"valuesContent", "bindStmt", "subSelectBlock", "pageDirective", "triplePattern", 
			"pathExpr", "objectExpr", "expr", "functionCall"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'@prefix'", "'@custom-selector'", "'@mixin'", "'@get'", "'@where'", 
			"'@lang'", "'@limit'", "'@offset'", "'@order-by'", "'@values'", "'@bind'", 
			"'@select'", null, null, null, null, null, null, null, null, null, null, 
			null, null, null, null, null, null, null, null, "'=>'", "'{'", "'}'", 
			"'('", "')'", "'['", "']'", "';'", "'.'", "','", "'='", "'!='", "'>='", 
			"'<='", "'>'", "'<'", "':'", "'/'", "'^'", "'*'", "'+'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "AT_PREFIX", "AT_CUSTOM_SELECTOR", "AT_MIXIN", "AT_GET", "AT_WHERE", 
			"AT_LANG", "AT_LIMIT", "AT_OFFSET", "AT_ORDER_BY", "AT_VALUES", "AT_BIND", 
			"AT_SELECT", "FILTER", "VALUES", "BIND", "SELECT", "AS", "LANG_KEY", 
			"ASC", "DESC", "CUSTOM_SELECTOR_NAME", "MIXIN_NAME", "SPARQL_VAR", "PARAM_VAR", 
			"CURIE", "IRI_REF", "NUMBER_LITERAL", "STRING_LITERAL", "BOOLEAN_LITERAL", 
			"IDENTIFIER", "ARROW_RIGHT", "LBRACE", "RBRACE", "LPAREN", "RPAREN", 
			"LBRACKET", "RBRACKET", "SEMI", "DOT", "COMMA", "EQUALS", "NOT_EQUALS", 
			"GTE", "LTE", "GT", "LT", "COLON", "SLASH", "CARET", "ASTERISK", "PLUS", 
			"WS", "SL_COMMENT", "ML_COMMENT"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "CRQL.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public CRQLParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CrqlDocumentContext extends ParserRuleContext {
		public TerminalNode EOF() { return getToken(CRQLParser.EOF, 0); }
		public List<PrefixDeclarationContext> prefixDeclaration() {
			return getRuleContexts(PrefixDeclarationContext.class);
		}
		public PrefixDeclarationContext prefixDeclaration(int i) {
			return getRuleContext(PrefixDeclarationContext.class,i);
		}
		public List<CustomSelectorDefContext> customSelectorDef() {
			return getRuleContexts(CustomSelectorDefContext.class);
		}
		public CustomSelectorDefContext customSelectorDef(int i) {
			return getRuleContext(CustomSelectorDefContext.class,i);
		}
		public List<MixinDefContext> mixinDef() {
			return getRuleContexts(MixinDefContext.class);
		}
		public MixinDefContext mixinDef(int i) {
			return getRuleContext(MixinDefContext.class,i);
		}
		public List<RuleBlockContext> ruleBlock() {
			return getRuleContexts(RuleBlockContext.class);
		}
		public RuleBlockContext ruleBlock(int i) {
			return getRuleContext(RuleBlockContext.class,i);
		}
		public CrqlDocumentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_crqlDocument; }
	}

	public final CrqlDocumentContext crqlDocument() throws RecognitionException {
		CrqlDocumentContext _localctx = new CrqlDocumentContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_crqlDocument);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(71);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==AT_PREFIX) {
				{
				{
				setState(68);
				prefixDeclaration();
				}
				}
				setState(73);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(79);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & 140738564194316L) != 0)) {
				{
				setState(77);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case AT_CUSTOM_SELECTOR:
					{
					setState(74);
					customSelectorDef();
					}
					break;
				case AT_MIXIN:
					{
					setState(75);
					mixinDef();
					}
					break;
				case CUSTOM_SELECTOR_NAME:
				case IDENTIFIER:
				case COLON:
					{
					setState(76);
					ruleBlock();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(81);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(82);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PrefixDeclarationContext extends ParserRuleContext {
		public TerminalNode AT_PREFIX() { return getToken(CRQLParser.AT_PREFIX, 0); }
		public TerminalNode IRI_REF() { return getToken(CRQLParser.IRI_REF, 0); }
		public TerminalNode SEMI() { return getToken(CRQLParser.SEMI, 0); }
		public TerminalNode IDENTIFIER() { return getToken(CRQLParser.IDENTIFIER, 0); }
		public TerminalNode COLON() { return getToken(CRQLParser.COLON, 0); }
		public PrefixDeclarationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_prefixDeclaration; }
	}

	public final PrefixDeclarationContext prefixDeclaration() throws RecognitionException {
		PrefixDeclarationContext _localctx = new PrefixDeclarationContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_prefixDeclaration);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(84);
			match(AT_PREFIX);
			setState(88);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IDENTIFIER:
				{
				setState(85);
				match(IDENTIFIER);
				setState(86);
				match(COLON);
				}
				break;
			case COLON:
				{
				setState(87);
				match(COLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(90);
			match(IRI_REF);
			setState(91);
			match(SEMI);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CustomSelectorDefContext extends ParserRuleContext {
		public TerminalNode AT_CUSTOM_SELECTOR() { return getToken(CRQLParser.AT_CUSTOM_SELECTOR, 0); }
		public SelectorNameContext selectorName() {
			return getRuleContext(SelectorNameContext.class,0);
		}
		public TerminalNode LBRACE() { return getToken(CRQLParser.LBRACE, 0); }
		public SelectorBodyContext selectorBody() {
			return getRuleContext(SelectorBodyContext.class,0);
		}
		public TerminalNode RBRACE() { return getToken(CRQLParser.RBRACE, 0); }
		public CustomSelectorDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_customSelectorDef; }
	}

	public final CustomSelectorDefContext customSelectorDef() throws RecognitionException {
		CustomSelectorDefContext _localctx = new CustomSelectorDefContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_customSelectorDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(93);
			match(AT_CUSTOM_SELECTOR);
			setState(94);
			selectorName();
			setState(95);
			match(LBRACE);
			setState(96);
			selectorBody();
			setState(97);
			match(RBRACE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SelectorNameContext extends ParserRuleContext {
		public TerminalNode CUSTOM_SELECTOR_NAME() { return getToken(CRQLParser.CUSTOM_SELECTOR_NAME, 0); }
		public TerminalNode COLON() { return getToken(CRQLParser.COLON, 0); }
		public TerminalNode IDENTIFIER() { return getToken(CRQLParser.IDENTIFIER, 0); }
		public SelectorNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_selectorName; }
	}

	public final SelectorNameContext selectorName() throws RecognitionException {
		SelectorNameContext _localctx = new SelectorNameContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_selectorName);
		try {
			setState(103);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case CUSTOM_SELECTOR_NAME:
				enterOuterAlt(_localctx, 1);
				{
				setState(99);
				match(CUSTOM_SELECTOR_NAME);
				}
				break;
			case COLON:
				enterOuterAlt(_localctx, 2);
				{
				setState(100);
				match(COLON);
				setState(101);
				match(IDENTIFIER);
				}
				break;
			case IDENTIFIER:
				enterOuterAlt(_localctx, 3);
				{
				setState(102);
				match(IDENTIFIER);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SelectorBodyContext extends ParserRuleContext {
		public List<TriplePatternContext> triplePattern() {
			return getRuleContexts(TriplePatternContext.class);
		}
		public TriplePatternContext triplePattern(int i) {
			return getRuleContext(TriplePatternContext.class,i);
		}
		public List<BindStmtContext> bindStmt() {
			return getRuleContexts(BindStmtContext.class);
		}
		public BindStmtContext bindStmt(int i) {
			return getRuleContext(BindStmtContext.class,i);
		}
		public List<FilterStmtContext> filterStmt() {
			return getRuleContexts(FilterStmtContext.class);
		}
		public FilterStmtContext filterStmt(int i) {
			return getRuleContext(FilterStmtContext.class,i);
		}
		public SelectorBodyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_selectorBody; }
	}

	public final SelectorBodyContext selectorBody() throws RecognitionException {
		SelectorBodyContext _localctx = new SelectorBodyContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_selectorBody);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(110);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & 8431616L) != 0)) {
				{
				setState(108);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case SPARQL_VAR:
					{
					setState(105);
					triplePattern();
					}
					break;
				case AT_BIND:
				case BIND:
					{
					setState(106);
					bindStmt();
					}
					break;
				case FILTER:
					{
					setState(107);
					filterStmt();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(112);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class MixinDefContext extends ParserRuleContext {
		public TerminalNode AT_MIXIN() { return getToken(CRQLParser.AT_MIXIN, 0); }
		public TerminalNode MIXIN_NAME() { return getToken(CRQLParser.MIXIN_NAME, 0); }
		public TerminalNode LBRACE() { return getToken(CRQLParser.LBRACE, 0); }
		public BodyBlockContext bodyBlock() {
			return getRuleContext(BodyBlockContext.class,0);
		}
		public TerminalNode RBRACE() { return getToken(CRQLParser.RBRACE, 0); }
		public ParamDefsContext paramDefs() {
			return getRuleContext(ParamDefsContext.class,0);
		}
		public MixinDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_mixinDef; }
	}

	public final MixinDefContext mixinDef() throws RecognitionException {
		MixinDefContext _localctx = new MixinDefContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_mixinDef);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(113);
			match(AT_MIXIN);
			setState(114);
			match(MIXIN_NAME);
			setState(116);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==LPAREN) {
				{
				setState(115);
				paramDefs();
				}
			}

			setState(118);
			match(LBRACE);
			setState(119);
			bodyBlock();
			setState(120);
			match(RBRACE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ParamDefsContext extends ParserRuleContext {
		public TerminalNode LPAREN() { return getToken(CRQLParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(CRQLParser.RPAREN, 0); }
		public List<ParamDefContext> paramDef() {
			return getRuleContexts(ParamDefContext.class);
		}
		public ParamDefContext paramDef(int i) {
			return getRuleContext(ParamDefContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(CRQLParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(CRQLParser.COMMA, i);
		}
		public ParamDefsContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_paramDefs; }
	}

	public final ParamDefsContext paramDefs() throws RecognitionException {
		ParamDefsContext _localctx = new ParamDefsContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_paramDefs);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(122);
			match(LPAREN);
			setState(131);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SPARQL_VAR || _la==PARAM_VAR) {
				{
				setState(123);
				paramDef();
				setState(128);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==COMMA) {
					{
					{
					setState(124);
					match(COMMA);
					setState(125);
					paramDef();
					}
					}
					setState(130);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
			}

			setState(133);
			match(RPAREN);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ParamDefContext extends ParserRuleContext {
		public TerminalNode PARAM_VAR() { return getToken(CRQLParser.PARAM_VAR, 0); }
		public TerminalNode SPARQL_VAR() { return getToken(CRQLParser.SPARQL_VAR, 0); }
		public TerminalNode EQUALS() { return getToken(CRQLParser.EQUALS, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public ParamDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_paramDef; }
	}

	public final ParamDefContext paramDef() throws RecognitionException {
		ParamDefContext _localctx = new ParamDefContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_paramDef);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(135);
			_la = _input.LA(1);
			if ( !(_la==SPARQL_VAR || _la==PARAM_VAR) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(138);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==EQUALS) {
				{
				setState(136);
				match(EQUALS);
				setState(137);
				expr();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class RuleBlockContext extends ParserRuleContext {
		public SelectorExprListContext selectorExprList() {
			return getRuleContext(SelectorExprListContext.class,0);
		}
		public TerminalNode LBRACE() { return getToken(CRQLParser.LBRACE, 0); }
		public BodyBlockContext bodyBlock() {
			return getRuleContext(BodyBlockContext.class,0);
		}
		public TerminalNode RBRACE() { return getToken(CRQLParser.RBRACE, 0); }
		public RuleBlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_ruleBlock; }
	}

	public final RuleBlockContext ruleBlock() throws RecognitionException {
		RuleBlockContext _localctx = new RuleBlockContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_ruleBlock);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(140);
			selectorExprList();
			setState(141);
			match(LBRACE);
			setState(142);
			bodyBlock();
			setState(143);
			match(RBRACE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SelectorExprListContext extends ParserRuleContext {
		public List<SelectorExprContext> selectorExpr() {
			return getRuleContexts(SelectorExprContext.class);
		}
		public SelectorExprContext selectorExpr(int i) {
			return getRuleContext(SelectorExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(CRQLParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(CRQLParser.COMMA, i);
		}
		public SelectorExprListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_selectorExprList; }
	}

	public final SelectorExprListContext selectorExprList() throws RecognitionException {
		SelectorExprListContext _localctx = new SelectorExprListContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_selectorExprList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(145);
			selectorExpr();
			setState(150);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(146);
				match(COMMA);
				setState(147);
				selectorExpr();
				}
				}
				setState(152);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SelectorExprContext extends ParserRuleContext {
		public SelectorNameContext selectorName() {
			return getRuleContext(SelectorNameContext.class,0);
		}
		public List<AttrFilterContext> attrFilter() {
			return getRuleContexts(AttrFilterContext.class);
		}
		public AttrFilterContext attrFilter(int i) {
			return getRuleContext(AttrFilterContext.class,i);
		}
		public TerminalNode LPAREN() { return getToken(CRQLParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(CRQLParser.RPAREN, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(CRQLParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(CRQLParser.COMMA, i);
		}
		public SelectorExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_selectorExpr; }
	}

	public final SelectorExprContext selectorExpr() throws RecognitionException {
		SelectorExprContext _localctx = new SelectorExprContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_selectorExpr);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(153);
			selectorName();
			setState(157);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==LBRACKET) {
				{
				{
				setState(154);
				attrFilter();
				}
				}
				setState(159);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(172);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==LPAREN) {
				{
				setState(160);
				match(LPAREN);
				setState(169);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 2139095040L) != 0)) {
					{
					setState(161);
					expr();
					setState(166);
					_errHandler.sync(this);
					_la = _input.LA(1);
					while (_la==COMMA) {
						{
						{
						setState(162);
						match(COMMA);
						setState(163);
						expr();
						}
						}
						setState(168);
						_errHandler.sync(this);
						_la = _input.LA(1);
					}
					}
				}

				setState(171);
				match(RPAREN);
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class AttrFilterContext extends ParserRuleContext {
		public TerminalNode LBRACKET() { return getToken(CRQLParser.LBRACKET, 0); }
		public TerminalNode IDENTIFIER() { return getToken(CRQLParser.IDENTIFIER, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode RBRACKET() { return getToken(CRQLParser.RBRACKET, 0); }
		public TerminalNode EQUALS() { return getToken(CRQLParser.EQUALS, 0); }
		public TerminalNode NOT_EQUALS() { return getToken(CRQLParser.NOT_EQUALS, 0); }
		public TerminalNode GTE() { return getToken(CRQLParser.GTE, 0); }
		public TerminalNode LTE() { return getToken(CRQLParser.LTE, 0); }
		public TerminalNode GT() { return getToken(CRQLParser.GT, 0); }
		public TerminalNode LT() { return getToken(CRQLParser.LT, 0); }
		public AttrFilterContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_attrFilter; }
	}

	public final AttrFilterContext attrFilter() throws RecognitionException {
		AttrFilterContext _localctx = new AttrFilterContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_attrFilter);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(174);
			match(LBRACKET);
			setState(175);
			match(IDENTIFIER);
			setState(176);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 138538465099776L) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(177);
			expr();
			setState(178);
			match(RBRACKET);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class BodyBlockContext extends ParserRuleContext {
		public List<BodyItemContext> bodyItem() {
			return getRuleContexts(BodyItemContext.class);
		}
		public BodyItemContext bodyItem(int i) {
			return getRuleContext(BodyItemContext.class,i);
		}
		public List<TerminalNode> SEMI() { return getTokens(CRQLParser.SEMI); }
		public TerminalNode SEMI(int i) {
			return getToken(CRQLParser.SEMI, i);
		}
		public List<TerminalNode> DOT() { return getTokens(CRQLParser.DOT); }
		public TerminalNode DOT(int i) {
			return getToken(CRQLParser.DOT, i);
		}
		public BodyBlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_bodyBlock; }
	}

	public final BodyBlockContext bodyBlock() throws RecognitionException {
		BodyBlockContext _localctx = new BodyBlockContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_bodyBlock);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(186);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & 562955431313392L) != 0)) {
				{
				{
				setState(180);
				bodyItem();
				setState(182);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==SEMI || _la==DOT) {
					{
					setState(181);
					_la = _input.LA(1);
					if ( !(_la==SEMI || _la==DOT) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
				}

				}
				}
				setState(188);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class BodyItemContext extends ParserRuleContext {
		public PropertyPatternContext propertyPattern() {
			return getRuleContext(PropertyPatternContext.class,0);
		}
		public GetDirectiveContext getDirective() {
			return getRuleContext(GetDirectiveContext.class,0);
		}
		public NestedTraversalContext nestedTraversal() {
			return getRuleContext(NestedTraversalContext.class,0);
		}
		public WhereModifierContext whereModifier() {
			return getRuleContext(WhereModifierContext.class,0);
		}
		public LangDirectiveContext langDirective() {
			return getRuleContext(LangDirectiveContext.class,0);
		}
		public FilterStmtContext filterStmt() {
			return getRuleContext(FilterStmtContext.class,0);
		}
		public ValuesBlockContext valuesBlock() {
			return getRuleContext(ValuesBlockContext.class,0);
		}
		public BindStmtContext bindStmt() {
			return getRuleContext(BindStmtContext.class,0);
		}
		public SubSelectBlockContext subSelectBlock() {
			return getRuleContext(SubSelectBlockContext.class,0);
		}
		public PageDirectiveContext pageDirective() {
			return getRuleContext(PageDirectiveContext.class,0);
		}
		public BodyItemContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_bodyItem; }
	}

	public final BodyItemContext bodyItem() throws RecognitionException {
		BodyItemContext _localctx = new BodyItemContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_bodyItem);
		try {
			setState(199);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,18,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(189);
				propertyPattern();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(190);
				getDirective();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(191);
				nestedTraversal();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(192);
				whereModifier();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(193);
				langDirective();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(194);
				filterStmt();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(195);
				valuesBlock();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(196);
				bindStmt();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(197);
				subSelectBlock();
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(198);
				pageDirective();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PropertyPatternContext extends ParserRuleContext {
		public PredicateContext predicate() {
			return getRuleContext(PredicateContext.class,0);
		}
		public TerminalNode AT_WHERE() { return getToken(CRQLParser.AT_WHERE, 0); }
		public List<TerminalNode> SPARQL_VAR() { return getTokens(CRQLParser.SPARQL_VAR); }
		public TerminalNode SPARQL_VAR(int i) {
			return getToken(CRQLParser.SPARQL_VAR, i);
		}
		public LangAttrFilterContext langAttrFilter() {
			return getRuleContext(LangAttrFilterContext.class,0);
		}
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode ARROW_RIGHT() { return getToken(CRQLParser.ARROW_RIGHT, 0); }
		public TargetPredicateContext targetPredicate() {
			return getRuleContext(TargetPredicateContext.class,0);
		}
		public PropertyPatternContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyPattern; }
	}

	public final PropertyPatternContext propertyPattern() throws RecognitionException {
		PropertyPatternContext _localctx = new PropertyPatternContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_propertyPattern);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(202);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==AT_WHERE) {
				{
				setState(201);
				match(AT_WHERE);
				}
			}

			setState(205);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SPARQL_VAR) {
				{
				setState(204);
				match(SPARQL_VAR);
				}
			}

			setState(207);
			predicate();
			setState(209);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==LBRACKET) {
				{
				setState(208);
				langAttrFilter();
				}
			}

			setState(212);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,22,_ctx) ) {
			case 1:
				{
				setState(211);
				expr();
				}
				break;
			}
			setState(222);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==ARROW_RIGHT) {
				{
				setState(214);
				match(ARROW_RIGHT);
				setState(216);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==SPARQL_VAR) {
					{
					setState(215);
					match(SPARQL_VAR);
					}
				}

				setState(218);
				targetPredicate();
				setState(220);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,24,_ctx) ) {
				case 1:
					{
					setState(219);
					expr();
					}
					break;
				}
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PredicateContext extends ParserRuleContext {
		public TerminalNode CURIE() { return getToken(CRQLParser.CURIE, 0); }
		public TerminalNode IDENTIFIER() { return getToken(CRQLParser.IDENTIFIER, 0); }
		public TerminalNode IRI_REF() { return getToken(CRQLParser.IRI_REF, 0); }
		public PredicateContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_predicate; }
	}

	public final PredicateContext predicate() throws RecognitionException {
		PredicateContext _localctx = new PredicateContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_predicate);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(224);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 1174405120L) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TargetPredicateContext extends ParserRuleContext {
		public TerminalNode CURIE() { return getToken(CRQLParser.CURIE, 0); }
		public TerminalNode IDENTIFIER() { return getToken(CRQLParser.IDENTIFIER, 0); }
		public TerminalNode IRI_REF() { return getToken(CRQLParser.IRI_REF, 0); }
		public TargetPredicateContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_targetPredicate; }
	}

	public final TargetPredicateContext targetPredicate() throws RecognitionException {
		TargetPredicateContext _localctx = new TargetPredicateContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_targetPredicate);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(226);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 1174405120L) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class LangAttrFilterContext extends ParserRuleContext {
		public TerminalNode LBRACKET() { return getToken(CRQLParser.LBRACKET, 0); }
		public TerminalNode LANG_KEY() { return getToken(CRQLParser.LANG_KEY, 0); }
		public TerminalNode EQUALS() { return getToken(CRQLParser.EQUALS, 0); }
		public TerminalNode RBRACKET() { return getToken(CRQLParser.RBRACKET, 0); }
		public TerminalNode PARAM_VAR() { return getToken(CRQLParser.PARAM_VAR, 0); }
		public TerminalNode STRING_LITERAL() { return getToken(CRQLParser.STRING_LITERAL, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public LangAttrFilterContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_langAttrFilter; }
	}

	public final LangAttrFilterContext langAttrFilter() throws RecognitionException {
		LangAttrFilterContext _localctx = new LangAttrFilterContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_langAttrFilter);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(228);
			match(LBRACKET);
			setState(229);
			match(LANG_KEY);
			setState(230);
			match(EQUALS);
			setState(234);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,26,_ctx) ) {
			case 1:
				{
				setState(231);
				match(PARAM_VAR);
				}
				break;
			case 2:
				{
				setState(232);
				match(STRING_LITERAL);
				}
				break;
			case 3:
				{
				setState(233);
				expr();
				}
				break;
			}
			setState(236);
			match(RBRACKET);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class GetDirectiveContext extends ParserRuleContext {
		public TerminalNode AT_GET() { return getToken(CRQLParser.AT_GET, 0); }
		public TerminalNode MIXIN_NAME() { return getToken(CRQLParser.MIXIN_NAME, 0); }
		public TerminalNode LPAREN() { return getToken(CRQLParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(CRQLParser.RPAREN, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(CRQLParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(CRQLParser.COMMA, i);
		}
		public GetDirectiveContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_getDirective; }
	}

	public final GetDirectiveContext getDirective() throws RecognitionException {
		GetDirectiveContext _localctx = new GetDirectiveContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_getDirective);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(238);
			match(AT_GET);
			setState(239);
			match(MIXIN_NAME);
			setState(252);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==LPAREN) {
				{
				setState(240);
				match(LPAREN);
				setState(249);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 2139095040L) != 0)) {
					{
					setState(241);
					expr();
					setState(246);
					_errHandler.sync(this);
					_la = _input.LA(1);
					while (_la==COMMA) {
						{
						{
						setState(242);
						match(COMMA);
						setState(243);
						expr();
						}
						}
						setState(248);
						_errHandler.sync(this);
						_la = _input.LA(1);
					}
					}
				}

				setState(251);
				match(RPAREN);
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class NestedTraversalContext extends ParserRuleContext {
		public TerminalNode IDENTIFIER() { return getToken(CRQLParser.IDENTIFIER, 0); }
		public TerminalNode LBRACE() { return getToken(CRQLParser.LBRACE, 0); }
		public BodyBlockContext bodyBlock() {
			return getRuleContext(BodyBlockContext.class,0);
		}
		public TerminalNode RBRACE() { return getToken(CRQLParser.RBRACE, 0); }
		public TerminalNode CARET() { return getToken(CRQLParser.CARET, 0); }
		public TerminalNode GT() { return getToken(CRQLParser.GT, 0); }
		public NestedTraversalContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_nestedTraversal; }
	}

	public final NestedTraversalContext nestedTraversal() throws RecognitionException {
		NestedTraversalContext _localctx = new NestedTraversalContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_nestedTraversal);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(255);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==CARET) {
				{
				setState(254);
				match(CARET);
				}
			}

			setState(257);
			match(IDENTIFIER);
			setState(259);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==GT) {
				{
				setState(258);
				match(GT);
				}
			}

			setState(261);
			match(LBRACE);
			setState(262);
			bodyBlock();
			setState(263);
			match(RBRACE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class WhereModifierContext extends ParserRuleContext {
		public TerminalNode AT_WHERE() { return getToken(CRQLParser.AT_WHERE, 0); }
		public TerminalNode LBRACE() { return getToken(CRQLParser.LBRACE, 0); }
		public BodyBlockContext bodyBlock() {
			return getRuleContext(BodyBlockContext.class,0);
		}
		public TerminalNode RBRACE() { return getToken(CRQLParser.RBRACE, 0); }
		public WhereModifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_whereModifier; }
	}

	public final WhereModifierContext whereModifier() throws RecognitionException {
		WhereModifierContext _localctx = new WhereModifierContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_whereModifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(265);
			match(AT_WHERE);
			setState(266);
			match(LBRACE);
			setState(267);
			bodyBlock();
			setState(268);
			match(RBRACE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class LangDirectiveContext extends ParserRuleContext {
		public TerminalNode AT_LANG() { return getToken(CRQLParser.AT_LANG, 0); }
		public TerminalNode LPAREN() { return getToken(CRQLParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(CRQLParser.RPAREN, 0); }
		public List<TerminalNode> PARAM_VAR() { return getTokens(CRQLParser.PARAM_VAR); }
		public TerminalNode PARAM_VAR(int i) {
			return getToken(CRQLParser.PARAM_VAR, i);
		}
		public List<TerminalNode> STRING_LITERAL() { return getTokens(CRQLParser.STRING_LITERAL); }
		public TerminalNode STRING_LITERAL(int i) {
			return getToken(CRQLParser.STRING_LITERAL, i);
		}
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(CRQLParser.COMMA, 0); }
		public TerminalNode SPARQL_VAR() { return getToken(CRQLParser.SPARQL_VAR, 0); }
		public LangDirectiveContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_langDirective; }
	}

	public final LangDirectiveContext langDirective() throws RecognitionException {
		LangDirectiveContext _localctx = new LangDirectiveContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_langDirective);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(270);
			match(AT_LANG);
			setState(290);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case LPAREN:
				{
				setState(271);
				match(LPAREN);
				setState(273);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,32,_ctx) ) {
				case 1:
					{
					setState(272);
					_la = _input.LA(1);
					if ( !(_la==SPARQL_VAR || _la==PARAM_VAR) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
					break;
				}
				setState(276);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==COMMA) {
					{
					setState(275);
					match(COMMA);
					}
				}

				setState(281);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,34,_ctx) ) {
				case 1:
					{
					setState(278);
					match(PARAM_VAR);
					}
					break;
				case 2:
					{
					setState(279);
					match(STRING_LITERAL);
					}
					break;
				case 3:
					{
					setState(280);
					expr();
					}
					break;
				}
				setState(283);
				match(RPAREN);
				}
				break;
			case PARAM_VAR:
				{
				setState(284);
				match(PARAM_VAR);
				}
				break;
			case STRING_LITERAL:
				{
				setState(286); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(285);
					match(STRING_LITERAL);
					}
					}
					setState(288); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==STRING_LITERAL );
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class FilterStmtContext extends ParserRuleContext {
		public TerminalNode FILTER() { return getToken(CRQLParser.FILTER, 0); }
		public TerminalNode LPAREN() { return getToken(CRQLParser.LPAREN, 0); }
		public FilterExprContext filterExpr() {
			return getRuleContext(FilterExprContext.class,0);
		}
		public TerminalNode RPAREN() { return getToken(CRQLParser.RPAREN, 0); }
		public FilterStmtContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_filterStmt; }
	}

	public final FilterStmtContext filterStmt() throws RecognitionException {
		FilterStmtContext _localctx = new FilterStmtContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_filterStmt);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(292);
			match(FILTER);
			setState(293);
			match(LPAREN);
			setState(294);
			filterExpr();
			setState(295);
			match(RPAREN);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class FilterExprContext extends ParserRuleContext {
		public List<TerminalNode> RPAREN() { return getTokens(CRQLParser.RPAREN); }
		public TerminalNode RPAREN(int i) {
			return getToken(CRQLParser.RPAREN, i);
		}
		public FilterExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_filterExpr; }
	}

	public final FilterExprContext filterExpr() throws RecognitionException {
		FilterExprContext _localctx = new FilterExprContext(_ctx, getState());
		enterRule(_localctx, 46, RULE_filterExpr);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(298); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(297);
				_la = _input.LA(1);
				if ( _la <= 0 || (_la==RPAREN) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(300); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & 36028762659225598L) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ValuesBlockContext extends ParserRuleContext {
		public TerminalNode LBRACE() { return getToken(CRQLParser.LBRACE, 0); }
		public ValuesContentContext valuesContent() {
			return getRuleContext(ValuesContentContext.class,0);
		}
		public TerminalNode RBRACE() { return getToken(CRQLParser.RBRACE, 0); }
		public TerminalNode AT_VALUES() { return getToken(CRQLParser.AT_VALUES, 0); }
		public TerminalNode VALUES() { return getToken(CRQLParser.VALUES, 0); }
		public List<TerminalNode> SPARQL_VAR() { return getTokens(CRQLParser.SPARQL_VAR); }
		public TerminalNode SPARQL_VAR(int i) {
			return getToken(CRQLParser.SPARQL_VAR, i);
		}
		public TerminalNode LPAREN() { return getToken(CRQLParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(CRQLParser.RPAREN, 0); }
		public ValuesBlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_valuesBlock; }
	}

	public final ValuesBlockContext valuesBlock() throws RecognitionException {
		ValuesBlockContext _localctx = new ValuesBlockContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_valuesBlock);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(302);
			_la = _input.LA(1);
			if ( !(_la==AT_VALUES || _la==VALUES) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(311);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SPARQL_VAR:
				{
				setState(303);
				match(SPARQL_VAR);
				}
				break;
			case LPAREN:
				{
				setState(304);
				match(LPAREN);
				setState(306); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(305);
					match(SPARQL_VAR);
					}
					}
					setState(308); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==SPARQL_VAR );
				setState(310);
				match(RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(313);
			match(LBRACE);
			setState(314);
			valuesContent();
			setState(315);
			match(RBRACE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ValuesContentContext extends ParserRuleContext {
		public List<TerminalNode> RBRACE() { return getTokens(CRQLParser.RBRACE); }
		public TerminalNode RBRACE(int i) {
			return getToken(CRQLParser.RBRACE, i);
		}
		public ValuesContentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_valuesContent; }
	}

	public final ValuesContentContext valuesContent() throws RecognitionException {
		ValuesContentContext _localctx = new ValuesContentContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_valuesContent);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(318); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(317);
				_la = _input.LA(1);
				if ( _la <= 0 || (_la==RBRACE) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(320); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & 36028788429029374L) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class BindStmtContext extends ParserRuleContext {
		public TerminalNode LPAREN() { return getToken(CRQLParser.LPAREN, 0); }
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode AS() { return getToken(CRQLParser.AS, 0); }
		public TerminalNode SPARQL_VAR() { return getToken(CRQLParser.SPARQL_VAR, 0); }
		public TerminalNode RPAREN() { return getToken(CRQLParser.RPAREN, 0); }
		public TerminalNode AT_BIND() { return getToken(CRQLParser.AT_BIND, 0); }
		public TerminalNode BIND() { return getToken(CRQLParser.BIND, 0); }
		public BindStmtContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_bindStmt; }
	}

	public final BindStmtContext bindStmt() throws RecognitionException {
		BindStmtContext _localctx = new BindStmtContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_bindStmt);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(322);
			_la = _input.LA(1);
			if ( !(_la==AT_BIND || _la==BIND) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(323);
			match(LPAREN);
			setState(324);
			expr();
			setState(325);
			match(AS);
			setState(326);
			match(SPARQL_VAR);
			setState(327);
			match(RPAREN);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SubSelectBlockContext extends ParserRuleContext {
		public List<TerminalNode> RBRACE() { return getTokens(CRQLParser.RBRACE); }
		public TerminalNode RBRACE(int i) {
			return getToken(CRQLParser.RBRACE, i);
		}
		public TerminalNode AT_SELECT() { return getToken(CRQLParser.AT_SELECT, 0); }
		public TerminalNode SELECT() { return getToken(CRQLParser.SELECT, 0); }
		public TerminalNode LBRACE() { return getToken(CRQLParser.LBRACE, 0); }
		public SubSelectBlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_subSelectBlock; }
	}

	public final SubSelectBlockContext subSelectBlock() throws RecognitionException {
		SubSelectBlockContext _localctx = new SubSelectBlockContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_subSelectBlock);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(333);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case AT_SELECT:
				{
				setState(329);
				match(AT_SELECT);
				}
				break;
			case SELECT:
				{
				setState(330);
				match(SELECT);
				}
				break;
			case LBRACE:
				{
				setState(331);
				match(LBRACE);
				setState(332);
				match(SELECT);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(336); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(335);
				_la = _input.LA(1);
				if ( _la <= 0 || (_la==RBRACE) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(338); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & 36028788429029374L) != 0) );
			setState(340);
			match(RBRACE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PageDirectiveContext extends ParserRuleContext {
		public TerminalNode AT_LIMIT() { return getToken(CRQLParser.AT_LIMIT, 0); }
		public TerminalNode NUMBER_LITERAL() { return getToken(CRQLParser.NUMBER_LITERAL, 0); }
		public TerminalNode AT_OFFSET() { return getToken(CRQLParser.AT_OFFSET, 0); }
		public TerminalNode AT_ORDER_BY() { return getToken(CRQLParser.AT_ORDER_BY, 0); }
		public TerminalNode SPARQL_VAR() { return getToken(CRQLParser.SPARQL_VAR, 0); }
		public TerminalNode ASC() { return getToken(CRQLParser.ASC, 0); }
		public TerminalNode DESC() { return getToken(CRQLParser.DESC, 0); }
		public PageDirectiveContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_pageDirective; }
	}

	public final PageDirectiveContext pageDirective() throws RecognitionException {
		PageDirectiveContext _localctx = new PageDirectiveContext(_ctx, getState());
		enterRule(_localctx, 56, RULE_pageDirective);
		int _la;
		try {
			setState(351);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case AT_LIMIT:
				enterOuterAlt(_localctx, 1);
				{
				setState(342);
				match(AT_LIMIT);
				setState(343);
				match(NUMBER_LITERAL);
				}
				break;
			case AT_OFFSET:
				enterOuterAlt(_localctx, 2);
				{
				setState(344);
				match(AT_OFFSET);
				setState(345);
				match(NUMBER_LITERAL);
				}
				break;
			case AT_ORDER_BY:
				enterOuterAlt(_localctx, 3);
				{
				setState(346);
				match(AT_ORDER_BY);
				setState(347);
				match(SPARQL_VAR);
				setState(349);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==ASC || _la==DESC) {
					{
					setState(348);
					_la = _input.LA(1);
					if ( !(_la==ASC || _la==DESC) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
				}

				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TriplePatternContext extends ParserRuleContext {
		public TerminalNode SPARQL_VAR() { return getToken(CRQLParser.SPARQL_VAR, 0); }
		public PathExprContext pathExpr() {
			return getRuleContext(PathExprContext.class,0);
		}
		public ObjectExprContext objectExpr() {
			return getRuleContext(ObjectExprContext.class,0);
		}
		public TerminalNode SEMI() { return getToken(CRQLParser.SEMI, 0); }
		public TerminalNode DOT() { return getToken(CRQLParser.DOT, 0); }
		public TriplePatternContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_triplePattern; }
	}

	public final TriplePatternContext triplePattern() throws RecognitionException {
		TriplePatternContext _localctx = new TriplePatternContext(_ctx, getState());
		enterRule(_localctx, 58, RULE_triplePattern);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(353);
			match(SPARQL_VAR);
			setState(354);
			pathExpr();
			setState(355);
			objectExpr();
			setState(357);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SEMI || _la==DOT) {
				{
				setState(356);
				_la = _input.LA(1);
				if ( !(_la==SEMI || _la==DOT) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PathExprContext extends ParserRuleContext {
		public List<TerminalNode> IDENTIFIER() { return getTokens(CRQLParser.IDENTIFIER); }
		public TerminalNode IDENTIFIER(int i) {
			return getToken(CRQLParser.IDENTIFIER, i);
		}
		public TerminalNode CURIE() { return getToken(CRQLParser.CURIE, 0); }
		public List<TerminalNode> SLASH() { return getTokens(CRQLParser.SLASH); }
		public TerminalNode SLASH(int i) {
			return getToken(CRQLParser.SLASH, i);
		}
		public List<TerminalNode> CARET() { return getTokens(CRQLParser.CARET); }
		public TerminalNode CARET(int i) {
			return getToken(CRQLParser.CARET, i);
		}
		public List<TerminalNode> ASTERISK() { return getTokens(CRQLParser.ASTERISK); }
		public TerminalNode ASTERISK(int i) {
			return getToken(CRQLParser.ASTERISK, i);
		}
		public List<TerminalNode> PLUS() { return getTokens(CRQLParser.PLUS); }
		public TerminalNode PLUS(int i) {
			return getToken(CRQLParser.PLUS, i);
		}
		public PathExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_pathExpr; }
	}

	public final PathExprContext pathExpr() throws RecognitionException {
		PathExprContext _localctx = new PathExprContext(_ctx, getState());
		enterRule(_localctx, 60, RULE_pathExpr);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(359);
			_la = _input.LA(1);
			if ( !(_la==CURIE || _la==IDENTIFIER) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(368);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & 4222124650659840L) != 0)) {
				{
				setState(366);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case SLASH:
					{
					setState(360);
					match(SLASH);
					setState(361);
					match(IDENTIFIER);
					}
					break;
				case CARET:
					{
					setState(362);
					match(CARET);
					setState(363);
					match(IDENTIFIER);
					}
					break;
				case ASTERISK:
					{
					setState(364);
					match(ASTERISK);
					}
					break;
				case PLUS:
					{
					setState(365);
					match(PLUS);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(370);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ObjectExprContext extends ParserRuleContext {
		public TerminalNode SPARQL_VAR() { return getToken(CRQLParser.SPARQL_VAR, 0); }
		public TerminalNode CURIE() { return getToken(CRQLParser.CURIE, 0); }
		public TerminalNode IRI_REF() { return getToken(CRQLParser.IRI_REF, 0); }
		public TerminalNode STRING_LITERAL() { return getToken(CRQLParser.STRING_LITERAL, 0); }
		public TerminalNode NUMBER_LITERAL() { return getToken(CRQLParser.NUMBER_LITERAL, 0); }
		public ObjectExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_objectExpr; }
	}

	public final ObjectExprContext objectExpr() throws RecognitionException {
		ObjectExprContext _localctx = new ObjectExprContext(_ctx, getState());
		enterRule(_localctx, 62, RULE_objectExpr);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(371);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 511705088L) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ExprContext extends ParserRuleContext {
		public FunctionCallContext functionCall() {
			return getRuleContext(FunctionCallContext.class,0);
		}
		public TerminalNode SPARQL_VAR() { return getToken(CRQLParser.SPARQL_VAR, 0); }
		public TerminalNode PARAM_VAR() { return getToken(CRQLParser.PARAM_VAR, 0); }
		public TerminalNode CURIE() { return getToken(CRQLParser.CURIE, 0); }
		public TerminalNode IRI_REF() { return getToken(CRQLParser.IRI_REF, 0); }
		public TerminalNode STRING_LITERAL() { return getToken(CRQLParser.STRING_LITERAL, 0); }
		public TerminalNode NUMBER_LITERAL() { return getToken(CRQLParser.NUMBER_LITERAL, 0); }
		public TerminalNode BOOLEAN_LITERAL() { return getToken(CRQLParser.BOOLEAN_LITERAL, 0); }
		public ExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expr; }
	}

	public final ExprContext expr() throws RecognitionException {
		ExprContext _localctx = new ExprContext(_ctx, getState());
		enterRule(_localctx, 64, RULE_expr);
		try {
			setState(381);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IDENTIFIER:
				enterOuterAlt(_localctx, 1);
				{
				setState(373);
				functionCall();
				}
				break;
			case SPARQL_VAR:
				enterOuterAlt(_localctx, 2);
				{
				setState(374);
				match(SPARQL_VAR);
				}
				break;
			case PARAM_VAR:
				enterOuterAlt(_localctx, 3);
				{
				setState(375);
				match(PARAM_VAR);
				}
				break;
			case CURIE:
				enterOuterAlt(_localctx, 4);
				{
				setState(376);
				match(CURIE);
				}
				break;
			case IRI_REF:
				enterOuterAlt(_localctx, 5);
				{
				setState(377);
				match(IRI_REF);
				}
				break;
			case STRING_LITERAL:
				enterOuterAlt(_localctx, 6);
				{
				setState(378);
				match(STRING_LITERAL);
				}
				break;
			case NUMBER_LITERAL:
				enterOuterAlt(_localctx, 7);
				{
				setState(379);
				match(NUMBER_LITERAL);
				}
				break;
			case BOOLEAN_LITERAL:
				enterOuterAlt(_localctx, 8);
				{
				setState(380);
				match(BOOLEAN_LITERAL);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class FunctionCallContext extends ParserRuleContext {
		public TerminalNode IDENTIFIER() { return getToken(CRQLParser.IDENTIFIER, 0); }
		public TerminalNode LPAREN() { return getToken(CRQLParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(CRQLParser.RPAREN, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(CRQLParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(CRQLParser.COMMA, i);
		}
		public FunctionCallContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_functionCall; }
	}

	public final FunctionCallContext functionCall() throws RecognitionException {
		FunctionCallContext _localctx = new FunctionCallContext(_ctx, getState());
		enterRule(_localctx, 66, RULE_functionCall);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(383);
			match(IDENTIFIER);
			setState(384);
			match(LPAREN);
			setState(393);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 2139095040L) != 0)) {
				{
				setState(385);
				expr();
				setState(390);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==COMMA) {
					{
					{
					setState(386);
					match(COMMA);
					setState(387);
					expr();
					}
					}
					setState(392);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
			}

			setState(395);
			match(RPAREN);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\u0004\u00016\u018e\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004\u0007\u0004\u0002"+
		"\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007\u0007\u0007\u0002"+
		"\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002\u000b\u0007\u000b\u0002"+
		"\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e\u0002\u000f\u0007\u000f"+
		"\u0002\u0010\u0007\u0010\u0002\u0011\u0007\u0011\u0002\u0012\u0007\u0012"+
		"\u0002\u0013\u0007\u0013\u0002\u0014\u0007\u0014\u0002\u0015\u0007\u0015"+
		"\u0002\u0016\u0007\u0016\u0002\u0017\u0007\u0017\u0002\u0018\u0007\u0018"+
		"\u0002\u0019\u0007\u0019\u0002\u001a\u0007\u001a\u0002\u001b\u0007\u001b"+
		"\u0002\u001c\u0007\u001c\u0002\u001d\u0007\u001d\u0002\u001e\u0007\u001e"+
		"\u0002\u001f\u0007\u001f\u0002 \u0007 \u0002!\u0007!\u0001\u0000\u0005"+
		"\u0000F\b\u0000\n\u0000\f\u0000I\t\u0000\u0001\u0000\u0001\u0000\u0001"+
		"\u0000\u0005\u0000N\b\u0000\n\u0000\f\u0000Q\t\u0000\u0001\u0000\u0001"+
		"\u0000\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0003\u0001Y\b"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0002\u0001\u0002\u0001"+
		"\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0003\u0001\u0003\u0001"+
		"\u0003\u0001\u0003\u0003\u0003h\b\u0003\u0001\u0004\u0001\u0004\u0001"+
		"\u0004\u0005\u0004m\b\u0004\n\u0004\f\u0004p\t\u0004\u0001\u0005\u0001"+
		"\u0005\u0001\u0005\u0003\u0005u\b\u0005\u0001\u0005\u0001\u0005\u0001"+
		"\u0005\u0001\u0005\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0005"+
		"\u0006\u007f\b\u0006\n\u0006\f\u0006\u0082\t\u0006\u0003\u0006\u0084\b"+
		"\u0006\u0001\u0006\u0001\u0006\u0001\u0007\u0001\u0007\u0001\u0007\u0003"+
		"\u0007\u008b\b\u0007\u0001\b\u0001\b\u0001\b\u0001\b\u0001\b\u0001\t\u0001"+
		"\t\u0001\t\u0005\t\u0095\b\t\n\t\f\t\u0098\t\t\u0001\n\u0001\n\u0005\n"+
		"\u009c\b\n\n\n\f\n\u009f\t\n\u0001\n\u0001\n\u0001\n\u0001\n\u0005\n\u00a5"+
		"\b\n\n\n\f\n\u00a8\t\n\u0003\n\u00aa\b\n\u0001\n\u0003\n\u00ad\b\n\u0001"+
		"\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001"+
		"\f\u0001\f\u0003\f\u00b7\b\f\u0005\f\u00b9\b\f\n\f\f\f\u00bc\t\f\u0001"+
		"\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001"+
		"\r\u0003\r\u00c8\b\r\u0001\u000e\u0003\u000e\u00cb\b\u000e\u0001\u000e"+
		"\u0003\u000e\u00ce\b\u000e\u0001\u000e\u0001\u000e\u0003\u000e\u00d2\b"+
		"\u000e\u0001\u000e\u0003\u000e\u00d5\b\u000e\u0001\u000e\u0001\u000e\u0003"+
		"\u000e\u00d9\b\u000e\u0001\u000e\u0001\u000e\u0003\u000e\u00dd\b\u000e"+
		"\u0003\u000e\u00df\b\u000e\u0001\u000f\u0001\u000f\u0001\u0010\u0001\u0010"+
		"\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011"+
		"\u0003\u0011\u00eb\b\u0011\u0001\u0011\u0001\u0011\u0001\u0012\u0001\u0012"+
		"\u0001\u0012\u0001\u0012\u0001\u0012\u0001\u0012\u0005\u0012\u00f5\b\u0012"+
		"\n\u0012\f\u0012\u00f8\t\u0012\u0003\u0012\u00fa\b\u0012\u0001\u0012\u0003"+
		"\u0012\u00fd\b\u0012\u0001\u0013\u0003\u0013\u0100\b\u0013\u0001\u0013"+
		"\u0001\u0013\u0003\u0013\u0104\b\u0013\u0001\u0013\u0001\u0013\u0001\u0013"+
		"\u0001\u0013\u0001\u0014\u0001\u0014\u0001\u0014\u0001\u0014\u0001\u0014"+
		"\u0001\u0015\u0001\u0015\u0001\u0015\u0003\u0015\u0112\b\u0015\u0001\u0015"+
		"\u0003\u0015\u0115\b\u0015\u0001\u0015\u0001\u0015\u0001\u0015\u0003\u0015"+
		"\u011a\b\u0015\u0001\u0015\u0001\u0015\u0001\u0015\u0004\u0015\u011f\b"+
		"\u0015\u000b\u0015\f\u0015\u0120\u0003\u0015\u0123\b\u0015\u0001\u0016"+
		"\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0017\u0004\u0017"+
		"\u012b\b\u0017\u000b\u0017\f\u0017\u012c\u0001\u0018\u0001\u0018\u0001"+
		"\u0018\u0001\u0018\u0004\u0018\u0133\b\u0018\u000b\u0018\f\u0018\u0134"+
		"\u0001\u0018\u0003\u0018\u0138\b\u0018\u0001\u0018\u0001\u0018\u0001\u0018"+
		"\u0001\u0018\u0001\u0019\u0004\u0019\u013f\b\u0019\u000b\u0019\f\u0019"+
		"\u0140\u0001\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0001"+
		"\u001a\u0001\u001a\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b\u0003"+
		"\u001b\u014e\b\u001b\u0001\u001b\u0004\u001b\u0151\b\u001b\u000b\u001b"+
		"\f\u001b\u0152\u0001\u001b\u0001\u001b\u0001\u001c\u0001\u001c\u0001\u001c"+
		"\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0003\u001c\u015e\b\u001c"+
		"\u0003\u001c\u0160\b\u001c\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d"+
		"\u0003\u001d\u0166\b\u001d\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e"+
		"\u0001\u001e\u0001\u001e\u0001\u001e\u0005\u001e\u016f\b\u001e\n\u001e"+
		"\f\u001e\u0172\t\u001e\u0001\u001f\u0001\u001f\u0001 \u0001 \u0001 \u0001"+
		" \u0001 \u0001 \u0001 \u0001 \u0003 \u017e\b \u0001!\u0001!\u0001!\u0001"+
		"!\u0001!\u0005!\u0185\b!\n!\f!\u0188\t!\u0003!\u018a\b!\u0001!\u0001!"+
		"\u0001!\u0000\u0000\"\u0000\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012"+
		"\u0014\u0016\u0018\u001a\u001c\u001e \"$&(*,.02468:<>@B\u0000\u000b\u0001"+
		"\u0000\u0017\u0018\u0001\u0000).\u0001\u0000&\'\u0002\u0000\u0019\u001a"+
		"\u001e\u001e\u0001\u0000##\u0002\u0000\n\n\u000e\u000e\u0001\u0000!!\u0002"+
		"\u0000\u000b\u000b\u000f\u000f\u0001\u0000\u0013\u0014\u0002\u0000\u0019"+
		"\u0019\u001e\u001e\u0002\u0000\u0017\u0017\u0019\u001c\u01b6\u0000G\u0001"+
		"\u0000\u0000\u0000\u0002T\u0001\u0000\u0000\u0000\u0004]\u0001\u0000\u0000"+
		"\u0000\u0006g\u0001\u0000\u0000\u0000\bn\u0001\u0000\u0000\u0000\nq\u0001"+
		"\u0000\u0000\u0000\fz\u0001\u0000\u0000\u0000\u000e\u0087\u0001\u0000"+
		"\u0000\u0000\u0010\u008c\u0001\u0000\u0000\u0000\u0012\u0091\u0001\u0000"+
		"\u0000\u0000\u0014\u0099\u0001\u0000\u0000\u0000\u0016\u00ae\u0001\u0000"+
		"\u0000\u0000\u0018\u00ba\u0001\u0000\u0000\u0000\u001a\u00c7\u0001\u0000"+
		"\u0000\u0000\u001c\u00ca\u0001\u0000\u0000\u0000\u001e\u00e0\u0001\u0000"+
		"\u0000\u0000 \u00e2\u0001\u0000\u0000\u0000\"\u00e4\u0001\u0000\u0000"+
		"\u0000$\u00ee\u0001\u0000\u0000\u0000&\u00ff\u0001\u0000\u0000\u0000("+
		"\u0109\u0001\u0000\u0000\u0000*\u010e\u0001\u0000\u0000\u0000,\u0124\u0001"+
		"\u0000\u0000\u0000.\u012a\u0001\u0000\u0000\u00000\u012e\u0001\u0000\u0000"+
		"\u00002\u013e\u0001\u0000\u0000\u00004\u0142\u0001\u0000\u0000\u00006"+
		"\u014d\u0001\u0000\u0000\u00008\u015f\u0001\u0000\u0000\u0000:\u0161\u0001"+
		"\u0000\u0000\u0000<\u0167\u0001\u0000\u0000\u0000>\u0173\u0001\u0000\u0000"+
		"\u0000@\u017d\u0001\u0000\u0000\u0000B\u017f\u0001\u0000\u0000\u0000D"+
		"F\u0003\u0002\u0001\u0000ED\u0001\u0000\u0000\u0000FI\u0001\u0000\u0000"+
		"\u0000GE\u0001\u0000\u0000\u0000GH\u0001\u0000\u0000\u0000HO\u0001\u0000"+
		"\u0000\u0000IG\u0001\u0000\u0000\u0000JN\u0003\u0004\u0002\u0000KN\u0003"+
		"\n\u0005\u0000LN\u0003\u0010\b\u0000MJ\u0001\u0000\u0000\u0000MK\u0001"+
		"\u0000\u0000\u0000ML\u0001\u0000\u0000\u0000NQ\u0001\u0000\u0000\u0000"+
		"OM\u0001\u0000\u0000\u0000OP\u0001\u0000\u0000\u0000PR\u0001\u0000\u0000"+
		"\u0000QO\u0001\u0000\u0000\u0000RS\u0005\u0000\u0000\u0001S\u0001\u0001"+
		"\u0000\u0000\u0000TX\u0005\u0001\u0000\u0000UV\u0005\u001e\u0000\u0000"+
		"VY\u0005/\u0000\u0000WY\u0005/\u0000\u0000XU\u0001\u0000\u0000\u0000X"+
		"W\u0001\u0000\u0000\u0000YZ\u0001\u0000\u0000\u0000Z[\u0005\u001a\u0000"+
		"\u0000[\\\u0005&\u0000\u0000\\\u0003\u0001\u0000\u0000\u0000]^\u0005\u0002"+
		"\u0000\u0000^_\u0003\u0006\u0003\u0000_`\u0005 \u0000\u0000`a\u0003\b"+
		"\u0004\u0000ab\u0005!\u0000\u0000b\u0005\u0001\u0000\u0000\u0000ch\u0005"+
		"\u0015\u0000\u0000de\u0005/\u0000\u0000eh\u0005\u001e\u0000\u0000fh\u0005"+
		"\u001e\u0000\u0000gc\u0001\u0000\u0000\u0000gd\u0001\u0000\u0000\u0000"+
		"gf\u0001\u0000\u0000\u0000h\u0007\u0001\u0000\u0000\u0000im\u0003:\u001d"+
		"\u0000jm\u00034\u001a\u0000km\u0003,\u0016\u0000li\u0001\u0000\u0000\u0000"+
		"lj\u0001\u0000\u0000\u0000lk\u0001\u0000\u0000\u0000mp\u0001\u0000\u0000"+
		"\u0000nl\u0001\u0000\u0000\u0000no\u0001\u0000\u0000\u0000o\t\u0001\u0000"+
		"\u0000\u0000pn\u0001\u0000\u0000\u0000qr\u0005\u0003\u0000\u0000rt\u0005"+
		"\u0016\u0000\u0000su\u0003\f\u0006\u0000ts\u0001\u0000\u0000\u0000tu\u0001"+
		"\u0000\u0000\u0000uv\u0001\u0000\u0000\u0000vw\u0005 \u0000\u0000wx\u0003"+
		"\u0018\f\u0000xy\u0005!\u0000\u0000y\u000b\u0001\u0000\u0000\u0000z\u0083"+
		"\u0005\"\u0000\u0000{\u0080\u0003\u000e\u0007\u0000|}\u0005(\u0000\u0000"+
		"}\u007f\u0003\u000e\u0007\u0000~|\u0001\u0000\u0000\u0000\u007f\u0082"+
		"\u0001\u0000\u0000\u0000\u0080~\u0001\u0000\u0000\u0000\u0080\u0081\u0001"+
		"\u0000\u0000\u0000\u0081\u0084\u0001\u0000\u0000\u0000\u0082\u0080\u0001"+
		"\u0000\u0000\u0000\u0083{\u0001\u0000\u0000\u0000\u0083\u0084\u0001\u0000"+
		"\u0000\u0000\u0084\u0085\u0001\u0000\u0000\u0000\u0085\u0086\u0005#\u0000"+
		"\u0000\u0086\r\u0001\u0000\u0000\u0000\u0087\u008a\u0007\u0000\u0000\u0000"+
		"\u0088\u0089\u0005)\u0000\u0000\u0089\u008b\u0003@ \u0000\u008a\u0088"+
		"\u0001\u0000\u0000\u0000\u008a\u008b\u0001\u0000\u0000\u0000\u008b\u000f"+
		"\u0001\u0000\u0000\u0000\u008c\u008d\u0003\u0012\t\u0000\u008d\u008e\u0005"+
		" \u0000\u0000\u008e\u008f\u0003\u0018\f\u0000\u008f\u0090\u0005!\u0000"+
		"\u0000\u0090\u0011\u0001\u0000\u0000\u0000\u0091\u0096\u0003\u0014\n\u0000"+
		"\u0092\u0093\u0005(\u0000\u0000\u0093\u0095\u0003\u0014\n\u0000\u0094"+
		"\u0092\u0001\u0000\u0000\u0000\u0095\u0098\u0001\u0000\u0000\u0000\u0096"+
		"\u0094\u0001\u0000\u0000\u0000\u0096\u0097\u0001\u0000\u0000\u0000\u0097"+
		"\u0013\u0001\u0000\u0000\u0000\u0098\u0096\u0001\u0000\u0000\u0000\u0099"+
		"\u009d\u0003\u0006\u0003\u0000\u009a\u009c\u0003\u0016\u000b\u0000\u009b"+
		"\u009a\u0001\u0000\u0000\u0000\u009c\u009f\u0001\u0000\u0000\u0000\u009d"+
		"\u009b\u0001\u0000\u0000\u0000\u009d\u009e\u0001\u0000\u0000\u0000\u009e"+
		"\u00ac\u0001\u0000\u0000\u0000\u009f\u009d\u0001\u0000\u0000\u0000\u00a0"+
		"\u00a9\u0005\"\u0000\u0000\u00a1\u00a6\u0003@ \u0000\u00a2\u00a3\u0005"+
		"(\u0000\u0000\u00a3\u00a5\u0003@ \u0000\u00a4\u00a2\u0001\u0000\u0000"+
		"\u0000\u00a5\u00a8\u0001\u0000\u0000\u0000\u00a6\u00a4\u0001\u0000\u0000"+
		"\u0000\u00a6\u00a7\u0001\u0000\u0000\u0000\u00a7\u00aa\u0001\u0000\u0000"+
		"\u0000\u00a8\u00a6\u0001\u0000\u0000\u0000\u00a9\u00a1\u0001\u0000\u0000"+
		"\u0000\u00a9\u00aa\u0001\u0000\u0000\u0000\u00aa\u00ab\u0001\u0000\u0000"+
		"\u0000\u00ab\u00ad\u0005#\u0000\u0000\u00ac\u00a0\u0001\u0000\u0000\u0000"+
		"\u00ac\u00ad\u0001\u0000\u0000\u0000\u00ad\u0015\u0001\u0000\u0000\u0000"+
		"\u00ae\u00af\u0005$\u0000\u0000\u00af\u00b0\u0005\u001e\u0000\u0000\u00b0"+
		"\u00b1\u0007\u0001\u0000\u0000\u00b1\u00b2\u0003@ \u0000\u00b2\u00b3\u0005"+
		"%\u0000\u0000\u00b3\u0017\u0001\u0000\u0000\u0000\u00b4\u00b6\u0003\u001a"+
		"\r\u0000\u00b5\u00b7\u0007\u0002\u0000\u0000\u00b6\u00b5\u0001\u0000\u0000"+
		"\u0000\u00b6\u00b7\u0001\u0000\u0000\u0000\u00b7\u00b9\u0001\u0000\u0000"+
		"\u0000\u00b8\u00b4\u0001\u0000\u0000\u0000\u00b9\u00bc\u0001\u0000\u0000"+
		"\u0000\u00ba\u00b8\u0001\u0000\u0000\u0000\u00ba\u00bb\u0001\u0000\u0000"+
		"\u0000\u00bb\u0019\u0001\u0000\u0000\u0000\u00bc\u00ba\u0001\u0000\u0000"+
		"\u0000\u00bd\u00c8\u0003\u001c\u000e\u0000\u00be\u00c8\u0003$\u0012\u0000"+
		"\u00bf\u00c8\u0003&\u0013\u0000\u00c0\u00c8\u0003(\u0014\u0000\u00c1\u00c8"+
		"\u0003*\u0015\u0000\u00c2\u00c8\u0003,\u0016\u0000\u00c3\u00c8\u00030"+
		"\u0018\u0000\u00c4\u00c8\u00034\u001a\u0000\u00c5\u00c8\u00036\u001b\u0000"+
		"\u00c6\u00c8\u00038\u001c\u0000\u00c7\u00bd\u0001\u0000\u0000\u0000\u00c7"+
		"\u00be\u0001\u0000\u0000\u0000\u00c7\u00bf\u0001\u0000\u0000\u0000\u00c7"+
		"\u00c0\u0001\u0000\u0000\u0000\u00c7\u00c1\u0001\u0000\u0000\u0000\u00c7"+
		"\u00c2\u0001\u0000\u0000\u0000\u00c7\u00c3\u0001\u0000\u0000\u0000\u00c7"+
		"\u00c4\u0001\u0000\u0000\u0000\u00c7\u00c5\u0001\u0000\u0000\u0000\u00c7"+
		"\u00c6\u0001\u0000\u0000\u0000\u00c8\u001b\u0001\u0000\u0000\u0000\u00c9"+
		"\u00cb\u0005\u0005\u0000\u0000\u00ca\u00c9\u0001\u0000\u0000\u0000\u00ca"+
		"\u00cb\u0001\u0000\u0000\u0000\u00cb\u00cd\u0001\u0000\u0000\u0000\u00cc"+
		"\u00ce\u0005\u0017\u0000\u0000\u00cd\u00cc\u0001\u0000\u0000\u0000\u00cd"+
		"\u00ce\u0001\u0000\u0000\u0000\u00ce\u00cf\u0001\u0000\u0000\u0000\u00cf"+
		"\u00d1\u0003\u001e\u000f\u0000\u00d0\u00d2\u0003\"\u0011\u0000\u00d1\u00d0"+
		"\u0001\u0000\u0000\u0000\u00d1\u00d2\u0001\u0000\u0000\u0000\u00d2\u00d4"+
		"\u0001\u0000\u0000\u0000\u00d3\u00d5\u0003@ \u0000\u00d4\u00d3\u0001\u0000"+
		"\u0000\u0000\u00d4\u00d5\u0001\u0000\u0000\u0000\u00d5\u00de\u0001\u0000"+
		"\u0000\u0000\u00d6\u00d8\u0005\u001f\u0000\u0000\u00d7\u00d9\u0005\u0017"+
		"\u0000\u0000\u00d8\u00d7\u0001\u0000\u0000\u0000\u00d8\u00d9\u0001\u0000"+
		"\u0000\u0000\u00d9\u00da\u0001\u0000\u0000\u0000\u00da\u00dc\u0003 \u0010"+
		"\u0000\u00db\u00dd\u0003@ \u0000\u00dc\u00db\u0001\u0000\u0000\u0000\u00dc"+
		"\u00dd\u0001\u0000\u0000\u0000\u00dd\u00df\u0001\u0000\u0000\u0000\u00de"+
		"\u00d6\u0001\u0000\u0000\u0000\u00de\u00df\u0001\u0000\u0000\u0000\u00df"+
		"\u001d\u0001\u0000\u0000\u0000\u00e0\u00e1\u0007\u0003\u0000\u0000\u00e1"+
		"\u001f\u0001\u0000\u0000\u0000\u00e2\u00e3\u0007\u0003\u0000\u0000\u00e3"+
		"!\u0001\u0000\u0000\u0000\u00e4\u00e5\u0005$\u0000\u0000\u00e5\u00e6\u0005"+
		"\u0012\u0000\u0000\u00e6\u00ea\u0005)\u0000\u0000\u00e7\u00eb\u0005\u0018"+
		"\u0000\u0000\u00e8\u00eb\u0005\u001c\u0000\u0000\u00e9\u00eb\u0003@ \u0000"+
		"\u00ea\u00e7\u0001\u0000\u0000\u0000\u00ea\u00e8\u0001\u0000\u0000\u0000"+
		"\u00ea\u00e9\u0001\u0000\u0000\u0000\u00eb\u00ec\u0001\u0000\u0000\u0000"+
		"\u00ec\u00ed\u0005%\u0000\u0000\u00ed#\u0001\u0000\u0000\u0000\u00ee\u00ef"+
		"\u0005\u0004\u0000\u0000\u00ef\u00fc\u0005\u0016\u0000\u0000\u00f0\u00f9"+
		"\u0005\"\u0000\u0000\u00f1\u00f6\u0003@ \u0000\u00f2\u00f3\u0005(\u0000"+
		"\u0000\u00f3\u00f5\u0003@ \u0000\u00f4\u00f2\u0001\u0000\u0000\u0000\u00f5"+
		"\u00f8\u0001\u0000\u0000\u0000\u00f6\u00f4\u0001\u0000\u0000\u0000\u00f6"+
		"\u00f7\u0001\u0000\u0000\u0000\u00f7\u00fa\u0001\u0000\u0000\u0000\u00f8"+
		"\u00f6\u0001\u0000\u0000\u0000\u00f9\u00f1\u0001\u0000\u0000\u0000\u00f9"+
		"\u00fa\u0001\u0000\u0000\u0000\u00fa\u00fb\u0001\u0000\u0000\u0000\u00fb"+
		"\u00fd\u0005#\u0000\u0000\u00fc\u00f0\u0001\u0000\u0000\u0000\u00fc\u00fd"+
		"\u0001\u0000\u0000\u0000\u00fd%\u0001\u0000\u0000\u0000\u00fe\u0100\u0005"+
		"1\u0000\u0000\u00ff\u00fe\u0001\u0000\u0000\u0000\u00ff\u0100\u0001\u0000"+
		"\u0000\u0000\u0100\u0101\u0001\u0000\u0000\u0000\u0101\u0103\u0005\u001e"+
		"\u0000\u0000\u0102\u0104\u0005-\u0000\u0000\u0103\u0102\u0001\u0000\u0000"+
		"\u0000\u0103\u0104\u0001\u0000\u0000\u0000\u0104\u0105\u0001\u0000\u0000"+
		"\u0000\u0105\u0106\u0005 \u0000\u0000\u0106\u0107\u0003\u0018\f\u0000"+
		"\u0107\u0108\u0005!\u0000\u0000\u0108\'\u0001\u0000\u0000\u0000\u0109"+
		"\u010a\u0005\u0005\u0000\u0000\u010a\u010b\u0005 \u0000\u0000\u010b\u010c"+
		"\u0003\u0018\f\u0000\u010c\u010d\u0005!\u0000\u0000\u010d)\u0001\u0000"+
		"\u0000\u0000\u010e\u0122\u0005\u0006\u0000\u0000\u010f\u0111\u0005\"\u0000"+
		"\u0000\u0110\u0112\u0007\u0000\u0000\u0000\u0111\u0110\u0001\u0000\u0000"+
		"\u0000\u0111\u0112\u0001\u0000\u0000\u0000\u0112\u0114\u0001\u0000\u0000"+
		"\u0000\u0113\u0115\u0005(\u0000\u0000\u0114\u0113\u0001\u0000\u0000\u0000"+
		"\u0114\u0115\u0001\u0000\u0000\u0000\u0115\u0119\u0001\u0000\u0000\u0000"+
		"\u0116\u011a\u0005\u0018\u0000\u0000\u0117\u011a\u0005\u001c\u0000\u0000"+
		"\u0118\u011a\u0003@ \u0000\u0119\u0116\u0001\u0000\u0000\u0000\u0119\u0117"+
		"\u0001\u0000\u0000\u0000\u0119\u0118\u0001\u0000\u0000\u0000\u011a\u011b"+
		"\u0001\u0000\u0000\u0000\u011b\u0123\u0005#\u0000\u0000\u011c\u0123\u0005"+
		"\u0018\u0000\u0000\u011d\u011f\u0005\u001c\u0000\u0000\u011e\u011d\u0001"+
		"\u0000\u0000\u0000\u011f\u0120\u0001\u0000\u0000\u0000\u0120\u011e\u0001"+
		"\u0000\u0000\u0000\u0120\u0121\u0001\u0000\u0000\u0000\u0121\u0123\u0001"+
		"\u0000\u0000\u0000\u0122\u010f\u0001\u0000\u0000\u0000\u0122\u011c\u0001"+
		"\u0000\u0000\u0000\u0122\u011e\u0001\u0000\u0000\u0000\u0123+\u0001\u0000"+
		"\u0000\u0000\u0124\u0125\u0005\r\u0000\u0000\u0125\u0126\u0005\"\u0000"+
		"\u0000\u0126\u0127\u0003.\u0017\u0000\u0127\u0128\u0005#\u0000\u0000\u0128"+
		"-\u0001\u0000\u0000\u0000\u0129\u012b\b\u0004\u0000\u0000\u012a\u0129"+
		"\u0001\u0000\u0000\u0000\u012b\u012c\u0001\u0000\u0000\u0000\u012c\u012a"+
		"\u0001\u0000\u0000\u0000\u012c\u012d\u0001\u0000\u0000\u0000\u012d/\u0001"+
		"\u0000\u0000\u0000\u012e\u0137\u0007\u0005\u0000\u0000\u012f\u0138\u0005"+
		"\u0017\u0000\u0000\u0130\u0132\u0005\"\u0000\u0000\u0131\u0133\u0005\u0017"+
		"\u0000\u0000\u0132\u0131\u0001\u0000\u0000\u0000\u0133\u0134\u0001\u0000"+
		"\u0000\u0000\u0134\u0132\u0001\u0000\u0000\u0000\u0134\u0135\u0001\u0000"+
		"\u0000\u0000\u0135\u0136\u0001\u0000\u0000\u0000\u0136\u0138\u0005#\u0000"+
		"\u0000\u0137\u012f\u0001\u0000\u0000\u0000\u0137\u0130\u0001\u0000\u0000"+
		"\u0000\u0138\u0139\u0001\u0000\u0000\u0000\u0139\u013a\u0005 \u0000\u0000"+
		"\u013a\u013b\u00032\u0019\u0000\u013b\u013c\u0005!\u0000\u0000\u013c1"+
		"\u0001\u0000\u0000\u0000\u013d\u013f\b\u0006\u0000\u0000\u013e\u013d\u0001"+
		"\u0000\u0000\u0000\u013f\u0140\u0001\u0000\u0000\u0000\u0140\u013e\u0001"+
		"\u0000\u0000\u0000\u0140\u0141\u0001\u0000\u0000\u0000\u01413\u0001\u0000"+
		"\u0000\u0000\u0142\u0143\u0007\u0007\u0000\u0000\u0143\u0144\u0005\"\u0000"+
		"\u0000\u0144\u0145\u0003@ \u0000\u0145\u0146\u0005\u0011\u0000\u0000\u0146"+
		"\u0147\u0005\u0017\u0000\u0000\u0147\u0148\u0005#\u0000\u0000\u01485\u0001"+
		"\u0000\u0000\u0000\u0149\u014e\u0005\f\u0000\u0000\u014a\u014e\u0005\u0010"+
		"\u0000\u0000\u014b\u014c\u0005 \u0000\u0000\u014c\u014e\u0005\u0010\u0000"+
		"\u0000\u014d\u0149\u0001\u0000\u0000\u0000\u014d\u014a\u0001\u0000\u0000"+
		"\u0000\u014d\u014b\u0001\u0000\u0000\u0000\u014e\u0150\u0001\u0000\u0000"+
		"\u0000\u014f\u0151\b\u0006\u0000\u0000\u0150\u014f\u0001\u0000\u0000\u0000"+
		"\u0151\u0152\u0001\u0000\u0000\u0000\u0152\u0150\u0001\u0000\u0000\u0000"+
		"\u0152\u0153\u0001\u0000\u0000\u0000\u0153\u0154\u0001\u0000\u0000\u0000"+
		"\u0154\u0155\u0005!\u0000\u0000\u01557\u0001\u0000\u0000\u0000\u0156\u0157"+
		"\u0005\u0007\u0000\u0000\u0157\u0160\u0005\u001b\u0000\u0000\u0158\u0159"+
		"\u0005\b\u0000\u0000\u0159\u0160\u0005\u001b\u0000\u0000\u015a\u015b\u0005"+
		"\t\u0000\u0000\u015b\u015d\u0005\u0017\u0000\u0000\u015c\u015e\u0007\b"+
		"\u0000\u0000\u015d\u015c\u0001\u0000\u0000\u0000\u015d\u015e\u0001\u0000"+
		"\u0000\u0000\u015e\u0160\u0001\u0000\u0000\u0000\u015f\u0156\u0001\u0000"+
		"\u0000\u0000\u015f\u0158\u0001\u0000\u0000\u0000\u015f\u015a\u0001\u0000"+
		"\u0000\u0000\u01609\u0001\u0000\u0000\u0000\u0161\u0162\u0005\u0017\u0000"+
		"\u0000\u0162\u0163\u0003<\u001e\u0000\u0163\u0165\u0003>\u001f\u0000\u0164"+
		"\u0166\u0007\u0002\u0000\u0000\u0165\u0164\u0001\u0000\u0000\u0000\u0165"+
		"\u0166\u0001\u0000\u0000\u0000\u0166;\u0001\u0000\u0000\u0000\u0167\u0170"+
		"\u0007\t\u0000\u0000\u0168\u0169\u00050\u0000\u0000\u0169\u016f\u0005"+
		"\u001e\u0000\u0000\u016a\u016b\u00051\u0000\u0000\u016b\u016f\u0005\u001e"+
		"\u0000\u0000\u016c\u016f\u00052\u0000\u0000\u016d\u016f\u00053\u0000\u0000"+
		"\u016e\u0168\u0001\u0000\u0000\u0000\u016e\u016a\u0001\u0000\u0000\u0000"+
		"\u016e\u016c\u0001\u0000\u0000\u0000\u016e\u016d\u0001\u0000\u0000\u0000"+
		"\u016f\u0172\u0001\u0000\u0000\u0000\u0170\u016e\u0001\u0000\u0000\u0000"+
		"\u0170\u0171\u0001\u0000\u0000\u0000\u0171=\u0001\u0000\u0000\u0000\u0172"+
		"\u0170\u0001\u0000\u0000\u0000\u0173\u0174\u0007\n\u0000\u0000\u0174?"+
		"\u0001\u0000\u0000\u0000\u0175\u017e\u0003B!\u0000\u0176\u017e\u0005\u0017"+
		"\u0000\u0000\u0177\u017e\u0005\u0018\u0000\u0000\u0178\u017e\u0005\u0019"+
		"\u0000\u0000\u0179\u017e\u0005\u001a\u0000\u0000\u017a\u017e\u0005\u001c"+
		"\u0000\u0000\u017b\u017e\u0005\u001b\u0000\u0000\u017c\u017e\u0005\u001d"+
		"\u0000\u0000\u017d\u0175\u0001\u0000\u0000\u0000\u017d\u0176\u0001\u0000"+
		"\u0000\u0000\u017d\u0177\u0001\u0000\u0000\u0000\u017d\u0178\u0001\u0000"+
		"\u0000\u0000\u017d\u0179\u0001\u0000\u0000\u0000\u017d\u017a\u0001\u0000"+
		"\u0000\u0000\u017d\u017b\u0001\u0000\u0000\u0000\u017d\u017c\u0001\u0000"+
		"\u0000\u0000\u017eA\u0001\u0000\u0000\u0000\u017f\u0180\u0005\u001e\u0000"+
		"\u0000\u0180\u0189\u0005\"\u0000\u0000\u0181\u0186\u0003@ \u0000\u0182"+
		"\u0183\u0005(\u0000\u0000\u0183\u0185\u0003@ \u0000\u0184\u0182\u0001"+
		"\u0000\u0000\u0000\u0185\u0188\u0001\u0000\u0000\u0000\u0186\u0184\u0001"+
		"\u0000\u0000\u0000\u0186\u0187\u0001\u0000\u0000\u0000\u0187\u018a\u0001"+
		"\u0000\u0000\u0000\u0188\u0186\u0001\u0000\u0000\u0000\u0189\u0181\u0001"+
		"\u0000\u0000\u0000\u0189\u018a\u0001\u0000\u0000\u0000\u018a\u018b\u0001"+
		"\u0000\u0000\u0000\u018b\u018c\u0005#\u0000\u0000\u018cC\u0001\u0000\u0000"+
		"\u00003GMOXglnt\u0080\u0083\u008a\u0096\u009d\u00a6\u00a9\u00ac\u00b6"+
		"\u00ba\u00c7\u00ca\u00cd\u00d1\u00d4\u00d8\u00dc\u00de\u00ea\u00f6\u00f9"+
		"\u00fc\u00ff\u0103\u0111\u0114\u0119\u0120\u0122\u012c\u0134\u0137\u0140"+
		"\u014d\u0152\u015d\u015f\u0165\u016e\u0170\u017d\u0186\u0189";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}