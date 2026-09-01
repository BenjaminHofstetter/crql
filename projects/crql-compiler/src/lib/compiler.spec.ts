import { describe, it, expect } from 'vitest';
import { compileCrql, crql } from './template/crql-tag';

describe('CRQL Formal Language Test Suite', () => {
  describe('Custom Selectors & Basic Rule Blocks', () => {
    it('compiles a custom selector into a SPARQL CONSTRUCT query', () => {
      const input = `
        @custom-selector :--estoniaCompanies {
          ?focusNode a/rdfs:subClassOf* ex:Company .
          ?focusNode ex:headQuarterCountry ex:Estonia .
        }

        :--estoniaCompanies {
          schema:name ?companyName ;
          schema:address ?companyAddress ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('CONSTRUCT {');
      expect(sparql).toContain('?focusNode_1 schema:name ?companyName .');
      expect(sparql).toContain('?focusNode_1 schema:address ?companyAddress .');
      expect(sparql).toContain('?focusNode_1 a/rdfs:subClassOf* ex:Company .');
      expect(sparql).toContain('?focusNode_1 ex:headQuarterCountry ex:Estonia .');
    });

    it('supports property renaming (storeProp => uiProp)', () => {
      const input = `
        :--company {
          schema:legalName => ui:title ;
          ex:hqLocation => ui:subtitle ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('?focusNode_1 ui:title ?legalName .');
      expect(sparql).toContain('?focusNode_1 ui:subtitle ?hqLocation .');
      expect(sparql).toContain('?focusNode_1 schema:legalName ?legalName .');
      expect(sparql).toContain('?focusNode_1 ex:hqLocation ?hqLocation .');
    });

    it('isolates WHERE clause vs CONSTRUCT template when mapping predicates', () => {
      const input = `
        @prefix schema: <http://schema.org/>;
        @prefix ui: <https://myapp>;

        @custom-selector :--product {
          BIND(<https://agriculture.ld.admin.ch/plant-protection/product/D-7463> AS ?focusNode)
        }

        :--product {
           schema:name ?name => ui:name ;
        }
      `;

      const sparql = compileCrql(input);
      const constructClause = sparql.split('CONSTRUCT {')[1].split('}')[0];
      const whereClause = sparql.split('WHERE {')[1];

      expect(constructClause).toContain('?focusNode_1 ui:name ?name .');
      expect(whereClause).toContain('?focusNode_1 schema:name ?name .');
      expect(whereClause).not.toContain('ui:name');
    });
  });

  describe('Mixins & Parameterization', () => {
    it('expands basic mixins using @mixin and @use', () => {
      const input = `
        @mixin --name-and-address {
          schema:name ?companyName ;
          schema:address ?companyAddress ;
        }

        @custom-selector :--estoniaCompanies {
          ?focusNode a ex:Company .
        }

        :--estoniaCompanies {
          @use --name-and-address ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('schema:name ?companyName');
      expect(sparql).toContain('schema:address ?companyAddress');
    });

    it('assigns unique variable suffixes (_mx1, _mx2) to prevent mixin variable collisions', () => {
      const input = `
        @prefix schema: <http://schema.org/>;
        @prefix ui: <https://myapp>;
        @prefix psm: <https://agriculture.ld.admin.ch/plant-protection/> ;

        @custom-selector :--product {
          BIND(<https://agriculture.ld.admin.ch/plant-protection/product/D-7463> AS ?focusNode)
        }

        @mixin --permissionType {
          VALUES ?productType {
                    psm:ParallelImport
                    psm:SalePermission
                    psm:RegularProduct
          }
          ?focusNode a ?productType .
          ?productType schema:name ?premissionName => ui:permissionType ; 
        }

        :--product {
          schema:name ?name => ui:name ;
          @use --permissionType ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('VALUES ?productType_mx1');
      expect(sparql).toContain('?productType_mx1 schema:name ?premissionName_mx1 .');
      expect(sparql).toContain('?focusNode_1 ui:permissionType ?premissionName_mx1 .');
    });

    it('supports nested mixin invocations and recursive parameter forwarding', () => {
      const input = `
        @mixin --localizedName($langs = "de,en") {
          schema:name[lang=$langs] ?name => ui:name ;
        }

        @mixin --country($allowedLangs = "de,fr") {
          schema:countryOfOrigin {
            @use --localizedName($allowedLangs) ;
          }
        }

        :--product {
          @use --country("de,it") ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('FILTER(LANG(?name_mx2) IN ("de", "it"))');
    });
  });

  describe('CONSTRUCT vs. WHERE Control Directives', () => {
    it('suppresses statements from CONSTRUCT when marked with @where', () => {
      const input = `
        @mixin --permissionType {
          VALUES ?productType { psm:ParallelImport }
          @where ?focusNode a ?productType .
          ?productType schema:name ?premissionName => ui:permissionType ;
        }

        :--product {
          @use --permissionType ;
        }
      `;

      const sparql = compileCrql(input);
      const constructClause = sparql.split('CONSTRUCT {')[1].split('}')[0];
      const whereClause = sparql.split('WHERE {')[1];

      expect(whereClause).toContain('?focusNode_1 a ?productType_mx1 .');
      expect(constructClause).not.toContain('?focusNode_1 a ?productType_mx1 .');
    });

    it('attaches mapped properties to explicit CONSTRUCT target subjects (=> ?targetSubject predicate)', () => {
      const input = `
        @mixin --permissionType {
          VALUES ?productType { psm:ParallelImport }
          @where ?focusNode a ?productType .
          ?productType schema:name ?premissionName => ?productType ui:permissionType ;
        }

        :--product {
          @use --permissionType ;
        }
      `;

      const sparql = compileCrql(input);

      const constructClause = sparql.split('CONSTRUCT {')[1].split('}')[0];
      expect(constructClause).toContain('?productType_mx1 ui:permissionType ?premissionName_mx1 .');
    });
  });

  describe('Turtle-Style Predicate List Chaining & Graph Subject Preservation', () => {
    it('chains predicate lists with semicolons and inherits active subjects', () => {
      const input = `
        @prefix schema: <http://schema.org/>;
        @prefix psm: <https://agriculture.ld.admin.ch/plant-protection/> ;
        @prefix qudt: <http://qudt.org/schema/qudt/> ;

        @mixin --substance {
          psm:ingredient ?substance .

          ?substance psm:share ?share .
          ?share a ?shareType ;
              schema:unitCode ?unit;
              qudt:symbol ?symbol;
              schema:value ?value ;
          .

          ?substance a ?substanceType ;
              schema:name ?name ;
              psm:iupacName ?iupacName ;
          .
        }

        :--product {
          @use --substance ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('?share_mx1 schema:unitCode ?unit_mx1 .');
      expect(sparql).toContain('?share_mx1 qudt:symbol ?symbol_mx1 .');
      expect(sparql).toContain('?substance_mx1 schema:name ?name_mx1 .');
      expect(sparql).toContain('?substance_mx1 psm:iupacName ?iupacName_mx1 .');
    });

    it('preserves graph entity subjects in CONSTRUCT for unmapped statements while mapping focus-node properties', () => {
      const input = `
        @prefix schema: <http://schema.org/>;
        @prefix psm: <https://agriculture.ld.admin.ch/plant-protection/> ;
        @prefix qudt: <http://qudt.org/schema/qudt/> ;
        @prefix ui: <https://myapp> ;

        @mixin --substance {
           psm:ingredient ?ingredient .
           
           ?ingredient psm:share ?share .

           ?share a ?shareType ;
             schema:unitCode ?unit;
             qudt:symbol ?symbol;
             schema:value ?value ;
           .
           ?ingredient psm:substance ?substance .
           ?substance a ?substanceType ;
             schema:name ?name => ui:substanceName ;
             psm:iupacName ?iupacName ;
           .
        }

        :--product {
          @use --substance ;
        }
      `;

      const sparql = compileCrql(input);
      const constructClause = sparql.split('CONSTRUCT {')[1].split('}')[0];

      expect(constructClause).toContain('?share_mx1 schema:unitCode ?unit_mx1 .');
      expect(constructClause).toContain('?substance_mx1 psm:iupacName ?iupacName_mx1 .');
      expect(constructClause).toContain('?focusNode_1 ui:substanceName ?name_mx1 .');
    });

    it('inherits active block subjects in nested traversal blocks (?share schema:unitCode { ... })', () => {
      const input = `
        @prefix schema: <http://schema.org/>;
        @prefix psm: <https://agriculture.ld.admin.ch/plant-protection/> ;
        @prefix qudt: <http://qudt.org/schema/qudt/> ;

        @mixin --substance {
           psm:ingredient ?ingredient .
           
           ?ingredient psm:share ?share .
           ?share a ?shareType ;
             schema:unitCode {
                qudt:symbol ?symbol;
             }
             schema:value ?value ;
           .
        }

        :--product {
          @use --substance ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('?share_mx1 schema:unitCode ?child_1_schema_unitCode .');
      expect(sparql).toContain('?child_1_schema_unitCode qudt:symbol ?symbol_mx1 .');
    });
  });

  describe('Filtering & Language Directives', () => {
    it('supports property attribute language filters [lang=...]', () => {
      const input = `
        :--product {
          schema:name[lang="de,en"] ?name => ui:name ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('FILTER(LANG(?name) IN ("de", "en"))');
    });

    it('supports native SPARQL FILTER(...) statements inside mixins', () => {
      const input = `
        @mixin --country {
          schema:countryOfOrigin {
            schema:name ?countryName => ui:country ;
          }
          FILTER(LANG(?countryName) IN ("de", "en"))
        }

        :--product {
          @use --country ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('FILTER(LANG(?countryName_mx1) IN ("de", "en"))');
    });

    it('supports standalone reusable language filter mixins accepting variable parameters (@mixin --langFilter(?var, $langs))', () => {
      const input = `
        @mixin --langFilter(?var, $langs = "de,en,fr,it") {
          @lang(?var, $langs) ;
        }

        :--product {
          schema:name ?productName => ui:name ;
          schema:countryOfOrigin {
            schema:name ?countryName => ui:country ;
            @use --langFilter(?countryName, "de,fr") ;
          }
          @use --langFilter(?productName, "de,en,fr,it") ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('FILTER(LANG(?countryName) IN ("de", "fr"))');
      expect(sparql).toContain('FILTER(LANG(?productName) IN ("de", "en", "fr", "it"))');
    });

    it('aligns variable names in sub-mixins (@use --langFilter(?countryName)) with parent mixin scoping (?countryName_mx1)', () => {
      const input = `
        @prefix schema: <http://schema.org/>;
        @prefix ui: <https://myapp>;

        @mixin --langFilter(?var, $langs = "de,en,fr,it") {
          @lang(?var, $langs) ;
        }

        @mixin --country() {
          schema:countryOfOrigin {
            schema:name ?countryName => ui:countryName ;
            @use --langFilter(?countryName)
          }
        }

        :--product {
          @use --country ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('?child_1_schema_countryOfOrigin schema:name ?countryName_mx1 .');
      expect(sparql).toContain('FILTER(LANG(?countryName_mx1) IN ("de", "en", "fr", "it"))');
    });
  });

  describe('Pagination, Built-ins & Template Literal Utilities', () => {
    it('compiles pagination directives (@limit, @offset, @order-by)', () => {
      const input = `
        :--paginated {
          schema:name ?name ;
          @order-by ?name DESC ;
          @limit 15 ;
          @offset 30 ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('ORDER BY DESC(?name)');
      expect(sparql).toContain('LIMIT 15');
      expect(sparql).toContain('OFFSET 30');
    });

    it('synthesizes BIND clauses for concat and iri built-ins', () => {
      const input = `
        :--user {
          schema:givenName ?firstName ;
          schema:familyName ?lastName ;
          schema:identifier ?userId ;
          ui:title concat(?firstName, " ", ?lastName) ;
          ui:link iri("http://example.org/users/", ?userId) ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('BIND(CONCAT(?firstName, " ", ?lastName) AS ?auto_bound_1_1)');
      expect(sparql).toContain('BIND(IRI(CONCAT(<http://example.org/users/>, ?userId)) AS ?auto_bound_1_2)');
    });

    it('supports tagged template literals with parameter substitution using crql``', () => {
      const country = 'ex:Estonia';

      const sparql = crql`
        @custom-selector :--targetCompanies {
          ?focusNode a ex:Company .
          ?focusNode ex:country ${country} .
        }

        :--targetCompanies {
          schema:name ?name ;
        }
      `;

      expect(sparql).toContain('ex:country ex:Estonia .');
      expect(sparql).toContain('schema:name ?name .');
    });

    it('merges multiple CRQL queries safely using crql.merge()', () => {
      const q1 = `:--uiConfig { ui:icon ?icon ; }`;
      const q2 = `:--instanceData { schema:name ?name ; }`;

      const merged = crql.merge(q1, q2);

      expect(merged).toContain('?focusNode_1 ui:icon ?icon');
      expect(merged).toContain('?focusNode_2 schema:name ?name');
    });
  });

  describe('Document Constants (@const)', () => {
    it('resolves document-level constants in property patterns, custom selectors, and mixins', () => {
      const input = `
        @prefix schema: <http://schema.org/>;
        @prefix ui: <https://myapp>;

        @const $defaultLangs = "de,fr" ;
        @const $activeStatus = "Active" ;
        @const $targetCountry = ex:Estonia ;

        @custom-selector :--estoniaCompanies {
          ?focusNode a ex:Company .
          ?focusNode ex:country $targetCountry .
        }

        @mixin --localizedName($langs) {
          schema:name[lang=$langs] ?name => ui:name ;
        }

        :--estoniaCompanies {
          ex:status $activeStatus ;
          @use --localizedName($defaultLangs) ;
        }
      `;

      const sparql = compileCrql(input);

      expect(sparql).toContain('?focusNode_1 ex:country ex:Estonia .');
      expect(sparql).toContain('?focusNode_1 ex:status "Active" .');
      expect(sparql).toContain('FILTER(LANG(?name_mx1) IN ("de", "fr"))');
    });
  });
});
