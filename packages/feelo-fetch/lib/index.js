import { FetchRequest, } from './fetch';
export { exceptionError } from './catchError';
export function createFetchRequest(options) {
    return new FetchRequest(options);
}
