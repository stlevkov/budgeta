/**
 * Represents a record information object for types: Income, Expense or Unexpected
 */
class DocumentInfo {
  /**
   * Creates a new DocumentInfo instance with the specified properties.
   * @param id - The unique identifier of the document.
   * @param name - The name of the document.
   * @param description - A description of the document.
   * @param value - The numeric value associated with the document.
   * @param updatedAt - The date when the document was last updated (nullable).
   * @param dashboardId - The identifier of the dashboard associated with the document.
   */
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public value: number,
    public updatedAt: Date | null,
    public dashboardId: string | null
  ) {}
}

export default DocumentInfo;