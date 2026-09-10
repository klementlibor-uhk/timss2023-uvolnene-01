'use strict';
const answers={};let page=0,unlocked=0,finished=false,selected='S',elapsed=0,activeInput=null;const started=Date.now();
const state={numbers:Object.fromEntries(['q1','q3','q5','q11a'].map(k=>[k,{mode:'plain',value:'',num:'',den:''}]))};
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const escapeHTML=esc;
const fractionIcon='<span class="fraction-icon" aria-hidden="true"><span></span><i></i><span></span></span>';
function numberField(key,label='Odpověď:',unit=''){const m=state.numbers[key];return `<div class="answer-wrap"><span id="${key}-label">${label}</span><div class="answer-box">${m.mode==='plain'?`<input id="${key}-value" data-model="${key}" data-part="value" aria-labelledby="${key}-label" type="text" inputmode="decimal" autocomplete="off" maxlength="32" value="${esc(m.value)}" ${finished?'readonly':''}>`:`<div class="fraction-editor"><input id="${key}-num" data-model="${key}" data-part="num" aria-label="Čitatel zlomku" type="text" inputmode="numeric" autocomplete="off" maxlength="12" value="${esc(m.num)}" ${finished?'readonly':''}><input id="${key}-den" data-model="${key}" data-part="den" aria-label="Jmenovatel zlomku" type="text" inputmode="numeric" autocomplete="off" maxlength="12" value="${esc(m.den)}" ${finished?'readonly':''}></div>`}</div>${unit?`<span>${unit}</span>`:''}</div>`;}
const input=numberField;
function clearFeedback(){if(finished)return;for(const [key,m] of Object.entries(state.numbers))answers[key]=m.mode==='plain'?m.value:(m.num||m.den?`${m.num}/${m.den}`:'');renderSteps();}
function formatTime(t){return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;}
function snailStatus(){return ['S','T'].map(t=>`Šnek ${t}: ${answers['snail'+t]===undefined?'zatím neumístěn':'bod '+(Number(answers['snail'+t])+1)}`).join(' · ');}
