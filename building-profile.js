import { BUILDINGS } from '../data/buildings.js';
import { TENANT_OCCUPANCY } from '../data/tenant_occupancy.js';
import { FLOOR_SUITE_STACK } from '../data/floor_suite_stack.js';
import { AVAILABILITY } from '../data/availability.js';
import { HISTORICAL_ACTIVITY_COMPS } from '../data/historical_activity_comps.js';
import { BD_OPPORTUNITIES } from '../data/bd_opportunities.js';
import { MARKET_RENTS } from '../data/market_rents.js';
import { METADATA } from '../data/metadata.js';
export const data = {
  buildings: BUILDINGS,
  tenants: TENANT_OCCUPANCY,
  floorStack: FLOOR_SUITE_STACK,
  availability: AVAILABILITY,
  activity: HISTORICAL_ACTIVITY_COMPS,
  bd: BD_OPPORTUNITIES,
  marketRents: MARKET_RENTS,
  metadata: METADATA
};
export const buildingById = new Map(BUILDINGS.map(b=>[b.building_id,b]));
export const compsByBuildingId = new Map();
for(const c of HISTORICAL_ACTIVITY_COMPS){
  const id=c.parent_building_id;
  if(!compsByBuildingId.has(id)) compsByBuildingId.set(id,[]);
  compsByBuildingId.get(id).push(c);
}
for(const [id, rows] of compsByBuildingId){rows.sort((a,b)=>String(b.execution_date||'').localeCompare(String(a.execution_date||'')));}
export function childrenFor(buildingId){return {
  tenants: data.tenants.filter(x=>x.parent_building_id===buildingId),
  floorStack: data.floorStack.filter(x=>x.parent_building_id===buildingId),
  availability: data.availability.filter(x=>x.parent_building_id===buildingId),
  activity: compsByBuildingId.get(buildingId)||[],
  bd: data.bd.filter(x=>x.parent_building_id===buildingId)
};}
