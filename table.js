import { state, setFilter, resetFilters } from './state.js';
import { data } from './data-loader.js';
import { $, $$, uniqueSorted } from './utils.js';
export function initFilters(onChange){
  populateSelect($('#classFilter'), uniqueSorted(data.buildings.map(b=>b.building_class)));
  populateSelect($('#ownerFilter'), uniqueSorted(data.buildings.map(b=>b.owner_landlord)).slice(0,260));
  populateSelect($('#leasingFilter'), uniqueSorted(data.buildings.map(b=>b.primary_leasing_company)).slice(0,260));
  $('#globalSearch').addEventListener('input', e=>{state.query=e.target.value; onChange();});
  $('#classFilter').addEventListener('change', e=>{setFilter('building_class',e.target.value); onChange();});
  $('#ownerFilter').addEventListener('change', e=>{setFilter('owner_landlord',e.target.value); onChange();});
  $('#leasingFilter').addEventListener('change', e=>{setFilter('primary_leasing_company',e.target.value); onChange();});
  $('#minRba').addEventListener('input', e=>{setFilter('min_rba',e.target.value); onChange();});
  $('#builtAfter').addEventListener('input', e=>{setFilter('built_after',e.target.value); onChange();});
  $('#resetFilters').addEventListener('click',()=>{resetFilters(); syncInputs(); onChange();});
  $('#filterToggle')?.addEventListener('click',()=>$('#filtersPanel').classList.toggle('open'));
}
function populateSelect(el, values){ if(!el) return; for(const v of values){ const opt=document.createElement('option'); opt.value=v; opt.textContent=v; el.appendChild(opt);} }
function syncInputs(){['globalSearch','classFilter','ownerFilter','leasingFilter','minRba','builtAfter'].forEach(id=>{const el=$('#'+id); if(el) el.value='';});}
export function applyFilters(buildings){
  const q=String(state.query||'').toLowerCase().trim();
  const f=state.filters;
  let rows=buildings.filter(b=>{
    if(f.building_class && b.building_class!==f.building_class) return false;
    if(f.owner_landlord && b.owner_landlord!==f.owner_landlord) return false;
    if(f.primary_leasing_company && b.primary_leasing_company!==f.primary_leasing_company) return false;
    if(f.min_rba && Number(b.rba_sf||0)<Number(f.min_rba)) return false;
    if(f.built_after && Number(b.year_built||0)<Number(f.built_after)) return false;
    if(q){
      const hay=[b.display_name,b.property_name,b.street_address,b.full_address,b.owner_landlord,b.primary_leasing_company,b.building_class,b.costar_property_name,b.costar_submarket_name].join(' ').toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
  const {key,dir}=state.sort;
  rows.sort((a,b)=>{
    const av=a[key]??'', bv=b[key]??'';
    const cmp=(typeof av==='number'&&typeof bv==='number')?av-bv:String(av).localeCompare(String(bv),undefined,{numeric:true});
    return dir==='asc'?cmp:-cmp;
  });
  return rows;
}
export function initNav(onSection){$$('[data-section]').forEach(btn=>btn.addEventListener('click',()=>onSection(btn.dataset.section)));}
