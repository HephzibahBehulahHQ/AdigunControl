import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

class Element {
  constructor(id=''){
    this.id=id;this.textContent='';this.innerHTML='';this.title='';this.disabled=false;this.value='';this.style={removeProperty(name){delete this[name];}};
    this.attributes={};this.events={};this.children=[];this.className='';this.scrollTop=0;this.scrollHeight=0;
    const classes=new Set();this.classList={add:(...names)=>names.forEach(x=>classes.add(x)),remove:(...names)=>names.forEach(x=>classes.delete(x)),contains:name=>classes.has(name),toggle:(name,force)=>{const on=force===undefined?!classes.has(name):Boolean(force);on?classes.add(name):classes.delete(name);return on;}};
  }
  addEventListener(type,handler){(this.events[type]??=[]).push(handler);}
  dispatch(type,event={}){for(const handler of [...(this.events[type]||[])])handler({target:this,preventDefault(){},...event});}
  setAttribute(name,value){this.attributes[name]=String(value);}
  appendChild(child){this.children.push(child);return child;}
  focus(){}
  blur(){}
  closest(){return null;}
  getBoundingClientRect(){return {left:Number.parseFloat(this.style.left)||300,top:Number.parseFloat(this.style.top)||100,width:Number.parseFloat(this.style.width)||410,height:Number.parseFloat(this.style.height)||620};}
}

function mount(host='admin.hephzibahbehulah.com',initial={},language='en'){
  const elements=new Map(),storage=new Map(Object.entries(initial));
  const get=selector=>{if(!elements.has(selector))elements.set(selector,new Element(selector));return elements.get(selector);};
  const rootElement=new Element('root');rootElement.querySelector=selector=>get(selector);rootElement.querySelectorAll=()=>[];
  const win=get('#hbBotWindow');win.querySelector=selector=>get(selector);
  const listeners={};
  const browser={innerWidth:1280,innerHeight:900,addEventListener(type,fn){(listeners[type]??=[]).push(fn);},removeEventListener(type,fn){listeners[type]=(listeners[type]||[]).filter(x=>x!==fn);},dispatch(type,event){for(const fn of [...(listeners[type]||[])])fn(event);}};
  let mounted=false;
  const document={readyState:'complete',documentElement:{dataset:{}},body:{appendChild(){mounted=true;}},createElement(){return rootElement;},getElementById(id){return mounted?elements.get('#'+id)||null:null;},addEventListener(){}};
  const localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))};
  browser.HBLanguage={get:()=>language};
  const context={window:browser,document,location:{hostname:host,pathname:'/'},localStorage,AbortSignal,setTimeout(fn){fn();},console};
  vm.runInNewContext(fs.readFileSync(path.join(root,'js/hb-bot-chat.js'),'utf8'),context);
  return {browser,storage,get};
}

test('Admin Adigun BOT is a floating window and supports minimize, restore, and maximize',()=>{
  const {get}=mount(),launcher=get('#hbBotLauncher'),win=get('#hbBotWindow'),min=get('#hbBotMin'),max=get('#hbBotMax');
  assert.equal(get('.hb-bot-title span').textContent,'ADIGUN CONTROL');
  launcher.dispatch('click');
  assert.equal(win.classList.contains('open'),true);
  assert.equal(launcher.attributes['aria-expanded'],'true');
  min.dispatch('click');
  assert.equal(win.classList.contains('minimized'),true);
  launcher.dispatch('click');
  assert.equal(win.classList.contains('minimized'),false);
  max.dispatch('click');
  assert.equal(win.classList.contains('maximized'),true);
  assert.equal(max.attributes['aria-label'],'Restore');
  max.dispatch('click');
  assert.equal(win.classList.contains('maximized'),false);
});

test('Admin Adigun BOT stores bounded position and size per host',()=>{
  const {browser,storage,get}=mount(),launcher=get('#hbBotLauncher'),header=get('.hb-bot-head'),resize=get('#hbBotWindow').children[0];
  launcher.dispatch('click');
  header.dispatch('pointerdown',{button:0,clientX:100,clientY:100});
  browser.dispatch('pointermove',{clientX:5000,clientY:5000});
  browser.dispatch('pointerup',{});
  let state=JSON.parse(storage.get('hb-adigun-bot-window:admin.hephzibahbehulah.com'));
  assert.equal(state.x,858);
  assert.equal(state.y,268);
  resize.dispatch('pointerdown',{button:0,clientX:100,clientY:100});
  browser.dispatch('pointermove',{clientX:5000,clientY:5000});
  browser.dispatch('pointerup',{});
  state=JSON.parse(storage.get('hb-adigun-bot-window:admin.hephzibahbehulah.com'));
  assert.equal(state.width,1256);
  assert.equal(state.height,792);
  assert.equal(get('#hbBotWindow').style.width,'1256px');
});

test('Admin Adigun BOT can be moved and resized from the keyboard',()=>{
  const {get}=mount(),launcher=get('#hbBotLauncher'),header=get('.hb-bot-head'),win=get('#hbBotWindow');
  launcher.dispatch('click');
  header.dispatch('keydown',{key:'ArrowRight'});
  assert.equal(win.style.left,'316px');
  header.dispatch('keydown',{key:'ArrowDown',shiftKey:true});
  assert.equal(win.style.height,'644px');
});

test('Admin Adigun BOT window controls use the selected language',()=>{
  const german=mount('admin.hephzibahbehulah.com',{},'de'),germanMin=german.get('#hbBotMin');
  assert.equal(germanMin.attributes['aria-label'],'Minimieren');
  germanMin.dispatch('click');
  assert.equal(germanMin.attributes['aria-label'],'Wiederherstellen');
  const pidgin=mount('admin.hephzibahbehulah.com',{},'pcm');
  assert.equal(pidgin.get('#hbBotLauncher').attributes['aria-label'],'Open Adigun Bot');
  assert.equal(pidgin.get('#hbBotInput').placeholder,'Ask Adigun Bot…');
  assert.equal(pidgin.get('#hbBotMin').title,'Make am small');
  assert.match(pidgin.get('#hbBotMessages').children[0].textContent,/go use only/);
});

test('Admin Adigun BOT restores its prior open/minimized state for that host',()=>{
  const key='hb-adigun-bot-window:admin.hephzibahbehulah.com';
  const {get,storage}=mount('admin.hephzibahbehulah.com',{[key]:JSON.stringify({x:60,y:70,width:480,height:520,maximized:false,open:true,minimized:true})});
  const win=get('#hbBotWindow'),launcher=get('#hbBotLauncher');
  assert.equal(win.classList.contains('open'),true);
  assert.equal(win.classList.contains('minimized'),true);
  assert.equal(launcher.attributes['aria-expanded'],'true');
  assert.equal(JSON.parse(storage.get(key)).open,true);
});
