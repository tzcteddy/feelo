


import {createFetchRequest} from '@ij/fetch'
const fetchRequest=createFetchRequest({
  getawy:'',
  loadingStart(){},
  laodingEnd(){},
  timeout:3000,
})
export function request(url,body,method,{
  headers:{},
  retry:2,
  throttle:false
}){
  return fetchRequest.request(url,body,method).retry(2)
}
export function requestLoading(url,body,method){
  return fetchRequest.requestLoading(url,body,method).norepeat()
}
export function requestDownload(url,body,method){
  return fetchRequest.requestDownload(url,body,method).timeout(3000)
}


