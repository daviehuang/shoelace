

set "SourceDirectory=C:\work\workspace\js\shoelace\_site"
set "DestinationDirectory=C:\work\workspace\hbuilder\pure-webcomponent\shoelace"

# xcopy /E /I /Y "C:\work\workspace\js\shoelace\cdn" "C:\work\workspace\hbuilder\pure-webcomponent\shoelace\cdn"
xcopy /E /I /Y "C:\work\workspace\js\shoelace\cdn\chunks" "C:\work\workspace\hbuilder\pure-webcomponent\shoelace\cdn\chunks"
xcopy /E /I /Y "C:\work\workspace\js\shoelace\cdn\components\calendar" "C:\work\workspace\hbuilder\pure-webcomponent\shoelace\cdn\components\calendar"
xcopy /E /I /Y "C:\work\workspace\js\shoelace\cdn\styles" "C:\work\workspace\hbuilder\pure-webcomponent\shoelace\cdn\styles"
xcopy /E /I /Y "C:\work\workspace\js\shoelace\cdn\themes" "C:\work\workspace\hbuilder\pure-webcomponent\shoelace\cdn\themes"

scp -r C:\work\workspace\hbuilder\pure-webcomponent\* ceadmin@10.39.104.103:/home/ceadmin/env/fb/html