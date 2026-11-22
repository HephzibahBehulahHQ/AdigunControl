import {createAccountService} from './admin-accounts-core.mjs';

const accessAudience = '__PREVIEW_ACCESS_AUDIENCE__';
if (!/^[a-f0-9]{64}$/.test(accessAudience)) throw new Error('The Admin preview Access audience is required.');
Deno.serve(createAccountService({readEnv:(name:string)=>Deno.env.get(name),accessAudience,readOnly:true}));
