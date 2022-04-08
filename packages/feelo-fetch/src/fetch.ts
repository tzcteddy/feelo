import { downloadGet, downloadPost } from "./download";
import { parseText, parseBlob } from "./parse";
import { addParams, padStartApi } from "./share";
import { exceptionError } from "./catchError";

interface FetchHttpOptions {
  timeout: number;
}
class FetchHttp {
  timeout: number;
  signal: AbortSignal;
  controller: AbortController;
  constructor(options: FetchHttpOptions) {
    this.timeout = options.timeout || 0;
    this.controller = new AbortController();
    this.signal = this.controller.signal;
  }
  setConfig(body: BodyParams, method: Method): FetchConfig {
    const config: FetchConfig = {
      method,
      credentials: "same-origin",
      cache: "reload",
    };
    if (body && body instanceof FormData) return { ...config, body };
    if (typeof body === "object" && /post|put/i.test(method)) {
      config.body = JSON.stringify(body);
      config.headers = { "Content-Type": "application/json" };
    }
    if (typeof body === "string") {
      config.headers = { "Content-Type": "application/x-www-form-urlencoded" };
    }
    return config;
  }
  private async fetch(url: FetchInput, config: FetchConfig) {
    // fetch API: https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
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
  async get(url: FetchInput, body: BodyParams) {
    const config: FetchConfig = this.setConfig(body, "get");
    const response = await this.fetch(addParams(url, body), config);
    return response;
  }
  async post(url: FetchInput, body: BodyParams) {
    const config: FetchConfig = this.setConfig(body, "post");
    const response = await this.fetch(url, config);
    return response;
  }
  async put(url: FetchInput, body: BodyParams) {
    const config: FetchConfig = this.setConfig(body, "put");
    const response = await this.fetch(url, config);
    return response;
  }
  async delete(url: FetchInput, body: BodyParams) {
    const config: FetchConfig = this.setConfig(body, "delete");
    const response = await this.fetch(url, config);
    return response;
  }
  abort() {
    this.controller.abort();
  }
  async timeoutWrapper(fn: Function) {
    async function timeoutFn(timeout: number) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const response: Response = new Response("timeout", { status: 504, statusText: "timeout" });
          resolve(response);
        }, timeout);
      });
    }

    return await Promise.race([timeoutFn(this.timeout), fn()]);
  }
}

export class FetchRequest {
  lodingApiQueue: Array<string> = [];
  geteway: string;
  isLoading: boolean = false;
  _timeout: number = 0;
  _loadingStart: () => void;
  _loadingEnd: () => void;
  _alert: (msg: string) => void;
  constructor(options: FetchRequestOptions) {
    this.geteway = options.geteway;
    this._alert = options.alert;
    this._loadingStart = options.loadingStart;
    this._loadingEnd = options.loadingEnd;
    this._timeout = options.timeout;
  }
  loadingStart(url: string, body: BodyParams) {
    this.lodingApiQueue.push(url);
    if (this.isLoading && this.lodingApiQueue.length > 0) return;
    this.isLoading = true;
    this._loadingStart();
  }
  loadingEnd() {
    this.lodingApiQueue.pop();
    if (this.isLoading && this.lodingApiQueue.length > 0) {
      return;
    }
    this._loadingEnd();
    this.isLoading = false;
  }
  alert(msg: string) {
    typeof this._alert === "function" ? this._alert(msg) : window.alert(msg);
  }
  private async _fetch(url: string, body: BodyParams, method: Method, config?: any) {
    const methods = ["get", "post", "put", "delete"];
    if (!methods.includes(method)) {
      throw new Error(`Invalid method,please use ${methods.join(",")}`);
    }
    try {
      const apiUrl = padStartApi(this.geteway, url);
      const fetchHttp = new FetchHttp({ timeout: this._timeout });
      const response = await fetchHttp[method](apiUrl, body);
      return response;
    } catch (responseError) {
      const responseData: ResponseText = exceptionError.getErrorRes((responseError as Response).status);
      this.alert(responseData.msg);
      this.loadingEnd();
      throw new Error(responseData.msg);
    }
  }
  private async _startLoding(url: string, body: BodyParams, method: Method, config?: any) {
    this.loadingStart(url, body);
    const response = await this._fetch(url, body, method, config);
    this.loadingEnd();
    return response;
  }

  public async request(url: string, body: BodyParams, method: Method, loading?: boolean) {
    if (loading) {
      return await this.requestLoading(url, body, method);
    }
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
