const apiPathMap: ApiPathMap = {};
const duplicatedCache: SymbolCache = {};
export const registryApi = (
  options: ApiOptions = {
    path: "",
    name: "",
    method: "get",
    isRoot: false,
    loading: true,
  }
) => {
  const { path, name } = options;

  if (!path) throw new Error(`The PATH field cannot be empty `);
  if (!name) options.name = path.substring(path.lastIndexOf("/") + 1);
  duplicated(path, duplicatedCache);
  duplicated(options.name, duplicatedCache);
  apiPathMap[options.name] = options;
};
export const getApiPath = (name: string) => {
  return apiPathMap[name].path;
};



function duplicated(key: string, cache: SymbolCache) {
  const rid = Symbol.for(key);
  if (Object.getOwnPropertySymbols(cache).includes(rid)) {
    console.warn(`${key.indexOf("/") >= 0 ? "path" : "name"} '${key}' 重复, 请重新定义`);
  } else {
    cache[rid] = 1;
  }
}
