import React from 'react';
import { createContext } from 'react';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StateFactory from '../contexts/StateFactory';
import DashboardState from '../contexts/DashboardState';
import IncomesState from '../contexts/IncomesState';
import ExpensesState from '../contexts/ExpensesState';
import UnexpectedState from '../contexts/UnexpectedState';
import BalanceAccountState from '../contexts/BalanceAccountState';
import CostAnalyticState from '../contexts/CostAnalyticState';
import SettingState from '../contexts/SettingState';

// Create a context object to hold the instances
export const ColorModeContext = React.createContext({ toggleColorMode: () => { }, });
export const CostAnalyticContext = createContext();
export const IncomesContext = createContext();
export const ExpensesContext = createContext();
export const UnexpectedContext = createContext();
export const BalanceAccountContext = createContext();

// Initialize the State Factory
const stateFactory = new StateFactory();

// Create an instance of each state classes, order is also important
const incomesState = stateFactory.createState(IncomesState);
const expensesState = stateFactory.createState(ExpensesState);
const unexpectedState = stateFactory.createState(UnexpectedState)
const balanceAccountState = stateFactory.createState(BalanceAccountState);
const costAnalyticState = stateFactory.createState(CostAnalyticState);
const settingState = stateFactory.createState(SettingState);
const dashboardState = stateFactory.createState(DashboardState);

stateFactory.ready(); // At this point any state can aquire another state

export const DashboardContext = createContext(dashboardState);
export const SettingContext = createContext(settingState);

export default function withContexts(Component) {
  // TODO move this color theme stuffs in a separate state context class!!!
  const themeModeStored =
    localStorage.getItem("themeMode") !== undefined &&
      localStorage.getItem("themeMode") !== null
      ? localStorage.getItem("themeMode")
      : "dark";

  const [mode, setMode] = React.useState(themeModeStored);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
      },
    }),
    []
  );

  const defaultTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return function WithContexts(props) {
    return (
      <UnexpectedContext.Provider value={unexpectedState}>
        <ExpensesContext.Provider value={expensesState}>
          <IncomesContext.Provider value={incomesState}>
            <CostAnalyticContext.Provider value={costAnalyticState}>
              <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={defaultTheme}>
                  <BalanceAccountContext.Provider value={balanceAccountState}>
                    <Component {...props} />
                  </BalanceAccountContext.Provider>
                </ThemeProvider>
              </ColorModeContext.Provider>
            </CostAnalyticContext.Provider>
          </IncomesContext.Provider>
        </ExpensesContext.Provider>
      </UnexpectedContext.Provider>
    );
  }
}