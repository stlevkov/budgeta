import config from "../resources/config.json";
import axios from "axios";
import { toast } from "material-react-toastify";

export function getCostAnalytic() {
  return genericFetch(config.api.costAnalyticEndpoint);
}

export function getIncomes() {
  return genericFetch(config.api.incomesEndpoint);
}

export function editIncome(income) {
  genericEdit(config.api.incomesEndpoint, income);
}

export function createIncome(income) {
  genericCreate(config.api.incomesEndpoint, income);
}

export function getExpenses() {
  return genericFetch(config.api.expensesEndpoint);
}

export function editExpense(expense) {
  genericEdit(config.api.expensesEndpoint, expense);
}

export function createExpense(expense) {
  genericCreate(config.api.expensesEndpoint, expense);
}

export function getUnexpected() {
  return genericFetch(config.api.unexpectedEndpoint);
}

export function editUnexpected(unexpected) {
  genericEdit(config.api.unexpectedEndpoint, unexpected);
}

export function createUnexpected(unexpected) {
  genericCreate(config.api.expensesEndpoint, unexpected);
}

/**
 * Makes a get request to fetch resource from the back-end.
 *
 * @param endpoint for the back-end
 * @returns dto, or error if the operation failed
 */
async function genericFetch(endpoint) {
  console.log("[API] Fetching " + endpoint);
  try {
    const response = await axios.get(config.server.uri + endpoint);
    if (response.data !== "") {
      console.log("[FETCH][" + endpoint + "] Response OK");
      console.log("Data: " + JSON.stringify(response.data));
      return response.data;
    } else {
      console.log("Something is wrong");
      return "error";
    }
  } catch (err) {
    console.log("Something is wrong: " + err);
    return "error: " + err;
  }
}

/**
 * Generic Edit serves all PUT operations to the back-end for DTOs, which implements TransactionType Interface.
 * The function is fire and forget and does not require callback.
 */
async function genericEdit(endpoint, dto) {
  axios
    .put(`${config.server.uri}${endpoint}/${dto.id}`, dto, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("[EDIT][" + endpoint + "]: RESPONSE OK: ", response.data);
      toast.success(dto.name + " edited successfully!");
    })
    .catch((error) => {
      console.log("[EDIT][" + endpoint + "]: RESPONSE ERROR: " + error);
      toast.error(
        `Unable to edit ${dto.name}. Try again, or check your internet connection!`
      );
    });
}

/**
 * Generic Create, serves all POST operations to the back-end for DTOs, which implements TransactionType Interface.
 * The function is fire and forget and does not require callback.
 */
async function genericCreate(endpoint, dto) {
  axios
    .post(`${config.server.uri}${endpoint}/${dto.id}`, dto, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("[EDIT][" + endpoint + "]: RESPONSE OK: ", response.data);
      toast.success(dto.name + " created successfully!");
    })
    .catch((error) => {
      console.log("[EDIT][" + endpoint + "]: RESPONSE ERROR: " + error);
      toast.error(
        `Unable to create ${dto.name}. Try again, or check your internet connection!`
      );
    });
}
