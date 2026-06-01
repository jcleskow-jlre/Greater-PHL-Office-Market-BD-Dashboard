export const state = {
  activeSection:'overview',
  query:'',
  filters:{ building_class:'', owner_landlord:'', primary_leasing_company:'', min_rba:'', built_after:'' },
  selectedBuildingId:null,
  sort:{ key:'display_name', dir:'asc' },
  compSort:{ key:'execution_date', dir:'desc' },
  compFilters:{ type:'', class:'', startYear:'', minSf:'' },
  filteredBuildings:[]
};
export function setFilter(key,value){state.filters[key]=value;}
export function resetFilters(){state.query=''; state.filters={building_class:'', owner_landlord:'', primary_leasing_company:'', min_rba:'', built_after:''};}
export function setCompFilter(key,value){state.compFilters[key]=value;}
export function resetCompFilters(){state.compFilters={type:'', class:'', startYear:'', minSf:''};}
