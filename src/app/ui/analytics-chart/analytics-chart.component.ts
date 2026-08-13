import { Component, computed, input } from '@angular/core';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'tms-analytics-chart',
  standalone: true,
  template: `
    <div class="chart-container">
      <h3>Enrollment Analytics</h3>
      <div class="chart-bars">
        <div class="bar-group">
          <span class="bar-count">{{ approvedCount() }}</span>
          <div class="bar approved" [style.height.px]="approvedHeight()">
            <span>Approved</span>
          </div>
        </div>
        <div class="bar-group">
          <span class="bar-count">{{ pendingCount() }}</span>
          <div class="bar pending" [style.height.px]="pendingHeight()">
            <span>Pending</span>
          </div>
        </div>
        <div class="bar-group">
          <span class="bar-count">{{ rejectedCount() }}</span>
          <div class="bar rejected" [style.height.px]="rejectedHeight()">
            <span>Rejected</span>
          </div>
        </div>
      </div>
      <p class="chart-summary">Total records: {{ data().length }}</p>
    </div>
  `,
  styleUrl: './analytics-chart.component.scss',
})
export class AnalyticsChartComponent {
  data = input.required<Enrollment[]>();

  approvedCount = computed(() => this.data().filter((e) => e.status === 'Approved').length);
  pendingCount = computed(() => this.data().filter((e) => e.status === 'Pending').length);
  rejectedCount = computed(() => this.data().filter((e) => e.status === 'Rejected').length);

  approvedHeight = computed(() => {
    const total = Math.max(this.data().length, 1);
    return Math.max(35, (this.approvedCount() / total) * 140);
  });

  pendingHeight = computed(() => {
    const total = Math.max(this.data().length, 1);
    return Math.max(35, (this.pendingCount() / total) * 140);
  });

  rejectedHeight = computed(() => {
    const total = Math.max(this.data().length, 1);
    return Math.max(35, (this.rejectedCount() / total) * 140);
  });
}