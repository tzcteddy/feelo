import { FetchRequest } from "./fetch";
import { registryApi as registry, getApiPath } from "./apiManager";

export { exceptionError } from "./catchError";

let instance: FetchRequest;

export function createFetchRequest(options: FetchRequestOptions) {
  instance = new FetchRequest(options);
  return instance;
}


export const registryApi = (options: ApiOptions) => {
  options.method= options.method||'get'
  registry(options);
  return async (params: BodyParams) => {
    const { path, name, isRoot, method, loading, config } = options;
    if (!instance) throw new Error("不能在实例化之前调用");
    let response: ResponseText=await instance.request(path, params, method,loading);
    return isRoot ? response : response.data;
  };
};
