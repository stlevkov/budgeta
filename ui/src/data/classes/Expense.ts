import DocumentInfo from "./DocumentInfo";

export default class Expense extends DocumentInfo {
    public loan: boolean;
    public maxPeriod: number;
    public startDate: Date;
  
    public scheduled: boolean;
    public scheduledPeriod: number[] = [];
  
    constructor(
      id: string,
      name: string,
      description: string,
      value: number,
      updatedAt: Date | null,
      dashboardId: string,
      loan: boolean,
      maxPeriod: number,
      startDate: Date,
      scheduled: boolean,
      scheduledPeriod: number[]
    ) {
      super(id, name, description, value, updatedAt, dashboardId);
  
      this.loan = loan;
      this.maxPeriod = maxPeriod;
      this.startDate = startDate;
      this.scheduled = scheduled;
      this.scheduledPeriod = scheduledPeriod;
    }
  }