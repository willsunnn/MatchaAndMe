cd flask-server

@ECHO OFF
:choice
set /P c=Are you sure you want to reset the database (this is irreversable) [Y/N]?
if /I "%c%" EQU "Y" goto :run-reset
if /I "%c%" EQU "N" goto :end
goto :choice

:run-reset
del "database.db"
.\venv\Scripts\python.exe create-db.py

:end