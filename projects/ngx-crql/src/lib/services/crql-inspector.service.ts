import { Injectable, signal, computed } from '@angular/core';

export interface QueryLogEntry {
  id: string;
  timestamp: Date;
  crqlQuery: string;
  sparql: string;
  durationMs: number;
  status: 'success' | 'error';
  errorMessage?: string;
}

@Injectable({ providedIn: 'root' })
export class CrqlInspectorService {
  private queryLogsSignal = signal<QueryLogEntry[]>([]);

  public readonly logs = computed(() => this.queryLogsSignal());
  public readonly totalQueriesExecuted = computed(() => this.queryLogsSignal().length);
  public readonly latestLog = computed(() => {
    const logs = this.queryLogsSignal();
    return logs.length > 0 ? logs[logs.length - 1] : null;
  });

  public logQueryExecution(entry: Omit<QueryLogEntry, 'id' | 'timestamp'>): void {
    const newEntry: QueryLogEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date()
    };
    this.queryLogsSignal.update(logs => [...logs, newEntry]);
  }

  public clearLogs(): void {
    this.queryLogsSignal.set([]);
  }
}
