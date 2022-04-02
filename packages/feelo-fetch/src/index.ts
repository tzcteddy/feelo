import {FetchRequest} from './fetch'

export function createFetchRequest(options: FetchHttpOptions) {
  return new FetchRequest(options)
}