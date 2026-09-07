/* Hodnocení tohoto cvičného testu: 12 bodů, bez dílčích bodů u úhlů a šneků. */
(function(root){
const ids=['ME61178','ME61246','ME61271','ME61256','ME61182','ME61049','ME61232','ME61095','ME61264','ME61108','ME61211'];
function number(s){s=String(s??'').trim();const mixed=s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);if(mixed){const [,whole,a,b]=mixed.map(Number);return b?whole+a/b:NaN;}s=s.replace(/\s+/g,'').replace(',','.');if(!s)return NaN; if(/^\d+\/\d+$/.test(s)){const [a,b]=s.split('/').map(Number);return b?a/b:NaN;}return /^\d+(\.\d+)?$/.test(s)?Number(s):NaN;}
function score(a){return [number(a.q1)===9000,a.q2==='C',number(a.q3)===1872,a.q4==='A',number(a.q5)===1.25,a.q6==='C',a.q7==='A',a.angleB==='C'&&a.angleC==='B'&&a.angleD==='C'&&a.angleE==='A',String(a.snailS)==='10'&&String(a.snailT)==='9',a.q10==='B',number(a.q11a)===130,a.q11b==='B'].map(Number);}
function grade(n){return n>=11?'Výborně!':n>=9?'Velmi dobře!':n>=6?'Dobře!':n>=3?'Ještě trochu procvičování a půjde to lépe.':'Nevzdávej to, zkus úlohy znovu.';}
root.TIMSS={ids,number,score,grade};if(typeof module!=='undefined')module.exports=root.TIMSS;
})(typeof window==='undefined'?globalThis:window);
