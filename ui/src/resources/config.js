export default {
  server: {
    uri: `http://${import.meta.env.BUDGETA_SDK_API_HOST || 'localhost'}:${import.meta.env.BUDGETA_SDK_API_PORT || '8080'}/api/`,
  },
  api: {
    costAnalyticEndpoint: 'costAnalytics',
    incomesEndpoint: 'incomes',
    expensesEndpoint: 'expenses',
    unexpectedEndpoint: 'unexpecteds',
    balanceTransactionEndpoint: 'balanceAccount',
  }
};