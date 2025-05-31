import { Component, OnInit } from '@angular/core';
import { AuditService, AuditLog } from '../../../Shared/services/audit.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seguimiento-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seguimiento-app.component.html',
  styleUrls: ['./seguimiento-app.component.css'],
  providers: [DatePipe],
})
export class SeguimientoAppComponent implements OnInit {
  logs: AuditLog[] = [];
  selectedLog: AuditLog | null = null;
  formattedChanges: string[] = [];

  constructor(private auditService: AuditService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.auditService.getLogs().subscribe((logs) => {
      this.logs = logs;
    });
  }

  clearLogs(): void {
    if (confirm('¿Estás seguro de que deseas borrar todo el historial?')) {
      this.auditService.clearLogs();
      this.logs = [];
    }
  }

  formatDetails(details: any): string {
    if (!details) return '';
    try {
      return JSON.stringify(details, null, 2);
    } catch {
      return 'Detalles no disponibles';
    }
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'medium') || '';
  }

  getActionClass(action: string): string {
    const baseClass = 'action-badge';
    switch (action) {
      case 'CREATE':
        return `${baseClass} create-action`;
      case 'UPDATE':
        return `${baseClass} update-action`;
      case 'DELETE':
        return `${baseClass} delete-action`;
      default:
        return `${baseClass} other-action`;
    }
  }

  openDetails(log: AuditLog): void {
    this.selectedLog = log;
    this.formattedChanges = this.parseDetails(log.details);
  }

  closeDetails(): void {
    this.selectedLog = null;
    this.formattedChanges = [];
  }

  downloadSQL(): void {
    const sqlLines = this.logs.map((log) => {
      return `INSERT INTO audit_logs (action, entity, entity_id, timestamp) VALUES ('${
        log.action
      }', '${log.entity}', ${log.entityId ?? 'NULL'}, '${log.timestamp}');`;
    });

    const blob = new Blob([sqlLines.join('\n')], { type: 'text/sql' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historial_auditoria.sql';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadBackup() {
    const fileUrl = '/assets/backup.sql'; // ruta en Angular
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'backup.sql';
    link.click();
  }

  parseDetails(details: any): string[] {
    if (!details) return [];

    const changes: string[] = [];

    for (const [key, value] of Object.entries(details)) {
      if (
        value &&
        typeof value === 'object' &&
        'old' in value &&
        'new' in value
      ) {
        changes.push(
          `Se actualizó el campo "${key}" de "${value.old}" a "${value.new}"`
        );
      } else {
        changes.push(`Se modificó "${key}" → ${JSON.stringify(value)}`);
      }
    }

    return changes;
  }
}
