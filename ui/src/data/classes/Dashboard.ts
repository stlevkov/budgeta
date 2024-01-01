/**
 * Represents a dashboard with information about ID, month, year, and read-only status.
 * The dashboard can be picked from the sidebar calendar dialog component. It provides history usage of the
 * data based on the selected month/year pair to fullfill the dashboard.
 */
export default class Dashboard {
  
    /**
     * Creates a new Dashboard instance with the specified properties.
     * 
     * @param id - The unique identifier of the dashboard.
     * @param month - The month associated with the dashboard.
     * @param year - The year associated with the dashboard.
     * @param readOnly - Indicates whether the dashboard is read-only.
     */
    constructor(
      public id: string | null,
      public month: string, 
      public year: number, 
      public readOnly: boolean) {}
  }