import React from 'react';
import { createContext } from 'react';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CostAnalyticState from "../contexts/CostAnalyticState";
import IncomesState from "../contexts/IncomesState";
import ExpensesState from "../contexts/ExpensesState";
import UnexpectedState from "../contexts/UnexpectedState";
import BalanceAccountState from '../contexts/BalanceAccountState';

// Create a context object to hold the instances
export const ColorModeContext = React.createContext({ toggleColorMode: () => { }, });
export const CostAnalyticContext = createContext();
export const IncomesContext = createContext();
export const ExpensesContext = createContext();
export const UnexpectedContext = createContext();
export const BalanceAccountContext = createContext();

export default function withContexts(Component) {
  // Create an instance of each state classes
  const costAnalyticState = new CostAnalyticState();
  const incomesState = new IncomesState();
  const expensesState = new ExpensesState();
  const unexpectedState = new UnexpectedState();
  const balanceAccountState = new BalanceAccountState();

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