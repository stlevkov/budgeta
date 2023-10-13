package com.budgeta.sdk.api;

import com.budgeta.sdk.api.exception.ValidationCollectionException;
import com.budgeta.sdk.api.model.*;
import com.budgeta.sdk.api.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Month;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Component
@EnableScheduling
public class AccountBalanceScheduler {

    @Autowired
    CostAnalyticService costAnalyticService;
    @Autowired
    BalanceServiceImpl balanceService;
    @Autowired
    DashboardService dashboardService;
    @Autowired
    ExpenseService expenseService;
    @Autowired
    IncomeService incomeService;

    // Schedule the task for the last day of the month at 23:59
    @Scheduled(cron = "0 59 23 L * ?")
    public void performMonthlyTask() {
        System.out.println("[Account Balance Scheduler] Activated.");
        int currentYear = YearMonth.now().getYear();
        String currentMonth = YearMonth.now().format(DateTimeFormatter.ofPattern("MMMM"));
        try {
            CostAnalytic currentCostAnalytic = costAnalyticService.getCurrentCostAnalytic(currentYear, currentMonth);
            System.out.println("[Account Balance Scheduler] I - Creating new Balance transaction to have the history of balance account change");
            newBalanceTransaction(currentCostAnalytic);
            System.out.println("[Account Balance Scheduler] II - Updating the CostAnalytic by adding the target saving for this month");
            updateCostAnalyticAccountBalance(currentCostAnalytic);
            System.out.println("[Account Balance Scheduler] III - Setting the current dashboard to be read only, as new dashboard will be created");
            Dashboard currentDashboard = setCurrentDashboardReadOnly(currentYear, currentMonth);
            System.out.println("[Account Balance Scheduler] IV - Creating new dashboard for the next month");
            Dashboard newDashboard = createNewDashboard(currentDashboard);
            System.out.println("[Account Balance Scheduler] V - Copying all the regular Expenses for the next month and assign the new dashboard");
            copyExpensesToNewDashboard(currentDashboard, newDashboard);
            System.out.println("[Account Balance Scheduler] VI - Copying all the Incomes for the next month and assign the new dashboard");
            copyIncomesToNewDashboard(currentDashboard, newDashboard);
            System.out.println("[Account Balance Scheduler] VII - Copying CostAnalytic for the next month and assign the new dashboardId");
            copyCostAnalyticToNewDashboard(currentCostAnalytic, newDashboard);
            System.out.println("[Account Balance Scheduler] Complete.");
        } catch (ValidationCollectionException e) {
            System.out.println("[Account Balance Scheduler] Unable to proceed. Reason: " + e.getMessage());
        }

    }

    private void newBalanceTransaction(final CostAnalytic currentCostAnalytic) throws ValidationCollectionException {
        balanceService.createBalanceTransaction(new BalanceTransaction(
                null,
                BalanceTransaction.SYSTEM_UPDATE,
                BalanceTransaction.SYSTEM_UPDATE_DESCR,
                currentCostAnalytic.getTargetSaving(),
                new Date(),
                BalanceTransaction.DEPOSIT,
                currentCostAnalytic.getDashboardId()
        ));
    }

    private void updateCostAnalyticAccountBalance(CostAnalytic currentCostAnalytic) throws ValidationCollectionException {
        currentCostAnalytic.setBalanceAccount(currentCostAnalytic.getBalanceAccount().add(currentCostAnalytic.getTargetSaving()));
        costAnalyticService.updateCostAnalytic(currentCostAnalytic);
    }

    private Dashboard setCurrentDashboardReadOnly(final int currentYear, final String currentMonth) throws ValidationCollectionException {
        Dashboard currentDashboard = dashboardService.getCurrentDashboard(currentYear, currentMonth);
        System.out.println("1Current dashboard: " + currentDashboard);
        currentDashboard.setReadOnly(true);
        Dashboard updatedDashboard = dashboardService.createDashboard(currentDashboard);
        System.out.println("Updated dashboard: " + updatedDashboard);
        return updatedDashboard;
    }

    private Dashboard createNewDashboard(Dashboard currentDashboard) throws ValidationCollectionException {

        int year = currentDashboard.getYear();
        if(currentDashboard.getMonth().equals("December")) {
            year = currentDashboard.getYear() + 1;
        }
        Month month = Month.valueOf(currentDashboard.getMonth().toUpperCase());
        Month monthCandidate = month.plus(1);
        String nextMonthAsString = monthCandidate.getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        nextMonthAsString = nextMonthAsString.substring(0, 1).toUpperCase() + nextMonthAsString.substring(1);
        String nextMonth = nextMonthAsString;

        Dashboard newDashboard = new Dashboard(null, nextMonth, year, false);
        return dashboardService.createDashboard(newDashboard);
    }

    private void copyExpensesToNewDashboard(final Dashboard oldDashboard, final Dashboard newDashboard) throws ValidationCollectionException {
        System.out.println("Old dashboard: " + oldDashboard + ", new: " + newDashboard);
        List<Expense> expenses = expenseService.getByDashboardId(oldDashboard.getId());
        for (Expense expense : expenses) {
            expense.setDashboardId(newDashboard.getId());
            expense.setId(null);
        }
        for (Expense updatedExpense : expenses) {
            expenseService.createExpense(updatedExpense);
        }
    }

    private void copyIncomesToNewDashboard(final Dashboard oldDashboard, final Dashboard newDashboard) throws ValidationCollectionException {
        List<Income> incomes = incomeService.getByDashboardId(oldDashboard.getId());
        for (Income income : incomes) {
            income.setDashboardId(newDashboard.getId());
            income.setId(null);
        }
        for (Income updatedIncome : incomes) {
            incomeService.createIncome(updatedIncome);
        }
    }

    private void copyCostAnalyticToNewDashboard(CostAnalytic costAnalytic, final Dashboard newDashboard) throws ValidationCollectionException {
        costAnalytic.setId(null);
        costAnalytic.setDashboardId(newDashboard.getId());
        System.out.println("Cost Analytic candidate: " + costAnalytic);
        costAnalyticService.createCostAnalytic(costAnalytic);
    }

}
