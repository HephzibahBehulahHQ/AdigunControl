// AdigunSPs only. No shared/VoltPro account gateway or privileged key is used.
export const ADIGUNSPS_URL='https://fqcbfnktdvqojyezxeis.supabase.co';
const KEY='sb_publishable_kUwuugYcMSOUVfSicQE1TQ_2j_B6P8o';
export function createAdigunSPsAdminClient({fetcher=fetch,now=Date.now,accountEndpoint=null}={}){
 let token=null,user=null,expiresAt=0;
 async function send(path,{method='GET',body,authenticated=false}={}){
  if(authenticated&&(!token||now()>=expiresAt))throw Error('Sign in to AdigunSPs again.');
  const response=await fetcher(ADIGUNSPS_URL+path,{method,credentials:'omit',cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15000),headers:{apikey:KEY,'content-type':'application/json',...(authenticated?{authorization:'Bearer '+token,'accept-profile':'adigunsps','content-profile':'adigunsps',prefer:'return=representation'}:{})},...(body?{body:JSON.stringify(body)}:{})});
  let data=null;try{data=await response.json();}catch{}
  if(!response.ok)throw Error(response.status===401?'Sign-in expired or credentials were rejected.':response.status===403?'AdigunSPs permission denied.':'AdigunSPs request failed.');
  return data;
 }
 async function signOut(){const previous=token;token=null;user=null;expiresAt=0;if(previous)await fetcher(ADIGUNSPS_URL+'/auth/v1/logout?scope=local',{method:'POST',credentials:'omit',cache:'no-store',headers:{apikey:KEY,authorization:'Bearer '+previous},signal:AbortSignal.timeout(10000)}).catch(()=>{});}
 async function productAccount(payload){
  if(!accountEndpoint)throw Error('AdigunSPs email verification is unavailable.');
  const response=await fetcher(accountEndpoint,{method:'POST',credentials:'include',cache:'no-store',
    redirect:'error',signal:AbortSignal.timeout(15000),headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const result=await response.json().catch(()=>null);
  if(!response.ok||!result)throw Error(response.status===429?'Wait before requesting another code.':'AdigunSPs account verification failed.');
  return result;
 }
 return {
  async beginSignIn(email,password){
   await signOut();
   const result=await productAccount({step:'begin',mode:'sign-in',email:String(email).trim(),password});
   if(result.step!=='verify')throw Error('AdigunSPs did not send an email code.');
  },
  async verifySignIn(code){
   const result=await productAccount({step:'verify',code:String(code).trim()});
   const data=result.session;
   if(result.step!=='signed-in'||!data?.access_token||!data.user?.id||data.user.role!=='admin'||
      !Number.isFinite(data.expires_in)||data.expires_in<=0)throw Error('A verified AdigunSPs administrator session is required.');
   token=data.access_token;user=data.user;expiresAt=now()+data.expires_in*1000;
   return {id:user.id,email:user.email};
  },
  async signIn(email,password){
   if(accountEndpoint)throw Error('Enter the emailed verification code to sign in.');
   await signOut();
   const data=await send('/auth/v1/token?grant_type=password',{method:'POST',body:{email:String(email).trim(),password}});
   if(!data?.access_token||!data.user?.id||!Number.isFinite(data.expires_in)||data.expires_in<=0)throw Error('AdigunSPs sign-in response was incomplete.');
   token=data.access_token;user=data.user;expiresAt=now()+data.expires_in*1000;
   if(user.is_anonymous||user.app_metadata?.role!=='admin'){await signOut();throw Error('An AdigunSPs administrator account is required.');}
   return {id:user.id,email:user.email};
  },
  listReviews(){return send('/rest/v1/adigun_recipe_submissions?select=id,user_id,project_name,recipe_name,recipe_version,recipe_values,submitted_at,adigun_recipe_decisions(reviewer_id,decision,comment,decided_at)&order=submitted_at.desc&limit=100',{authenticated:true});},
  decide(submissionId,decision,comment=''){
   if(!/^[0-9a-f-]{36}$/i.test(submissionId)||!['approved','rejected'].includes(decision))throw Error('Invalid recipe decision.');
   return send('/rest/v1/adigun_recipe_decisions',{method:'POST',authenticated:true,body:{submission_id:submissionId,decision,comment:String(comment).trim().slice(0,1000)}});
  },
  signOut
 };
}
