import BalanceAccountTransaction from "./BalanceAccountTransaction.ts";
import DocumentInfo from "./DocumentInfo.ts";

export class BalanceAccount extends DocumentInfo {

    constructor(
        id: string,
        name: string,
        description: string,
        value: number,
        updatedAt: Date | null,
        dashboardId: string,
        public user: string, // TODO replace with Class Reference
        public balanceAccountTransactions: BalanceAccountTransaction[],
        public active: boolean,
        public primary: boolean
        ) {
        super(id, name, description, value, updatedAt, dashboardId);
    }
}