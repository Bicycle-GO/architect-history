import {buildings,eras,sources} from './data.js';
export const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const byId=id=>buildings.find(b=>b.id===id);
export const eraOf=id=>eras.find(e=>e.id===id);
export const sourceOf=id=>sources.find(s=>s.id===id);
const iconPaths = {
 arrow:'<path d="M4 10h12m-5-5 5 5-5 5"/>',
 external:'<path d="M11 3h6v6M17 3l-9 9M8 4H4v13h13v-5"/>',
 search:'<circle cx="8.8" cy="8.8" r="5.8"/><path d="m13.2 13.2 4.4 4.4"/>',
 bookmark:'<path d="M5 3h10v15l-5-3-5 3z"/>',
 compare:'<path d="M3 6h13m-3-3 3 3-3 3M17 14H4m3-3-3 3 3 3"/>',
 pin:'<path d="M15.5 8c0 4-5.5 9-5.5 9S4.5 12 4.5 8a5.5 5.5 0 1 1 11 0Z"/><circle cx="10" cy="8" r="1.7"/>',
 book:'<path d="M10 5C7 3 5 3 2 4v12c3-1 5-1 8 1 3-2 5-2 8-1V4c-3-1-5-1-8 1Zm0 0v12"/>',
 layers:'<path d="m10 2 8 4-8 4-8-4 8-4Zm-8 9 8 4 8-4M2 15l8 4 8-4"/>',
 close:'<path d="m5 5 10 10M15 5 5 15"/>',
 chevron:'<path d="m6 8 4 4 4-4"/>',
 plus:'<path d="M10 4v12M4 10h12"/>',
 menu:'<path d="M3 5h14M3 10h14M3 15h14"/>',
 info:'<circle cx="10" cy="10" r="8"/><path d="M10 9v5m0-9v.5"/>',
 check:'<path d="m4 10 4 4 8-8"/>',
 bulb:'<path d="M6 13C1 9 5 2 10 2s9 7 4 11l-1 3H7l-1-3Zm1 6h6M8 16v-5m4 5v-5M7 8l3 3 3-3"/>',
 building:'<path d="m2 7 8-5 8 5H2Zm2 2v7m4-7v7m4-7v7m4-7v7M2 18h16"/>',
 leaf:'<path d="M17 3C7 1 2 5 4 12c2 7 13 5 13-9ZM3 18 14 7"/>',
 print:'<path d="M5 7V2h10v5M5 14H2V7h16v7h-3M5 11h10v7H5Zm10-2h.5"/>',
 clock:'<circle cx="10" cy="10" r="8"/><path d="M10 5v5l3 2"/>',
};
const icon = (name, cls='') => `<svg class="icon ${cls}" viewBox="0 0 20 20" aria-hidden="true">${iconPaths[name]||iconPaths.building}</svg>`;
const brandIcon = `<svg class="brand-symbol" viewBox="0 0 38 40" fill="none" aria-hidden="true"><path d="M3 16c6-1 12-4 16-10 4 6 10 9 16 10M6 19h26M8 20v14m7-14v14m8-14v14m7-14v14M5 34h28M2 38h34M11 11h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M18 7V3h2v4" fill="currentColor"/></svg>`;
const photoIds = new Set(['amsa','dolmen','mireuk','bulguk','buseok','changdeok','hahoe','jeju','station','ddp']);
let drawingSequence=0;
function conceptSVG(type){
 const patternId='gieok-grid-'+(++drawingSequence);
 const defs=`<defs><pattern id="${patternId}" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0v18" fill="none" stroke="currentColor" stroke-width=".3" opacity=".22"/></pattern></defs><rect width="320" height="200" fill="url(#${patternId})"/>`;
 const roof='<path d="M30 87Q95 77 160 37q65 40 130 50l-16 8H46Z"/><path d="M40 87q120-44 240 0M160 37v-9m-5 8h10M65 99v73m53-73v73m84-73v73m53-73v73M49 173h222M39 181h242M70 119h180M125 124h71v48M148 125v47m25-47v47"/>';
 let body='';
 if(['apartment','tower'].includes(type)) body='<path d="m43 61 75-20 45 18v119H43Zm120 0 75-24 35 16v125H163Z"/><path d="M118 42v136M238 38v140M43 81h75M43 102h75M43 123h75M43 144h75M163 82h75M163 104h75M163 126h75M163 148h75"/><path d="M63 62v116m23-122v122m98-122v122m27-132v132M25 179h270m-185 9h180M145 63v114m115-118v118"/>';
 else if(type==='cave') body='<path d="M16 169q14-44 32-63l25-38 44-20 29-20 37 15 33 16 23 47 29 20 37 44M19 171h282M82 169q1-69 65-93 50-6 68 93M67 74l30 35m19-58 8 38m62-41-15 39m49-17-26 41M138 163l10-21 10 21-19-8h21"/>';
 else if(type==='pit') body='<ellipse cx="160" cy="115" rx="109" ry="59"/><ellipse cx="160" cy="111" rx="96" ry="48"/><ellipse cx="160" cy="114" rx="24" ry="13"/><circle cx="139" cy="114" r="5"/><circle cx="180" cy="114" r="5"/><path d="M55 115v23q107 110 209 0v-23M84 94v-18m152 18V76M92 145v-19m135 20v-20M34 181h252M160 38v21m-6-16 6-5 6 5"/>';
 else if(type==='tomb'||type==='grotto') body='<path d="M48 175v-66q0-80 112-80t112 80v66M62 175v-66q0-67 98-67t98 67v66M44 175h231M92 163v-53q0-48 68-48t68 48v53M77 165h165M145 159v-23q-10-18 0-25 3-10 15-10t15 10q10 7 0 25v23M137 160h46M95 100l-32-7m46-14-27-22m55 9-14-25m37 20V42m22 24 14-25m18 38 24-20m-12 41 31-8"/>';
 else if(type==='fortress') body='<path d="m23 141 42-30 33 5 54-45 38 15 43-21 65 34M25 151l44-30 31 7 54-45 35 16 43-21 68 32M28 140l-4-14 8-6 7 9 17-10-6-13 9-6 7 12m44-6-5-12 9-7 8 11m30-28-2-13 11-4 5 12m26 18 1-13 10-5 6 12m28-15-1-13 12 1 3 14M19 180q33-33 75-20t70 12 80-28 58 14"/>';
 else if(type==='neowa') body='<path d="m33 110 62-72 156 27 36 49H33Zm4 0v63h245v-59M94 40l62 73m-50-67 58 67m-39-63 46 63m-30-60 41 60m-22-57 34 57m-17-53 30 53m-11-50 23 50m-8-47 18 47M60 116v56m53-58v58m97-58v58m48-58v58M34 146h248M126 172v-43h69v43m-157 8h248"/>';
 else if(type==='city') body='<path d="M57 29h206v148H57Zm9 9h188v130H66ZM66 109h188M154 39v130M165 39v130M84 57h49v33H84Zm102 0h49v33h-49ZM84 127h49v24H84Zm103 0h48v24h-48ZM143 73h34v25h-34ZM36 180h250"/>';
 else if(type==='classical') body='<path d="m55 71 105-42 105 42H55Zm0 9h210M65 87v77m34-77v77m40-77v77m42-77v77m40-77v77m34-77v77M52 164h216M44 174h232M36 184h248M72 89h20m39 0h16m27 0h16m25 0h16M54 101h213M152 121h16v42M89 119h20v26H89Zm121 0h20v26h-20Z"/>';
 else if(type==='museum') body='<path d="m35 87 105-20 57 20v82H35Zm162 14 57-13 32 11v70h-89ZM35 87v-12l105-20 57 20v12M197 101V88l57-13 32 13v13M52 107h79v35H52Zm94-6h34v41h-34M52 153h128M210 112h57v30h-57M141 67v101M254 88v81M18 181h285m-178-4 35-21 35 21M23 89V54m-12 15h24"/>';
 else body=roof;
 return `<svg viewBox="0 0 320 200" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${defs}${body}</svg>`;
}
function media(b,cls='',lazy=true){
 return photoIds.has(b.image)?`<img class="${cls}" src="/assets/${b.image}.jpg" alt="${esc(b.title)}${b.imageLabel?' — '+esc(b.imageLabel):'의 현재 모습'}" ${lazy?'loading="lazy"':''} width="1000" height="667">`:`<div class="concept ${cls}" role="img" aria-label="${esc(b.imageLabel||b.title+'의 설명용 개념도')}">${conceptSVG(b.image)}<span class="concept-note">설명용 개념도</span></div>`;
}
function sourceLink(id,short=false){const s=sourceOf(id);return s?`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${esc(short?s.org:s.org+' · '+s.title)} ↗</a>`:'';}

export {icon,brandIcon,media,sourceLink,photoIds,conceptSVG};
