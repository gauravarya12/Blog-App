from flask import Flask
from flask_mysqldb import MySQL

app = Flask(__name__)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Python@mldl123'
app.config['MYSQL_DB'] = 'blogsql'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

from blueprint_auth import auth
from blueprint_blogs import blogs
from blueprint_comments import comments
from blueprint_category import category
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(blogs, url_prefix='/blogs')
app.register_blueprint(comments, url_prefix='/comments')
app.register_blueprint(category, url_prefix='/category')

@app.after_request
def add_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
    return response
