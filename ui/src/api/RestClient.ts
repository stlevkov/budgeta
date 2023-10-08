import config from '../resources/config';
import axios from 'axios';
import { toast } from 'material-react-toastify';
import { processCallback, embedPathVariables } from '../utils/RestUtil';
import DocumentInfo from '../data/classes/DocumentInfo';


export default class RestClient {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

/**
 * Makes a get request to fetch a resource from the back-end.
 *
 * @param pathVariables - Array of variables for fetching the specific resource (e.g., `api/var/var/var...`).
 * @returns A promise that resolves to the requested data of type `T`, or an error if the operation fails.
 *
 * @example
 * // Fetch and set data of type `TypeClass[]` from the specified dashboard.
 *   this.restClient.genericFetch<DocumentInfo[]>([dashboard.id]).then((data) => {
 *       this.setState(data);
 *     }).catch((error) => {
 *       this.setState([]);
 *     });
 */
  async genericFetch<T>(pathVariables: any[]): Promise<T> {
    console.log("[API] Fetching " + this.endpoint + ", path vars: ", pathVariables);
    try {
      const uri = config.server.uri + embedPathVariables(pathVariables, this.endpoint);
      console.log('URI: ', uri);
      const response = await axios.get(uri);
      if (response.data !== "") {
        console.log("[FETCH][" + this.endpoint + "] Response OK");
        console.log("Data: " + JSON.stringify(response.data));
        return response.data as T;
      } else {
        console.log("Something is wrong");
        return Promise.reject("error");
      }
    } catch (err) {
      console.log("Something is wrong: " + err);
      return "error: " + err as T;
    }
  }
  

  /**
   * Generic Edit, serves all POST operations to the back-end for DTOs,
   * which implements DocumentInfo type.
   * This function will fire toast depending on the operation output - success or fail.
   *
   * @param dto - DocumentInfo object.
   * @param optional - notifySuccess, callback function which will be called if the operation passes.
   */
  async genericEdit(dto: DocumentInfo, notifySuccess?: () => void): Promise<void> {
    axios
      .put(`${config.server.uri}${this.endpoint}`, dto, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("[EDIT][" + this.endpoint + "]: RESPONSE OK: ", response.data);
        toast.success(dto.name + " edited successfully!");
        if (notifySuccess) {
          processCallback(notifySuccess);
        }
      })
      .catch((error) => {
        console.log("[EDIT][" + this.endpoint + "]: RESPONSE ERROR: " + error);
        toast.error(`Unable to edit ${dto.name}. Try again, or check your internet connection!`);
      });
  }

  /**
   * Generic Create, serves all POST operations to the back-end for DTOs,
   * which implements DocumentInfo type.
   * This function will fire toast depending on the operation output - success or fail.
   *
   * @param dto - DocumentInfo object.
   * @param optional - notifySuccess, callback function which will be called if the operation passes.
   */
  async genericCreate(dto: DocumentInfo, notifySuccess?: () => void): Promise<void> {
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
   * which implements DocumentInfo type.
   * This function will fire toast depending on the operation output - success or fail.
   *
   * @param dto - DocumentInfo object.
   * @param optional notifySuccess, a callback function which will be called if the operation passes.
   */
  async genericDelete(dto: DocumentInfo, notifySuccess?: () => void): Promise<void> {
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
