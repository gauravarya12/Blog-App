from flask import Blueprint, request
from server import mysql
import json
from helpers import decode_token

blogs = Blueprint('blogs', __name__)

@blogs.route('')
def fetchBlogs():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        userId = decode_token(token)['id']
        cursor = mysql.connection.cursor()
        cursor.execute('''select * from blogs where user_id != %s''', (userId,))
        blogs = []
        for item in cursor.fetchall():
            blogs.append(item)
        cursor.execute('''select * from users where id!=%s''', (userId,))
        names = []
        for item in cursor.fetchall():
            names.append(item)
        for i, blog in enumerate(blogs):
            user_name = ''
            for name in names:
                if blog['user_id'] == name['id']:
                    user_name = name['name']
                    break
            blogs[i]['author'] = user_name
        mysql.connection.commit()
        cursor.close()
        return json.dumps({'data': blogs, 'error': False})
    except:
        return json.dumps({'message': 'Some Error Occured', 'error': True})

@blogs.route('/user', methods=['GET', 'POST'])
def fetchUserBlogs():
    if request.method == 'GET':
        token = request.headers['Authorization'].split(' ')[1]
        userId = decode_token(token)['id']
        cursor = mysql.connection.cursor()
        cursor.execute('''select * from blogs where user_id=%s''', (userId,))
        results = cursor.fetchall()
        items = []
        for item in results:
            items.append(item)
        mysql.connection.commit()
        cursor.close()
        return json.dumps({'data': items, 'error': False})
    elif request.method == 'POST':
        cursor = mysql.connection.cursor()
        content = request.json['content']
        categoryId = request.json['category_id']
        title = request.json['title']
        token = request.headers.get('Authorization').split(' ')[1]
        userId = decode_token(token)['id']
        cursor.execute('''insert into blogs(content, category_id, user_id, title) values(%s, %s, %s, %s)''', (content, categoryId, userId, title))
        mysql.connection.commit()
        cursor.close()
        return json.dumps({'message': 'Blog added successfully', 'error': False})

@blogs.route('/<int:blogId>', methods=['GET', 'PUT', 'DELETE'])
def fetchBlog(blogId):
    if request.method == 'GET':
        cursor = mysql.connection.cursor()
        cursor.execute('''select * from blogs where id=%s''', (blogId,))
        results = cursor.fetchall()
        items = []
        for item in results:
            items.append(item)
        mysql.connection.commit()
        cursor.close()
        if items:
            items = items[0]
            return json.dumps({'data': items, 'error': False})
        else:
            return json.dumps({'message': 'Invalid Blog ID', 'error': True})
    elif request.method == 'PUT':
        cursor = mysql.connection.cursor()
        content = request.json['content']
        title = request.json['title']
        token = request.headers.get('Authorization').split(' ')[1]
        userId = decode_token(token)['id']
        cursor.execute('''update blogs set content=%s, title=%s where id=%s and user_id=%s''', (content, title, blogId, userId,))
        mysql.connection.commit()
        cursor.close()
        return json.dumps({'message': 'Blog Edited Successfully', 'error': False})
    elif request.method == 'DELETE':
        token = request.headers.get('Authorization').split(' ')[1]
        userId = decode_token(token)['id']
        cursor = mysql.connection.cursor()
        cursor.execute('''delete from blogs where id=%s and user_id=%s''', (blogId, userId,))
        mysql.connection.commit()
        cursor.close()
        return json.dumps({'message': 'Blog Deleted Successfully', 'error': False})

@blogs.route('/category/<int:categoryId>')
def fetchBlogCategory(categoryId):
    token = request.headers['Authorization'].split(' ')[1]
    userId = decode_token(token)['id']
    cursor = mysql.connection.cursor()
    cursor.execute('''select * from blogs where category_id=%s and user_id!=%s''', (categoryId,userId,))
    results = cursor.fetchall()
    mysql.connection.commit()
    cursor.close()
    blogs = []
    for item in results:
        blogs.append(item)
    return json.dumps({'data': blogs, 'error': False})

    
    