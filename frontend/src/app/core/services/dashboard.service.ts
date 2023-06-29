import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private filterValueSource = new BehaviorSubject('');
  public filterValue = this.filterValueSource.asObservable();

  constructor(private apiSvc: ApiService) {}

  setFilterValue(value: string) {
    this.filterValueSource.next(value);
  }
}
