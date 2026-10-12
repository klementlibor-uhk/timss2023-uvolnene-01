'use strict';
// Keep Czech one-letter words with the following word, including across inline tags.
// Change text nodes only: answers, markup, input values and event handlers stay intact.
window.CzechTypography = (() => {
  const letters = 'ksvzouaiKSVZOUAI';
  const inside = new RegExp(`(?<![^\\s(„“«])([${letters}])[ \\t]+(?=\\S|$)`, 'gu');
  const ending = new RegExp(`(?<![^\\s(„“«])[${letters}]$`, 'u');
  const excluded = 'script,style,textarea,input,pre,code,svg,[contenteditable],.cert-name';
  const text = value => value.replace(inside, '$1\u00a0');
  function blockOwner(node) {
    let el = node.parentElement;
    while (el && getComputedStyle(el).display === 'inline') el = el.parentElement;
    return el;
  }
  function apply(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node, previous = null;
    while ((node = walker.nextNode())) {
      if (!node.parentElement || node.parentElement.closest(excluded)) {previous = null; continue;}
      let value = text(node.nodeValue);
      if (previous && ending.test(previous.nodeValue) && /^[ \t]+\S/u.test(value)
          && blockOwner(previous) === blockOwner(node)) {
        value = value.replace(/^[ \t]+/u, '\u00a0');
      }
      if (value !== node.nodeValue) node.nodeValue = value;
      if (value.length) previous = node;
    }
  }
  apply();
  const observer = new MutationObserver(records => {
    const roots = new Set(records.map(record => record.target.nodeType === 3
      ? record.target.parentElement : record.target));
    roots.forEach(root => apply(root));
  });
  observer.observe(document.body, {childList:true, characterData:true, subtree:true});
  return {apply, text};
})();

