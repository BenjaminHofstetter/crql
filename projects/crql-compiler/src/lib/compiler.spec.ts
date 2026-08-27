import { describe, it } from 'node:test';
import assert from 'node:assert';
import { compileCrql, crql } from './template/crql-tag';

describe('CRQL Compiler Suite', () => {
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

    assert.ok(sparql.includes('CONSTRUCT {'));
    assert.ok(sparql.includes('?focusNode_1 schema:name ?companyName .'));
    assert.ok(sparql.includes('?focusNode_1 schema:address ?companyAddress .'));
    assert.ok(sparql.includes('?focusNode_1 a/rdfs:subClassOf* ex:Company .'));
    assert.ok(sparql.includes('?focusNode_1 ex:headQuarterCountry ex:Estonia .'));
  });

  it('expands mixins using @mixin and @get', () => {
    const input = `
      @mixin --name-and-address {
        schema:name ?companyName ;
        schema:address ?companyAddress ;
      }

      @custom-selector :--estoniaCompanies {
        ?focusNode a ex:Company .
      }

      :--estoniaCompanies {
        @get --name-and-address ;
      }
    `;

    const sparql = compileCrql(input);

    assert.ok(sparql.includes('schema:name ?companyName'));
    assert.ok(sparql.includes('schema:address ?companyAddress'));
  });

  it('supports property renaming (storeProp => uiProp)', () => {
    const input = `
      :--company {
        schema:legalName => ui:title ;
        ex:hqLocation => ui:subtitle ;
      }
    `;

    const sparql = compileCrql(input);

    assert.ok(sparql.includes('?focusNode_1 ui:title ?legalName'));
    assert.ok(sparql.includes('?focusNode_1 ui:subtitle ?hqLocation'));
  });

  it('handles attribute filters [attr=val]', () => {
    const input = `
      :--company[ex:status="Active"][ex:employeeCount >= 10] {
        schema:name ?name ;
      }
    `;

    const sparql = compileCrql(input);

    assert.ok(sparql.includes('?focusNode_1 ex:status "Active"'));
    assert.ok(sparql.includes('FILTER(?filter_1_ex_employeeCount >= 10)'));
  });

  it('synthesizes BIND clauses for built-in functions concat and iri', () => {
    const input = `
      :--user {
        ui:title concat(?firstName, " ", ?lastName) ;
        ui:link iri("http://example.org/users/", ?userId) ;
      }
    `;

    const sparql = compileCrql(input);

    assert.ok(sparql.includes('BIND(CONCAT(?firstName, " ", ?lastName) AS ?auto_bound_1_1)'));
    assert.ok(sparql.includes('BIND(IRI(CONCAT("http://example.org/users/", ?userId)) AS ?auto_bound_1_2)'));
  });

  it('supports tagged template literals with parameter substitution', () => {
    const country = 'ex:Estonia';
    const minEmp = 25;

    const sparql = crql`
      @custom-selector :--targetCompanies {
        ?focusNode a ex:Company .
        ?focusNode ex:country ${country} .
        ?focusNode ex:empCount ?count .
        FILTER(?count >= ${minEmp})
      }

      :--targetCompanies {
        schema:name ?name ;
      }
    `;

    assert.ok(sparql.includes('ex:country ex:Estonia .'));
    assert.ok(sparql.includes('schema:name ?name .'));
  });

  it('merges multiple CRQL queries safely', () => {
    const q1 = `
      :--uiConfig {
        ui:icon ?icon ;
      }
    `;
    const q2 = `
      :--instanceData {
        schema:name ?name ;
      }
    `;

    const merged = crql.merge(q1, q2);

    assert.ok(merged.includes('?focusNode_1 ui:icon ?icon'));
    assert.ok(merged.includes('?focusNode_2 schema:name ?name'));
  });
});
