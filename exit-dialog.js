'use strict';
let exitMode='home';
function openExitDialog(mode){
  exitMode=mode;
  const again=mode==='again';
  $('#exit-title').textContent=again?'Chceš začít test znovu?':'Chceš se vrátit na úvodní stránku?';
  $('#exit-text').textContent=again
    ? 'Začneš od první úlohy s prázdnými odpověďmi a čas se bude měřit od začátku. Dosavadní odpovědi a výsledek se vymažou. Předchozí pokus si můžeš nejprve vytisknout.'
    : 'Odpovědi a výsledek tohoto pokusu se ztratí. Pokud si je chceš uchovat, nejprve si vytiskni certifikát nebo své odpovědi.';
  $('#exit-accept').textContent=again?'Začít nový pokus':'Přejít na úvod';
  $('#exit-dialog').showModal();$('#exit-cancel').focus();
}
$('#exit-cancel').onclick=()=>$('#exit-dialog').close();
$('#exit-dialog').addEventListener('close',()=>$(exitMode==='again'?'#again':'#home')?.focus());
$('#exit-accept').onclick=()=>{if(exitMode==='again')location.reload();else location.assign('index.html');};
