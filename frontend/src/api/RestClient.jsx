import config from "../resources/config.json";
import axios from "axios";

export function getCostAnalytic() {
   return genericFetch(config.api.costAnalyticEndpoint);
}

export function getIncomes() {
  return genericFetch(config.api.incomesEndpoint);
}

export function getExpenses() {
  return genericFetch(config.api.expensesEndpoint);
}

export function getUnexpected() {
  return genericFetch(config.api.unexpectedEndpoint);
}

async function genericFetch(endpoint){
  console.log("[API] Fetching " + endpoint);
  try {
    const response = await axios.get(config.server.uri + endpoint);
    if (response.data !== "") {
      console.log("[FETCH]["+ endpoint +"] Response OK");
      console.log("Data: " + JSON.stringify(response.data));
      return response.data;
    } else {
      console.log("Something is wrong");
      return "error";
    }
  } catch (err) {
    console.log("Something is wrong: " + err);
    return "error";
  }
}