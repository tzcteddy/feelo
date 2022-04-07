
declare type Method='post'|'get'|'delete'|'put'

declare interface FetchConfig{
  signal?:AbortSignal,
  method?:Method,
  headers?:HeadersInit,
  body?:BodyInit,
  credentials?:RequestCredentials,
  cache?:RequestCache
  mode?:RequestMode,
}
declare interface ResponseText{
  code:number,
  msg:string,
  [propName: string]: any;
}
declare interface BodyParams extends Object {
  [index: string]: any;
}
declare interface FetchHttpOptions {
  //配置共用网关
  geteway: string;
  alert: () => void;
  //loading start hook
  loadingStart: () => void;
  //loading end hook
  loadingEnd: () => void;
  timeout:number;
}