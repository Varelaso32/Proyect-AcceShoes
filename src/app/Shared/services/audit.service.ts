import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AuditLog {
  action: string;
  entity: string;
  entityId?: number | string;
  timestamp: Date;
  details?: any;
  user?: string; // Puedes obtenerlo del usuario autenticado
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private logs: AuditLog[] = [];
  private logsSubject = new BehaviorSubject<AuditLog[]>([]);

  constructor() {
    // Cargar logs del localStorage si existen
    const savedLogs = localStorage.getItem('auditLogs');
    if (savedLogs) {
      this.logs = JSON.parse(savedLogs);
      this.logsSubject.next(this.logs);
    }
  }

  addLog(log: Omit<AuditLog, 'timestamp'>): void {
    const newLog: AuditLog = {
      ...log,
      timestamp: new Date(),
    };

    this.logs.unshift(newLog); // Agregar al inicio para orden cronológico inverso
    this.logsSubject.next(this.logs);

    // Guardar en localStorage
    localStorage.setItem('auditLogs', JSON.stringify(this.logs));
  }

  getLogs(): Observable<AuditLog[]> {
    return this.logsSubject.asObservable();
  }

  clearLogs(): void {
    this.logs = [];
    this.logsSubject.next(this.logs);
    localStorage.removeItem('auditLogs');
  }
}
