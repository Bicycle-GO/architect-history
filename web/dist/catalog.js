import { buildings, eras, regions } from './data.js';

export const functions = [
  {id:'residential',name:'주거·생활',subtitle:'일상을 담는 공간',desc:'선사시대의 거처에서 전통 민가와 아파트까지, 먹고 쉬고 함께 살아가는 공간의 변화를 살펴봅니다.',image:'hahoe',icon:'building'},
  {id:'political',name:'정치·행정',subtitle:'나라를 운영하는 공간',desc:'왕실의 의례와 생활, 국가 운영을 위한 궁궐과 도성의 공간을 읽습니다.',image:'changdeok',icon:'building'},
  {id:'religious',name:'신앙·의례',subtitle:'믿음을 공간으로',desc:'사찰, 불전, 석탑과 석굴에서 불교의 세계관과 건축 기술이 만나는 지점을 찾아봅니다.',image:'bulguk',icon:'leaf'},
  {id:'funerary',name:'장례·추모',subtitle:'삶 너머를 생각한 공간',desc:'고인돌과 고분의 묘실에서 장례 의례와 사후세계, 공동체의 기술을 살펴봅니다.',image:'dolmen',icon:'layers'},
  {id:'defensive',name:'방어·도시',subtitle:'경계를 만들고 도시를 짓다',desc:'성곽과 도성에서 자연 지형, 방어, 도로와 공간 계획의 관계를 읽습니다.',image:'fortress',icon:'layers'},
  {id:'transport',name:'교통·교류',subtitle:'사람과 도시를 연결하다',desc:'근대 철도역을 통해 교통시설이 사람의 이동과 도시의 변화를 어떻게 담았는지 살펴봅니다.',image:'station',icon:'compare'},
  {id:'cultural',name:'문화·전시',subtitle:'시민에게 열린 문화 공간',desc:'전시·교육·디자인과 기존 건물의 재사용을 통해 오늘의 공공문화 공간을 읽습니다.',image:'ddp',icon:'book'},
];

export const types = [
  {id:'natural',name:'동굴·바위그늘',subtitle:'자연의 지형을 이용한 거처',desc:'구석기 주거는 자연 거처를 이용한 흔적과 고고학적 추정을 중심으로 읽습니다.',image:'cave'},
  {id:'pit-house',name:'움집·집터',subtitle:'땅에 남은 생활의 흔적',desc:'움집과 집터의 바닥·기둥구멍·화덕으로 선사 주거와 취락을 이해합니다.',image:'amsa'},
  {id:'tombs',name:'고인돌·고분',subtitle:'거석과 묘실의 건축',desc:'덮개돌과 매장시설, 내부 묘실을 통해 장례 공간의 구조를 살펴봅니다.',image:'dolmen'},
  {id:'stone',name:'석탑·석굴',subtitle:'돌을 조립해 만든 신앙 공간',desc:'석재로 구현한 목조 형식과 인공 석굴의 원리를 비교합니다.',image:'mireuk'},
  {id:'temples',name:'사찰·불전',subtitle:'전각과 마당이 이루는 사찰',desc:'사찰 전체의 배치와 개별 불전의 목구조를 함께 읽습니다.',image:'buseok'},
  {id:'palaces',name:'궁궐·전각',subtitle:'왕실 공간의 서로 다른 모습',desc:'목조 전각과 서양식 석조 전각을 통해 왕실 건축의 변화와 다양성을 살펴봅니다.',image:'changdeok'},
  {id:'traditional',name:'민가·전통마을',subtitle:'지역의 삶을 담은 집',desc:'기와집과 초가, 너와집과 마을의 공간에서 지역 환경과 생활문화를 읽습니다.',image:'hahoe'},
  {id:'fortifications',name:'성곽·도성',subtitle:'지형과 계획이 만드는 경계',desc:'산성과 도성의 사례를 통해 건축을 도시 규모로 바라봅니다.',image:'fortress'},
  {id:'apartments',name:'공동주택',subtitle:'여러 가구가 함께 사는 건축',desc:'단지형 아파트와 고층 공동주택에서 도시화와 생활 방식의 변화를 읽습니다.',image:'apartment'},
  {id:'stations',name:'근대 역사',subtitle:'철도의 관문이 된 건축',desc:'벽돌·석재·돔과 아치, 대합실을 통해 근대 철도역의 공간을 살펴봅니다.',image:'station'},
  {id:'cultural-buildings',name:'현대 문화시설',subtitle:'전시와 만남을 위한 공간',desc:'디자인플라자와 박물관에서 전시·교육·보행 공간의 관계를 읽습니다.',image:'ddp'},
  {id:'reuse',name:'재사용 건축',subtitle:'기존 공간에 새로운 쓰임을',desc:'기존 건물을 보존하고 새로운 기능을 더한 사례에서 형태와 기능의 변화를 구별합니다.',image:'station'},
];

// Curatorial navigation, derived from the uses and forms explained in each sourced record.
export const classification = {
  shelter:{functions:['residential'],type:'natural'},
  amsa:{functions:['residential'],type:'pit-house'},
  songguk:{functions:['residential'],type:'pit-house'},
  dolmen:{functions:['funerary'],type:'tombs',regions:['capital','jeolla']},
  mireuk:{functions:['religious'],type:'stone'},
  gongsan:{functions:['defensive','political'],type:'fortifications'},
  tomb:{functions:['funerary'],type:'tombs'},
  bulguk:{functions:['religious'],type:'temples'},
  seokguram:{functions:['religious'],type:'stone'},
  buseok:{functions:['religious'],type:'temples'},
  bongjeong:{functions:['religious'],type:'temples'},
  changdeok:{functions:['political','residential'],type:'palaces'},
  hahoe:{functions:['residential'],type:'traditional'},
  neowa:{functions:['residential'],type:'traditional'},
  jeju:{functions:['residential'],type:'traditional'},
  station:{functions:['transport'],type:'stations'},
  mapo:{functions:['residential'],type:'apartments'},
  yeouido:{functions:['residential'],type:'apartments'},
  ddp:{functions:['cultural'],type:'cultural-buildings'},
  reuse:{functions:['cultural'],type:'reuse'},
  balhae:{functions:['political','defensive'],type:'fortifications'},
  seokjo:{functions:['political','residential'],type:'palaces'},
  semoca:{functions:['cultural'],type:'cultural-buildings'},
};

const eraImages={paleo:'cave',neo:'amsa',bronze:'dolmen',three:'mireuk',northsouth:'bulguk',goryeo:'buseok',joseon:'hahoe',modern:'station',industry:'apartment',today:'ddp'};
const regionImages={capital:'changdeok',gangwon:'neowa',chungcheong:'pit',jeolla:'mireuk',gyeongsang:'buseok',jeju:'jeju'};
export const periodCategories=eras.filter(e=>e.id!=='all').map(e=>({...e,subtitle:e.date,image:eraImages[e.id]}));
export const regionCategories=[...regions.map(r=>({...r,image:regionImages[r.id]})),
 {id:'outside',name:'한반도 북부·관련 문화권',subtitle:'한국 건축사의 연결된 지역',desc:'현 북한 지역의 고구려 고분과 현 중국 지역의 발해 도성을 한국 건축사의 맥락에서 살펴봅니다.',image:'city',keywords:['고구려 고분','발해 도성'],source:['goguryeo','balhae'],supplemental:true},
 {id:'multiple',name:'여러 지역에 걸친 거처',subtitle:'특정 권역에 한정되지 않는 사례',desc:'한반도 여러 지역에서 확인되는 자연 거처의 이용을 개괄합니다. 특정 유적의 단일 복원 형태를 뜻하지 않습니다.',image:'cave',keywords:['자연 거처','고고학적 해석'],source:['nm-paleo'],supplemental:true},
];
export const dimensions={
 periods:{name:'시대별 탐색',short:'시대별',en:'THROUGH TIME',question:'언제 지어졌을까요?',description:'구석기부터 동시대까지, 시대를 고르면 그 시기의 기록을 별도 페이지에서 만납니다.',categories:periodCategories,icon:'clock'},
 regions:{name:'지역별 탐색',short:'지역별',en:'BUILT BY PLACE',question:'어디에서 태어난 공간일까요?',description:'기후와 재료, 지역의 생활문화가 공간에 남긴 차이를 권역별로 살펴봅니다.',categories:regionCategories,icon:'pin'},
 functions:{name:'기능별 탐색',short:'기능별',en:'SPACES FOR LIFE',question:'무엇을 위해 쓰였을까요?',description:'주거·정치·신앙·장례·방어·교통·문화. 건축이 수행한 역할을 기준으로 탐색합니다.',categories:functions,icon:'book'},
 types:{name:'종류별 탐색',short:'종류별',en:'FORMS OF ARCHITECTURE',question:'어떤 형태의 건축일까요?',description:'움집, 사찰, 궁궐, 전통마을, 공동주택. 건축물과 공간의 형태를 기준으로 살펴봅니다.',categories:types,icon:'layers'},
};
export const recordURL=id=>`/buildings/${id}/`;
export const categoryURL=(dimension,id)=>`/${dimension}/${id}/`;
export function recordsFor(dimension,id){return buildings.filter(b=>{
 const c=classification[b.id];
 if(dimension==='periods')return b.era===id;
 if(dimension==='regions')return (c.regions||[b.region]).includes(id);
 if(dimension==='functions')return c.functions.includes(id);
 if(dimension==='types')return c.type===id;
 return false;
}).sort((a,b)=>periodCategories.findIndex(e=>e.id===a.era)-periodCategories.findIndex(e=>e.id===b.era));}
export function categoryOf(dimension,id){return dimensions[dimension]?.categories.find(c=>c.id===id);}
export const mainNavigation=[['/periods/','시대별','periods'],['/regions/','지역별','regions'],['/functions/','기능별','functions'],['/types/','종류별','types'],['/compare/','건축 비교','compare'],['/library/','자료실','library']];
export const routes=[
 {path:'/',kind:'home',title:'기억 — 한국건축 아카이브'},
 ...Object.entries(dimensions).flatMap(([dimension,d])=>[
   {path:`/${dimension}/`,kind:'directory',dimension,title:`${d.name} — 기억`},
   ...d.categories.map(c=>({path:categoryURL(dimension,c.id),kind:'collection',dimension,id:c.id,title:`${c.name} · ${d.name} — 기억`}))
 ]),
 ...buildings.map(b=>({path:recordURL(b.id),kind:'record',id:b.id,title:`${b.title} — 기억`})),
 {path:'/compare/',kind:'compare',title:'건축 비교 — 기억'},
 {path:'/library/',kind:'sources',title:'출처 자료실 — 기억'},
 {path:'/library/glossary/',kind:'glossary',title:'건축 용어집 — 기억'},
 {path:'/library/quiz/',kind:'quiz',title:'배움 확인 — 기억'},
 {path:'/library/photos/',kind:'credits',title:'사진 출처 — 기억'},
 {path:'/saved/',kind:'saved',title:'나의 보관함 — 기억'},
 {path:'/search/',kind:'search',title:'아카이브 검색 — 기억'},
 {path:'/404.html',kind:'notfound',title:'페이지를 찾을 수 없습니다 — 기억'},
];
