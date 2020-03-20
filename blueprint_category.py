from flask import Blueprint
from server import mysql
import json

category = Blueprint('category', __name__)

@category.route('/')
def fetchCategory():
    cursor = mysql.connection.cursor()
    cursor.execute('''select * from category''')
    categories = []
    for item in cursor.fetchall():
        categories.append(item)
    mysql.connection.commit()
    cursor.close()
    return json.dumps({'data': categories, 'error': False})

@category.route('/<int:categoryId>')
def fetchCategoryById(categoryId):
    cursor = mysql.connection.cursor()
    cursor.execute('''select * from category where id=%s''', (categoryId,))
    items = []
    for item in cursor.fetchall():
        items.append(item)
    items = items[0]['title']
    return json.dumps({'data': items, 'error': False})