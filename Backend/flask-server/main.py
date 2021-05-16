from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def my_index():
	return render_template("index.html", flash_token="Hello world")