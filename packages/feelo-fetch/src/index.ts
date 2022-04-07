import {FetchRequest,} from './fetch'
export {exceptionError, ResponseData} from './catchError'
export function createFetchRequest(options: FetchHttpOptions) {
  return new FetchRequest(options)
}
