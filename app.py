from flask import Flask, render_template, url_for, request
from functions import prediction

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/predictions', methods=['POST', 'GET'])
def predictions():
    if request.method == 'POST':
        result = prediction(request.files['picture'])
        return str(result)


if __name__ == '__main__':
    app.run()
