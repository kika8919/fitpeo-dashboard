import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() closeSideNav = new EventEmitter();

  constructor(private router: Router) {}

  onToggleClose() {
    this.closeSideNav.emit();
  }

  ngOnInit() {}

  gotoDashboard() {
    this.router.navigate(['/dashboard']);
    this.onToggleClose();
  }
}
