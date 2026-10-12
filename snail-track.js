'use strict';
// Shared by the practice and test. Coordinates follow the SVG, including bends.
window.SnailTrack = {
  markup(points, path, positions, assetBase, locked=false, marks='') {
    const zones=points.map(([x,y],i)=>['S','T'].map(t=>`<rect class="landing ${t}" data-landing="${t}-${i}" x="${x-20}" y="${y+(t==='S'?-103:35)}" width="40" height="68" rx="10"/>`).join('')).join('');
    return `<div class="snail-track" id="snail-track"><svg viewBox="-90 0 650 340" role="img" aria-label="Cestička s ${points.length} body. Modrá políčka jsou nad cestičkou, oranžová pod ní."><rect x="-80" y="67" width="65" height="68" rx="12" fill="#f1f4f7" stroke="#bac8d4"/><rect x="-80" y="205" width="65" height="68" rx="12" fill="#f1f4f7" stroke="#bac8d4"/><text x="-47" y="48" text-anchor="middle" fill="#52677a" font-size="13">Přesuň</text>${zones}<path d="${path}" fill="none" stroke="#536580" stroke-width="3"/>${points.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="4" fill="#35445e"/>`).join('')}${marks}</svg>${points.map(([x,y],i)=>['S','T'].map(t=>`<button class="landing-control ${t}" data-target="${t}" data-index="${i}" style="left:${(x+90)/6.5}%;top:${(y+(t==='S'?-69:69))/3.4}%" aria-label="Umístit ${t==='S'?'modrého':'oranžového'} šneka ${t} k bodu ${i+1}" ${locked?'disabled':''}></button>`).join('')).join('')}${['S','T'].map(t=>{const index=positions[t],p=index==null?[-47,170]:points[Number(index)];return `<button class="track-snail ${t} ${index==null?'unplaced':''}" data-snail="${t}" style="left:${(p[0]+90)/6.5}%;top:${(p[1]+(t==='S'?-69:69))/3.4}%" aria-label="Šnek ${t}, ${index==null?'zatím neumístěn':'bod '+(Number(index)+1)}. Přetáhni do barevného políčka." ${locked?'disabled':''}><img src="${assetBase}snek-${t.toLowerCase()}.png" draggable="false" alt=""><span class="snail-letter">${t}</span><svg class="snail-arrow" viewBox="0 0 20 32" aria-hidden="true"><path d="${t==='S'?'M10 1 V27 M3 20 L10 28 L17 20':'M10 31 V5 M3 12 L10 4 L17 12'}"/></svg></button>`;}).join('')}</div>`;
  },
  target(x,y,rect,points,t) {
    const px=(x-rect.left)/rect.width*650-90,py=(y-rect.top)/rect.height*340;
    let best=null,distance=Infinity;
    points.forEach(([a,b],i)=>{const cy=b+(t==='S'?-69:69),dx=Math.abs(a-px),dy=Math.abs(cy-py);if(dx<=25&&dy<=43&&dx+dy/3<distance){best=i;distance=dx+dy/3;}});
    return best;
  },
  bind(points,getPositions,onMove,locked=false) {
    const board=document.querySelector('#snail-track');if(!board)return;
    const refresh=()=>{const positions=getPositions();board.querySelectorAll('[data-snail]').forEach(el=>{const t=el.dataset.snail,i=positions[t],p=i==null?[-47,170]:points[Number(i)];el.style.left=(p[0]+90)/6.5+'%';el.style.top=(p[1]+(t==='S'?-69:69))/3.4+'%';el.classList.remove('dragging');el.classList.toggle('unplaced',i==null);el.setAttribute('aria-label',`Šnek ${t}, ${i==null?'zatím neumístěn':'bod '+(Number(i)+1)}. Přetáhni do barevného políčka.`);});board.querySelectorAll('.landing').forEach(el=>el.classList.remove('candidate'));};
    if(locked)return;
    board.querySelectorAll('[data-target]').forEach(el=>el.onclick=()=>{onMove(el.dataset.target,Number(el.dataset.index));refresh();});
    board.querySelectorAll('[data-snail]').forEach(el=>{let drag=null;
      el.onpointerdown=e=>{if(e.button!==0)return;const r=el.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,dx:e.clientX-r.left-r.width/2,dy:e.clientY-r.top-r.height/2,moved:false};el.setPointerCapture(e.pointerId);};
      el.onpointermove=e=>{if(!drag)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>4)drag.moved=true;if(!drag.moved)return;const r=board.getBoundingClientRect(),x=e.clientX-drag.dx,y=e.clientY-drag.dy;el.classList.add('dragging');el.style.left=x-r.left+'px';el.style.top=y-r.top+'px';const i=this.target(x,y,r,points,el.dataset.snail);board.querySelectorAll('.landing').forEach(z=>z.classList.toggle('candidate',i!==null&&z.dataset.landing===el.dataset.snail+'-'+i));};
      el.onpointerup=e=>{if(!drag)return;const d=drag;drag=null;if(d.moved){const i=this.target(e.clientX-d.dx,e.clientY-d.dy,board.getBoundingClientRect(),points,el.dataset.snail);if(i!==null)onMove(el.dataset.snail,i);}refresh();};
      el.onpointercancel=()=>{drag=null;refresh();};
      el.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const t=el.dataset.snail,current=Number(getPositions()[t]??0),i=e.key==='Home'?0:e.key==='End'?points.length-1:Math.max(0,Math.min(points.length-1,current+(e.key==='ArrowLeft'?-1:1)));onMove(t,i);refresh();};
    });
  }
};
