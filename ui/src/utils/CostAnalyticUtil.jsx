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
export function calculateDailyRecommended(expenses, incomes, unexpected, costAnalytic) {
  const currentDate = new Date();
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const totalExpenses = sum(expenses);
  const totalIncomes = sum(incomes);
  const totalUnexpected = sum(unexpected);
  console.log('sum Incomes: ', totalIncomes);
  console.log('sum Expenses: ', totalExpenses);
  console.log('sum Unexpected: ', totalUnexpected);
  console.log('target Savin: ', costAnalytic.targetSaving);
  console.log('lastDayOfMonth: ', lastDayOfMonth);
  console.log('Calculating daily Recommended: old', costAnalytic.dailyRecommended);

  costAnalytic.dailyRecommended = (
    (totalIncomes - (totalExpenses + totalUnexpected + costAnalytic.targetSaving)) / lastDayOfMonth
  ).toFixed(2);
  console.log('Calculating daily Recommended new: ', costAnalytic.dailyRecommended);
  return costAnalytic;
}


function sum(arr) {
  return arr.reduce((sum, obj) => {
    return sum + obj.value;
  }, 0);
}