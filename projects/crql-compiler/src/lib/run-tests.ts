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
if (!sparql10.includes('?focusNode_1 ui:icon ?icon_mx1 .') || !sparql10.includes('ex:iconForClass ?child_1_a .')) {
  console.log('SPARQL10 Output:\n', sparql10);
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
if (!sparql11.includes('VALUES ?productType_mx1 { psm:ParallelImport psm:SalePermission psm:RegularProduct }') || !sparql11.includes('?focusNode_1 appPrefix:permissionType ?productType_mx1 .')) {
  console.log('SPARQL11 Output:\n', sparql11);
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
if (!sparql12.includes('SELECT ?focusNode') || !sparql12.includes('?focusNode_1 ex:reviewCount ?reviewCount_mx1 .')) {
  console.log('SPARQL12 Output:\n', sparql12);
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
if (!sparql15.includes('?productType_mx1 schema:name ?premissionName_mx1 .') ||
    !sparql15.includes('?focusNode_1 ui:permissionType ?premissionName_mx1 .')) {
  console.log('SPARQL15 Output:\n', sparql15);
  throw new Error('Test 15 failed!');
}
console.log('✔ Test 15: explicit subject variable & automatic mixin variable scoping passed');

const input16 = `
  @mixin --permissionType {
    VALUES ?productType {
      psm:ParallelImport
      psm:SalePermission
      psm:RegularProduct
    }
    @where ?focusNode a ?productType ;
    ?productType schema:name ?premissionName => ui:permissionType ;
  }
  :--product {
    @get --permissionType ;
  }
`;
const sparql16 = compileCrql(input16);
const constructSection16 = sparql16.split('CONSTRUCT {')[1].split('}')[0];
if (!sparql16.includes('?focusNode_1 a ?productType_mx1 .') || constructSection16.includes('a ?productType')) {
  console.log('SPARQL16 Output:\n', sparql16);
  throw new Error('Test 16 failed!');
}
console.log('✔ Test 16: @where CONSTRUCT suppression passed');

const input17 = `
  @mixin --permissionType {
    VALUES ?productType {
      psm:ParallelImport
      psm:SalePermission
      psm:RegularProduct
    }
    @where ?focusNode a ?productType ;
    ?productType schema:name ?premissionName => ?productType ui:permissionType ;
  }
  :--product {
    @get --permissionType ;
  }
`;
const sparql17 = compileCrql(input17);
const constructSection17 = sparql17.split('CONSTRUCT {')[1].split('}')[0];
if (!constructSection17.includes('?productType_mx1 ui:permissionType ?premissionName_mx1 .')) {
  console.log('SPARQL17 Output:\n', sparql17);
  throw new Error('Test 17 failed!');
}
console.log('✔ Test 17: explicit CONSTRUCT target subject attachment (=> ?productType ui:permissionType) passed');

const input18 = `
  @prefix schema: <http://schema.org/>;
  @prefix ui: <https://myapp>;
  @prefix psm: <https://agriculture.ld.admin.ch/plant-protection/> ;

  @custom-selector :--product {
    BIND(<https://agriculture.ld.admin.ch/plant-protection/product/D-7463> AS ?focusNode)
  }

  @mixin --permissionType {
    VALUES ?permissionType {
      psm:ParallelImport
      psm:SalePermission
      psm:RegularProduct
    }
    @where a ?permissionType .
    ?permissionType schema:name ?premissionName => ui:permissionType ; 
  }

  @mixin --category {
    psm:productType {
       schema:name ?premissionName => ui:category ; 
    }
  }

  :--product {
    schema:name ?name => ui:name ;
    @get --permissionType; 
    @get --category ;
  }
`;
const sparql18 = compileCrql(input18);
if (!sparql18.includes('?focusNode_1 psm:productType ?child_1_psm_productType .') ||
    !sparql18.includes('?child_1_psm_productType schema:name ?premissionName_mx2 .') ||
    !sparql18.includes('?focusNode_1 ui:category ?premissionName_mx2 .')) {
  console.log('SPARQL18 Output:\n', sparql18);
  throw new Error('Test 18 failed!');
}
console.log('✔ Test 18: nested block traversal (psm:productType { ... }) passed');

const input19 = `
  @mixin --localizedName($langs = "de,en") {
    schema:name[lang=$langs] ?name => ui:name ;
  }

  @mixin --country($allowedLangs = "de,fr") {
    schema:countryOfOrigin {
      @get --localizedName($allowedLangs) ;
    }
  }

  :--product {
    @get --country("de,it") ;
  }
`;
const sparql19 = compileCrql(input19);
if (!sparql19.includes('FILTER(LANG(?name_mx1) IN ("de", "it"))')) {
  console.log('SPARQL19 Output:\n', sparql19);
  throw new Error('Test 19 failed!');
}
console.log('✔ Test 19: nested mixin invocation & parameter forwarding passed');

const input20 = `
  @mixin --company($allowedLangs = "de,en,fr") {
    ex:employeeCount ?empCount ;
    schema:name[lang=$allowedLangs] ?companyName => ui:name ;
  }

  :--swissCo {
    @get --company("de,fr") ;
  }
`;
const sparql20 = compileCrql(input20);
if (!sparql20.includes('FILTER(LANG(?companyName_mx1) IN ("de", "fr"))') ||
    sparql20.includes('LANG(?empCount)')) {
  console.log('SPARQL20 Output:\n', sparql20);
  throw new Error('Test 20 failed!');
}
console.log('✔ Test 20: property attribute filter [lang=$langs] isolates language string variable passed');

const input21 = `
  @mixin --country {
    schema:countryOfOrigin {
      schema:name ?countryName => ui:country ;
    }
    FILTER(LANG(?countryName) IN ("de", "en"))
  }

  :--product {
    @get --country ;
  }
`;
const sparql21 = compileCrql(input21);
if (!sparql21.includes('FILTER(LANG(?countryName_mx1) IN ("de", "en"))')) {
  console.log('SPARQL21 Output:\n', sparql21);
  throw new Error('Test 21 failed!');
}
console.log('✔ Test 21: native SPARQL FILTER(...) statement inside mixin passed');

const input22 = `
  @mixin --langFilter(?var, $langs = "de,en,fr,it") {
    @lang(?var, $langs) ;
  }

  :--product {
    schema:name ?productName => ui:name ;
    schema:countryOfOrigin {
      schema:name ?countryName => ui:country ;
      @get --langFilter(?countryName, "de,fr") ;
    }
    @get --langFilter(?productName, "de,en,fr,it") ;
  }
`;
const sparql22 = compileCrql(input22);
if (!sparql22.includes('FILTER(LANG(?countryName) IN ("de", "fr"))') ||
    !sparql22.includes('FILTER(LANG(?productName) IN ("de", "en", "fr", "it"))')) {
  console.log('SPARQL22 Output:\n', sparql22);
  throw new Error('Test 22 failed!');
}
console.log('✔ Test 22: standalone reusable language filter mixin @mixin --langFilter(?var, $langs) passed');

const input23 = `
  @prefix schema: <http://schema.org/>;
  @prefix ui: <https://myapp>;

  @mixin --langFilter(?var, $langs = "de,en,fr,it") {
    @lang(?var, $langs) ;
  }

  @mixin --country() {
    schema:countryOfOrigin {
      schema:name ?countryName => ui:countryName ;
      @get --langFilter(?countryName)
    }
  }

  :--product {
    @get --country ;
  }
`;
const sparql23 = compileCrql(input23);
if (!sparql23.includes('?child_1_schema_countryOfOrigin schema:name ?countryName_mx1 .') ||
    !sparql23.includes('FILTER(LANG(?countryName_mx1) IN ("de", "en", "fr", "it"))')) {
  console.log('SPARQL23 Output:\n', sparql23);
  throw new Error('Test 23 failed!');
}
console.log('✔ Test 23: mixin-in-mixin variable scoping alignment (?countryName_mx1) passed');

const input24 = `
  @prefix schema: <http://schema.org/>;
  @prefix ui: <https://myapp>;
  @prefix psm: <https://agriculture.ld.admin.ch/plant-protection/> ;

  @mixin --permissionType {
    VALUES ?permissionType {
      psm:ParallelImport
      psm:SalePermission
      psm:RegularProduct
    }
    @where ?focusNode a ?permissionType .
    ?permissionType schema:name ?premissionName => ui:permissionType ; 
    @lang(?premissionName, "de")
  }

  :--product {
    @get --permissionType ;
  }
`;
const sparql24 = compileCrql(input24);
if (!sparql24.includes('?permissionType_mx1 schema:name ?premissionName_mx1 .') ||
    !sparql24.includes('FILTER(LANG(?premissionName_mx1) IN ("de"))')) {
  console.log('SPARQL24 Output:\n', sparql24);
  throw new Error('Test 24 failed!');
}
console.log('✔ Test 24: @lang(?var, "de") targetVarExpr mixin scoping alignment passed');

const input25 = `
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
    @get --substance ;
  }
`;
const sparql25 = compileCrql(input25);
if (!sparql25.includes('?share_mx1 schema:unitCode ?unit_mx1 .') ||
    !sparql25.includes('?share_mx1 qudt:symbol ?symbol_mx1 .') ||
    !sparql25.includes('?substance_mx1 schema:name ?name_mx1 .') ||
    !sparql25.includes('?substance_mx1 psm:iupacName ?iupacName_mx1 .')) {
  console.log('SPARQL25 Output:\n', sparql25);
  throw new Error('Test 25 failed!');
}
console.log('✔ Test 25: Turtle style predicate list semicolon chaining (?substance a ... ; schema:name ...) passed');

const input26 = `
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
    @get --substance ;
  }
`;
const sparql26 = compileCrql(input26);
const constructSection26 = sparql26.split('CONSTRUCT {')[1].split('}')[0];
if (!constructSection26.includes('?share_mx1 schema:unitCode ?unit_mx1 .') ||
    !constructSection26.includes('?substance_mx1 psm:iupacName ?iupacName_mx1 .') ||
    !constructSection26.includes('?focusNode_1 ui:substanceName ?name_mx1 .')) {
  console.log('SPARQL26 Output:\n', sparql26);
  throw new Error('Test 26 failed!');
}
console.log('✔ Test 26: preservation of graph subjects in CONSTRUCT vs mapped focus-node properties passed');

console.log('All 26 CRQL Compiler tests passed successfully!');
