import { downloadGet, downloadPost } from "./download";
import { parseText, parseBlob } from "./parse";
import { addParams, padStartApi } from "./share";

class FetchHttp {
  signal:AbortSignal|unknown
  controller:AbortController|unknown
  constructor() {
    this.controller=new AbortController()
    this.signal=(this.controller as AbortController).signal
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
  async fetch(url: string,config:FetchConfig){
    const response =await fetch(url, config)
    if(response.status!==200){
      throw response
    }
    return response
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
  abort(){
    (this.controller as AbortController).abort()
  }
}

export class FetchRequest extends FetchHttp {
  geteway: string;
  isLoading: boolean = false;
  _timeout:number=0;
  alert: () => void;
  _loadingStart: () => void;
  _loadingEnd: () => void;
  constructor(options: FetchHttpOptions) {
    super();
    this.geteway = options.geteway;
    this.alert = options.alert;
    this._loadingStart = options.loadingEnd;
    this._loadingEnd = options.loadingEnd;
  }
  loadingStart() {
    if (this.isLoading) return;
    this.isLoading = true;
    this._loadingStart();
  }
  loadingEnd() {
    this._loadingEnd();
  }
  private async _fetch(url: string, body: BodyParams, method: Method, config?: any) {
    const methods = ["get", "post", "put", "delete"];
    if (!methods.includes(method)) {
      throw new Error(`Invalid method,please use ${methods.join(",")}`);
    }
    //设置前缀
    const api = padStartApi(this.geteway, url);
    const response = await this[method](api, body);
    return response;
  }
  private async _startLoding(url: string, body: BodyParams, method: Method, config?: any) {
    if (!this.isLoading) {
      this.loadingStart();
      this.isLoading = true;
    }
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

function timeout(timer:number){
  return new Promise((resolve, reject) => {
    setTimeout(() =>{
      const response: Response = new Response("timeout", { status: 504, statusText: "timeout" });
      resolve(response)
    },timer)
  })
}
async function timeoutWrapper(timer:number){
  await Promise.race([timeout(3000)])
}

