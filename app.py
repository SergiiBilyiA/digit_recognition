from flask import Flask, render_template, url_for, request
from functions import prediction

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('digit_recognition.html')


@app.route('/img', methods=['POST', 'GET'])
def img():
    if request.method == 'POST':
        res = prediction(request.files['picture'])
        return str(res)


if __name__ == '__main__':
    app.run()
