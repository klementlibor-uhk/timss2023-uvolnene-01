'use strict';
function workMark(parent,ok,filled=true){
  const mark=document.createElement('span');mark.className='portfolio-mark '+(!filled?'missing':ok?'correct':'incorrect');
  mark.textContent=!filled?'— Bez odpovědi':ok?'✓ Správně':'× Nesprávně';parent.append(mark);
}
function preparePortfolio(){
  if(!finished)return;
  const root=$('#portfolio'),scores=TIMSS.score(answers),sum=scores.reduce((a,b)=>a+b,0);
  const percent=(sum/12*100).toLocaleString('cs-CZ',{maximumFractionDigits:1});
  root.innerHTML=`<header class="portfolio-header"><p class="eyebrow">Moje práce do portfolia</p><h1>Matematický test číslo 1</h1>${pupilName?`<p class="portfolio-name">Jméno: <b>${esc(pupilName)}</b></p>`:''}<p><b>${sum} / 12 bodů</b> · <b>${percent} %</b> · Čas řešení ${formatTime(elapsed)} · ${esc(completedDate)}</p></header>`;
  const expected={q2:'C',q4:'A',q6:'C',q7:'A',angleB:'C',angleC:'B',angleD:'C',angleE:'A',q10:'B',q11b:'B'};
  const scoreIndex={q1:0,q3:2,q5:4,q11a:10};
  for(let i=0;i<11;i++){
    const earned=i===10?scores[10]+scores[11]:scores[i],max=i===10?2:1;
    const filled=required[i].some(k=>String(answers[k]??'').trim()!=='');
    const status=earned===max?'correct':earned?'partial':'incorrect';
    const label=!filled?'Bez odpovědi':status==='correct'?'Správně':status==='partial'?'Částečně správně':'Nesprávně';
    const article=document.createElement('article');article.className='portfolio-task';
    article.innerHTML=`<div class="portfolio-task-head"><h2>Úloha ${i+1}</h2><span class="status ${status}">${label} · ${earned}/${max} ${max===1?'bod':'body'}</span></div><div class="portfolio-question">${screens[i]()}</div>`;
    article.querySelectorAll('.answer-wrap').forEach(wrap=>{
      const field=wrap.querySelector('[data-model]'),key=field.dataset.model;
      workMark(wrap,!!scores[scoreIndex[key]],String(answers[key]??'').trim()!=='');
    });
    article.querySelectorAll('input[type="radio"]').forEach(input=>{
      const chosen=input.checked,label=input.closest('label');
      if(chosen){label.classList.add('portfolio-selected');workMark(label,input.value===expected[input.name]);}
      const mark=document.createElement('span');mark.className='portfolio-choice-mark';mark.textContent=chosen?'●':'○';
      mark.setAttribute('aria-label',chosen?'Žákova odpověď':'Neoznačeno');input.replaceWith(mark);
    });
    article.querySelectorAll('[data-model]').forEach(input=>{
      const span=document.createElement('span');span.className='portfolio-number';span.textContent=input.value||'—';input.replaceWith(span);
    });
    article.querySelectorAll('textarea').forEach(input=>{
      const answer=document.createElement('p');answer.className='portfolio-written';answer.textContent=input.value||'— Bez vysvětlení';input.replaceWith(answer);
    });
    if(i===8){
      for(const [j,t] of ['S','T'].entries()){
        const note=document.createElement('p');note.textContent=`Šnek ${t}: `;
        workMark(note,String(answers['snail'+t])===String(j===0?10:9),answers['snail'+t]!==undefined);
        article.querySelector('.portfolio-question').append(note);
      }
      article.querySelectorAll('.landing-control').forEach(el=>el.remove());
      article.querySelectorAll('.track-snail').forEach(button=>{
        const snail=document.createElement('div');snail.className=button.className;snail.style.cssText=button.style.cssText;snail.innerHTML=button.innerHTML;button.replaceWith(snail);
      });
    }
    // The print copy is static; no duplicate interactive field IDs.
    article.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
    article.querySelectorAll('[tabindex],[aria-labelledby]').forEach(el=>{el.removeAttribute('tabindex');el.removeAttribute('aria-labelledby');});
    root.append(article);
  }
  const source=document.createElement('p');source.className='portfolio-source';source.textContent='Uvolněné úlohy TIMSS 2023. © 2025 IEA. Vydavatel: TIMSS & PIRLS International Study Center, Boston College.';root.append(source);
  window.CzechTypography?.apply(root);
}
function showPortfolio(){
  if(!finished)return;closePad();preparePortfolio();document.body.classList.remove('certificate-preview');
  document.body.classList.add('portfolio-preview');$('#certificate-tools').hidden=true;$('#portfolio-tools').hidden=false;$('#portfolio').hidden=false;
  window.scrollTo(0,0);$('#portfolio-back').focus({preventScroll:true});
}
$('#portfolio-back').onclick=()=>{document.body.classList.remove('portfolio-preview');$('#portfolio-tools').hidden=true;$('#portfolio').hidden=true;window.scrollTo(0,0);$('#print-answers').focus({preventScroll:true});};
$('#portfolio-print').onclick=async()=>{await Promise.all([...$('#portfolio').querySelectorAll('img')].map(img=>img.decode().catch(()=>{})));window.print();};
window.addEventListener('beforeprint',()=>{if(document.body.classList.contains('portfolio-preview'))preparePortfolio();});
