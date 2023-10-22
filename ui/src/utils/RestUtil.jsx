import { toast } from "material-react-toastify";

export function embedPathVariables(pathVariables, endpoint) {
    if (!pathVariables) {
        return endpoint;
    }
    let path = ""
    if (Array.isArray(pathVariables)) {
        pathVariables.forEach(pathVar => (path = path + '/' + pathVar));
    } else {
        path = path + '/' + pathVariables;
    }

    return endpoint + path;
}

export function processCallback(notifySuccess, modifiedObject) {
    if (notifySuccess !== undefined) {
        try {
            notifySuccess(modifiedObject);
        } catch (error) {
            toast.error(`Internal error. Please contact devs: ${error}`);
        }
    }
}