import { childrenFor } from './data-loader.js';
import { clean, sf, badge, escapeHtml, money, pct, shortDate } from './utils.js';
export function profileHtml(building){
  if(!building) return `<div class="empty-state"><strong>Select a building</strong><span>Click a CBD building on the map, table, or comp record to open its profile.</span></div>`;
  const kids=childrenFor(building.building_id);
  const recent=kids.activity.slice(0,8);
  return `
    <div class="profile-eyebrow">${escapeHtml(building.building_class)} office building</div>
    <div class="profile-title">${escapeHtml(building.display_name)}</div>
    <div class="profile-address">${escapeHtml(building.full_address)}</div>
    <div class="pill-row">${badge(building.building_class)}<span class="pill">${sf(building.rba_sf)}</span><span class="pill">Built ${clean(building.year_built)}</span><span class="pill yellow">${building.historical_activity_count||0} comps</span></div>
    <div class="metric-grid">
      <div class="mini-metric"><div class="mini-label">Owner / landlord</div><div class="mini-value">${escapeHtml(clean(building.owner_landlord))}</div></div>
      <div class="mini-metric"><div class="mini-label">Leasing company</div><div class="mini-value">${escapeHtml(clean(building.primary_leasing_company))}</div></div>
      <div class="mini-metric"><div class="mini-label">Available SF</div><div class="mini-value">${sf(building.total_available_sf)}</div></div>
      <div class="mini-metric"><div class="mini-label">% leased</div><div class="mini-value">${pct(building.percent_leased)}</div></div>
      <div class="mini-metric"><div class="mini-label">Stories</div><div class="mini-value">${escapeHtml(clean(building.number_of_stories))}</div></div>
      <div class="mini-metric"><div class="mini-label">Typical floor</div><div class="mini-value">${sf(building.typical_floor_size)}</div></div>
      <div class="mini-metric"><div class="mini-label">Avg rent 2022+</div><div class="mini-value">${money(building.avg_2022_plus_starting_rent_psf)}</div></div>
      <div class="mini-metric"><div class="mini-label">Last comp</div><div class="mini-value">${shortDate(building.last_activity_date)}</div></div>
    </div>
    <div class="tabs"><button class="tab active">Overview</button><button class="tab">Stack</button><button class="tab">Tenants</button><button class="tab">Availability</button><button class="tab">Activity</button><button class="tab">BD</button></div>
    <div class="info-card"><div class="stack-title">CoStar enrichment</div>${costarHtml(building)}</div>
    <div class="stack-card"><div class="stack-title">Stacking plan preview</div>${stackHtml(kids)}</div>
    <div class="info-card"><div class="stack-title">Historical activity / comps</div>${activityHtml(recent, building)}</div>
    <div class="info-card"><div class="stack-title">Data model</div><p class="panel-note">Building is the parent record. Tenant/floor stack and availability will become the current operating layer. Comps are historical activity records used to support pricing trends, tenant movement, and BD decision-making.</p></div>`;
}
function costarHtml(b){
  const rows=[['CoStar match',b.costar_match_status],['Property manager',b.property_manager],['Direct service type',b.direct_services],['Tax expense',b.tax_expenses],['Direct available',sf(b.direct_available_sf)],['Sublet available',sf(b.sublet_available_sf)],['Max contiguous',sf(b.max_building_contiguous_sf)],['Year renovated',b.year_renovated],['Debt maturity',b.debt_maturity_date],['Loan type',b.loan_type],['Originator',b.originator]];
  return `<div class="profile-grid-list">${rows.map(([k,v])=>`<div><span>${escapeHtml(k)}</span><strong>${escapeHtml(clean(v))}</strong></div>`).join('')}</div>${b.amenities?`<p class="panel-note"><strong>Amenities:</strong> ${escapeHtml(b.amenities)}</p>`:''}`;
}
function stackHtml(kids){
  if(!kids.floorStack.length){ return `<div class="stack-placeholder">Stacking plan data not yet uploaded.<br />When Savills tenant stack data is imported, each floor/suite row will render here by tenant, floor, suite, occupied SF, availability, and expiration.</div>`; }
  return `<div class="stack-placeholder">${kids.floorStack.length} floor/suite records loaded.</div>`;
}
function activityHtml(rows,b){
  if(!rows.length) return `<p class="panel-note">No historical comp records matched to this building yet.</p>`;
  return `<div class="activity-list">${rows.map(c=>`<div class="activity-item"><div><strong>${escapeHtml(clean(c.tenant))}</strong><span>${escapeHtml(clean(c.transaction_type))} • ${sf(c.transaction_sf)} • ${shortDate(c.execution_date)}</span></div><div>${money(c.starting_rent_psf)}</div></div>`).join('')}</div>`;
}
