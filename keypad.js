function bindNumberFields(){document.querySelectorAll('[data-model]').forEach(input=>{input.onfocus=()=>openPad(input);input.onclick=()=>openPad(input);input.oninput=()=>{const m=state.numbers[input.dataset.model];m[input.dataset.part]=input.value;if(m.mode==='fraction'&&!m.num&&!m.den){m.mode='plain';m.value='';rebuildNumber(input);}else clearFeedback();};input.onkeydown=e=>{const m=state.numbers[input.dataset.model];if((e.key==='Backspace'||e.key==='Delete')&&m.mode==='fraction'&&!m.num&&!m.den){e.preventDefault();m.mode='plain';m.value='';rebuildNumber(input);}};});}
function openPad(input){if(!input)return;activeInput=input;$('#keypad').hidden=false;$('#pad-toggle').setAttribute('aria-pressed','true');$('#pad-target').textContent=input.dataset.part==='num'?'Píšeš čitatele (horní číslo).':input.dataset.part==='den'?'Píšeš jmenovatele (spodní číslo).':'Píšeš do odpovědního pole.';clampFloating($('#keypad'));}
function closePad(){ $('#keypad').hidden=true;$('#pad-toggle').setAttribute('aria-pressed','false');activeInput=null;}
$('#pad-toggle').onclick=()=>{if(!$('#keypad').hidden){closePad();return;}const el=$('[data-model]');if(el){el.focus();openPad(el);}};$('#pad-close').onclick=closePad;
const keys=[['7','7'],['8','8'],['9','9'],['minus','−'],['4','4'],['5','5'],['6','6'],['fraction',fractionIcon],['1','1'],['2','2'],['3','3'],['back','⌫'],['0','0'],['comma',','],['ok','OK'],['clear','Vymazat vše']];$('#keys').innerHTML=keys.map(([k,label])=>`<button data-key="${k}" aria-label="${k==='fraction'?'Přepnout zlomek / běžné číslo':k==='clear'?'Vymazat celou odpověď':k==='back'?'Smazat znak':k==='ok'?'Zavřít klávesnici':k==='minus'?'Znaménko minus':k==='comma'?'Desetinná čárka':label}">${label}</button>`).join('');
$('#keys').querySelectorAll('button').forEach(b=>{b.onpointerdown=e=>e.preventDefault();b.onclick=()=>keyPress(b.dataset.key);});
function keyPress(key){if(key==='ok'){closePad();return;}if(!activeInput||!document.contains(activeInput))return;const input=activeInput,m=state.numbers[input.dataset.model];
if(key==='clear'){Object.assign(m,{mode:'plain',value:'',num:'',den:''});rebuildNumber(input);return;}
if(key==='fraction'){
 if(m.mode==='fraction'){m.value=m.num;m.mode='plain';m.num='';m.den='';}
 else{m.num=/^-?\d+$/.test(m.value)?m.value:'';m.den='';m.mode='fraction';}
 rebuildNumber(input);return;
}
if(key==='back'&&m.mode==='fraction'&&!m.num&&!m.den){m.mode='plain';m.value='';rebuildNumber(input);return;}
const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;let value=input.value,pos=start;
if(key==='back'){if(start!==end){value=value.slice(0,start)+value.slice(end);}else if(start>0){value=value.slice(0,start-1)+value.slice(end);pos--;} }
else if(key==='minus'){if(input.dataset.part==='den')return;value=value.startsWith('-')?value.slice(1):'-'+value;pos=value.length;}
else{const ch=key==='comma'?',':key;if(ch===','&&(m.mode==='fraction'||/[,.]/.test(value)))return;if(value.length>=input.maxLength&&start===end)return;value=value.slice(0,start)+ch+value.slice(end);pos=start+ch.length;}
input.value=value;input.setSelectionRange(Math.max(0,pos),Math.max(0,pos));m[input.dataset.part]=value;if(m.mode==='fraction'&&!m.num&&!m.den){m.mode='plain';m.value='';rebuildNumber(input);}else clearFeedback();}

function clampFloating(el){if(el.hidden)return;const r=el.getBoundingClientRect();el.style.left=Math.max(5,Math.min(r.left,innerWidth-r.width-5))+'px';el.style.top=Math.max(5,Math.min(r.top,innerHeight-r.height-5))+'px';el.style.right='auto';}
function dragPanel(panel,handle){let drag=null;handle.onpointerdown=e=>{if(e.button!==0)return;const r=panel.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top};handle.setPointerCapture(e.pointerId);};handle.onpointermove=e=>{if(!drag)return;panel.style.left=e.clientX-drag.x+'px';panel.style.top=e.clientY-drag.y+'px';panel.style.right='auto';clampFloating(panel);};handle.onpointerup=handle.onpointercancel=()=>{drag=null;};handle.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const r=panel.getBoundingClientRect();panel.style.left=r.left+(e.key==='ArrowLeft'?-10:e.key==='ArrowRight'?10:0)+'px';panel.style.top=r.top+(e.key==='ArrowUp'?-10:e.key==='ArrowDown'?10:0)+'px';clampFloating(panel);};}

dragPanel($('#keypad'),$('#pad-handle'));window.addEventListener('resize',()=>clampFloating($('#keypad')));document.addEventListener('keydown',e=>{if(e.key==='Escape')closePad();});

function rebuildNumber(input){const which=input.dataset.model,wrap=input.closest('.answer-wrap');wrap.outerHTML=numberField(which,wrap.dataset.label,wrap.dataset.unit);bindNumberFields();const next=$(`[data-model="${which}"]`);next.focus();openPad(next);clearFeedback();}
