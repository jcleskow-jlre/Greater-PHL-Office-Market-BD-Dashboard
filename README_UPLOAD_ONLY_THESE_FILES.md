# Greater Philadelphia Office CBD Dashboard v10.3

Upload only these extracted files to the GitHub repository root:

- `index.html`
- `dashboard.html`
- `.nojekyll`
- `README_UPLOAD_ONLY_THESE_FILES.md`

Delete prior dashboard files first so GitHub Pages does not mix old versions.

v10.3 focuses on Cesium map debugging:
- real Cesium 3D tiles remain the map base
- visible class dots/beacons removed
- real Cesium/OSM building tiles are styled where building-name metadata matches the CBD inventory
- invisible click hotspots remain for building selection without cluttering the map
- click/fly-to behavior uses bounding-sphere camera targeting to avoid flying past selected buildings
- v9 market intelligence tables, filters, Market AI, and building profile modal remain intact
