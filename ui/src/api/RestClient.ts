import config from '../resources/config';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'material-react-toastify';
import { processCallback, embedPathVariables } from '../utils/RestUtil';
import DocumentInfo from '../data/classes/DocumentInfo';

axios.defaults.withCredentials = true;

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
    console.log("[API][GET] Fetching " + this.endpoint + ", path vars: ", pathVariables);
    let response = {} as AxiosResponse;
    try {
      const uri = config.server.uriAPI + embedPathVariables(pathVariables, this.endpoint);
      console.log('[API][GET] URI: ', uri);
      response = await axios.get(uri, {withCredentials: true})
      console.log(`requestURL: ${uri}, responseURL: ${response.request.responseURL}`);
      if(response.request.responseURL != uri){
        window.location.href = config.server.frontendUri + "/login"; // TODO this is not the best routing in case not authenticated
        console.log(`Redirecting to Login. Reason: Url missmatch.`);
        return Promise.reject('redirected to login');
      }
      return this.validateResponse<T>(response);
    } catch (err) {
      console.log("[API][GET][" + this.endpoint + "] Something is wrong: ", err);
      return Promise.reject(err);
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
      .put(`${config.server.uriAPI}${this.endpoint}`, dto, {
        withCredentials: true,
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
        console.log("[EDIT][" + this.endpoint + "]: RESPONSE ERROR: " + error.response.data);
        toast.error(`Unable to edit ${dto.name}.Reason: ${error.response.data}!`);
      });
  }

  /**
   * Generic Create, serves all POST operations to the back-end for DTOs,
   * which implements DocumentInfo type.
   * This function will fire toast depending on the operation output - success or fail.
   *
   * @param dto - DocumentInfo object.
   * @param optional - notifySuccess, callback function which will be called if the operation passes
   * and providing the created object.
   */
  async genericCreate(dto: DocumentInfo | any, notifySuccess?: (dto: DocumentInfo) => void, pathVariables?: any[]): Promise<void> {
    const uri = config.server.uriAPI + embedPathVariables(pathVariables, this.endpoint);
    console.log("[POST][" + this.endpoint + "]: URI: ", uri);
    axios
      .post(uri, dto, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("[POST][" + this.endpoint + "]: RESPONSE OK: ", response.data);
        toast.success(dto.name + " created successfully!");
        processCallback(notifySuccess, response.data);
      })
      .catch((error) => {
        console.log("[POST][" + this.endpoint + "]: RESPONSE ERROR: ", error.response.data);
        toast.error(`Unable to create ${dto.name}.Reason: ${error.response.data}!`);
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
      .delete(`${config.server.uriAPI}${this.endpoint}/${dto.id}`, {
        withCredentials: true,
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

  validateResponse<T>(response: any): T {
    if (response.data !== "") {
      console.log("[FETCH][" + this.endpoint + "] Response OK");
      return response.data as T;
    } else {
      console.log("[FETCH][" + this.endpoint + "] Something is wrong");
      throw new Error(`Error: ${JSON.stringify(response)}`);
    }
  }
}
