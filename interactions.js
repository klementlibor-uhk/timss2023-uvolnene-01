'use strict';
window.CardTiles=(()=>{
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function content({values,slots,rows,disabled=false,simple=false},selected=null) {
    return `<div class="tile-pool" aria-label="Nabídka kartiček">${values.map(v=>slots.includes(String(v))?`<span class="tile-placeholder" aria-label="Kartička ${v} je v odpovědi">—</span>`:`<button type="button" class="tile-card ${selected===String(v)?'selected':''}" data-card="${v}" aria-pressed="${selected===String(v)}" ${disabled?'disabled':''}>${v}</button>`).join('')}</div><div class="tile-rows ${simple?'practice-tile-targets':''}">${rows.map((r,i)=>`<div class="tile-row"><span>${r.prefix}</span><button type="button" class="tile-drop ${slots[i]?'filled':''} ${selected===slots[i]?'selected':''}" data-drop="${i}" ${slots[i]?`data-card="${escape(slots[i])}"`:''} aria-label="${['První','Druhé','Třetí'][i]||'Odpovědní'} políčko${slots[i]?': '+escape(slots[i]):', prázdné'}" ${disabled?'disabled':''}>${slots[i]||(simple?'':'<span aria-hidden="true">?</span>')}</button><span>${r.suffix}</span></div>`).join('')}</div>${disabled?'':`<button type="button" class="secondary tile-return" data-return disabled>Vrátit vybranou kartičku do nabídky</button><p class="subtle">Kartičku přetáhni do políčka. Můžeš také kliknout na kartičku a potom na políčko. Každá kartička může být jen na jednom místě.</p>`}`;
  }
  function markup(options) {return `<div class="card-board ${options.simple?'simple-card-board':''}" data-card-board>${content(options)}</div>`;}
  function bind(root,config) {
    if(!root||config.disabled)return;
    let selected=null,drag=null;
    const draw=()=>{root.innerHTML=content({...config,slots:config.get()},selected);root.querySelector('[data-return]').disabled=selected===null;if(selected!==null)root.querySelector(`[data-card="${selected}"]`)?.focus();};
    const move=target=>{
      if(selected===null)return;
      const slots=[...config.get()].map(v=>String(v??''));
      const old=slots.indexOf(selected);
      if(old>=0)slots[old]='';
      if(target!==null)slots[target]=selected;
      config.onchange(slots);
      selected=null;draw();
      root.querySelector(target===null?'[data-card]':`[data-drop="${target}"]`)?.focus();
    };
    root.addEventListener('click',e=>{
      const target=e.target.closest('[data-drop]');
      if(target&&selected!==null){move(Number(target.dataset.drop));return;}
      if(e.target.closest('[data-return]')){move(null);return;}
      const card=e.target.closest('[data-card]');
      if(card){selected=selected===card.dataset.card?null:card.dataset.card;draw();}
    });
    root.addEventListener('keydown',e=>{
      const card=e.target.closest('[data-card]');
      if(card&&(e.key==='Delete'||e.key==='Backspace')){e.preventDefault();selected=card.dataset.card;move(null);}
      if(e.key==='Escape'){selected=null;draw();}
    });
    root.addEventListener('pointerdown',e=>{
      const card=e.target.closest('[data-card]');
      if(!card||e.button!==0)return;
      drag={value:card.dataset.card,drop:card.dataset.drop??null,x:e.clientX,y:e.clientY,id:e.pointerId,moved:false,ghost:null};
      root.setPointerCapture(e.pointerId);
    });
    root.addEventListener('pointermove',e=>{
      if(!drag)return;
      if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7) {
        drag.moved=true;drag.ghost=document.createElement('div');
        drag.ghost.className='tile-ghost';drag.ghost.textContent=drag.value;document.body.append(drag.ghost);
      }
      if(drag.moved) {
        e.preventDefault();drag.ghost.style.left=(e.clientX-42)+'px';drag.ghost.style.top=(e.clientY-42)+'px';
        const drop=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop]');
        root.querySelectorAll('[data-drop]').forEach(el=>el.classList.toggle('drag-over',el===drop));
        root.querySelector('.tile-pool').classList.toggle('drag-over',!!document.elementFromPoint(e.clientX,e.clientY)?.closest('.tile-pool'));
      }
    });
    function end(e,cancel=false) {
      if(!drag)return;
      const d=drag;drag=null;d.ghost?.remove();
      root.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));
      if(d.moved){
        if(!cancel) {
          const hit=document.elementFromPoint(e.clientX,e.clientY);
          const drop=hit?.closest('[data-drop]');
          selected=d.value;
          if(drop&&root.contains(drop))move(Number(drop.dataset.drop));
          else if(hit?.closest('.tile-pool')&&root.contains(hit))move(null);
          else draw();
        }
      } else if(!cancel) {
        if(selected!==null&&d.drop!==null)move(Number(d.drop));
        else {selected=selected===d.value?null:d.value;draw();}
      }
      if(root.hasPointerCapture(e.pointerId))root.releasePointerCapture(e.pointerId);
    }
    root.addEventListener('pointerup',e=>end(e));
    root.addEventListener('pointercancel',e=>end(e,true));
  }
  return {markup,bind};
})();

window.GridDrawing=(()=>{
  const start=40,step=64,size=7;
  const px=x=>start+x*step;
  function edge(a,b) {
    if(a[0]>b[0]||a[0]===b[0]&&a[1]>b[1])[a,b]=[b,a];
    return `${a[0]},${a[1]}:${b[0]},${b[1]}`;
  }
  function lineMarkup(edges,color='#287bb3') {
    return edges.map(s=>{const c=s.match(/^(\d+),(\d+):(\d+),(\d+)$/);if(!c)return '';const [x,y,u,v]=c.slice(1).map(Number);return `<line x1="${px(x)}" y1="${px(y)}" x2="${px(u)}" y2="${px(v)}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;}).join('');
  }
  function star(x,y) {
    return `<path d="M0 -13 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4 Z" transform="translate(${px(x)} ${px(y)})" fill="#233148" pointer-events="none"/>`;
  }
  const icons={
    pen:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16 16 5l3 3L8 19l-5 2z" fill="#287bb3" stroke="#185a86"/></svg>',
    eraser:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 14 10-10 8 8-8 10H9z" fill="#f2b6cc" stroke="#785367"/><path d="m6 11 8 8" stroke="#785367"/></svg>',
    reset:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8a8 8 0 1 1-1 7" fill="none" stroke="#b57518" stroke-width="2.5"/><path d="m3 3 2 6 6-2" fill="none" stroke="#b57518" stroke-width="2.5"/></svg>'
  };
  function markup({edges=[],disabled=false,starX=5,starY=2,marieSrc='assets/original/q08-marie.png',plain=false,label='Čtvercová síť pro kreslení'}={}) {
    const grid=Array.from({length:8},(_,i)=>`<path d="M${px(i)} ${px(0)} V${px(size)} M${px(0)} ${px(i)} H${px(size)}" stroke="#a5b0bc" stroke-width="1"/>`).join('');
    return `<div class="drawing-board" data-drawing-board><div class="drawing-area"><svg class="drawing-grid" viewBox="0 0 528 528" role="application" tabindex="${disabled?'-1':'0'}" aria-label="${label}" data-grid><rect x="40" y="40" width="448" height="448" fill="#fff"/>${grid}${plain?'':`<image href="${marieSrc}" x="${px(3)-20}" y="${px(5)-85}" width="44" height="82" preserveAspectRatio="xMidYMax meet" pointer-events="none"/><path d="M${px(1)} ${px(5)} H${px(6)}" stroke="#233148" stroke-width="4" pointer-events="none"/><text x="${px(3)}" y="${px(5)+22}" text-anchor="middle" font-size="17" fill="#233148" pointer-events="none">Marie</text>${star(starX,starY)}`}<g class="ink-layer">${lineMarkup(edges)}</g><circle class="grid-cursor" cx="${px(1)}" cy="${px(1)}" r="8" fill="#f0a530" stroke="white" stroke-width="2" hidden/></svg></div>${disabled?'':`<div class="drawing-tools" aria-label="Nástroje pro kreslení"><button type="button" class="draw-tool" data-tool="pen" aria-pressed="false">${icons.pen}<span>Kreslit</span></button><button type="button" class="draw-tool" data-tool="eraser" aria-pressed="false">${icons.eraser}<span>Guma</span></button><button type="button" class="draw-tool" data-tool="reset">${icons.reset}<span>Začít znovu</span></button></div>`}</div>${disabled?'':`<p class="drawing-help subtle" role="status">Nejprve klikni na Kreslit nebo Guma. Čára vede po linkách sítě.</p><p class="sr-only">Klávesnicí: šipky posouvají bod, mezerník zapíná a vypíná kreslení. Nástroj vyber tlačítkem Kreslit nebo Guma.</p>`}`;
  }
  function bind(root,config) {
    if(!root||config.disabled)return;
    const svg=root.querySelector('[data-grid]'),ink=root.querySelector('.ink-layer'),cursor=svg.querySelector('.grid-cursor');
    const help=root.nextElementSibling;
    let mode=null,previous=null,drawing=false,pointer=null,cursorNode=[1,1],keyboardDrawing=false;
    const current=()=>new Set(config.get()||[]);
    const commit=set=>{const values=[...set];ink.innerHTML=lineMarkup(values);config.onchange(values);};
    const point=e=>{const r=svg.getBoundingClientRect();return [(e.clientX-r.left)*528/r.width,(e.clientY-r.top)*528/r.height];};
    const node=p=>p.map(v=>Math.max(0,Math.min(size,Math.round((v-start)/step))));
    function travel(from,to) {
      const set=current(),p=[...from];
      const axes=Math.abs(to[0]-p[0])>=Math.abs(to[1]-p[1])?[0,1]:[1,0];
      for(const axis of axes)while(p[axis]!==to[axis]){const next=[...p];next[axis]+=Math.sign(to[axis]-p[axis]);const s=edge(p,next);if(mode==='pen')set.add(s);else set.delete(s);p[axis]=next[axis];}
      commit(set);
    }
    function eraseAt(p) {
      const set=current();let closest=null,distance=Infinity;
      for(const s of set) {
        const c=s.match(/^(\d+),(\d+):(\d+),(\d+)$/);if(!c)continue;
        const [x,y,u,v]=c.slice(1).map(Number),a=[px(x),px(y)],b=[px(u),px(v)];
        const length=(b[0]-a[0])**2+(b[1]-a[1])**2;
        const t=Math.max(0,Math.min(1,((p[0]-a[0])*(b[0]-a[0])+(p[1]-a[1])*(b[1]-a[1]))/length));
        const d=Math.hypot(p[0]-a[0]-t*(b[0]-a[0]),p[1]-a[1]-t*(b[1]-a[1]));
        if(d<distance){distance=d;closest=s;}
      }
      if(closest&&distance<=22){set.delete(closest);commit(set);}
    }
    root.querySelectorAll('[data-tool]').forEach(button=>button.addEventListener('click',()=>{
      if(button.dataset.tool==='reset'){commit(new Set());keyboardDrawing=false;if(help)help.textContent='Čáry jsou vymazané. Můžeš začít znovu.';return;}
      mode=button.dataset.tool;keyboardDrawing=false;
      root.querySelectorAll('[aria-pressed]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      if(help)help.textContent=mode==='pen'?'Kreslení je zapnuté. Klikni na síť a táhni po linkách.':'Guma je zapnutá. Klikni na nakreslený úsek, který chceš vymazat.';
    }));
    svg.addEventListener('pointerdown',e=>{
      if(!mode||e.button!==0)return;
      const p=point(e);if(p.some(v=>v<25||v>503))return;
      e.preventDefault();drawing=true;pointer=e.pointerId;svg.setPointerCapture(pointer);previous=node(p);
      if(mode==='eraser')eraseAt(p);
    });
    svg.addEventListener('pointermove',e=>{
      if(!drawing||e.pointerId!==pointer)return;e.preventDefault();
      const p=point(e);
      if(mode==='eraser'){eraseAt(p);return;}
      const next=node(p);if(next[0]!==previous[0]||next[1]!==previous[1]){travel(previous,next);previous=next;}
    });
    const end=e=>{if(pointer!==null&&svg.hasPointerCapture(pointer))svg.releasePointerCapture(pointer);drawing=false;pointer=null;previous=null;};
    svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
    function showCursor(){cursor.removeAttribute('hidden');cursor.setAttribute('cx',px(cursorNode[0]));cursor.setAttribute('cy',px(cursorNode[1]));}
    svg.addEventListener('focus',showCursor);svg.addEventListener('blur',()=>{cursor.setAttribute('hidden','');keyboardDrawing=false;});
    svg.addEventListener('keydown',e=>{
      if(e.key===' '){e.preventDefault();if(mode){keyboardDrawing=!keyboardDrawing;if(help)help.textContent=keyboardDrawing?'Posouvej se šipkami po síti.':'Kreslení šipkami je vypnuté.';}return;}
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
      e.preventDefault();const next=[...cursorNode],axis=e.key==='ArrowLeft'||e.key==='ArrowRight'?0:1;
      next[axis]=Math.max(0,Math.min(size,next[axis]+(e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1)));
      if(mode&&keyboardDrawing&&(next[axis]!==cursorNode[axis]))travel(cursorNode,next);
      cursorNode=next;showCursor();
    });
  }
  return {markup,bind,lineMarkup};
})();
