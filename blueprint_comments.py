from flask import Blueprint, request
from server import mysql
import json
from helpers import decode_token

comments = Blueprint('comments', __name__)

@comments.route('/<int:blogId>', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def fetchAndPostcomments(blogId):
    if request.method == 'GET':
        token = request.headers['Authorization'].split(' ')[1]
        userId = decode_token(token)['id']
        cursor = mysql.connection.cursor()
        cursor.execute('''select * from comments where blog_id=%s''', (blogId,))
        results = cursor.fetchall()
        comments = []
        for item in results:
            if item['user_id'] == userId:
                item['current'] = True
            else:
                item['current'] = False
            comments.append(item)
        cursor.execute('''select * from users''')
        names = []
        for item in cursor.fetchall():
            names.append(item)
        for i, comment in enumerate(comments):
            user_name = ''
            for name in names:
                if comment['user_id'] == name['id']:
                    user_name = name['name']
                    break
            comments[i]['author'] = user_name
        mysql.connection.commit()
        cursor.close()
        return json.dumps({'data': comments, 'error': False})
    elif request.method == 'POST':
        cursor = mysql.connection.cursor()
        comment = request.json['comment']
        token = request.headers['Authorization'].split(' ')[1]
        userId = decode_token(token)['id']
        cursor.execute('''insert into comments(comment, blog_id, user_id) values(%s, %s, %s)''', (comment, blogId, userId, ))
        mysql.connection.commit()
        cursor.close()
        return json.dumps({'message': 'Comment Added Successfully', 'error': False})

@comments.route('/manipulate/<int:commentId>', methods=['PUT', 'DELETE'])
def manipulateComments(commentId):
    if request.method == 'PUT':
        cursor = mysql.connection.cursor()
        comment = request.json['comment']
        token = request.headers['Authorization'].split(' ')[1]
        userId = decode_token(token)['id']
        cursor.execute('''update comments set comment=%s where id=%s and user_id=%s''', (comment, commentId, userId,))
        mysql.connection.commit()
        cursor.close()
        return json.dumps({'message': 'Comment Edited Successfully', 'error': False})
    elif request.method == 'DELETE':
        token = request.headers['Authorization'].split(' ')[1]
        userId = decode_token(token)['id']
        cursor = mysql.connection.cursor()
        cursor.execute('''delete from comments where id=%s and user_id=%s''', (commentId, userId, ))
        mysql.connection.commit()
        cursor.close()
        return json.dumps({'message': 'Comment Deleted Successfully', 'error': False})


