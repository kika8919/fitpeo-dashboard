import { Component, Input } from "@angular/core";

@Component({
  selector: "app-mini-card",
  templateUrl: "./mini-card.component.html",
  styleUrls: ["./mini-card.component.scss"],
})
export class MiniCardComponent {
  @Input() icon!: string | undefined;
  @Input() title!: string;
  @Input() kpi!: string;
  @Input() value!: any;
  @Input() color!: string | undefined;
}
