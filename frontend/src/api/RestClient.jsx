import config from "../resources/config.json";
import axios from "axios";
import { toast } from "material-react-toastify";

export default class RestClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  /**
   * Makes a get request to fetch resource from the back-end.
   *
   * @param endpoint for the back-end
   * @returns dto, or error if the operation failed
   */
  async genericFetch() {
    console.log("[API] Fetching " + this.endpoint);
    try {
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
 * Generic Edit serves all PUT operations to the back-end for DTOs, which implements TransactionType Interface.
 * The function is fire and forget and does not require callback.
 */
  async genericEdit(dto) {
    axios.put(`${config.server.uri}${this.endpoint}/${dto.id}`, dto, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("[EDIT][" + this.endpoint + "]: RESPONSE OK: ", response.data);
        toast.success(dto.name + " edited successfully!");
      })
      .catch((error) => {
        console.log("[EDIT][" + this.endpoint + "]: RESPONSE ERROR: " + error);
        toast.error(`Unable to edit ${dto.name}. Try again, or check your internet connection!`);
      });
  }

  /**
   * Generic Create, serves all POST operations to the back-end for DTOs, which implements TransactionType Interface.
   * The function is fire and forget and does not require callback.
   */
  async genericCreate(dto) {
    axios
      .post(`${config.server.uri}${this.endpoint}`, dto, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("[POST][" + this.endpoint + "]: RESPONSE OK: ", response.data);
        toast.success(dto.name + " created successfully!");
      })
      .catch((error) => {
        console.log("[POST][" + this.endpoint + "]: RESPONSE ERROR: " + error);
        toast.error(`Unable to create ${dto.name}. Try again, or check your internet connection!`);
      });
  }

  /**
   * Generic Delete, serves all DELETE operations to the back-end for DTOs, which implements TransactionType Interface.
   * The function is fire and forget and does not require callback.
   */
  async genericDelete(dto) {
    axios
      .delete(`${config.server.uri}${this.endpoint}/${dto.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("[DELETE][" + this.endpoint + "]: RESPONSE OK: ", response.data);
        toast.success(dto.name + " deleted successfully!");
      })
      .catch((error) => {
        console.log("[DELETE][" + this.endpoint + "]: RESPONSE ERROR: " + error);
        toast.error(`Unable to delete ${dto.name}. Try again, or check your internet connection!`);
      });
  }
}