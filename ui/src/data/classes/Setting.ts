
export default class Setting {
  
    /**
     * Creates a new Dashboard instance with the specified properties.
     * 
     * @param id - The unique identifier of the dashboard.
     * @param initialized - The month associated with the dashboard.
     */
    constructor(
      public id: string,
      public initialized: boolean
      ) {}
  }