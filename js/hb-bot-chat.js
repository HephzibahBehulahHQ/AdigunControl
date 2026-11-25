(()=>{"use strict";
if(window.HBBotChat)return;
const boot=()=>{
  if(document.getElementById("hbBotWindow"))return;
  const privatePage=location.hostname==="admin.hephzibahbehulah.com"||document.documentElement.dataset.hbPrivate==="true";
  const engineering=location.hostname.startsWith("engineering.")||location.pathname.startsWith("/engineering/");
  const cyber=location.hostname.startsWith("cyber.")||location.pathname.startsWith("/cyber/");
  const language=window.HBLanguage?.get?.()||"en";
  const copy={
    en:{status:"ADIGUN BOT",open:"Open Adigun Bot",minimize:"Minimize",restore:"Restore",maximize:"Maximize",close:"Close",clear:"Clear conversation",full:"Open the full assistant",resize:"Resize Adigun Bot",moveResize:"Use arrow keys to move; Shift plus arrow keys to resize.",placeholder:"Ask Adigun Bot…",welcome:"Ask about this workspace. Adigun Bot uses only the services and actions available to your account.",suggestions:["What can you help me with?","Explain this workspace","How do I get started?"]},
    de:{status:"ADIGUN BOT",open:"Adigun Bot öffnen",minimize:"Minimieren",restore:"Wiederherstellen",maximize:"Maximieren",close:"Schließen",clear:"Unterhaltung löschen",full:"Vollständigen Assistenten öffnen",resize:"Adigun Bot anpassen",moveResize:"Mit Pfeiltasten bewegen; mit Umschalt plus Pfeiltasten Größe ändern.",placeholder:"Adigun Bot fragen…",welcome:"Stelle eine Frage zu diesem Arbeitsbereich. Adigun Bot verwendet nur Dienste und Aktionen, die für dein Konto verfügbar sind.",suggestions:["Wobei kannst du helfen?","Diesen Arbeitsbereich erklären","Wie beginne ich?"]},
    yo:{status:"ADIGUN BOT",open:"Ṣí Adigun Bot",minimize:"Dín kù",restore:"Dá padà",maximize:"Tóbi sí i",close:"Pa dé",clear:"Pa ìjíròrò rẹ́",full:"Ṣí olùrànlọ́wọ́ kíkún",resize:"Ṣàtúnṣe Adigun Bot",moveResize:"Lo àwọn bọ́tìnì ọfà láti gbé e; lo Shift àti bọ́tìnì ọfà láti tún ìwọ̀n rẹ̀ ṣe.",placeholder:"Béèrè lọ́wọ́ Adigun Bot…",welcome:"Béèrè nípa ibi iṣẹ́ yìí. Adigun Bot yóò lo àwọn iṣẹ́ àti irinṣẹ́ tó wà fún àkọọ́lẹ̀ rẹ nìkan.",suggestions:["Kí lo lè ràn mí lọ́wọ́?","Ṣàlàyé ibi iṣẹ́ yìí","Báwo ni mo ṣe bẹ̀rẹ̀?"]},
    pcm:{status:"ADIGUN BOT",open:"Open Adigun Bot",minimize:"Make am small",restore:"Bring am back",maximize:"Make am big",close:"Close",clear:"Clear this chat",full:"Open the full assistant",resize:"Resize Adigun Bot",moveResize:"Use arrow keys to move am; hold Shift with arrow keys to resize am.",placeholder:"Ask Adigun Bot…",welcome:"Ask about this workspace. Adigun Bot go use only the services and actions wey your account fit use.",suggestions:["Wetin you fit help me do?","Explain this workspace","How I go start?"]}
  }[language==="pid"?"pcm":language]||null;
  const words=copy||{
    status:"ADIGUN BOT",open:"Open Adigun Bot",minimize:"Minimize",restore:"Restore",maximize:"Maximize",close:"Close",clear:"Clear conversation",full:"Open the full assistant",resize:"Resize Adigun Bot",moveResize:"Use arrow keys to move; Shift plus arrow keys to resize.",placeholder:"Ask Adigun Bot…",welcome:"Ask about this workspace. Adigun Bot uses only the services and actions available to your account.",suggestions:["What can you help me with?","Explain this workspace","How do I get started?"]
  };
  const root=document.createElement("div");
  root.innerHTML=`
<button class="hb-bot-launcher" id="hbBotLauncher" aria-label="Open Adigun Bot" aria-expanded="false" title="Ask Adigun Bot"><span>AI</span><i class="hb-bot-dot"></i></button>
<section class="hb-bot-window" id="hbBotWindow" role="dialog" aria-label="Adigun Bot" aria-hidden="true">
<header class="hb-bot-head" tabindex="0" aria-label="Adigun Bot window"> <div class="hb-bot-brand"><div class="hb-bot-core">AI</div><div class="hb-bot-title"><strong>ADIGUN BOT</strong><span></span></div></div><div class="hb-bot-actions"><button id="hbBotMin" type="button" aria-label="Minimize Adigun Bot" title="Minimize">−</button><button id="hbBotMax" type="button" aria-label="Maximize Adigun Bot" title="Maximize">□</button><button id="hbBotFull" type="button" title="Open full AI">↗</button><button id="hbBotClear" type="button" title="Clear chat">⌫</button><button id="hbBotClose" type="button" aria-label="Close Adigun Bot" title="Close">×</button></div></header>
<div class="hb-bot-status">ADIGUN BOT</div>
<div class="hb-bot-messages" id="hbBotMessages"></div>
<div class="hb-bot-suggestions" id="hbBotSuggestions"><button>What is this website?</button><button>Explain cybersecurity</button><button>What can you help me with?</button></div>
<form class="hb-bot-composer" id="hbBotForm"><textarea id="hbBotInput" rows="1" placeholder="Ask ADIGUN anything…" autocomplete="off"></textarea><button class="hb-bot-send" id="hbBotSend" type="submit" aria-label="Send">→</button></form>
<footer class="hb-bot-footer"><span>HEPHZIBAH BEHULAH</span><span>ADIGUN BOT</span></footer>
</section>`;
  document.body.appendChild(root);
  root.querySelector(".hb-bot-title span").textContent=privatePage?"ADIGUN CONTROL":engineering?"ELEKTRONIKER":cyber?"CYBER LEARNING":"HEPHZIBAH BEHULAH";
  root.querySelector(".hb-bot-footer span").textContent="HEPHZIBAH BEHULAH";
  root.querySelector(".hb-bot-status").textContent=words.status;
  const launcher=root.querySelector("#hbBotLauncher"), win=root.querySelector("#hbBotWindow"), msgs=root.querySelector("#hbBotMessages"), input=root.querySelector("#hbBotInput"), form=root.querySelector("#hbBotForm"), send=root.querySelector("#hbBotSend"), minButton=root.querySelector("#hbBotMin"), maxButton=root.querySelector("#hbBotMax");
  launcher.setAttribute("aria-label",words.open);launcher.title=words.open;
  input.placeholder=words.placeholder;
  const botHead=root.querySelector(".hb-bot-head");botHead.title=words.moveResize;botHead.setAttribute("aria-label",words.moveResize);
  root.querySelector("#hbBotClose").title=words.close;root.querySelector("#hbBotClose").setAttribute("aria-label",words.close);
  root.querySelector("#hbBotClear").title=words.clear;root.querySelector("#hbBotFull").title=words.full;
  root.querySelectorAll("#hbBotSuggestions button").forEach((button,index)=>{if(words.suggestions[index])button.textContent=words.suggestions[index];});
  const storageKey=`hb-adigun-bot-window:${location.hostname}`;
  const viewport=()=>({width:window.innerWidth,height:window.innerHeight});
  const minimum=()=>viewport().width<560?{width:Math.min(320,viewport().width-20),height:260}:{width:320,height:400};
  const readWindowState=()=>{try{const saved=JSON.parse(localStorage.getItem(storageKey)||"null");return saved&&typeof saved==="object"?saved:{}}catch{return {}}};
  const state=readWindowState();
  const clamp=(value,min,max)=>Math.min(Math.max(value,min),max);
  const saveWindowState=()=>{try{localStorage.setItem(storageKey,JSON.stringify({x:state.x,y:state.y,width:state.width,height:state.height,maximized:Boolean(state.maximized),open:win.classList.contains("open"),minimized:win.classList.contains("minimized")}))}catch{}};
  const applyWindowState=()=>{
    const {width:vw,height:vh}=viewport();win.classList.toggle("maximized",Boolean(state.maximized));
    if(state.maximized){win.style.removeProperty("left");win.style.removeProperty("top");win.style.removeProperty("width");win.style.removeProperty("height");maxButton.title=words.restore;maxButton.setAttribute("aria-label",words.restore);maxButton.textContent="❐";return;}
    maxButton.title=words.maximize;maxButton.setAttribute("aria-label",words.maximize);maxButton.textContent="□";
    const min=minimum(),maxWidth=Math.max(min.width,vw-24),maxHeight=Math.max(min.height,vh-108);
    state.width=clamp(Number(state.width)||Math.min(410,maxWidth),min.width,maxWidth);state.height=clamp(Number(state.height)||Math.min(620,maxHeight),min.height,maxHeight);
    if(Number.isFinite(Number(state.x)))state.x=clamp(Number(state.x),12,Math.max(12,vw-state.width-12));
    if(Number.isFinite(Number(state.y)))state.y=clamp(Number(state.y),12,Math.max(12,vh-state.height-12));
    if(Number.isFinite(state.x)){win.style.left=`${state.x}px`;win.style.right="auto";}else{win.style.removeProperty("left");win.style.removeProperty("right");}
    if(Number.isFinite(state.y)){win.style.top=`${state.y}px`;win.style.bottom="auto";}else{win.style.removeProperty("top");win.style.removeProperty("bottom");}
    win.style.width=`${state.width}px`;win.style.height=`${state.height}px`;saveWindowState();
  };
  applyWindowState();
  const resizeHandle=document.createElement("button");resizeHandle.className="hb-bot-resize";resizeHandle.type="button";resizeHandle.setAttribute("aria-label",words.resize);resizeHandle.title=words.resize;resizeHandle.textContent="⤢";win.appendChild(resizeHandle);
  const add=(text,role="bot")=>{const el=document.createElement("div");el.className="hb-bot-msg "+role;el.textContent=text;msgs.appendChild(el);msgs.scrollTop=msgs.scrollHeight;return el};
  const welcome=words.welcome;
  add(welcome);
  const open=()=>{win.classList.add("open");win.setAttribute("aria-hidden","false");launcher.setAttribute("aria-expanded","true");applyWindowState();saveWindowState();setTimeout(()=>input.focus(),80)};
  const close=()=>{win.classList.remove("open");win.setAttribute("aria-hidden","true");launcher.setAttribute("aria-expanded","false");saveWindowState();launcher.focus()};
  if(state.open){win.classList.add("open");win.setAttribute("aria-hidden","false");launcher.setAttribute("aria-expanded","true");if(state.minimized){win.classList.add("minimized");minButton.textContent="□";minButton.title=words.restore;minButton.setAttribute("aria-label",words.restore);}saveWindowState();}
  launcher.addEventListener("click",()=>{if(!win.classList.contains("open")){open();return;}if(win.classList.contains("minimized")){win.classList.remove("minimized");minButton.textContent="−";minButton.title="Minimize";minButton.setAttribute("aria-label","Minimize Adigun Bot");saveWindowState();input.focus();return;}win.style.zIndex="100001";});
  root.querySelector("#hbBotClose").addEventListener("click",close);
  minButton.title=words.minimize;minButton.setAttribute("aria-label",words.minimize);
  minButton.addEventListener("click",()=>{const minimized=win.classList.toggle("minimized");minButton.textContent=minimized?"□":"−";minButton.title=minimized?words.restore:words.minimize;minButton.setAttribute("aria-label",minimized?words.restore:words.minimize);if(minimized)input.blur();else input.focus();saveWindowState();});
  maxButton.addEventListener("click",()=>{state.maximized=!state.maximized;applyWindowState();saveWindowState();});
  const pointerStart=(event,mode)=>{if(event.button!==undefined&&event.button!==0)return;if(mode==="move"&&event.target.closest("button,input,textarea,select,a"))return;event.preventDefault();const rect=win.getBoundingClientRect(),start={x:event.clientX,y:event.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height};const move=e=>{const {width:vw,height:vh}=viewport(),min=minimum();if(mode==="move"){state.x=clamp(start.left+e.clientX-start.x,12,Math.max(12,vw-start.width-12));state.y=clamp(start.top+e.clientY-start.y,12,Math.max(12,vh-start.height-12));win.style.left=`${state.x}px`;win.style.top=`${state.y}px`;win.style.right="auto";win.style.bottom="auto";}else{state.width=clamp(start.width+e.clientX-start.x,min.width,Math.max(min.width,vw-24));state.height=clamp(start.height+e.clientY-start.y,min.height,Math.max(min.height,vh-108));win.style.width=`${state.width}px`;win.style.height=`${state.height}px`;}};const finish=()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",finish);window.removeEventListener("pointercancel",finish);win.classList.remove("dragging","resizing");saveWindowState();};win.classList.add(mode==="move"?"dragging":"resizing");window.addEventListener("pointermove",move);window.addEventListener("pointerup",finish,{once:true});window.addEventListener("pointercancel",finish,{once:true});};
  botHead.addEventListener("pointerdown",event=>{if(window.innerWidth>=560&&!state.maximized)pointerStart(event,"move");});
  botHead.addEventListener("keydown",event=>{if(event.target!==botHead||window.innerWidth<560||state.maximized||!event.key.startsWith("Arrow"))return;event.preventDefault();const rect=win.getBoundingClientRect(),step=event.shiftKey?24:16,{width:vw,height:vh}=viewport(),min=minimum();state.x=Number.isFinite(state.x)?state.x:rect.left;state.y=Number.isFinite(state.y)?state.y:rect.top;state.width=Number(state.width)||rect.width;state.height=Number(state.height)||rect.height;if(event.shiftKey){state.width=clamp(state.width+(event.key==="ArrowRight"?step:event.key==="ArrowLeft"?-step:0),min.width,Math.max(min.width,vw-24));state.height=clamp(state.height+(event.key==="ArrowDown"?step:event.key==="ArrowUp"?-step:0),min.height,Math.max(min.height,vh-108));}else{state.x=clamp(state.x+(event.key==="ArrowRight"?step:event.key==="ArrowLeft"?-step:0),12,Math.max(12,vw-state.width-12));state.y=clamp(state.y+(event.key==="ArrowDown"?step:event.key==="ArrowUp"?-step:0),12,Math.max(12,vh-state.height-12));}applyWindowState();saveWindowState();});
  resizeHandle.addEventListener("pointerdown",event=>{if(window.innerWidth>=560&&!state.maximized)pointerStart(event,"resize");});
  window.addEventListener("resize",()=>{applyWindowState();saveWindowState();});
  win.addEventListener("keydown",event=>{if(event.key==="Escape")close();});
  root.querySelector("#hbBotFull").addEventListener("click",()=>location.href=privatePage?"/admin#operator":engineering?"/academy-workbench":cyber?"/#content":"/ai-agent.html");
  root.querySelector("#hbBotClear").addEventListener("click",()=>{if(window.Adigun?.memory)window.Adigun.memory.clear();msgs.innerHTML="";add("Chat memory cleared. Start a new conversation.");});
  root.querySelectorAll("#hbBotSuggestions button").forEach(b=>b.addEventListener("click",()=>{input.value=b.textContent;form.requestSubmit()}));
  input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
  form.addEventListener("submit",async e=>{
    e.preventDefault();const q=input.value.trim();if(!q||send.disabled)return;
    add(q,"user");input.value="";send.disabled=true;
    const thinking=add("","bot");thinking.innerHTML='<span class="hb-bot-thinking"><i></i><i></i><i></i></span>';
    try{
      let d;
      const path=privatePage?"/api/admin/agent":engineering?"/api/engineering/chat":cyber?"/api/cyber/chat":"/api/chat";
      const body=privatePage?{task:q}:cyber?{question:q}:{messages:[{role:"user",content:q}],language:window.HBLanguage?.get?.()||"en"};
      const response=await fetch(path,{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(90000)});
      if(!response.ok)throw Error((await response.json().catch(()=>({}))).error||"Assistant request failed");
      if(response.headers.get("content-type")?.includes("text/event-stream")){
        const reader=response.body.getReader(),decoder=new TextDecoder();let buffer="",answer="";
        while(true){
          const chunk=await reader.read();
          buffer+=decoder.decode(chunk.value||new Uint8Array(),{stream:!chunk.done});
          const lines=buffer.split(/\r?\n/);buffer=lines.pop()||"";
          for(const line of lines){
            if(!line.startsWith("data:"))continue;
            const data=line.slice(5).trim();if(!data||data==="[DONE]")continue;
            try{const piece=JSON.parse(data).response;if(typeof piece==="string"){answer+=piece;thinking.textContent=answer;}}catch{}
          }
          if(chunk.done)break;
        }
        if(!answer)throw Error("The assistant returned an empty response.");
        d={answer};
      }else{d=await response.json();if(d.error&&!d.ok)throw Error(d.error);}

      thinking.remove();
      add(d?.answer||"I could not complete that request. Please try again.");
    }catch(err){thinking.remove();add(String(err.message||"ADIGUN is temporarily unavailable. Please try again shortly."));}
    finally{send.disabled=false;input.focus()}
  });
};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
window.HBBotChat={open:()=>document.getElementById("hbBotLauncher")?.click()};
})();
