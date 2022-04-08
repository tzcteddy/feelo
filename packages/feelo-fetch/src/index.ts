import {FetchRequest,} from './fetch'
export {exceptionError} from './catchError'
export function createFetchRequest(options: FetchRequestOptions) {
  return new FetchRequest(options)
}
