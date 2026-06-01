import { state, setCompFilter, resetCompFilters } from './state.js';
import { data } from './data-loader.js';
import { sf, clean, badge, escapeHtml, money, shortDate, uniqueSorted } from './utils.js';
export function tableHtml(rows){
  return `<div class="table-wrap"><table class="data-table" id="buildingTable"><thead><tr>
    ${head('display_name','Building')}${head('street_address','Street address')}${head('building_class','Class')}${head('rba_sf','RBA')}${head('total_available_sf','Available SF')}${head('percent_leased','% leased')}${head('historical_activity_count','Comps')}${head('avg_2022_plus_starting_rent_psf','Avg rent 2022+')}${head('owner_landlord','Owner / landlord')}${head('primary_leasing_company','Leasing company')}${head('number_of_stories','Stories')}${head('year_built','Built')}
  </tr></thead><tbody>${rows.map(rowHtml).join('')}</tbody></table></div>`;
}
function head(key,label){return `<th data-sort="${key}">${label}${state.sort.key===key?(state.sort.dir==='asc'?' ▲':' ▼'):''}</th>`;}
function rowHtml(b){return `<tr data-building-id="${escapeHtml(b.building_id)}"><td><strong>${escapeHtml(b.display_name)}</strong><div class="table-sub">${escapeHtml(b.building_id)}</div></td><td>${escapeHtml(b.street_address)}</td><td>${badge(b.building_class)}</td><td>${sf(b.rba_sf)}</td><td>${sf(b.total_available_sf)}</td><td>${b.percent_leased?Number(b.percent_leased).toFixed(1)+'%':'—'}</td><td>${b.historical_activity_count||'—'}</td><td>${money(b.avg_2022_plus_starting_rent_psf)}</td><td>${escapeHtml(clean(b.owner_landlord))}</td><td>${escapeHtml(clean(b.primary_leasing_company))}</td><td>${escapeHtml(clean(b.number_of_stories))}</td><td>${escapeHtml(clean(b.year_built))}</td></tr>`;}
export function attachTableEvents(root, onSelect, onSort){
  root.querySelectorAll('tbody tr[data-building-id]').forEach(tr=>tr.addEventListener('click',()=>onSelect(tr.dataset.buildingId)));
  root.querySelectorAll('th[data-sort]').forEach(th=>th.addEventListener('click',()=>onSort(th.dataset.sort)));
}
export function cardsHtml(rows){
  return `<div class="cards-grid">${rows.map(b=>`<div class="building-card" data-building-id="${escapeHtml(b.building_id)}"><h4>${escapeHtml(b.display_name)}</h4><p>${escapeHtml(b.street_address)}<br>${escapeHtml(clean(b.owner_landlord))}</p><div class="card-meta"><span class="small-tag">${escapeHtml(b.building_class)}</span><span class="small-tag">${sf(b.rba_sf)}</span><span class="small-tag">${b.historical_activity_count||0} comps</span><span class="small-tag">${sf(b.total_available_sf)}</span></div></div>`).join('')}</div>`;
}
export function attachCardEvents(root,onSelect){root.querySelectorAll('[data-building-id]').forEach(el=>el.addEventListener('click',()=>onSelect(el.dataset.buildingId)));}

const compCols=['parent_building_name','tenant','transaction_sf','transaction_type','execution_date','commencement_date','expiration_date','starting_rent_psf','rent_type','free_rent_months','ti_value_psf','floors_occupied','landlord','tenant_brokerage_firm'];
const compLabels={parent_building_name:'Building',tenant:'Tenant',transaction_sf:'Square feet',transaction_type:'Type',execution_date:'Executed',commencement_date:'Commenced',expiration_date:'Expires',starting_rent_psf:'Starting rent',rent_type:'Rent type',free_rent_months:'Free rent',ti_value_psf:'TI / PSF',floors_occupied:'Floors',landlord:'Landlord',tenant_brokerage_firm:'Tenant broker'};
export function filteredComps(){
  let rows=[...data.activity]; const f=state.compFilters;
  if(f.type) rows=rows.filter(c=>c.transaction_type===f.type);
  if(f.class) rows=rows.filter(c=>c.parent_building_class===f.class);
  if(f.startYear) rows=rows.filter(c=>String(c.execution_date||'').slice(0,4)>=String(f.startYear));
  if(f.minSf) rows=rows.filter(c=>Number(c.transaction_sf||0)>=Number(f.minSf));
  const q=String(state.query||'').toLowerCase().trim();
  if(q) rows=rows.filter(c=>[c.parent_building_name,c.building_address,c.tenant,c.transaction_type,c.industry,c.landlord,c.tenant_brokerage_firm,c.landlord_brokerage_firm].join(' ').toLowerCase().includes(q));
  const {key,dir}=state.compSort;
  rows.sort((a,b)=>{
    const av=a[key]??'', bv=b[key]??'';
    const cmp=(typeof av==='number'&&typeof bv==='number')?av-bv:String(av).localeCompare(String(bv),undefined,{numeric:true});
    return dir==='asc'?cmp:-cmp;
  });
  return rows;
}
function compHead(k){return `<th data-comp-sort="${k}" class="sortable">${compLabels[k]||k}${state.compSort.key===k?(state.compSort.dir==='asc'?' ▲':' ▼'):''}</th>`;}
function compVal(c,k){
  const v=c[k];
  if(k==='transaction_sf') return sf(v);
  if(k==='starting_rent_psf'||k==='ti_value_psf') return money(v);
  if(k==='free_rent_months') return v===null||v===undefined||v===''?'—':Number(v).toFixed(Number(v)%1?1:0)+' mo.';
  if(k.includes('date')) return shortDate(v);
  if(k==='parent_building_name') return `<strong>${escapeHtml(clean(v))}</strong><div class="table-sub">${escapeHtml(clean(c.building_address))}</div>`;
  return escapeHtml(clean(v));
}
function compFilterBar(){
  const types=uniqueSorted(data.activity.map(c=>c.transaction_type));
  const classes=uniqueSorted(data.activity.map(c=>c.parent_building_class));
  const years=uniqueSorted(data.activity.map(c=>String(c.execution_date||'').slice(0,4)).filter(y=>/^\d{4}$/.test(y))).reverse();
  const opt=(arr,selected,label)=>`<option value="">${label}</option>`+arr.map(v=>`<option value="${escapeHtml(v)}" ${v===selected?'selected':''}>${escapeHtml(v)}</option>`).join('');
  return `<div class="comp-filter-bar"><div><label>Transaction type</label><select id="compTypeFilter">${opt(types,state.compFilters.type,'All types')}</select></div><div><label>Building class</label><select id="compClassFilter">${opt(classes,state.compFilters.class,'All classes')}</select></div><div><label>Executed since</label><select id="compYearFilter">${opt(years,state.compFilters.startYear,'All years')}</select></div><div><label>Minimum SF</label><input id="compMinSf" type="number" placeholder="e.g. 10000" value="${escapeHtml(state.compFilters.minSf)}" /></div><button id="compResetFilters">Reset</button></div>`;
}
export function compsTableHtml(rows){
  return `${compFilterBar()}<div class="table-wrap"><table class="data-table comp-table"><thead><tr>${compCols.map(compHead).join('')}</tr></thead><tbody>${rows.slice(0,1400).map(c=>`<tr data-comp-id="${escapeHtml(c.activity_record_id)}" data-building-id="${escapeHtml(c.parent_building_id)}">${compCols.map(k=>`<td>${compVal(c,k)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${rows.length>1400?'<div class="table-note">Showing first 1,400 matched historical activity records. Use filters/search to narrow.</div>':''}`;
}
export function attachCompTableEvents(root, onSelect, onSort, onFilter){
  root.querySelectorAll('tr[data-building-id]').forEach(tr=>tr.addEventListener('click',()=>onSelect(tr.dataset.buildingId)));
  root.querySelectorAll('th[data-comp-sort]').forEach(th=>th.addEventListener('click',()=>onSort(th.dataset.compSort)));
  root.querySelector('#compTypeFilter')?.addEventListener('change',e=>{setCompFilter('type',e.target.value); onFilter();});
  root.querySelector('#compClassFilter')?.addEventListener('change',e=>{setCompFilter('class',e.target.value); onFilter();});
  root.querySelector('#compYearFilter')?.addEventListener('change',e=>{setCompFilter('startYear',e.target.value); onFilter();});
  root.querySelector('#compMinSf')?.addEventListener('input',e=>{setCompFilter('minSf',e.target.value); onFilter();});
  root.querySelector('#compResetFilters')?.addEventListener('click',()=>{resetCompFilters(); onFilter();});
}
