import { data, buildingById } from './data-loader.js';
import { state } from './state.js';
import { initFilters, applyFilters, initNav } from './filters.js';
import { initMap, updateMap, flyToBuilding, fitRows } from './map.js';
import { tableHtml, attachTableEvents, cardsHtml, attachCardEvents, compsTableHtml, attachCompTableEvents, filteredComps } from './table.js';
import { profileHtml } from './building-profile.js';
import { $, $$, sf, fmt, money, clean } from './utils.js';
function render(){
  state.filteredBuildings = applyFilters(data.buildings);
  $('#recordStatus').textContent = `${state.filteredBuildings.length} visible / ${data.buildings.length} CBD buildings`;
  renderOverview(); renderMapSection(); renderBuildings(); renderStacking(); renderActivity(); renderBD(); updateMap(state.filteredBuildings);
}
function setSection(id){
  state.activeSection=id;
  $$('.section').forEach(s=>s.classList.toggle('active',s.id===id));
  $$('[data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section===id));
  if(id==='mapSection') setTimeout(()=>fitRows(state.filteredBuildings),150);
}
function selectBuilding(id, shouldFly=true){
  state.selectedBuildingId=id;
  const b=buildingById.get(id);
  const profile=$('#profilePanel'); if(profile) profile.innerHTML=profileHtml(b);
  updateMap(state.filteredBuildings);
  if(shouldFly) flyToBuilding(b);
  if(state.activeSection!=='mapSection') setSection('mapSection');
}
function onSort(key){
  if(state.sort.key===key) state.sort.dir=state.sort.dir==='asc'?'desc':'asc'; else {state.sort.key=key; state.sort.dir='asc';}
  render();
}
function onCompSort(key){
  if(state.compSort.key===key) state.compSort.dir=state.compSort.dir==='asc'?'desc':'asc'; else {state.compSort.key=key; state.compSort.dir='asc';}
  renderActivity();
}
function renderOverview(){
  const rows=state.filteredBuildings; const meta=data.metadata; const total=rows.reduce((a,b)=>a+(Number(b.rba_sf)||0),0);
  const trophy=rows.filter(b=>b.building_class==='Trophy').length; const classA=rows.filter(b=>b.building_class==='Class A').length; const classB=rows.filter(b=>b.building_class==='Class B').length;
  const avail=rows.reduce((a,b)=>a+(Number(b.total_available_sf)||0),0); const comps=rows.reduce((a,b)=>a+(Number(b.historical_activity_count)||0),0); const enriched=rows.filter(b=>b.costar_match_status&&b.costar_match_status!=='Not matched').length;
  $('#overview').innerHTML=`
    <div class="kpis">
      <div class="kpi"><div class="kpi-label">Focused CBD buildings</div><div class="kpi-value">${fmt(rows.length)}</div><div class="kpi-sub">Trophy, Class A, and Class B only</div></div>
      <div class="kpi"><div class="kpi-label">Rentable building area</div><div class="kpi-value">${sf(total)}</div><div class="kpi-sub">Filtered CBD inventory</div></div>
      <div class="kpi"><div class="kpi-label">Available space</div><div class="kpi-value">${sf(avail)}</div><div class="kpi-sub">CoStar-enriched fields, matched only</div></div>
      <div class="kpi"><div class="kpi-label">Historical activity</div><div class="kpi-value">${fmt(comps)}</div><div class="kpi-sub">Matched Savills office comps</div></div>
      <div class="kpi"><div class="kpi-label">Trophy / A / B</div><div class="kpi-value">${trophy} / ${classA} / ${classB}</div><div class="kpi-sub">Class mix in current view</div></div>
      <div class="kpi"><div class="kpi-label">CoStar enrichment</div><div class="kpi-value">${fmt(enriched)}</div><div class="kpi-sub">No new buildings added</div></div>
    </div>
    <div class="panel"><div class="panel-head"><div><div class="panel-title">CBD-first office market environment</div><div class="panel-note">This build uses V72 as the table/design reference, keeps the current CBD building list fixed, supplements matched buildings with CoStar profile data, and loads Savills comps as historical activity tied to building parent records.</div></div><div class="pill-row"><span class="pill yellow">${meta.version}</span><span class="pill">Building → tenant stack → activity</span></div></div>
      <div style="padding:20px;display:grid;grid-template-columns:1.1fr .9fr;gap:18px">
        <div class="callout"><strong>Architecture:</strong> the map and building table use only the 91 focused CBD parent records. CoStar data enriches those records only. Comp records attach underneath buildings as historical activity and do not create new building records.</div>
        <div class="info-card" style="margin-top:0"><div class="stack-title">Next data layer</div><p class="panel-note">CBD stacking plans / tenant roster. This will become the current operating layer: tenant, floor, suite, occupied SF, expiration, availability status, and BD angle.</p></div>
      </div>
    </div>
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Most active CBD buildings</div><div class="panel-note">Ranked by matched historical comp count. Click a card to open the building profile.</div></div></div>${cardsHtml(rows.slice().sort((a,b)=>(b.historical_activity_count||0)-(a.historical_activity_count||0)).slice(0,9))}</div>`;
  attachCardEvents($('#overview'), selectBuilding);
}
function renderMapSection(){
  const selected=buildingById.get(state.selectedBuildingId);
  $('#mapSection').innerHTML=`
    <div class="panel"><div class="panel-head"><div><div class="panel-title">CBD market map</div><div class="panel-note">One mapped parent record per building. Comps and tenant records live inside building profiles, not as duplicate map points.</div></div><div class="pill-row"><span class="pill">${state.filteredBuildings.length} visible</span><span class="pill">${sf(state.filteredBuildings.reduce((a,b)=>a+(b.rba_sf||0),0))}</span></div></div>
      <div class="map-layout"><div class="map-wrap"><div id="map"></div><div class="map-legend"><div class="legend-item"><span class="dot trophy"></span>Trophy</div><div class="legend-item"><span class="dot class-a"></span>Class A</div><div class="legend-item"><span class="dot class-b"></span>Class B</div></div></div><aside class="profile" id="profilePanel">${profileHtml(selected)}</aside></div>
    </div>`;
  initMap(data.metadata.map_center, selectBuilding); setTimeout(()=>updateMap(state.filteredBuildings),400);
}
function renderBuildings(){
  $('#buildingsSection').innerHTML=`<div class="panel"><div class="panel-head"><div><div class="panel-title">CBD building inventory</div><div class="panel-note">Clean, standardized building table with CoStar enrichment fields added only to matched existing buildings.</div></div><div class="pill-row"><span class="pill yellow">${state.filteredBuildings.length} records</span></div></div>${tableHtml(state.filteredBuildings)}</div>`;
  attachTableEvents($('#buildingsSection'), selectBuilding, onSort);
}
function renderStacking(){
  $('#stackingSection').innerHTML=`<div class="panel"><div class="panel-head"><div><div class="panel-title">Tenant stack and occupancy model</div><div class="panel-note">This section is ready for the CBD stacking plan upload. Once imported, it will show tenants by building, floor, suite, occupied SF, expiration, and status.</div></div><span class="pill yellow">Awaiting tenant stack upload</span></div><div style="padding:20px"><div class="callout">Target structure: Building → floor/suite stack → current tenant occupancy → availability → lease expiration → BD opportunity.</div><div class="stack-card"><div class="stack-title">Why this matters</div><p class="panel-note">For office, the current tenant stack is the operating truth. Historical comps support pricing and trend decisions, but BD strategy should be driven by who is in the building today, where they sit in the stack, when they expire, and what workplace decision they may need to make.</p></div></div></div>`;
}
function renderActivity(){
  const rows=filteredComps();
  const sfTotal=rows.reduce((a,c)=>a+(Number(c.transaction_sf)||0),0); const rentVals=rows.map(c=>Number(c.starting_rent_psf)).filter(v=>Number.isFinite(v)&&v>0); const avgRent=rentVals.length?rentVals.reduce((a,b)=>a+b,0)/rentVals.length:null;
  $('#activitySection').innerHTML=`<div class="panel"><div class="panel-head"><div><div class="panel-title">Historical activity and comps</div><div class="panel-note">Savills office comps loaded as historical activity records and attached to existing CBD buildings.</div></div><div class="pill-row"><span class="pill yellow">${fmt(rows.length)} matched comps</span><span class="pill">${sf(sfTotal)}</span><span class="pill">Avg ${money(avgRent)}</span></div></div>${compsTableHtml(rows)}</div>`;
  attachCompTableEvents($('#activitySection'), selectBuilding, onCompSort, renderActivity);
}
function renderBD(){
  const ranked=state.filteredBuildings.slice().sort((a,b)=>((b.recent_activity_count_2022_plus||0)*4+(b.total_available_sf||0)/100000)-((a.recent_activity_count_2022_plus||0)*4+(a.total_available_sf||0)/100000)).slice(0,12);
  $('#bdSection').innerHTML=`<div class="panel"><div class="panel-head"><div><div class="panel-title">BD opportunity engine</div><div class="panel-note">Initial placeholder scoring using current availability and recent activity until tenant-stack/expiration data is uploaded.</div></div><span class="pill yellow">Tenant stack needed for true scoring</span></div><div style="padding:20px"><div class="callout">Current score is only directional: recent comp activity + available SF. Once tenant stacking plans are loaded, scoring should shift to tenant expiration windows, occupied SF, workplace strategy need, renewal leverage, landlord vacancy pressure, and Savills relationship status.</div>${cardsHtml(ranked)}</div></div>`;
  attachCardEvents($('#bdSection'), selectBuilding);
}
function boot(){initNav(setSection); initFilters(render); render(); setSection('overview');}
boot();
