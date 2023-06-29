import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DashboardService } from 'src/app/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @Output() SideNavToggle = new EventEmitter();

  filterValue: string = '';
  showSearch: boolean = false;
  showDashboardFilter: boolean = false;
  constructor(private router: Router, private dashboardSvc: DashboardService) {}
  ngOnInit(): void {
    if (this.router.url === '/dashboard') {
      this.showSearch = false;
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url;
        if (currentUrl === '/dashboard') {
          this.showSearch = false;
        } else {
          this.showSearch = false;
        }
      }
    });
  }

  openSidenav() {
    this.SideNavToggle.emit();
  }
  applyFilter(filterString: string) {
    this.dashboardSvc.setFilterValue(filterString);
  }

  clearSearch() {
    this.filterValue = '';
    this.applyFilter(this.filterValue);
  }
}
