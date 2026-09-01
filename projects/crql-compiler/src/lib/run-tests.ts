import { compileCrql, crql } from './template/crql-tag';

console.log('Running CRQL Compiler Suite...');

const input1 = `
  @custom-selector :--estoniaCompanies {
    ?focusNode a/rdfs:subClassOf* ex:Company .
    ?focusNode ex:headQuarterCountry ex:Estonia .
  }
  :--estoniaCompanies {
    schema:name ?companyName ;
    schema:address ?companyAddress ;
  }
`;
const sparql1 = compileCrql(input1);
if (!sparql1.includes('CONSTRUCT {') || !sparql1.includes('?focusNode_1 schema:name ?companyName')) {
  throw new Error('Test 1 failed!');
}
console.log('✔ Test 1: custom selector -> CONSTRUCT passed');

const input2 = `
  @mixin --name-and-address {
    schema:name ?companyName ;
  }
  @custom-selector :--estoniaCompanies { ?focusNode a ex:Company . }
  :--estoniaCompanies { @get --name-and-address ; }
`;
const sparql2 = compileCrql(input2);
if (!sparql2.includes('schema:name ?companyName')) {
  throw new Error('Test 2 failed!');
}
console.log('✔ Test 2: @mixin & @get passed');

const input3 = `:--company { schema:legalName => ui:title ; }`;
const sparql3 = compileCrql(input3);
if (!sparql3.includes('ui:title ?legalName')) {
  throw new Error('Test 3 failed!');
}
console.log('✔ Test 3: property renaming passed');

const input4 = `:--company[ex:status="Active"][ex:employeeCount >= 10] { schema:name ?name ; }`;
const sparql4 = compileCrql(input4);
if (!sparql4.includes('FILTER(?filter_1_ex_employeeCount >= 10)')) {
  throw new Error('Test 4 failed!');
}
console.log('✔ Test 4: attribute filters passed');

const input5 = `:--user { ex:firstName ?firstName ; ex:lastName ?lastName ; ui:title concat(?firstName, " ", ?lastName) ; }`;
const sparql5 = compileCrql(input5);
if (!sparql5.includes('BIND(CONCAT(?firstName, " ", ?lastName) AS ?auto_bound_1_1)')) {
  throw new Error('Test 5 failed!');
}
console.log('✔ Test 5: built-in functions passed');

const country = 'ex:Estonia';
const sparql6 = crql`
  @custom-selector :--targetCompanies { ?focusNode ex:country ${country} . }
  :--targetCompanies { schema:name ?name . }
`;
if (!sparql6.includes('ex:country ex:Estonia .')) {
  throw new Error('Test 6 failed!');
}
console.log('✔ Test 6: tagged template parameters passed');

const merged = crql.merge(`:--a { ui:icon ?i; }`, `:--b { schema:name ?n; }`);
if (!merged.includes('?focusNode_1') || !merged.includes('?focusNode_2')) {
  throw new Error('Test 7 failed!');
}
console.log('✔ Test 7: crql.merge passed');

const input8 = `
  :--swissCompany {
    schema:name ?name ;
    a > {
      ^ex:iconForClass > {
        ex:icon => ui:icon ;
      }
    }
  }
`;
const sparql8 = compileCrql(input8);
if (!sparql8.includes('?focusNode_1 ui:icon ?icon .') || !sparql8.includes('ex:iconForClass ?child_1_a .')) {
  throw new Error('Test 8 failed!');
}
console.log('✔ Test 8: 2-step class metadata icon lookup passed');

const input9 = `
  :--paginated {
    schema:name ?name ;
    @limit 10 ;
    @offset 20 ;
    @order-by ?name ASC ;
  }
`;
const sparql9 = compileCrql(input9);
if (!sparql9.includes('LIMIT 10') || !sparql9.includes('OFFSET 20') || !sparql9.includes('ORDER BY ASC(?name)')) {
  throw new Error('Test 9 failed!');
}
console.log('✔ Test 9: pagination @limit, @offset, @order-by passed');

const input10 = `
  @mixin --class-icon {
    a > {
      ^ex:iconForClass > {
        ex:icon => ui:icon ;
      }
    }
  }
  :--swissCompany {
    schema:name ?name ;
    @get --class-icon ;
  }
`;
const sparql10 = compileCrql(input10);
if (!sparql10.includes('?focusNode_1 ui:icon ?icon .') || !sparql10.includes('ex:iconForClass ?child_1_a .')) {
  throw new Error('Test 10 failed!');
}
console.log('✔ Test 10: nested traversal inside @mixin & @get passed');

const input11 = `
  @mixin --permissionType {
    VALUES ?productType {
      psm:ParallelImport
      psm:SalePermission
      psm:RegularProduct
    }
    a => appPrefix:permissionType ?productType ;
  }
  :--productRules {
    @get --permissionType ;
  }
`;
const sparql11 = compileCrql(input11);
if (!sparql11.includes('VALUES ?productType { psm:ParallelImport psm:SalePermission psm:RegularProduct }') || !sparql11.includes('?focusNode_1 appPrefix:permissionType ?productType .')) {
  throw new Error('Test 11 failed!');
}
console.log('✔ Test 11: VALUES block inside @mixin passed');

const input12 = `
  @mixin --reviewStats {
    {
      SELECT ?focusNode (COUNT(?review) AS ?reviewCount) WHERE {
        ?focusNode ex:hasReview ?review .
      }
      GROUP BY ?focusNode
    }
    ex:reviewCount ?reviewCount ;
  }
  :--popularProducts {
    @get --reviewStats ;
  }
`;
const sparql12 = compileCrql(input12);
if (!sparql12.includes('SELECT ?focusNode') || !sparql12.includes('?focusNode_1 ex:reviewCount ?reviewCount .')) {
  throw new Error('Test 12 failed!');
}
console.log('✔ Test 12: Sub-SELECT query inside @mixin passed');

const input13 = `
  @custom-selector :--PlantProtectionProduct {
    BIND (<https://agriculture.ld.admin.ch/plant-protection/product/D-7463> as ?focusNode )
  }
  :--PlantProtectionProduct {
    schema:name ?name ;
  }
`;
const sparql13 = compileCrql(input13);
if (!sparql13.includes('BIND(<https://agriculture.ld.admin.ch/plant-protection/product/D-7463> AS ?focusNode_1)') || !sparql13.includes('?focusNode_1 schema:name ?name .')) {
  throw new Error('Test 13 failed!');
}
console.log('✔ Test 13: BIND(...) inside @custom-selector passed');

const input14 = `
  @prefix schema: <http://schema.org/>;
  @prefix ui: <https://myapp>;

  @custom-selector :--product {
    BIND(<https://agriculture.ld.admin.ch/plant-protection/product/D-7463> AS ?focusNode)
  }

  :--product {
    schema:name ?name => ui:name ;
  }
`;
const sparql14 = compileCrql(input14);
if (!sparql14.includes('BIND(<https://agriculture.ld.admin.ch/plant-protection/product/D-7463> AS ?focusNode_1)') ||
    !sparql14.includes('?focusNode_1 schema:name ?name .') ||
    !sparql14.includes('CONSTRUCT {\n  ?focusNode_1 ui:name ?name .')) {
  console.log('SPARQL14 Output:\n', sparql14);
  throw new Error('Test 14 failed!');
}
console.log('✔ Test 14: predicate mapping (schema:name ?name => ui:name) isolates WHERE vs CONSTRUCT passed');

const input15 = `
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
    @get --permissionType
  }
`;
const sparql15 = compileCrql(input15);
if (!sparql15.includes('?productType schema:name ?premissionName .') ||
    !sparql15.includes('?focusNode_1 ui:permissionType ?premissionName .')) {
  console.log('SPARQL15 Output:\n', sparql15);
  throw new Error('Test 15 failed!');
}
console.log('✔ Test 15: explicit subject variable (?productType schema:name ...) in WHERE clause passed');

console.log('All 15 CRQL Compiler tests passed successfully!');
