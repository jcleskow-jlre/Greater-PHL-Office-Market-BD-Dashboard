Upload only these extracted files to the GitHub repo root:
- index.html
- dashboard.html
- .nojekyll
- README_UPLOAD_ONLY_THESE_FILES.md

Delete prior dashboard files first before uploading this version.


v14.10 regression guard checklist
- Right-side building profiles must show asking rent / comp signal card above the metrics.
- Right-side Recent historical activity must sort newest-first, not original data order.
- Full building profile Historical activity tab must sort newest-first.
- Tenant stack tabs must use stacker/OM sources when loaded, not CoStar fallback.
- Stack segments must show lease expiration labels on the visible block and selected-suite detail.
- 1700 Market stack must use the OM stacking plan / rent roll source, not CoStar tenant snippets.
- Map click/profile selection must remain wired after stack or data edits.


v14.11 click lock
- index.html and dashboard.html are intentionally identical to prevent GitHub Pages from loading a stale/non-click version.
- Building click selection uses Cesium entity pick, tile metadata pick, pickPosition, globe ray, and screen-space fallback.
- openBuildingModal also updates the right-side building profile panel.


v14.12 click hotspot lock
- Adds a DOM hotspot layer over the Cesium canvas so building selection no longer depends only on Cesium tile/entity picking.
- Hotspots are generated from the Savills inventory and update every Cesium render frame.
- index.html and dashboard.html remain identical.
- Do not remove mapHotspots, buildDomHotspots, updateDomHotspots, or the postRender listener in future edits.
