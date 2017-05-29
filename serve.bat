setlocal
set port=8099
start /b python -m SimpleHTTPServer %port%
start "" "http://localhost:%port%/"
pause
