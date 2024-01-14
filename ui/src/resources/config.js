export default {
  server: {
    uri: `${import.meta.env.BUDGETA_SDK_API_PROTOCOL || 'http'}://${import.meta.env.BUDGETA_SDK_API_HOST || 'localhost'}:${import.meta.env.BUDGETA_SDK_API_PORT || '8080'}/api/`,
  },
  api: {
    costAnalyticEndpoint: 'costAnalytics',
    incomesEndpoint: 'incomes',
    expensesEndpoint: 'expenses',
    unexpectedsEndpoint: 'unexpecteds',
    balanceAccountEndpoint: 'balanceAccount',
    dashboardEndpoint: 'dashboards',
    dashboardMinEndpoint: 'dashboards/min',
    dashboardAggregatedEndpoint: 'dashboards/aggregation',
    settingsEndpoint: 'settings',
    settingsInitDashboardEndpoint: 'settings/init_dashboard'
  }
};