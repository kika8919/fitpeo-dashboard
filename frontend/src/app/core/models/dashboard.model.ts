import { ChartType } from "chart.js";

export interface DashboardCard {
  _id: number;
  type: string;
  description: string;
  cols: number;
  rows: number;
  enabled: boolean;
  option?: any;
  heading?: string;
  isLoading?: boolean;
}

export interface Patient {
  patientId: string;
  entryTime: string;
  callLogs: { time: string; duration: number }[];
  readings: {
    actual: {
      weekId: string;
      date: string;
      readings: {
        readingTime: string;
        readingValue: number;
      }[];
    }[];
    planned: {
      weekId: string;
      startDate: string;
      endDate: string;
      plannedReadingCount: number;
    }[];
  };
  isActive: boolean;
  visits: { visitDate: string; visitDetails: string }[];
}

export interface ChartCard {
  chartType: ChartType;
  chartTitle: string;
  chartData?: any;
  visualCategory: string;
  chartLegends?: boolean | undefined;
}

export interface MiniCard {
  kpi: string;
  title: string;
  value?: any;
  color?: string | undefined;
  icon?: string;
}
