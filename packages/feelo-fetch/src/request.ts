class Fetch {
  signal: AbortSignal;
  controller: AbortController;
  constructor() {
    this.controller = new AbortController();
    this.signal = this.controller.signal;
  }
  fetch(input: RequestInfo, init: RequestInit) {
    return fetch(input, { ...init, signal: this.signal });
  }
}

interface OptionsFetch extends RequestInit {
  timeout?: number;
  url: RequestInfo;
}

function timeoutFn(timeout: number = 0): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response: Response = new Response("timeout", { status: 504, statusText: "timeout" });
      resolve(response);
    }, timeout);
  });
}

class InterceptorManager<T> {
  interceptors: Array<any> = [];
  use(fn:(config:T)=>T) {
    this.interceptors.push(fn)
  }
  run(config: T): T {
   return this.interceptors.reduce(async (config,fn)=>{
      const result= await fn(config)
      return result
    },config)
  }
}

export class FeeloFetch {
  constructor() {}
  request = new InterceptorManager<OptionsFetch>();
  response = new InterceptorManager<Response>();
  async requestFetch(input: RequestInfo, options: OptionsFetch): Promise<Response> {
    if (!options.method) {
      options.method = "get";
    }
    const init = this.request.run(options);
    const fetchRequest = new Fetch();
    const promises = [fetchRequest.fetch(input, init)];
    if (!!options.timeout && options.timeout > 0) {
      promises.push(timeoutFn(options.timeout));
    }
    const response = await Promise.race(promises);
    const result=await this.response.run(response);
    return result
  }
  get() {}
  post() {}
}
