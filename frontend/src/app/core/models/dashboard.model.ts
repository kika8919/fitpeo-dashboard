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
