import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { compileCrql, CrqlCompileOptions } from '@rdf-query/crql-compiler';
import { Observable, map } from 'rxjs';
import { CrqlInspectorService } from './crql-inspector.service';

export interface SparqlEndpointConfig {
  endpointUrl: string;
  defaultHeaders?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class RdfQueryService {
  private http = inject(HttpClient);
  private inspector = inject(CrqlInspectorService);

  private configSignal = signal<SparqlEndpointConfig>({
    endpointUrl: '/sparql'
  });

  public setEndpointConfig(config: SparqlEndpointConfig): void {
    this.configSignal.set(config);
  }

  public compile(crqlQuery: string, options?: CrqlCompileOptions): string {
    return compileCrql(crqlQuery, options);
  }

  public executeConstruct(
    crqlQuery: string,
    options?: CrqlCompileOptions
  ): Observable<string> {
    const startTime = performance.now();
    const sparql = this.compile(crqlQuery, options);
    const config = this.configSignal();

    let headers = new HttpHeaders({
      'Accept': 'text/turtle, application/n-triples, application/ld+json',
      'Content-Type': 'application/sparql-query'
    });

    if (config.defaultHeaders) {
      for (const [key, value] of Object.entries(config.defaultHeaders)) {
        headers = headers.set(key, value);
      }
    }

    return this.http.post(config.endpointUrl, sparql, { headers, responseType: 'text' }).pipe(
      map(response => {
        const durationMs = performance.now() - startTime;
        this.inspector.logQueryExecution({
          crqlQuery,
          sparql,
          durationMs,
          status: 'success'
        });
        return response;
      })
    );
  }
}
