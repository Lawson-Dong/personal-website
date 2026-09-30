export type Vec = [number, number];
export type Augmented = [number, number, number, number, number, number];
export const multiply = (m: Augmented, x: Vec): Vec => [m[0]*x[0]+m[1]*x[1], m[3]*x[0]+m[4]*x[1]];
export function solveColumns(m: Augmented) {
  const [a,b,p,c,d,q] = m;
  const scale = Math.max(Math.abs(a),Math.abs(b),Math.abs(c),Math.abs(d));
  if (scale === 0) return {rank:0, consistent:p===0 && q===0, x:[0,0] as Vec, projection:[0,0] as Vec};
  const [aa,bb,cc,dd] = [a,b,c,d].map(v=>v/scale);
  const det=aa*dd-bb*cc;
  if (Math.abs(det)>1e-10) {
    const x:Vec=[(dd*(p/scale)-bb*(q/scale))/det,(aa*(q/scale)-cc*(p/scale))/det];
    return {rank:2,consistent:true,x,projection:[p,q] as Vec};
  }
  const n1=Math.hypot(aa,cc), n2=Math.hypot(bb,dd);
  const u:Vec=n1>=n2?[aa/n1,cc/n1]:[bb/n2,dd/n2];
  const targetScale=Math.max(Math.abs(p),Math.abs(q));
  const pn=targetScale===0?0:p/targetScale, qn=targetScale===0?0:q/targetScale;
  const consistent=Math.abs(u[0]*qn-u[1]*pn)<=1e-10;
  const t=(u[0]*pn+u[1]*qn)*targetScale;
  const k1=u[0]*aa+u[1]*cc,k2=u[0]*bb+u[1]*dd;
  const x:Vec=[(t/scale)*k1/(k1*k1+k2*k2),(t/scale)*k2/(k1*k1+k2*k2)];
  return {rank:1,consistent,x,projection:[u[0]*t,u[1]*t] as Vec};
}
