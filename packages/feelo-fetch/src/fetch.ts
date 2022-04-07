import { downloadGet, downloadPost } from "./download";
import { parseText, parseBlob } from "./parse";
import { addParams, padStartApi } from "./share";
import { exceptionError, ResponseData } from "./catchError";

interface FetchHttpOptionAPi {
  timeout: number;
}
class FetchHttp {
  timeout: number;
  signal: AbortSignal;
  controller: AbortController | unknown;
  constructor(options: FetchHttpOptionAPi) {
    this.timeout = 0 || options.timeout;
    this.controller = new AbortController();
    this.signal = (this.controller as AbortController).signal;
  }
  setConfig(body: BodyParams, method: Method): FetchConfig {
    const config: FetchConfig = {
      method,
      credentials: "same-origin",
      cache: "reload",
    };
    if (body && body instanceof FormData) return config;
    if (typeof body === "object" && /post|put/i.test(method)) {
      config.body = JSON.stringify(body);
      config.headers = { "Content-Type": "application/json" };
    }
    if (typeof body === "string") {
      config.headers = { "Content-Type": "application/x-www-form-urlencoded" };
    }
    return config;
  }
  async fetch(url: string, config: FetchConfig) {
    let response: Response;
    const configData: FetchConfig = { ...config, signal: this.signal };
    if (this.timeout > 0) {
      response = await this.timeoutWrapper(async () => {
        return await fetch(url, configData);
      });
    } else {
      response = await fetch(url, configData);
    }
    if (response.status !== 200) {
      this.abort();
      throw response;
    }
    return response;
  }
  async get(url: string, body: BodyParams) {
    const config: FetchConfig = this.setConfig(body, "get");
    const response = await this.fetch(addParams(url, body), config);
    return response;
  }
  async post(url: string, body: BodyParams) {
    const config: FetchConfig = this.setConfig(body, "post");
    const response = await this.fetch(url, config);
    return response;
  }
  async put(url: string, body: BodyParams) {
    const config: FetchConfig = this.setConfig(body, "put");
    const response = await this.fetch(url, config);
    return response;
  }
  async delete(url: string, body: BodyParams) {
    const config: FetchConfig = this.setConfig(body, "delete");
    const response = await this.fetch(url, config);
    return response;
  }
  abort() {
    (this.controller as AbortController).abort();
  }
  async timeoutFn() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const response: Response = new Response("timeout", { status: 504, statusText: "timeout" });
        resolve(response);
      }, this.timeout);
    });
  }
  async timeoutWrapper(fn: Function) {
    return await Promise.race([this.timeoutFn(), fn()]);
  }
}

export class FetchRequest extends FetchHttp {
  lodingApiQueue:Array<string>=[]
  geteway: string;
  isLoading: boolean = false;
  _timeout: number = 0;
  _loadingStart: () => void;
  _loadingEnd: () => void;
  alert: (msg: string) => void;
  constructor(options: FetchHttpOptions) {
    super({ timeout: options.timeout });
    this.geteway = options.geteway;
    this.alert = options.alert;
    this._loadingStart = options.loadingStart;
    this._loadingEnd = options.loadingEnd;
    this._timeout = options.timeout;
  }
  loadingStart(url:string,body:BodyParams) {
    this.lodingApiQueue.push(url)
    if (this.isLoading&&this.lodingApiQueue.length>0) return;
    this.isLoading = true;
    this._loadingStart();
  }
  loadingEnd() {
    if (this.isLoading&&this.lodingApiQueue.length>0) {
      this.lodingApiQueue.length--
      return
    };
    this._loadingEnd();
    this.isLoading=false
  }
  private async _fetch(url: string, body: BodyParams, method: Method, config?: any) {
    const methods = ["get", "post", "put", "delete"];
    if (!methods.includes(method)) {
      throw new Error(`Invalid method,please use ${methods.join(",")}`);
    }
    try {
      const api = padStartApi(this.geteway, url);
      const fetchHttp = new FetchHttp({ timeout: this._timeout });
      const response = await fetchHttp[method](api, body);
      return response;
    } catch (responseError) {
      const responseData: ResponseData = exceptionError.getErrorRes((responseError as Response).status);
      typeof this.alert === 'function'? this.alert(responseData.msg):window.alert(responseData.msg);
      this.loadingEnd();
      return new Response("error");
    }
  }
  private async _startLoding(url: string, body: BodyParams, method: Method, config?: any) {
    this.loadingStart(url,body);
    const response = await this._fetch(url, body, method, config);
    this.loadingEnd();
    return response;
  }

  public async request(url: string, body: BodyParams, method: Method) {
    const response = await this._fetch(url, body, method);
    const responseJson = await parseText(response);
    return responseJson;
  }
  public async requestLoading(url: string, body: BodyParams, method: Method) {
    const response = await this._startLoding(url, body, method);
    const responseJson = await parseText(response);
    return responseJson;
  }
  public async requestDownload(url: string, body: BodyParams, method: Method, loading: boolean) {
    if (method === "get") {
      downloadGet(url, body);
    } else {
      const response: Response = loading
        ? await this._startLoding(url, body, "post")
        : await this._fetch(url, body, "post");
      const header: Headers = response.headers;
      const blob: Blob = await parseBlob(response);
      downloadPost(blob, header);
    }
  }
}
