import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface EnrollmentStatusEvent {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Injectable({ providedIn: 'root' })
export class LiveSyncService {
  private platformId = inject(PLATFORM_ID);
  private connection: HubConnection | null = null;
  private eventsSubject = new Subject<EnrollmentStatusEvent>();

  // Expose events as an observable - the store will subscribe to this
  events$ = this.eventsSubject.asObservable();

  // Connection state signal for UI status feedback
  connectionState = signal<'connected' | 'reconnecting' | 'disconnected'>('disconnected');

  connect() {
    if (this.connection) return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5282/hubs/tms')
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    this.connection.on(
      'ReceiveEnrollmentStatusUpdated',
      (enrollmentId: any, status: any) => {
        const idStr = String(enrollmentId);
        console.log('[LiveSyncService] SignalR event received (PascalCase):', { enrollmentId, idStr, status });
        this.eventsSubject.next({ id: idStr, status });
      }
    );

    this.connection.on(
      'receiveEnrollmentStatusUpdated',
      (enrollmentId: any, status: any) => {
        const idStr = String(enrollmentId);
        console.log('[LiveSyncService] SignalR event received (camelCase):', { enrollmentId, idStr, status });
        this.eventsSubject.next({ id: idStr, status });
      }
    );

    this.connection.onreconnecting(() => {
      console.log('[LiveSyncService] Reconnecting...');
      this.connectionState.set('reconnecting');
    });
    this.connection.onreconnected(() => {
      console.log('[LiveSyncService] Reconnected');
      this.connectionState.set('connected');
    });
    this.connection.onclose(() => {
      console.log('[LiveSyncService] Disconnected');
      this.connectionState.set('disconnected');
    });

    this.connection
      .start()
      .then(() => {
        console.log('[LiveSyncService] SignalR connected successfully');
        this.connectionState.set('connected');
      })
      .catch((err) => console.error('[LiveSyncService] SignalR connection error:', err));
  }
}
