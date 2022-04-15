import { addParams } from "./share";
/**
 * Fetch
 * 封装fetch方法。添加控制器
 * **/
export class Fetch {
  signal: AbortSignal;
  controller: AbortController;
  constructor() {
    this.controller = new AbortController();
    this.signal = this.controller.signal;
  }
  fetch(input: RequestInfo, init: RequestInit) {
    return fetch(input, { ...init, signal: this.signal });
  }
  abort(){
    this.controller.abort()
  }
}

interface FeeloRequestInit extends RequestInit {
  timeout?: number;
  url: RequestInfo;
  [propName: string]: any;
}

function timeoutFn(timeout: number = 0): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response: Response = new Response("timeout", { status: 504, statusText: "timeout" });
      resolve(response);
    }, timeout);
  });
}

/**拦截器管理类
 * **/
 export class InterceptorManager<T> {
  interceptors: Array<any> = [];
  use(fn: (config: T, fetchRequest?: Fetch) => T) {
    this.interceptors.push(fn);
  }
  async run(config: T, fetchRequest?: Fetch): Promise<T> {
    if (!this.interceptors.length) return config;
    return this.interceptors.reduce(async (config, fn) => {
      try{
        const result = await fn(config, fetchRequest);
      return result;
      }catch(err){
        throw err
      }
    }, config);
  }
}

export class FeeloFetch {
  constructor() {}
  request = new InterceptorManager<FeeloRequestInit>();
  response = new InterceptorManager<Response>();
  async requestFetch(input: RequestInfo, options: FeeloRequestInit): Promise<Response> {
    if (!options.method) {
      options.method = "get";
    }
    if (options.method === "get") {
      input = addParams(input, options.body as BodyParams);
      options.body = null;
    }
    //实例化
    const fetchRequest = new Fetch();
    //执行请求拦截
    const init = await this.request.run(options, fetchRequest);
    //发起请求
    const promises = [fetchRequest.fetch(input, init)];
    if (!!init.timeout && init.timeout > 0) {
      promises.push(timeoutFn(init.timeout));
    }
    const response = await Promise.race(promises);
    //执行响应拦截
    const result = await this.response.run(response,fetchRequest);
    return result;
  }
}
