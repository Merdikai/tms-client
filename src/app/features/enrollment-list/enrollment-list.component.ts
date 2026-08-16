import { Component, viewChild, effect, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'tms-enrollment-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule],
  templateUrl: './enrollment-list.component.html',
  styleUrl: './enrollment-list.component.scss',
})
export class EnrollmentListComponent {
  store = inject(EnrollmentStore);
  displayedColumns = ['studentName', 'courseName', 'status', 'grade', 'actions'];

  // MatTableDataSource bridges store data into Material's rendering pipeline
  dataSource = new MatTableDataSource<Enrollment>();

  // viewChild signals for MatPaginator and MatSort
  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  constructor() {
    // Effect 1: Push store entities into the Material data source whenever they change
    effect(() => {
      this.dataSource.data = this.store.entities();
    });

    // Effect 2: Wire paginator and sort controls once Angular resolves the view queries
    effect(() => {
      const p = this.paginator();
      if (p) this.dataSource.paginator = p;
      const s = this.sort();
      if (s) this.dataSource.sort = s;
    });

    // Load enrollments on component creation and listen to live SignalR stream
    this.store.loadEnrollments();
    this.store.listenForLiveUpdates();
  }
}