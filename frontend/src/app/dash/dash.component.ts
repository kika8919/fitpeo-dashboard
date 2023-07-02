import { Component, OnInit } from "@angular/core";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { ChartCard, DashboardService, MiniCard, Patient } from "../core";

@Component({
  selector: "app-dash",
  templateUrl: "./dash.component.html",
  styleUrls: ["./dash.component.scss"],
})
export class DashComponent implements OnInit {
  miniCardData: MiniCard[] = [];
  chartCardData: ChartCard[] = [];
  today = new Date();
  public bar = {
    labels: [] as any[],
    datasets: [
      {
        label: "",
        backgroundColor: "#42A5F5",
        borderColor: "#1E88E5",
        fill: false,
        data: [] as any[],
        hoverBackgroundColor: "#42A5F5",
        hoverBorderColor: "#1E88E5",
      },
    ],
  };

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dashboardSvc: DashboardService
  ) {}

  /** Based on the screen size, switch from standard to one column per row */
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 1,
          miniCard: { cols: 1, rows: 1 },
          chart: { cols: 1, rows: 2 },
          // table: { cols: 1, rows: 4 },
        };
      }

      return {
        columns: 4,
        miniCard: { cols: 1, rows: 1 },
        chart: { cols: 2, rows: 2 },
        // table: { cols: 4, rows: 4 },
      };
    })
  );

  ngOnInit(): void {
    this.getPatientData();
  }

  getPatientData() {
    this.dashboardSvc.getPatientData().subscribe({
      next: (data) => {
        this.getMiniCardData(data);
        this.getCardData(data);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getMiniCardData(data: Patient[]) {
    let kpis: MiniCard[] = [
      {
        kpi: "visit-count",
        title: "Patients Seen Today",
        color: "purple",
        icon: "person",
      },
      {
        kpi: "time-spent",
        title: "Time Spent per Patient",
        color: "green",
        icon: "av_timer",
      },
      {
        kpi: "weekly-readings",
        title: "Weekly Readings",
        color: "red",
        icon: "library_books",
      },
      {
        kpi: "calls-to-patient-today",
        title: "Calls to Patients Today",
        color: "blue",
        icon: "call",
      },
    ];
    for (let kp of kpis) {
      this.miniCardData.push({
        ...kp,
        value: this.getPatientKPIValue(data, kp.kpi),
      });
    }
  }

  getPatientKPIValue(data: Patient[], type: string): any {
    let returnVal;
    const activePatients = data.filter(({ isActive }) => isActive);
    switch (type) {
      case "visit-count":
        let todayVisitCount = 0;
        for (let { visits } of activePatients) {
          for (let { visitDate } of visits) {
            if (
              visitDate.slice(0, 10) == this.today.toISOString().slice(0, 10)
            ) {
              todayVisitCount += 1;
            }
          }
        }
        returnVal = todayVisitCount;
        break;
      case "time-spent":
        let attendedPatientCount = 0;
        let totalDurationOfToday = 0;
        for (let { callLogs } of activePatients) {
          if (callLogs.length > 0) {
            attendedPatientCount++;
            for (let { time, duration } of callLogs) {
              if (time.slice(0, 10) === this.today.toISOString().slice(0, 10)) {
                totalDurationOfToday += duration;
              }
            }
          }
        }
        returnVal = totalDurationOfToday / attendedPatientCount;
        break;
      case "weekly-readings":
        let totalPlannedReading = 0;
        let totalActualReading = 0;
        for (let { readings } of activePatients) {
          const today = this.today.getTime();
          let matchedWeekId;
          for (let reading of readings.planned) {
            const startDate = new Date(reading.startDate).getTime();
            const endDate = new Date(reading.endDate).getTime();

            if (startDate <= today && endDate >= today) {
              totalPlannedReading += reading.plannedReadingCount;
              matchedWeekId = reading.weekId;
            }
          }

          for (let reading of readings.actual) {
            if (reading.weekId == matchedWeekId) {
              totalActualReading += reading.readings.length;
            }
          }
        }
        returnVal = {
          weeklyTarget: totalPlannedReading,
          remainingReadings: totalPlannedReading - totalActualReading,
        };
        break;
      case "calls-to-patient-today":
        let totalCallsToPatientToday = 0;
        for (let { callLogs } of activePatients) {
          if (callLogs.length > 0) {
            for (let { time } of callLogs) {
              if (time.slice(0, 10) === this.today.toISOString().slice(0, 10)) {
                totalCallsToPatientToday += 1;
              }
            }
          }
        }
        returnVal = totalCallsToPatientToday;
        break;
    }
    return returnVal;
  }

  getCardData(data: Patient[]) {
    let chartCards: ChartCard[] = [
      {
        chartType: "bar",
        chartTitle: "Visits",
        visualCategory: "visits",
        chartLegends: true,
      },
      {
        chartType: "bar",
        chartTitle: "Weekly Readings",
        visualCategory: "readings",
        chartLegends: true,
      },
    ];
    for (let chart of chartCards) {
      this.chartCardData.push({
        ...chart,
        chartData: this.getWeeklyChart(
          data,
          chart.chartType,
          chart.visualCategory
        ),
      });
    }
  }

  getWeeklyChart(patients: Patient[], type: string, visualCategory: string) {
    let returnVal: any;
    const activePatients = patients.filter(({ isActive }) => isActive);
    switch (type) {
      case "bar":
        if (visualCategory == "visits") {
          const barCopy = {
            labels: [] as any[],
            datasets: [
              {
                label: "",
                backgroundColor: "#42A5F5",
                borderColor: "#1E88E5",
                fill: false,
                data: [] as any[],
                hoverBackgroundColor: "#42A5F5",
                hoverBorderColor: "#1E88E5",
              },
            ],
          };
          barCopy.labels = this.getLast7Days().map((date) => {
            return date.formattedDate;
          });
          barCopy.datasets[0].label = "Visits";
          const last7days = this.getLast7Days().map((date) =>
            date.originalDate.toISOString().slice(0, 10)
          );
          for (let date of last7days) {
            let visitCountOnDate = 0;
            for (let { visits } of activePatients) {
              for (let { visitDate } of visits) {
                if (visitDate.slice(0, 10) === date) {
                  visitCountOnDate++;
                }
              }
            }
            barCopy.datasets[0].data.push(visitCountOnDate);
          }

          returnVal = barCopy;
        } else if (visualCategory == "readings") {
          const barCopy = {
            labels: [] as any[],
            datasets: [
              {
                label: "Planned",
                backgroundColor: "#42A5F5",
                borderColor: "#1E88E5",
                fill: false,
                data: [] as any[],
                hoverBackgroundColor: "#42A5F5",
                hoverBorderColor: "#1E88E5",
              },
              {
                label: "Actual",
                backgroundColor: "#9CCC65",
                borderColor: "#7CB342",
                fill: false,
                data: [] as any[],
                hoverBackgroundColor: "#9CCC65",
                hoverBorderColor: "#7CB342",
              },
            ],
          };

          const aggregatedData = activePatients.reduce(
            (result, patientData) => {
              const lastSixWeeks = patientData.readings.planned.slice(-6); // Use planned, not actual, to get the last six weeks

              lastSixWeeks.forEach((week, index) => {
                const weekIndex = 6 - index - 1; // To show the latest week on the right side of the chart
                const plannedCount = week.plannedReadingCount;
                const actualCount = this.getActualCountForWeek(
                  patientData.readings.actual,
                  week.startDate,
                  week.endDate
                );

                result[weekIndex] = result[weekIndex] || {
                  plannedCounts: 0,
                  actualCounts: 0,
                };
                result[weekIndex].plannedCounts += plannedCount;
                result[weekIndex].actualCounts += actualCount;
              });

              return result;
            },
            [] as any[]
          );

          // Extract planned and actual counts for the last six weeks
          const plannedCounts = aggregatedData.map(
            (week) => week.plannedCounts
          );
          const actualCounts = aggregatedData.map((week) => week.actualCounts);

          // Extract labels for the chart data (week start dates)
          const labels = activePatients[0].readings.planned
            .slice(-6)
            .map((week) => formatDate(week.startDate, week.endDate)); // Assuming all patients have the same weeks data

          function formatDate(startDate: string, endDate: string) {
            const startDat = new Date(startDate);
            const endDat = new Date(endDate);
            return `${startDat.getDate()}/${
              startDat.getMonth() + 1
            }/${startDat.getFullYear()}-${endDat.getDate()}/${
              endDat.getMonth() + 1
            }/${endDat.getFullYear()}`;
          }

          barCopy.labels = labels;
          barCopy.datasets[0].data = plannedCounts;
          barCopy.datasets[1].data = actualCounts;

          returnVal = barCopy;
        } else {
          const barCopy = JSON.parse(JSON.stringify(this.bar));
          barCopy.labels = [1, 2, 3];
          barCopy.datasets[0].data = [1, 2, 3];
          returnVal = barCopy;
        }
        break;
      case "line":
        const barCopy = JSON.parse(JSON.stringify(this.bar));
        barCopy.labels = [1, 2, 3];
        barCopy.datasets[0].data = [1, 2, 3];
        returnVal = barCopy;
        break;

      default:
        break;
    }

    return returnVal;
  }

  getActualCountForWeek(
    actualReadings: any[],
    startDate: string,
    endDate: string
  ) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const actualReadingsForWeek = actualReadings.filter((week) => {
      const readingDate = new Date(week.date);
      return readingDate >= startDateObj && readingDate <= endDateObj;
    });
    return actualReadingsForWeek.reduce(
      (count, week) => count + week.readings.length,
      0
    );
  }

  getLast7Days() {
    const currentDate = this.today;
    const endOfWeek = new Date(currentDate); // Clone the current date object
    const startOfWeek = new Date(currentDate); // Clone the current date object

    endOfWeek.setHours(23, 59, 59, 999); // Adjust to the end of the day (23:59:59)

    // Set startOfWeek to 7 days ago from today
    startOfWeek.setDate(currentDate.getDate() - 6); // Subtract 6 to get 7 days ago, including today
    startOfWeek.setHours(0, 0, 0, 0); // Adjust to the beginning of the day (00:00:00)

    // Create an array to store the dates
    const datesArray = [];
    const currentDateCopy = new Date(startOfWeek);

    // Loop through each day from startOfWeek to endOfWeek and push objects with original and formatted dates to the array
    while (currentDateCopy <= endOfWeek) {
      const formattedDate = currentDateCopy.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      currentDateCopy.setDate(currentDateCopy.getDate() + 1); // Move to the next day
      // Create an object with original and formatted dates
      const dateObject = {
        originalDate: new Date(currentDateCopy), // Clone the current date object
        formattedDate: formattedDate,
      };

      datesArray.push(dateObject);
    }

    return datesArray;
  }
}
