import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyAccessToken, safeReturnPath } from '../lib/access-token.ts';
const team = 'research-test.cloudflareaccess.com', now = 100000;
const keys = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1,0,1]), hash: 'SHA-256' }, true, ['sign','verify']);
const jwk = { ...await crypto.subtle.exportKey('jwk', keys.publicKey), kid: 'fixture' };
async function token(overrides = {}) { const header = Buffer.from(JSON.stringify({ alg:'RS256',kid:'fixture' })).toString('base64url');const body = Buffer.from(JSON.stringify({ sub:'user-fixture',email:'research@example.invalid',iss:`https://${team}`,aud:['research-app'],exp:now+500,iat:now-10,type:'app',...overrides })).toString('base64url');const message=`${header}.${body}`;const sig=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',keys.privateKey,new TextEncoder().encode(message));return `${message}.${Buffer.from(sig).toString('base64url')}`; }
const options={now,fetchKeys:async()=>[jwk]};
test('Access accepts a correctly signed application session',async()=>assert.equal((await verifyAccessToken(await token(),team,['research-app'],options)).email,'research@example.invalid'));
test('Access rejects expired, wrong audience, wrong issuer and future sessions',async()=>{for(const c of [{exp:now},{aud:['other-app']},{iss:'https://evil.invalid'},{nbf:now+100},{iat:now+100},{email:''},{type:'service_token'}])assert.equal(await verifyAccessToken(await token(c),team,['research-app'],options),null);});
test('Access rejects forged signature and arbitrary key-fetch domain',async()=>{const t=await token();assert.equal(await verifyAccessToken(t.slice(0,-3)+'abc',team,['research-app'],options),null);assert.equal(await verifyAccessToken(t,'evil.invalid',['research-app'],options),null);});
test('Sign-in return paths cannot leave the site',()=>{for(const p of ['https://evil.invalid','//evil.invalid','/\\evil.invalid'])assert.equal(safeReturnPath(p),'/laboratory/ask');assert.equal(safeReturnPath('/tools?mode=x#result'),'/tools?mode=x#result');});
