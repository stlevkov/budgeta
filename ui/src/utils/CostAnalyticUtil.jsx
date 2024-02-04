/**
 * Calculates dailyRecommended.
 * 
 * @param expenses - the expenses state
 * @param incomes - the incomes state
 * @param unexpected - the unexpected state
 * @param costAnalytic - the costAnalytic state
 * 
 * @returns updated costAnalytic object with the new DailyRecommended value
 */
export function calculateDailyRecommended(sumExpenses, sumIncomes, sumUnexpecteds, costAnalytic) {
  const currentDate = new Date();
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const totalExpenses = sumExpenses;
  const totalIncomes = sumIncomes;
  const totalUnexpected = sumUnexpecteds;
  console.log('[CostAnalyticUtil] Calculating daily Recommended: old', costAnalytic.dailyRecommended);
  costAnalytic.dailyRecommended = (
    (totalIncomes - (totalExpenses + totalUnexpected + costAnalytic.targetSaving)) / lastDayOfMonth
  ).toFixed(2);
  console.log('[CostAnalyticUtil] Calculating daily Recommended new: ', costAnalytic.dailyRecommended);
  return costAnalytic;
}