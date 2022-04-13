declare type Method = "post" | "get" | "delete" | "put";

declare type FetchInput = USVString | Request;
declare interface FetchConfig {
  signal?: AbortSignal;
  method?: Method;
  headers?: HeadersInit;
  body?: BodyInit ;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  mode?: RequestMode;
}
declare interface ResponseText {
  code: number;
  msg: string;
  [propName: string]: any;
}
declare interface ResponseError {
  [status: number]: ResponseText;
}
declare interface BodyParams extends Object {
  [index: string]: any;
}
declare interface FetchRequestOptions {
  //配置共用网关
  geteway: string;
  alert: () => void;
  //loading start hook
  loadingStart: () => void;
  //loading end hook
  loadingEnd: () => void;
  timeout: number;
}



declare interface ApiOptions {
  path: string;
  name: string;
  isRoot: boolean;
  method: Method;
  loading: boolean;
  config?: FetchConfig;
}
declare interface SymbolCache {
  [propName: symbol]: number;
}

declare interface ApiPathMap {
  [propName: string]: ApiOptions;
}