export const $ = (sel, root=document) => root.querySelector(sel);
export const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
export function fmt(n){n=Number(n)||0;return n.toLocaleString();}
export function sf(n){n=Number(n)||0;if(!n)return '—'; if(n>=1000000)return (n/1000000).toFixed(n>=10000000?1:2)+'M SF'; if(n>=1000)return fmt(Math.round(n))+' SF'; return fmt(n)+' SF';}
export function money(n){n=Number(n);return Number.isFinite(n)?'$'+n.toFixed(2)+' PSF':'—';}
export function pct(n){n=Number(n);return Number.isFinite(n)?n.toFixed(1)+'%':'—';}
export function clean(v){return (v===undefined||v===null||String(v).trim()==='')?'—':String(v);}
export function shortDate(v){if(!v)return '—'; const s=String(v); return s.length>=10?s.slice(0,10):s;}
export function slugClass(v){v=String(v||'').toLowerCase(); if(v.includes('trophy')) return 'trophy'; if(v.includes('class a')) return 'class-a'; if(v.includes('class b')) return 'class-b'; return '';}
export function badge(v){return `<span class="class-badge ${slugClass(v)}">${clean(v)}</span>`;}
export function uniqueSorted(arr){return [...new Set(arr.filter(v=>v!==undefined&&v!==null&&String(v).trim()!==''))].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true}));}
export function escapeHtml(str){return String(str??'').replace(/[&<>'"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m]));}
export function normSearch(v){return String(v??'').toLowerCase().trim();}
export function avg(arr){const vals=arr.map(Number).filter(v=>Number.isFinite(v)&&v>0); return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;}
