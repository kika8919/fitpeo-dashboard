import { Component, Input } from "@angular/core";
import { ChartConfiguration, ChartType } from "chart.js";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent {
  @Input() chartTitle!: string;
  @Input() chartType!: ChartType;
  @Input() chartData!: any;
  @Input() chartLegend: boolean | undefined = true;

  public barChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    hover: {
      intersect: true,
      mode: "x",
      axis: "x",
    },
    plugins: {
      colors: { enabled: false },
      // tooltip: {
      //   callbacks: {
      //     label: (context) => {
      //       const {
      //         dataset,
      //         parsed: { y },
      //       } = context;
      //       return `${dataset.label}: ${y}`;
      //     },
      //   },
      // },
    },
  };

  public pieChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      colors: { enabled: true },
    },
    aspectRatio: 2,
  };

  getChartOptions(chartType: ChartType): ChartConfiguration["options"] {
    let options: ChartConfiguration["options"];
    switch (chartType) {
      case "line":
      case "bar":
        options = this.barChartOptions;
        break;
      case "pie":
        options = this.pieChartOptions;
        break;
    }

    return options;
  }
}
