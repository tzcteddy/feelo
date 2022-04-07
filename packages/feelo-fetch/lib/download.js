var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addParams } from './share';
export function createDown(href, download) {
    let downA = document.createElement('a');
    downA.href = href; //
    downA.download = download; //decodeURIComponent(filename)
    downA.click();
}
export function downloadBlob(blobData, filename) {
    let blob = blobData;
    window.URL = window.URL || window.webkitURL;
    let href = URL.createObjectURL(blob);
    createDown(href, decodeURIComponent(filename));
    window.URL.revokeObjectURL(href);
}
export function downloadGet(url, params) {
    const downurl = addParams(url, params);
    createDown(downurl, true);
}
export function downloadPost(blob, headers) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fileName = ((_a = headers.get('content-disposition')) === null || _a === void 0 ? void 0 : _a.split('filename=')[1]) || '';
        downloadBlob(blob, fileName);
    });
}
