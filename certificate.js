'use strict';
const pupilName=PupilProfile.read();
let completedDate='';
function prepareCertificate(){
  if(!finished)return;
  if(!completedDate)completedDate=new Intl.DateTimeFormat('cs-CZ').format(new Date());
  const sum=TIMSS.score(answers).reduce((a,b)=>a+b,0),percent=(sum/12*100).toLocaleString('cs-CZ',{maximumFractionDigits:1});
  document.querySelector('#certificate').innerHTML=`<div class="cert-top">Matematika · 4. ročník</div><div class="cert-title">CERTIFIKÁT</div><p class="cert-subtitle">o absolvování matematického testu č. 1</p><img class="cert-snail" src="assets/snek-s.png" alt="Usměvavý modrý šnek"><div class="cert-name ${pupilName?'':'blank'}">${esc(pupilName)}</div><div class="cert-label">${pupilName?'Jméno žáka / žákyně':'Sem si můžeš dopsat své jméno'}</div><div class="cert-stats"><div><strong>${sum} / 12</strong><span>získaných bodů</span></div><div><strong>${percent} %</strong><span>úspěšnost</span></div></div><p class="cert-grade">${TIMSS.grade(sum)}</p><p class="cert-message">Každá vyřešená úloha je další krok.<br>Prohlédni si své odpovědi a objev se šnečkem, co se můžeš ještě naučit.</p><p class="cert-bottom">Čas práce: <b>${formatTime(elapsed)}</b><br>Datum dokončení: ${completedDate}</p><div class="cert-stars" aria-hidden="true">✦ ✦ ✦</div>`;
  window.CzechTypography?.apply(document.querySelector('#certificate'));
}
window.addEventListener('beforeprint',prepareCertificate);

document.querySelector('#certificate-back').onclick=()=>{document.body.classList.remove('certificate-preview');document.querySelector('#certificate-tools').hidden=true;document.querySelector('#print').focus();};
document.querySelector('#certificate-print').onclick=async()=>{const img=document.querySelector('#certificate img');if(img&&img.decode){try{await img.decode();}catch{}}window.print();};
