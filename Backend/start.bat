cd react-app
call npm run build
cd ..

cd flask-server
$env:FLASK_APP="main.py"
.\venv\Scripts\python.exe -m flask run --host=0.0.0.0