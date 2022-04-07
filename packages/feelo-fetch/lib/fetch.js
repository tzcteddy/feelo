var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { downloadGet, downloadPost } from "./download";
import { parseText, parseBlob } from "./parse";
import { addParams, padStartApi } from "./share";
import { exceptionError } from "./catchError";
class FetchHttp {
    constructor(options) {
        this.timeout = 0 || options.timeout;
        this.controller = new AbortController();
        this.signal = this.controller.signal;
    }
    setConfig(body, method) {
        const config = {
            method,
            credentials: "same-origin",
            cache: "reload",
        };
        if (body && body instanceof FormData)
            return config;
        if (typeof body === "object" && /post|put/i.test(method)) {
            config.body = JSON.stringify(body);
            config.headers = { "Content-Type": "application/json" };
        }
        if (typeof body === "string") {
            config.headers = { "Content-Type": "application/x-www-form-urlencoded" };
        }
        return config;
    }
    fetch(url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            const configData = Object.assign(Object.assign({}, config), { signal: this.signal });
            if (this.timeout > 0) {
                response = yield this.timeoutWrapper(() => __awaiter(this, void 0, void 0, function* () {
                    return yield fetch(url, configData);
                }));
            }
            else {
                response = yield fetch(url, configData);
            }
            if (response.status !== 200) {
                this.abort();
                throw response;
            }
            return response;
        });
    }
    get(url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.setConfig(body, "get");
            const response = yield this.fetch(addParams(url, body), config);
            return response;
        });
    }
    post(url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.setConfig(body, "post");
            const response = yield this.fetch(url, config);
            return response;
        });
    }
    put(url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.setConfig(body, "put");
            const response = yield this.fetch(url, config);
            return response;
        });
    }
    delete(url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.setConfig(body, "delete");
            const response = yield this.fetch(url, config);
            return response;
        });
    }
    abort() {
        this.controller.abort();
    }
    timeoutFn() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const response = new Response("timeout", { status: 504, statusText: "timeout" });
                    resolve(response);
                }, this.timeout);
            });
        });
    }
    timeoutWrapper(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Promise.race([this.timeoutFn(), fn()]);
        });
    }
}
export class FetchRequest extends FetchHttp {
    constructor(options) {
        super({ timeout: options.timeout });
        this.lodingApiQueue = [];
        this.isLoading = false;
        this._timeout = 0;
        this.geteway = options.geteway;
        this.alert = options.alert;
        this._loadingStart = options.loadingStart;
        this._loadingEnd = options.loadingEnd;
        this._timeout = options.timeout;
    }
    loadingStart(url, body) {
        this.lodingApiQueue.push(url);
        if (this.isLoading && this.lodingApiQueue.length > 0)
            return;
        this.isLoading = true;
        this._loadingStart();
    }
    loadingEnd() {
        if (this.isLoading && this.lodingApiQueue.length > 0) {
            this.lodingApiQueue.length--;
            return;
        }
        ;
        this._loadingEnd();
    }
    _fetch(url, body, method, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const methods = ["get", "post", "put", "delete"];
            if (!methods.includes(method)) {
                throw new Error(`Invalid method,please use ${methods.join(",")}`);
            }
            try {
                const api = padStartApi(this.geteway, url);
                const fetchHttp = new FetchHttp({ timeout: this._timeout });
                const response = yield fetchHttp[method](api, body);
                return response;
            }
            catch (responseError) {
                const responseData = exceptionError.getErrorRes(responseError.status);
                typeof this.alert === 'function' ? this.alert(responseData.msg) : window.alert(responseData.msg);
                this.loadingEnd();
                return new Response("error");
            }
        });
    }
    _startLoding(url, body, method, config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loadingStart(url, body);
            const response = yield this._fetch(url, body, method, config);
            this.loadingEnd();
            return response;
        });
    }
    request(url, body, method) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._fetch(url, body, method);
            const responseJson = yield parseText(response);
            return responseJson;
        });
    }
    requestLoading(url, body, method) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._startLoding(url, body, method);
            const responseJson = yield parseText(response);
            return responseJson;
        });
    }
    requestDownload(url, body, method, loading) {
        return __awaiter(this, void 0, void 0, function* () {
            if (method === "get") {
                downloadGet(url, body);
            }
            else {
                const response = loading
                    ? yield this._startLoding(url, body, "post")
                    : yield this._fetch(url, body, "post");
                const header = response.headers;
                const blob = yield parseBlob(response);
                downloadPost(blob, header);
            }
        });
    }
}
