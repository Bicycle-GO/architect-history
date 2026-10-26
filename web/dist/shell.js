/* Navigation stays operational independently of page modules. */
(() => {
 'use strict';
 const panel=document.getElementById('site-sidebar');
 const frame=document.getElementById('site-frame');
 const toggles=[...document.querySelectorAll('[data-nav-toggle]')];
 const mobile=window.matchMedia('(max-width:1000px)');
 if(!panel||!frame)return;
 let desktopOpen=true;
 try{const value=localStorage.getItem('gieok-sidebar-open');if(value!==null)desktopOpen=value==='true';}catch{}
 let opened=false;
 let previousFocus=null;
 const focusable=()=>[...panel.querySelectorAll('a[href],button,summary,[tabindex="0"]')].filter(el=>el.getClientRects().length>0&&!el.disabled);
 function setOpen(next,{focus=false,persist=false}={}){
  const focusBefore=document.activeElement;
  opened=!!next;
  document.body.dataset.sidebar=opened?'open':'closed';
  panel.inert=!opened;
  panel.setAttribute('aria-hidden',String(!opened));
  toggles.forEach(button=>{button.setAttribute('aria-expanded',String(opened));button.setAttribute('aria-label',opened?'메뉴 숨기기':'메뉴 펼치기');});
  const modal=mobile.matches&&opened;
  frame.inert=modal;
  document.body.classList.toggle('panel-modal-open',modal);
  if(modal){panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');}
  else{panel.removeAttribute('role');panel.removeAttribute('aria-modal');}
  if(persist&&!mobile.matches){desktopOpen=opened;try{localStorage.setItem('gieok-sidebar-open',String(opened));}catch{}}
  if(focus&&opened){previousFocus=focusBefore;(focusable()[0]||panel).focus({preventScroll:true});}
  if(focus&&!opened){(previousFocus?.isConnected?previousFocus:toggles[0])?.focus({preventScroll:true});}
 }
 setOpen(mobile.matches?false:desktopOpen);
 document.addEventListener('click',event=>{
  if(event.target.closest('[data-nav-toggle]'))setOpen(!opened,{focus:true,persist:true});
  if(event.target.closest('[data-nav-close]'))setOpen(false,{focus:true,persist:true});
 });
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&opened){event.preventDefault();setOpen(false,{focus:true,persist:true});return;}
  if(event.key==='Tab'&&mobile.matches&&opened){
   const elements=focusable(),first=elements[0],last=elements.at(-1);if(!first)return;
   if(event.shiftKey&&(document.activeElement===first||!panel.contains(document.activeElement))){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&(document.activeElement===last||!panel.contains(document.activeElement))){event.preventDefault();first.focus();}
  }
 });
 mobile.addEventListener('change',()=>setOpen(mobile.matches?false:desktopOpen));
 window.addEventListener('pageshow',()=>setOpen(mobile.matches?false:desktopOpen));
 document.documentElement.dataset.shellReady='true';
 const showFailure=()=>{
  const status=document.getElementById('page-status');if(!status)return;
  status.hidden=false;
  status.textContent='일부 기능을 불러오지 못했습니다. 메뉴로 다른 페이지를 열거나 새로고침해 주세요.';
 };
 window.addEventListener('error',event=>{if(event.error||event.target?.tagName==='SCRIPT')showFailure();},true);
 window.addEventListener('unhandledrejection',showFailure);
})();
