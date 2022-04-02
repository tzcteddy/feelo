import {addParams} from './share'

export function createDown(href:string,download:any){
  let downA = document.createElement('a')
  downA.href = href //
  downA.download = download//decodeURIComponent(filename)
  downA.click()
}

export function downloadBlob(blobData:Blob, filename:string) {
  let blob = blobData
  window.URL = window.URL || window.webkitURL
  let href = URL.createObjectURL(blob)
  createDown(href,decodeURIComponent(filename))
  window.URL.revokeObjectURL(href)
}

export function downloadGet(url:string,params:object):void{
  const downurl = addParams(url, params)
  createDown(downurl,true)
}

export async function downloadPost(blob:Blob,headers:Headers){
  const fileName:string = (headers as Headers).get('content-disposition')?.split('filename=')[1]||''
  downloadBlob(blob, fileName)
}