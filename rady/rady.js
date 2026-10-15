'use strict';
const names=['Vítej','Vyber odpověď','Napiš číslo','Napiš zlomek','Přesuň kartičky','Nakresli čáru','Vyber z nabídky','Vyber více odpovědí','Máš vyzkoušeno'];
const state={step:0,unlocked:0,done:new Set(),choice:'',numbers:{practiceNumber:{mode:'plain',value:'',num:'',den:''},practiceFraction:{mode:'plain',value:'',num:'',den:''}},tiles:['','',''],drawing:[],days:'',multi:[],feedback:{}};
const $=s=>document.querySelector(s);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let activeInput=null;
const fractionIcon='<span class="fraction-icon" aria-hidden="true"><span></span><i></i><span></span></span>';
function numberField(key,label='Odpověď:',unit='') {
  const m=state.numbers[key];
  return `<div class="answer-wrap" data-label="${escapeHTML(label)}" data-unit="${escapeHTML(unit)}"><span id="${key}-label">${label}</span><div class="answer-box">${m.mode==='plain'?`<input id="${key}-value" data-model="${key}" data-part="value" aria-labelledby="${key}-label" type="text" inputmode="numeric" data-integer="true" pattern="[0-9]*" autocomplete="off" maxlength="32" value="${escapeHTML(m.value)}">`:`<div class="fraction-editor"><input id="${key}-num" data-model="${key}" data-part="num" aria-label="Čitatel zlomku" type="text" inputmode="numeric" data-integer="true" pattern="[0-9]*" maxlength="12" value="${escapeHTML(m.num)}"><input id="${key}-den" data-model="${key}" data-part="den" aria-label="Jmenovatel zlomku" type="text" inputmode="numeric" data-integer="true" pattern="[0-9]*" maxlength="12" value="${escapeHTML(m.den)}"></div>`}</div></div>`;
}
function clearFeedback(){delete state.feedback[state.step];state.done.delete(state.step);const el=$('#feedback');if(el)el.textContent='';renderSteps();}
function feedbackMarkup(){const f=state.feedback[state.step];return `<p id="feedback" class="feedback ${f&&!f.ok?'error':''}" role="status">${f?escapeHTML(f.text):''}</p>`;}
function updateFeedback(ok,text){state.feedback[state.step]={ok,text};if(ok)state.done.add(state.step);else state.done.delete(state.step);const el=$('#feedback');el.textContent=text;el.className='feedback'+(ok?'':' error');renderSteps();}
const practiceRows=Array.from({length:3},()=>({prefix:'',suffix:''}));
const coach=text=>`<div class="practice-coach"><img src="../assets/zelvicka.png" alt="Želvička"><p>${text}</p></div>`;
const animals=[['snake','Had'],['bird','Pták'],['camel','Velbloud'],['snail','Šnek'],['deer','Jelen']];
const pages=[
 ()=>`<span class="eyebrow">Než začneš</span><h1>Vítej! Pojď si to vyzkoušet.</h1><p class="lead">Tady zjistíš, jak se test vyplňuje. Všechno si můžeš v klidu vyzkoušet.</p><div class="welcome"><div><ul class="welcome-list"><li>Vybereš jednu nebo více odpovědí.</li><li>Napíšeš číslo i zlomek a přesuneš kartičky.</li><li>Nakreslíš čáru a vybereš odpověď z nabídky.</li></ul><p class="hint">Tady se neznámkuje a čas se neměří. Když se něco nepovede, zkus to znovu.</p></div><img src="../assets/zelvicka.png" alt="Usměvavá želvička s modrým krunýřem"></div><p>Postupuj tlačítkem <b>Další krok →</b>. K otevřeným krokům se můžeš vracet kolečky vlevo.</p>`,
 ()=>`<span class="eyebrow">Zkus si odpovědět</span><h1>Vyber jednu odpověď.</h1><p class="lead">Klikni na odpověď, kterou považuješ za správnou. Když si to rozmyslíš, klikni na jinou.</p><div class="exercise"><fieldset class="choice-group"><legend>Kolik minut má jedna hodina?</legend>${['12','24','60','120'].map((v,i)=>`<label class="choice"><input type="radio" name="practice-choice" value="${v}" ${state.choice===v?'checked':''}><span class="bubble">${'ABCD'[i]}</span><span>${v}</span></label>`).join('')}</fieldset><button class="check" id="check">Zkontrolovat</button>${feedbackMarkup()}</div><p class="subtle">V testu se správnost odpovědí dozvíš až po odevzdání.</p>`,
 ()=>`<span class="eyebrow">Číselná klávesnice</span><h1>Napiš číslo</h1><p class="lead">Klikni do políčka. Číselná klávesnice se otevře sama. Můžeš ji posunout za horní lištu.</p><div class="exercise"><h2>Napiš číslo 24.</h2>${numberField('practiceNumber')}<button class="check" id="check">Zkontrolovat</button>${feedbackMarkup()}</div><p class="hint"><b>⌫</b> smaže znak, <b>Vymazat vše</b> celou odpověď a <b>OK</b> klávesnici zavře. Můžeš použít i klávesnici počítače.</p>`,
 ()=>`<h1>Napiš zlomek</h1><p class="lead">Klikni do políčka a potom na tlačítko ${fractionIcon}. Napiš číslo nahoře a dole.</p><div class="exercise"><p class="fraction-task">Zkus napsat <span class="frac" aria-label="tři čtvrtiny"><span>3</span><span>4</span></span>.</p>${numberField('practiceFraction')}<button class="check" id="check">Zkontrolovat</button>${feedbackMarkup()}</div><p class="hint">Dalším stisknutím ${fractionIcon} se vrátíš k běžnému číslu.</p>`,
 ()=>`<span class="eyebrow">Chytni a přesuň</span><h1>Přesuň kartičky</h1><p class="lead">Někdy odpovíš tak, že slova, čísla nebo obrázky přetáhneš.</p><div class="exercise"><div class="practice-demo">${CardTiles.markup({values:[1,2,3],slots:state.tiles,rows:practiceRows,simple:true})}${coach('Klikni na číslo, přidrž ho, přetáhni do rámečku a pusť. Procvič si přetažení všech čísel do spodních rámečků.')}</div><button class="check" id="check">Zkontrolovat</button>${feedbackMarkup()}</div>`,
 ()=>`<span class="eyebrow">Kreslení v síti</span><h1>Nakresli čáru.</h1><p class="lead">Vyzkoušej si nakreslit čáru do čtvercové sítě.</p><div class="exercise">${GridDrawing.markup({edges:state.drawing,plain:true,label:'Prázdná čtvercová síť pro nácvik kreslení'})}${coach('Zapni Kreslit, klikni na síť a táhni po linkách. Gumou můžeš vymazat jednotlivý úsek. Tlačítkem Začít znovu vymažeš všechny své čáry.')}<button class="check" id="check">Zkontrolovat</button>${feedbackMarkup()}</div>`,
 ()=>`<span class="eyebrow">Rozbalovací nabídka</span><h1>Vyber z nabídky</h1><p class="lead">S pomocí rozbalovací nabídky urči, kolik dní má jeden týden.</p><div class="exercise"><div class="practice-demo"><label class="select-answer"><span class="sr-only">Počet dní v týdnu:</span><select id="practice-days" aria-label="Počet dní v týdnu"><option value="">Vyber jednu možnost</option>${['3','7','10'].map(n=>`<option value="${n}" ${state.days===n?'selected':''}>${n}</option>`).join('')}</select></label>${coach('Kliknutím na „Vyber jednu možnost“ se ti zobrazí možné odpovědi. Klikni na tu, kterou považuješ za správnou. Procvič si vybírání odpovědi.')}</div><button class="check" id="check">Zkontrolovat</button>${feedbackMarkup()}</div><p class="hint">Chceš odpověď změnit? Nabídku otevři znovu a vyber jinou možnost.</p>`,
 ()=>`<span class="eyebrow">Vyber všechny správné odpovědi</span><h1>Můžeš vybrat více odpovědí.</h1><p class="lead">Klikni na <b>všechna</b> zvířata, která mají čtyři nohy.</p><div class="exercise"><fieldset class="animal-options"><legend class="sr-only">Zvířata se čtyřmi nohami</legend>${animals.map(([key,name])=>`<label class="animal-choice"><input type="checkbox" name="practice-multi" value="${key}" ${state.multi.includes(key)?'checked':''}><img src="../assets/original/practice-${key}.png" alt="${name}"><span>${name}</span></label>`).join('')}</fieldset><button class="check" id="check">Zkontrolovat</button>${feedbackMarkup()}</div><p class="hint">Zde potřebuješ vybrat více než jednu odpověď. Klikni na všechny, které považuješ za správné. Dalším kliknutím výběr zrušíš.</p>`,
 ()=>`<span class="eyebrow">Rady máš za sebou</span><div class="finish-mark" aria-hidden="true">✓</div><h1>Teď už víš, jak na to.</h1><p class="lead">V testu si vždy pozorně přečti zadání. Odpověď můžeš před odevzdáním změnit.</p><ul class="summary-list"><li>Kolečky a tlačítky se pohybuj mezi úlohami.</li><li>Čísla piš do políček, kartičky přesuň na místo.</li><li>Čáru kresli po linkách sítě; chybu můžeš vymazat.</li><li>Z rozbalovacích nabídek vybírej požadovanou odpověď.</li><li>Kde je napsáno „všechny“, může být správných více odpovědí.</li></ul><div class="row tutorial-finish-actions"><button class="secondary" id="repeat">Projít rady znovu</button><a class="secondary tutorial-link" href="../index.html">Zpět na úvodní stránku</a><a class="primary tutorial-link" href="../test.html">Spustit test →</a></div>`
];
function renderSteps(){
  $('#steps').innerHTML=names.map((name,i)=>`<li class="${state.done.has(i)?'done':''}"><button data-step="${i}" ${i>state.unlocked?'disabled':''} ${i===state.step?'aria-current="step"':''} aria-label="Krok ${i+1}: ${name}"><span class="circle">${i+1}</span><span class="step-name">${name}</span></button></li>`).join('');
  $('#steps').querySelectorAll('button').forEach(b=>b.onclick=()=>navigate(Number(b.dataset.step)));
}
function navigate(i){if(i<0||i>=names.length||i>state.unlocked)return;closePad();state.step=i;render();}
function render(focus=true){
  $('#content').dataset.step=state.step;renderSteps();$('#content').innerHTML=pages[state.step]();
  $('#back').disabled=state.step===0;$('#next').hidden=state.step===8;$('#next').textContent=state.step===7?'Dokončit rady →':'Další krok →';
  $('#pad-toggle').disabled=![2,3].includes(state.step);bindPage();if(focus){$('#content').focus({preventScroll:true});window.scrollTo({top:0,left:0,behavior:'instant'});}
}
$('#back').onclick=()=>navigate(state.step-1);
$('#next').onclick=()=>{if(state.step===0)state.done.add(0);if(state.step<8){state.unlocked=Math.max(state.unlocked,state.step+1);navigate(state.step+1);}};
function bindPage(){
  bindNumberFields();
  $('#content').querySelectorAll('input[name="practice-choice"]').forEach(el=>el.onchange=()=>{state.choice=el.value;clearFeedback();});
  $('#content').querySelectorAll('input[name="practice-multi"]').forEach(el=>el.onchange=()=>{state.multi=[...$('#content').querySelectorAll('input[name="practice-multi"]:checked')].map(x=>x.value);clearFeedback();});
  const menu=$('#practice-days');if(menu)menu.onchange=()=>{state.days=menu.value;clearFeedback();};
  if(state.step===4)CardTiles.bind($('[data-card-board]'),{values:[1,2,3],rows:practiceRows,simple:true,get:()=>state.tiles,onchange:slots=>{state.tiles=slots;clearFeedback();}});
  if(state.step===5)GridDrawing.bind($('[data-drawing-board]'),{get:()=>state.drawing,onchange:edges=>{state.drawing=edges;clearFeedback();}});
  const check=$('#check');
  if(check)check.onclick=()=>{
    closePad();let ok=false,text='';
    if(state.step===1){ok=state.choice==='60';text=ok?'Správně! Jedna hodina má 60 minut.':'Zkus to znovu. Jedna hodina má 60 minut.';}
    if(state.step===2){const m=state.numbers.practiceNumber;ok=TIMSS.number(m.mode==='plain'?m.value:`${m.num}/${m.den}`)===24;text=ok?'Správně, napsal/a jsi 24.':'Zkontroluj číslice. Máš napsat číslo 24.';}
    if(state.step===4){ok=state.tiles.every(v=>['1','2','3'].includes(v))&&new Set(state.tiles).size===3;text=ok?'Výborně! Přesunul/a jsi všechny tři čtverečky do rámečků.':'Přesuň všechny tři čtverečky do spodních rámečků. Na jejich pořadí nezáleží.';}
    if(state.step===5){ok=state.drawing.length>0;text=ok?'Výborně! Čáru už umíš nakreslit. Může vést kterýmkoli směrem po linkách sítě. Vyzkoušej si také gumu a tlačítko Začít znovu.':'Nejprve zapni Kreslit a vyzkoušej si nakreslit čáru po linkách sítě.';}
    if(state.step===6){ok=state.days==='7';text=ok?'Správně! Jeden týden má 7 dní.':'Zkus to znovu. Jeden týden má 7 dní.';}
    if(state.step===7){ok=state.multi.length===2&&state.multi.includes('camel')&&state.multi.includes('deer');text=ok?'Správně! Čtyři nohy mají velbloud a jelen.':'Čtyři nohy mají velbloud a jelen. Označ oba a ostatní zvířata nech neoznačená.';}
    if(state.step===3){const m=state.numbers.practiceFraction;ok=m.mode==='fraction'&&TIMSS.number(`${m.num}/${m.den}`)===0.75;text=ok?'Správně, napsal/a jsi tři čtvrtiny.':'Klikni na tlačítko zlomku. Nahoře napiš 3 a dole 4.';}
    updateFeedback(ok,text);
  };
  if($('#repeat'))$('#repeat').onclick=()=>navigate(0);
}
window.addEventListener('DOMContentLoaded',()=>render(false));
