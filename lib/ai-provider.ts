export type AIProvider={provider:'azure'|'openai';key:string;model:string;url:string;label:string};
export function resolveAIProvider(secrets:Record<string,string|undefined>):AIProvider|null {
  if(secrets.AZURE_OPENAI_API_KEY){
    try{
      const url=new URL(secrets.AZURE_OPENAI_RESPONSES_URL||'');
      if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||!/(^|\.)(services\.ai\.azure\.com|openai\.azure\.com)$/.test(url.hostname)||url.pathname!=='/openai/v1/responses'||!secrets.AZURE_OPENAI_DEPLOYMENT)return null;
      return {provider:'azure',key:secrets.AZURE_OPENAI_API_KEY,model:secrets.AZURE_OPENAI_DEPLOYMENT,url:url.href,label:secrets.AZURE_OPENAI_DEPLOYMENT.startsWith('gpt-6-luna')?'Azure · GPT-6 Luna':'Azure OpenAI'};
    }catch{return null;}
  }
  return secrets.OPENAI_API_KEY?{provider:'openai',key:secrets.OPENAI_API_KEY,model:secrets.OPENAI_MODEL||'gpt-4.1-mini',url:'https://api.openai.com/v1/responses',label:'OpenAI'}:null;
}
export function providerHeaders(config:AIProvider):Record<string,string>{
  return {'Content-Type':'application/json',...(config.provider==='azure'?{'api-key':config.key}:{Authorization:`Bearer ${config.key}`})};
}
