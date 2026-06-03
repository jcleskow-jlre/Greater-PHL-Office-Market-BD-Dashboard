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
