import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { compileCrql } from '@rdf-query/crql-compiler';
import { CrqlInspectorService, RdfQueryService, toSparqlQuery } from '@rdf-query/ngx-crql';

export interface SamplePreset {
  id: string;
  title: string;
  description: string;
  code: string;
}

@Component({
  imports: [CommonModule, DatePipe, UpperCasePipe],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App {
  private rdfQueryService = inject(RdfQueryService);
  protected readonly inspector = inject(CrqlInspectorService);

  // Preset Samples
  protected readonly presets: SamplePreset[] = [
    {
      id: 'custom-selector',
      title: '1. Reusable Selectors & Parameters ($param)',
      description: 'Encapsulate domain matching logic and pass reactive signal parameters into queries.',
      code: `@prefix ex: <http://example.org/>;
@prefix schema: <https://schema.org/>;

@custom-selector :--targetCompanies {
  ?focusNode a/rdfs:subClassOf* ex:Company .
  ?focusNode ex:headQuarterCountry $country .
}

:--targetCompanies[ex:employeeCount >= $minEmployees] {
  schema:name ?companyName ;
  schema:address ?companyAddress ;
}`
    },
    {
      id: 'mixins',
      title: '2. Reusable Property Mixins (@mixin & @use)',
      description: 'Demonstrates modularizing property mapping rules into reusable mixins.',
      code: `@mixin --name-and-address {
  schema:name ?companyName ;
  schema:address ?companyAddress ;
}

@custom-selector :--estoniaCompanies {
  ?focusNode a ex:Company .
  ?focusNode ex:headQuarterCountry ex:Estonia .
}

:--estoniaCompanies {
  @use --name-and-address ;
}`
    },
    {
      id: 'schema-mapping',
      title: '3. Component Schema Mapping (storeProp => uiProp)',
      description: 'Transform heterogeneous triplestore schemas directly into UI Component props on the fly.',
      code: `@prefix schema: <https://schema.org/>;
@prefix org: <http://www.w3.org/ns/org#>;
@prefix ui: <http://example.org/ui/vocab#>;

@custom-selector :--companyEx {
  ?focusNode a ex:Company ;
             schema:name ?name ;
             ex:hqLocation ?location .
}

@custom-selector :--companyOrg {
  ?focusNode a org:Organization ;
             rdfs:label ?name ;
             org:siteAddress ?location .
}

:--companyEx,
:--companyOrg {
  schema:name => ui:title ;
  ex:hqLocation => ui:subtitle ;
  ui:icon "business" ;
  ui:component "CardComponent" ;
}`
    },
    {
      id: 'query-merging',
      title: '4. Batch Query Merging (crql.merge)',
      description: 'Combine UI configuration queries and instance queries into a single HTTP SPARQL request.',
      code: `@prefix ex: <http://example.org/>;
@prefix schema: <https://schema.org/>;
@prefix ui: <http://example.org/ui/vocab#>;

@custom-selector :--classUiConfig {
  ?focusNode a ui:UiComponentConfig .
}

@custom-selector :--estoniaCompanies {
  ?focusNode a ex:Company ;
             ex:headQuarterCountry ex:Estonia .
}

/* UI Configuration Query Fragment */
:--classUiConfig {
  ui:icon ?icon ;
  rdfs:label ?classLabel ;
}

/* Domain Instance Query Fragment */
:--estoniaCompanies {
  schema:name ?companyName ;
  schema:address ?companyAddress ;
}`
    },
    {
      id: 'builtins',
      title: '5. Built-ins & Expressions (concat, iri, calc)',
      description: 'Use CSS-style functional expressions and attribute filters [attr=val].',
      code: `@prefix ex: <http://example.org/>;
@prefix ui: <http://example.org/ui/vocab#>;

@custom-selector :--userAccount {
  ?focusNode a ex:UserAccount ;
             ex:status "Active" .
}

:--userAccount {
  ex:firstName ?firstName ;
  ex:lastName ?lastName ;
  ex:userId ?userId ;
  ex:basePrice ?basePrice ;
  ui:title concat(?firstName, " ", ?lastName) ;
  ui:link iri("http://example.org/users/", ?userId) ;
  ex:totalPrice calc(?basePrice * 1.2) ;
}`
    },
    {
      id: 'class-metadata',
      title: '6. Class Metadata Icon (Mixin vs Inline)',
      description: 'Demonstrates 2-step class icon resolution using both reusable @mixin and inline traversal.',
      code: `@prefix ex: <http://example.org/>;
@prefix schema: <https://schema.org/>;
@prefix ui: <http://example.org/ui/vocab#>;

/* Reusable Mixin encapsulating 2-step class icon lookup */
@mixin --class-icon {
  a > {
    ^ex:iconForClass > {
      ex:icon => ui:icon ;
    }
  }
}

@custom-selector :--swissCompanies {
  ?focusNode a ex:Company ;
             ex:headQuarterCountry ex:Switzerland .
}

@custom-selector :--germanCompanies {
  ?focusNode a ex:Company ;
             ex:headQuarterCountry ex:Germany .
}

/* Query Block 1: Using @mixin & @use */
:--swissCompanies {
  schema:name ?name ;
  schema:address ?address ;
  @use --class-icon ;
}

/* Query Block 2: Inline version without mixin */
:--germanCompanies {
  schema:name ?companyName ;
  a > {
    ^ex:iconForClass > {
      ex:icon => ui:icon ;
    }
  }
}`
    },
    {
      id: 'pagination',
      title: '7. Pagination & Solution Modifiers (@limit, @offset, @order-by)',
      description: 'Paginate query results and sort by properties directly using CSS-style directives.',
      code: `@prefix ex: <http://example.org/>;
@prefix schema: <https://schema.org/>;

@custom-selector :--paginatedCompanies {
  ?focusNode a ex:Company ;
             ex:headQuarterCountry ex:Switzerland .
}

:--paginatedCompanies {
  schema:name ?name ;
  schema:address ?address ;
  @order-by ?name ASC ;
  @limit 10 ;
  @offset 20 ;
}`
    },
    {
      id: 'values-subselect',
      title: '8. SPARQL VALUES, @where & Mixin Scoping',
      description: 'Constrain variable values, use @where to suppress CONSTRUCT triples, and attach mapped predicates.',
      code: `@prefix ex: <http://example.org/>;
@prefix psm: <https://agriculture.ld.admin.ch/plant-protection/>;
@prefix schema: <http://schema.org/>;
@prefix ui: <https://myapp>;

/* Reusable Mixin with VALUES constraint, @where suppression, & custom target subject */
@mixin --permissionType {
  VALUES ?productType {
    psm:ParallelImport
    psm:SalePermission
    psm:RegularProduct
  }
  @where ?focusNode a ?productType ;
  ?productType schema:name ?premissionName => ?productType ui:permissionType ;
}

@custom-selector :--product {
  BIND(<https://agriculture.ld.admin.ch/plant-protection/product/D-7463> AS ?focusNode)
}

:--product {
  schema:name ?name => ui:name ;
  @use --permissionType ;
}`
    },
    {
      id: 'bind-selector',
      title: '9. BIND(...) Expressions & IRI Focus Nodes',
      description: 'Bind specific IRIs or dynamic expressions to ?focusNode inside custom selectors.',
      code: `@prefix schema: <https://schema.org/>;
@prefix ex: <http://example.org/>;

@custom-selector :--PlantProtectionProduct {
  BIND (<https://agriculture.ld.admin.ch/plant-protection/product/D-7463> as ?focusNode )
}

:--PlantProtectionProduct {
  schema:name ?name ;
  ex:registrationStatus ?status ;
}`
    },
    {
      id: 'lang-filter',
      title: '10. Parameterized Language Filtering & Nested Mixins',
      description: 'Filter language-tagged string literals using property-level [lang=$langs], nested mixin calls, or native SPARQL FILTER(...).',
      code: `@prefix schema: <http://schema.org/>;
@prefix ui: <https://myapp>;

/* Sub-mixin with parameterized language filter on specific property */
@mixin --localizedName($langs = "de,en") {
  schema:name[lang=$langs] ?name => ui:name ;
}

/* Parent mixin calling sub-mixin with parameter forwarding */
@mixin --country($allowedLangs = "de,fr") {
  schema:countryOfOrigin {
    @use --localizedName($allowedLangs) ;
  }
}

:--product {
  @use --country("de,it") ;
}`
    },
    {
      id: 'constants',
      title: '11. Document-Level Constants (@const)',
      description: 'Define application-wide constants ($defaultLangs, $activeStatus, $targetCountry) and reuse them throughout stylesheet rules.',
      code: `@prefix schema: <http://schema.org/>;
@prefix ui: <https://myapp>;
@prefix ex: <http://example.org/>;

/* Document-level Constants */
@const $defaultLangs = "de,fr" ;
@const $activeStatus = "Active" ;
@const $targetCountry = ex:Estonia ;

@custom-selector :--estoniaCompanies {
  ?focusNode a ex:Company ;
             ex:headQuarterCountry $targetCountry .
}

@mixin --localizedName($langs) {
  schema:name[lang=$langs] ?name => ui:name ;
}

:--estoniaCompanies {
  ex:status $activeStatus ;
  @use --localizedName($defaultLangs) ;
}`
    }
  ];

  // Active state signals
  protected readonly selectedPresetId = signal<string>('custom-selector');
  protected readonly crqlCode = signal<string>(this.presets[0].code);
  protected readonly queryType = signal<'CONSTRUCT' | 'SELECT'>('CONSTRUCT');
  protected readonly parameterCountry = signal<string>('ex:Estonia');
  protected readonly parameterMinEmp = signal<number>(10);

  // Line numbering & error highlighting computation
  protected readonly lineCount = computed(() => this.crqlCode().split('\n').length);
  protected readonly lineNumbers = computed(() => Array.from({ length: this.lineCount() }, (_, i) => i + 1));

  protected readonly errorLine = computed<number | null>(() => {
    const latest = this.inspector.latestLog();
    if (latest && latest.status === 'error' && latest.errorMessage) {
      const match = latest.errorMessage.match(/line\s+(\d+)/i);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return null;
  });

  protected syncScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const gutter = target.parentElement?.querySelector('.line-numbers') as HTMLElement;
    if (gutter) {
      gutter.scrollTop = target.scrollTop;
    }
  }

  // Reactive SPARQL compilation signal using ngx-crql helper
  protected readonly optionsSignal = computed(
    () => ({
      queryType: this.queryType(),
      params: {
        country: this.parameterCountry(),
        minEmployees: this.parameterMinEmp()
      }
    }),
    {
      equal: (a, b) =>
        a.queryType === b.queryType &&
        a.params.country === b.params.country &&
        a.params.minEmployees === b.params.minEmployees
    }
  );

  protected readonly compiledSparql = toSparqlQuery(this.crqlCode, this.optionsSignal);

  protected selectPreset(preset: SamplePreset): void {
    if (this.selectedPresetId() !== preset.id) {
      this.selectedPresetId.set(preset.id);
      this.crqlCode.set(preset.code);
    }
  }

  protected updateCode(newCode: string): void {
    if (newCode !== this.crqlCode()) {
      this.crqlCode.set(newCode);
    }
  }

  protected updateCountry(newCountry: string): void {
    if (newCountry !== this.parameterCountry()) {
      this.parameterCountry.set(newCountry);
    }
  }

  protected updateMinEmp(newMin: number): void {
    if (newMin !== this.parameterMinEmp()) {
      this.parameterMinEmp.set(newMin);
    }
  }

  protected toggleQueryType(): void {
    this.queryType.update(t => (t === 'CONSTRUCT' ? 'SELECT' : 'CONSTRUCT'));
  }

  protected formatCode(): void {
    try {
      const code = this.crqlCode();
      compileCrql(code);
      this.inspector.logQueryExecution({
        crqlQuery: code,
        sparql: this.compiledSparql(),
        durationMs: 0.5,
        status: 'success'
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.inspector.logQueryExecution({
        crqlQuery: this.crqlCode(),
        sparql: '',
        durationMs: 0.1,
        status: 'error',
        errorMessage: msg
      });
    }
  }
}
