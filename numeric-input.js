'use strict';
window.NumericInputs=(()=>{
  const allowed=(input,value)=>input.dataset.integer==='true'||input.dataset.part==='den'
    ? /^\d*$/.test(value)
    : input.dataset.part==='num' ? /^-?\d*$/.test(value) : /^[-\d\s.,/]*$/.test(value);
  const remember=input=>{if(allowed(input,input.value))input.dataset.numericValue=input.value;};
  function bind(input){
    if(input.dataset.numericBound)return;
    input.dataset.numericBound='true';remember(input);
    input.addEventListener('beforeinput',e=>{
      if(e.data!==null&&e.data!==undefined){
        const next=input.value.slice(0,input.selectionStart)+e.data+input.value.slice(input.selectionEnd);
        if(!allowed(input,next))e.preventDefault();
      }
    });
    function insert(e,text){
      e.preventDefault();if(input.readOnly||input.disabled)return;
      const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;
      const next=input.value.slice(0,start)+text.trim()+input.value.slice(end);
      if(!allowed(input,next)||(input.maxLength>=0&&next.length>input.maxLength))return;
      input.setRangeText(text.trim(),start,end,'end');input.dispatchEvent(new Event('input',{bubbles:true}));
    }
    input.addEventListener('paste',e=>insert(e,e.clipboardData?.getData('text/plain')||''));
    input.addEventListener('drop',e=>insert(e,e.dataTransfer?.getData('text/plain')||''));
    input.addEventListener('input',e=>{
      if(!allowed(input,input.value)){input.value=input.dataset.numericValue||'';e.stopImmediatePropagation();}
      else remember(input);
    },true);
  }
  return {bind,remember,allowed};
})();
