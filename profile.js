'use strict';
// Only this browser tab; no network requests, cookies, or teacher collection.
window.PupilProfile={
  read(){try{return (sessionStorage.getItem('timss-test1-name')||'').slice(0,60);}catch{return '';}},
  save(value){try{sessionStorage.setItem('timss-test1-name',value.trim().slice(0,60));}catch{}}
};
const pupilNameField=document.querySelector('#pupil-name');
if(pupilNameField){pupilNameField.value=PupilProfile.read();pupilNameField.addEventListener('input',()=>PupilProfile.save(pupilNameField.value));}
