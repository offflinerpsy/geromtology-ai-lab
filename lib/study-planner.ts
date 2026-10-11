/** Two independent groups, two-sided pooled-variance t test.
 * Power = P(|(Z + noncentrality) / sqrt(V/df)| > tCritical), V~Chi²(df).
 * Numerically integrated noncentral t probability; includes both rejection tails.
 * Independent implementation; reference: R stats power.t.test(strict=TRUE).
 */
export type StudyInputs = {difference:number;sd:number;alpha:number;power:number;ratio:number;dropout:number};
const lanczos = [676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
function logGamma(z:number):number {
  if(z<0.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);
  z-=1;let x=0.99999999999980993;for(let i=0;i<lanczos.length;i++)x+=lanczos[i]/(z+i+1);
  const t=z+7.5;return 0.5*Math.log(2*Math.PI)+(z+0.5)*Math.log(t)-t+Math.log(x);
}
function betaFraction(a:number,b:number,x:number) {
  const tiny=1e-30;let c=1,d=1-(a+b)*x/(a+1);if(Math.abs(d)<tiny)d=tiny;d=1/d;let h=d;
  for(let m=1;m<=150;m++){
    const m2=2*m;let aa=m*(b-m)*x/((a-1+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<tiny)d=tiny;c=1+aa/c;if(Math.abs(c)<tiny)c=tiny;d=1/d;h*=d*c;
    aa=-(a+m)*(a+b+m)*x/((a+m2)*(a+1+m2));d=1+aa*d;if(Math.abs(d)<tiny)d=tiny;c=1+aa/c;if(Math.abs(c)<tiny)c=tiny;d=1/d;const change=d*c;h*=change;if(Math.abs(change-1)<1e-12)break;
  }return h;
}
function regularBeta(x:number,a:number,b:number):number {
  if(x<=0)return 0;if(x>=1)return 1;
  const prefix=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log1p(-x));
  return x<(a+1)/(a+b+2)?prefix*betaFraction(a,b,x)/a:1-prefix*betaFraction(b,a,1-x)/b;
}
function tCritical(df:number,alpha:number) {
  let lo=0,hi=100;for(let k=0;k<48;k++){const mid=(lo+hi)/2;const tail=0.5*regularBeta(df/(df+mid*mid),df/2,0.5);if(tail>alpha/2)lo=mid;else hi=mid;}return (lo+hi)/2;
}
function normalCDF(x:number) {
  const a=Math.abs(x),t=1/(1+0.2316419*a);
  const tail=Math.exp(-a*a/2)/Math.sqrt(2*Math.PI)*t*(0.319381530+t*(-0.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));
  return x>=0?1-tail:tail;
}
export function studyPower(nA:number,nB:number,d:number,alpha:number):number {
  if(nA<2||nB<2||!Number.isFinite(d)||alpha<=0||alpha>=1)throw new Error('Invalid power parameters');
  const df=nA+nB-2,critical=tCritical(df,alpha),nc=Math.abs(d)/Math.sqrt(1/nA+1/nB);
  const mode=Math.sqrt(df-1),lo=Math.max(0,mode-11),hi=mode+11,steps=256,step=(hi-lo)/steps;
  const logConstant=(1-df/2)*Math.log(2)-logGamma(df/2);
  let sum=0;
  for(let i=0;i<=steps;i++){
    const y=lo+i*step;if(y===0)continue;
    const density=Math.exp(logConstant+(df-1)*Math.log(y)-y*y/2);
    const threshold=critical*y/Math.sqrt(df);
    const tails=normalCDF(nc-threshold)+normalCDF(-nc-threshold);
    sum+=(i===0||i===steps?1:i%2?4:2)*density*tails;
  }return Math.min(1,Math.max(0,sum*step/3));
}
export function validateStudy(v:StudyInputs) {
  if(!Object.values(v).every(Number.isFinite))return 'Complete all numeric assumptions.';
  if(v.difference<=0||v.sd<=0||v.difference/v.sd<0.02||v.difference/v.sd>5)return 'Use a positive difference and SD, with standardized effect between 0.02 and 5.';
  if(v.alpha<0.001||v.alpha>0.1)return 'Choose alpha between 0.001 and 0.10.';
  if(v.power<0.5||v.power>0.99)return 'Target power must be between 50% and 99%.';
  if(v.ratio<0.25||v.ratio>4)return 'Allocation B:A must be between 0.25 and 4.';
  if(v.dropout<0||v.dropout>0.5)return 'Dropout must be between 0% and 50%.';
  return '';
}
export function planStudy(v:StudyInputs) {
  const error=validateStudy(v);if(error)throw new Error(error);
  const d=v.difference/v.sd;
  const b=(a:number)=>Math.max(2,Math.ceil(a*v.ratio));
  let lo=2,hi=4;while(hi<100000&&studyPower(hi,b(hi),d,v.alpha)<v.power)hi=Math.min(100000,hi*2);
  if(studyPower(hi,b(hi),d,v.alpha)<v.power)throw new Error('The required sample exceeds 100,000 participants in group A. Revise the design.');
  while(lo<hi){const mid=Math.floor((lo+hi)/2);if(studyPower(mid,b(mid),d,v.alpha)>=v.power)hi=mid;else lo=mid+1;}
  const nA=lo,nB=b(lo),recruitA=Math.ceil(nA/(1-v.dropout)),recruitB=Math.ceil(nB/(1-v.dropout));
  return {nA,nB,total:nA+nB,recruitA,recruitB,recruitTotal:recruitA+recruitB,achievedPower:studyPower(nA,nB,d,v.alpha),effect:d};
}
