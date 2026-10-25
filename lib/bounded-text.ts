export async function readBoundedText(message:Request|Response,maxBytes:number){
  if(Number(message.headers.get('content-length'))>maxBytes)throw new Error('BODY_TOO_LARGE');
  if(!message.body)return '';
  const reader=message.body.getReader();const chunks:Uint8Array[]=[];let length=0;
  try{while(true){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>maxBytes){await reader.cancel();throw new Error('BODY_TOO_LARGE');}chunks.push(value);}}
  finally{reader.releaseLock();}
  const body=new Uint8Array(length);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.byteLength;}
  return new TextDecoder().decode(body);
}
