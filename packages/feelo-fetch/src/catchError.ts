async function parseResponse(response:Response){
  if(response.status!==200){
    throw response
  }
  return response
}
 
 function catchError(){
  return async (response:Response)=>{
      try{
        return await parseResponse(response)
      }catch(error){
        // ErrorMessage(error)
        throw error 
      }
  }
}

interface ResponseData{
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
    }
  }
  setErrorRes(status:number,errorRes:ResponseData):void{
    if(this.errorCache[status]){
      throw new Error(`The current status [${status}] already exists`)
    }
    this.errorCache[status] = errorRes
  }
  getErrorRes(statue:number):ResponseData{
    return this.errorCache[statue]
  }
}

