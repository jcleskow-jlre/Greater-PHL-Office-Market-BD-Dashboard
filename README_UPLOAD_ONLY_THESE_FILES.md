# v79 Force building owner table display

Single-file GitHub package plus responsive splash images.

Update:
- Forces the building inventory table owner/landlord column to use a dedicated OwnerLandlordDisplay field.
- OwnerLandlordDisplay is populated directly from building owner fields and duplicated into the embedded building records.
- This avoids the table showing blanks/dashes when building profiles already have owner data.
- No record counts changed.

Upload all files into `/Claude-Dashboard/`:
- dashboard.html
- index.html
- .nojekyll
- README_UPLOAD_ONLY_THESE_FILES.md
- splash-desktop.png
- splash-mobile.png
