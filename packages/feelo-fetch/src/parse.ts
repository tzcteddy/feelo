export async function parseText(response:Response){
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    const div = document.createElement("div");
    div.innerHTML = text;
    const script = div.querySelector("script");
    if (script) {
      Function(script.innerText)(); // 执行页面脚本，如果session失效，则会跳转到登录页面或者session失效提示页面
    }
    return response;
  }
}
export async function parseBlob(response:Response){
  return await response.blob();
}