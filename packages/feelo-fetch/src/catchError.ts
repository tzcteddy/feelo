export interface ResponseData{
  code:number,
  msg:string, 
  [propName:string]:any
}
interface ResponseError{
  [status:number]:ResponseData
}
class Exception{
  errorCache:ResponseError={
    204:{
      code: 30004,
      msg: `操作过于频繁, 请稍后再试 - 204`,
    },
    500:{
      code: 500,
      msg: `服务器开小差了, 请稍后再试 -  500`,
    },
    504:{
      code:504, 
      msg:'请求超时'
    }
  }
  setErrorRes(status:number,errorRes:ResponseData):void{
    // if(this.errorCache[status]){
    //   throw new Error(`The current status [${status}] already exists`)
    // }
    this.errorCache[status] = errorRes
  }
  getErrorRes(status:number):ResponseData{
    return this.errorCache[status]
  }
}

export const exceptionError=new Exception()

