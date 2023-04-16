import { toast } from "material-react-toastify";

export function processCallback(notifySuccess) {
    if(notifySuccess !== undefined) {
        try {
         notifySuccess();
        } catch (error) {
         toast.error(`Internal error. Please contact devs: ${error}`);
        }
     }
}