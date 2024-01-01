import DocumentInfo from "./DocumentInfo";

export default class CostAnalytic extends DocumentInfo {
    public monthlyTarget: number
    public dailyRecommended: number;
    public targetSaving: number;
    public balanceAccount: number;

    constructor(
        id: string,
        name: string,
        targetSaving: number,
        dailyRecommended: number,
        monthlyTarget: number,
        balanceAccount: number,
        dashboardId: string
    ) {
        // Call the constructor of the parent class with the necessary parameters
        super(id, name, "", 0, null, dashboardId);

        // Add properties specific to CostAnalytic
        this.targetSaving = targetSaving;
        this.dailyRecommended = dailyRecommended;
        this.monthlyTarget = monthlyTarget;
        this.balanceAccount = balanceAccount;
    }
}
