import config from  '../resources/config';
import axios from "axios";
import { toast } from "material-react-toastify";
import { processCallback } from "../utils/RestUtil";

export default class RestClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  /**
   * Makes a get request to fetch resource from the back-end.
   *
   * @param endpoint for the back-end
   * @returns dto, or error if the operation failed
   * 
   * @example
   * restClient.genericFetch().then((data) => {
   *  // this.setState(data);
   * });
   * 
   */
  async genericFetch() {
    console.log("[API] Fetching " + this.endpoint);
    try {
    console.log('URI: ', config.server.uri);
      const response = await axios.get(config.server.uri + this.endpoint);
      if (response.data !== "") {
        console.log("[FETCH][" + this.endpoint + "] Response OK");
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
   * Generic Edit, serves all POST operations to the back-end for DTOs, 
   * which implements TransactionType Interface.
   * This function will fire toast depending on the operation output - success or fail.
   * 
   * @param dto - can be expense, unexpected etc
   * @param optional - notifySuccess, callback function which will be called if the operation pass
   * 
   * @example
   * // fire and forget
   * restClient.genericEdit(expense); 
   * 
   * // use lambda to consume success response
   * restClient.genericEdit(expense, () => {
   *  // update expense state
   *  // update something depending on the state
   * });
   * 
   */
  async genericEdit(dto, notifySuccess) {
    axios.put(`${config.server.uri}${this.endpoint}/${dto.id}`, dto, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("[EDIT][" + this.endpoint + "]: RESPONSE OK: ", response.data);
        toast.success(dto.name + " edited successfully!");
        processCallback(notifySuccess);
      })
      .catch((error) => {
        console.log("[EDIT][" + this.endpoint + "]: RESPONSE ERROR: " + error);
        toast.error(`Unable to edit ${dto.name}. Try again, or check your internet connection!`);
      });
  }


  /**
   * Generic Create, serves all POST operations to the back-end for DTOs, 
   * which implements TransactionType Interface.
   * This function will fire toast depending on the operation output - success or fail.
   * 
   * @param dto - can be expense, unexpected etc
   * @param optional - notifySuccess, callback function which will be called if the operation pass
   * 
   * @example
   * // fire and forget
   * restClient.genericCreate(expense); 
   * 
   * // use lambda to consume success response
   * restClient.genericCreate(expense, () => {
   *  // update expense state
   *  // update something depending on the state
   * });
   * 
   */
  async genericCreate(dto, notifySuccess) {
    axios
      .post(`${config.server.uri}${this.endpoint}`, dto, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("[POST][" + this.endpoint + "]: RESPONSE OK: ", response.data);
        toast.success(dto.name + " created successfully!");
        processCallback(notifySuccess);
      })
      .catch((error) => {
        console.log("[POST][" + this.endpoint + "]: RESPONSE ERROR: " + error);
        toast.error(`Unable to create ${dto.name}. Try again, or check your internet connection!`);
      });
  }

  /**
   * Generic Delete, serves all POST operations to the back-end for DTOs, 
   * which implements TransactionType Interface.
   * This function will fire toast depending on the operation output - success or fail.
   * 
   * @param dto - can be expense, unexpected etc
   * @param optional notifySuccess, a callback function which will be called if the operation pass
   * 
   * @example
   * // fire and forget
   * restClient.genericDelete(expense); 
   * 
   * // use lambda to consume success response
   * restClient.genericDelete(expense, () => {
   *  // update expense state
   *  // update something depending on the state
   * });
   * 
   */
  async genericDelete(dto, notifySuccess) {
    axios
      .delete(`${config.server.uri}${this.endpoint}/${dto.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("[DELETE][" + this.endpoint + "]: RESPONSE OK: ", response.data);
        toast.success(dto.name + " deleted successfully!");
        processCallback(notifySuccess);
      })
      .catch((error) => {
        console.log("[DELETE][" + this.endpoint + "]: RESPONSE ERROR: " + error);
        toast.error(`Unable to delete ${dto.name}. Try again, or check your internet connection!`);
      });
  }
}