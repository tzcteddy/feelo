import {addParams} from './share'

export function createDownload(href:string,download:any){
  let downA = document.createElement('a')
  downA.href = href //
  downA.download = download//decodeURIComponent(filename)
  downA.click()
}

export function downloadBlob(blobData:Blob, filename:string) {
  let blob = blobData
  window.URL = window.URL || window.webkitURL
  let href = URL.createObjectURL(blob)
  createDownload(href,decodeURIComponent(filename))
  window.URL.revokeObjectURL(href)
}

export function downloadGet(url:string,params:object):void{
  const downurl = addParams(url, params)
  createDownload(downurl,true)
}

export async function downloadPost(blob:Blob,headers:Headers){
  const fileName:string = (headers as Headers).get('content-disposition')?.split('filename=')[1]||''
  downloadBlob(blob, fileName)
}