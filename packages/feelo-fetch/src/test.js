function timeout(timer){
  return new Promise((resolve, reject) => {
    setTimeout(() =>{
      const response ={ status: 504, statusText: "timeout" }// new Response("timeout", { status: 504, statusText: "timeout" });
      resolve(response)
    },timer)
  })
}
function timeout2(){
  return new Promise((resolve, reject) => {
    setTimeout(() =>{
      const response ={ status: 504, statusText: "timeout" }// new Response("timeout", { status: 504, statusText: "timeout" });
      resolve(333)
    },500)
  })
}
async function timeoutWrapper(timer){
 const res= await Promise.race([timeout(timer),timeout2()])
 console.log(res)
}
timeoutWrapper(1000)