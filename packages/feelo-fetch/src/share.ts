export function addParams(url: string, params: BodyParams): string {
  if (params) {
    const values: string[] = [];
    Object.keys(params).forEach((name) => {
      if (params[name] != null) {
        values.push(name + "=" + params[name]);
      }
    });
    url += (url.includes("?") ? "&" : "?") + values.join("&");
  }
  return url;
}
export function padStartApi (geteway='',url:string):string  {
  if (!url || typeof url !== 'string') {
    throw new TypeError(`The URL type must be a string`)
  }
  return geteway + url
}

export function merge(){}