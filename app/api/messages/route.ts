import {NextResponse} from 'next/server';
export const runtime='nodejs';
const response=(value:object,status:number)=>NextResponse.json(value,{status,headers:{'Cache-Control':'no-store'}});
const windows=new Map<string,{count:number;until:number}>();
const maximum=12000;
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 if(!origin||origin!==new URL(request.url).origin)return response({error:'Please send your message from this website.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return response({error:'Invalid message format.'},415);
 const length=Number(request.headers.get('content-length')||0);
 if(length>80000)return response({error:'This message is too long.'},413);
 const reader=request.body?.getReader();if(!reader)return response({error:'Please write a message.'},400);
 const chunks:Uint8Array[]=[];let bytes=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>80000){await reader.cancel();return response({error:'This message is too long.'},413);}chunks.push(value);}}catch{return response({error:'The message could not be read.'},400);}
 let data;try{data=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{return response({error:'Invalid message format.'},400);}
 if(!data||typeof data!=='object'||Array.isArray(data))return response({error:'Invalid message format.'},400);
 if(data.website)return response({error:'Your message could not be sent.'},400);
 const {title,body,name}=data;
 if(typeof title!=='string'||!title.trim()||title.length>120||typeof body!=='string'||!body.trim()||body.length>maximum||(name!==undefined&&(typeof name!=='string'||name.length>80)))return response({error:'Please enter a subject (up to 120 characters) and a message (up to 12,000 characters).'},400);
 const token=process.env.MESSAGES_GITHUB_TOKEN;const repo=process.env.MESSAGES_GITHUB_REPO;
 if(!token||!repo||!/^Lawson-Dong\/[A-Za-z0-9_.-]+$/.test(repo))return response({error:'The private inbox is not connected yet. Your message has not been sent; please keep your text and try again later.'},503);
 const key=request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 const now=Date.now();for(const [k,v] of windows)if(v.until<=now)windows.delete(k);
 const entry=windows.get(key);if(entry&&entry.count>=5)return response({error:'Please wait a few minutes before sending another message.'},429);
 if(windows.size>10000)return response({error:'The inbox is busy. Please try again shortly.'},429);
 windows.set(key,{count:(entry?.count||0)+1,until:entry?.until||now+10*60*1000});
 const headers={Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'};
 try{
  const check=await fetch(`https://api.github.com/repos/${repo}`,{headers,cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!check.ok)return response({error:'The private inbox is temporarily unavailable. Your message has not been sent.'},503);
  const info=await check.json();
  if(info.private!==true||info.archived||info.has_issues!==true)return response({error:'The private inbox is temporarily unavailable. Your message has not been sent.'},503);
  const sender=(name?.trim()||'Anonymous').replace(/[\r\n]/g,' ');
  const result=await fetch(`https://api.github.com/repos/${repo}/issues`,{method:'POST',headers,body:JSON.stringify({title:`Website message: ${title.trim().replace(/[\r\n]/g,' ')}`,body:`From: ${sender}\nReceived: ${new Date().toISOString()}\n\n---\n\n${body}`}),signal:AbortSignal.timeout(15000)});
  if(!result.ok)return response({error:'Your message could not be delivered. Please keep your text and try again later.'},502);
  return response({ok:true},201);
 }catch{return response({error:'Delivery could not be confirmed. Please keep your text and try again later.'},502);}
}
