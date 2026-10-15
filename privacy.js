'use strict';
const privacyDialog=document.querySelector('#privacy-dialog');
document.querySelector('#privacy-open').onclick=()=>privacyDialog.showModal();
for(const id of ['privacy-x','privacy-close'])document.getElementById(id).onclick=()=>privacyDialog.close();
