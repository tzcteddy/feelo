class ApiManager{
  apiPathCollection={
    type:{
      path:'',
      isRoot:false,
      method:'post',
      loading:true,
      config:{}
    }
  }
  registry(type:string,content:Object){}
  getApiPath(){}
}
//单例模式 管理api
function createApiManager(){
  
}


//use
const apiManager = new ApiManager();
apiManager.registry('getUser',{
  path:'/',
  method:'post',
})
apiManager.registry('getUser',{
  path:'/',
  method:'post',
})

const template=`
export async function type(params){\n 
  const result = await request(url,params,method,loading,config)
  return result.data
}
`
const templateRoot=`
export async function type(params){\n 
  const result = await request(url,params,method,loading,config)
  return result
}
`


