import { buildings, questions } from './data.js';
import { byId } from './components.js';
import { routes } from './catalog.js';
import { collectionListing, compareContent, sourcesContent, quizContent, savedContent, searchContent } from './views.js';

const $=(selector,scope=document)=>scope.querySelector(selector);
let route;
try{route=JSON.parse(document.body.dataset.route||'{}');}catch{route=routes.find(r=>r.path===location.pathname)||{kind:'notfound'};}
if(!route.kind)route=routes.find(r=>r.path===location.pathname)||{kind:'notfound'};
const readStorage=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
const savedRaw=readStorage('gieok-saved',[]);
let saved=new Set(Array.isArray(savedRaw)?savedRaw.filter(id=>byId(id)):[]);
let toastTimer;
let quizIndex=0;
let answers=[];

function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600);}
function refreshSaved(){
 document.querySelectorAll('[data-saved-count]').forEach(el=>el.textContent=saved.size?String(saved.size).padStart(2,'0'):'');
 document.querySelectorAll('[data-action="save"]').forEach(button=>{
  const isSaved=saved.has(button.dataset.id),b=byId(button.dataset.id);if(!b)return;
  button.classList.toggle('saved',isSaved);
  button.setAttribute('aria-pressed',String(isSaved));
  button.setAttribute('aria-label',`${b.title} ${isSaved?'보관 취소':'보관하기'}`);
  const label=$('[data-save-label]',button);if(label)label.textContent=isSaved?'보관됨':'보관하기';
 });
}
function toggleSaved(id){if(!byId(id))return;const wasSaved=saved.has(id);if(wasSaved)saved.delete(id);else saved.add(id);
 let persisted=true;try{localStorage.setItem('gieok-saved',JSON.stringify([...saved]));}catch{persisted=false;}
 if(route.kind==='saved'&&$('#saved-content'))$('#saved-content').innerHTML=savedContent([...saved]);
 refreshSaved();toast(persisted?(wasSaved?'보관함에서 꺼냈습니다.':'나의 보관함에 담았습니다.'):'이 화면에만 보관했습니다. 브라우저 저장 공간에 접근할 수 없습니다.');
}
function updateComparison(side,id){const params=new URLSearchParams(location.search);params.set(side,id);const left=byId(params.get('left'))?.id||'hahoe';const right=byId(params.get('right'))?.id||'mapo';params.set('left',left);params.set('right',right);history.replaceState(null,'',`/compare/?${params}`);$('#compare-content').innerHTML=compareContent(left,right);}
function renderQuiz(){const content=$('#quiz-content');content.innerHTML=quizContent(quizIndex,answers);content.setAttribute('tabindex','-1');content.focus({preventScroll:true});}

// Preserve links shared before the multi-page update.
const legacy={timeline:'/periods/',explore:'/periods/',regions:'/regions/',compare:'/compare/',library:'/library/'};
if(location.pathname==='/'&&legacy[location.hash.slice(1)])location.replace(legacy[location.hash.slice(1)]);
if(route.kind==='collection'&&location.search&&$('#collection-listing'))$('#collection-listing').innerHTML=collectionListing(route,location.search);
if(route.kind==='compare'&&$('#compare-content')){
 const p=new URLSearchParams(location.search);$('#compare-content').innerHTML=compareContent(p.get('left')||'hahoe',p.get('right')||'mapo');
}
if(route.kind==='sources'&&location.search&&$('#sources-content'))$('#sources-content').innerHTML=sourcesContent(location.search);
if(route.kind==='search'&&$('#search-query')&&$('#search-content')){
 const p=new URLSearchParams(location.search);$('#search-query').value=p.get('q')||'';$('#search-content').innerHTML=searchContent(p);
}
if(route.kind==='saved'&&$('#saved-content'))$('#saved-content').innerHTML=savedContent([...saved]);
if(route.kind==='record'&&$('#learning-note')){
 const raw=readStorage('gieok-note-'+route.id,'');$('#learning-note').value=typeof raw==='string'?raw:'';
}
refreshSaved();
if(matchMedia('(max-width:760px)').matches){
 const active=$('.collection-sidebar nav [aria-current="page"]');
 if(active)active.parentElement.scrollLeft=Math.max(0,active.offsetLeft-active.parentElement.offsetLeft-(active.parentElement.clientWidth-active.clientWidth)/2);
}

document.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');if(!button)return;
 const id=button.dataset.id;
 switch(button.dataset.action){
  case 'save':toggleSaved(id);break;
  case 'save-note':try{localStorage.setItem('gieok-note-'+id,JSON.stringify($('#learning-note').value));$('#note-status').textContent='이 브라우저에 관찰 메모를 저장했습니다.';toast('관찰 메모를 저장했습니다.');}catch{toast('브라우저 저장 공간에 접근할 수 없습니다.');}break;
  case 'quiz-answer':if(answers[quizIndex]===undefined&&questions[quizIndex]){answers[quizIndex]=Number(id);renderQuiz();}break;
  case 'quiz-next':if(quizIndex<questions.length&&answers[quizIndex]!==undefined){quizIndex++;renderQuiz();}break;
  case 'quiz-restart':quizIndex=0;answers=[];renderQuiz();break;
  case 'print':window.print();break;
 }
});
document.addEventListener('input',event=>{if(event.target.id==='learning-note')$('#note-status').textContent='아직 저장하지 않은 메모입니다.';});
document.addEventListener('change',event=>{
 const element=event.target;
 if(element.dataset.select==='compare-era'){
  const b=buildings.find(b=>b.era===element.value);if(!b)return;updateComparison(element.dataset.side,b.id);$('#'+element.dataset.side+'-era').focus({preventScroll:true});
 }
 if(element.dataset.select==='compare-building'){updateComparison(element.dataset.side,element.value);$('#'+element.dataset.side+'-building').focus({preventScroll:true});}
});
document.addEventListener('keydown',event=>{
 if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){
  event.preventDefault();if(route.kind==='search')$('#search-query').focus();else location.assign('/search/');
 }
});
$('.skip-link').addEventListener('click',event=>{event.preventDefault();$('#main').focus();$('#main').scrollIntoView({behavior:'smooth'});});
window.addEventListener('storage',event=>{if(event.key==='gieok-saved'){
 const value=readStorage('gieok-saved',[]);saved=new Set(Array.isArray(value)?value.filter(id=>byId(id)):[]);
 if(route.kind==='saved'&&$('#saved-content'))$('#saved-content').innerHTML=savedContent([...saved]);refreshSaved();
}});

document.documentElement.dataset.pageReady='true';
