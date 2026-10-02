export const RESIDENT_SCHEMA = JSON.stringify({type:'object',properties:{astra:{type:'string'},nemi:{type:'string'}},required:['astra','nemi'],additionalProperties:false});
export function parseResidentOutput(raw: string): [string, string] {
  const text = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
  let astra: string | undefined, nemi: string | undefined;
  try { const value = JSON.parse(text); astra = typeof value.astra === 'string' ? value.astra : undefined; nemi = typeof value.nemi === 'string' ? value.nemi : undefined; } catch {
    // Handle old-style or malformed model outputs without merging speakers.
    const parts = [...text.matchAll(/\b(Astra|Nemi)\s*:\s*([\s\S]*?)(?=\b(?:Astra|Nemi)\s*:|$)/gi)];
    astra = parts.find(part => part[1].toLowerCase() === 'astra')?.[2];
    nemi = parts.find(part => part[1].toLowerCase() === 'nemi')?.[2];
  }
  const clean = (value: string | undefined, own: string) => value?.replace(new RegExp('^\\s*'+own+'\\s*:\\s*','i'),'').split(/\b(?:Astra|Nemi)\s*:/i)[0].trim().slice(0,240);
  const a = clean(astra, 'Astra'), n = clean(nemi, 'Nemi');
  if (!a || !n) throw new Error('Incomplete resident dialogue');
  return [a,n];
}
