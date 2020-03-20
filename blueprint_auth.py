from flask import Blueprint, request, make_response, jsonify
import json
from helpers import generate_salt, generate_hash, generate_token, decode_token
from server import mysql
import jwt

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    try:
        cursor = mysql.connection.cursor()
        name = request.json['name']
        email = request.json['email']
        password = request.json['password']
        cursor.execute('''select * from users where email = %s''', (email,))
        results = cursor.fetchall()
        items = []
        for item in results:
            items.append(item)
        if items:
            items = items[0]
        if items:
            return json.dumps({'message': 'User Already exists', 'error': True})
        else:
            salt = generate_salt()
            password_hash = generate_hash(password, salt)
            cursor.execute('''insert into users(name, email, password, salt) values(%s, %s, %s, %s)''',(name, email, password_hash, salt))
        mysql.connection.commit()
        cursor.close()
        return json.dumps({'message': 'User Created Successfully', 'error': False})
    except:
        return json.dumps({'message': 'Some Error Occured', 'error': True})

@auth.route('/login', methods=['POST'])
def login():
    try:
        email = request.json['email']
        password = request.json['password']
        cursor = mysql.connection.cursor()
        cursor.execute('''select * from users where email = %s''', (email,))
        results = cursor.fetchall()
        items = []
        for item in results:
            items.append(item)
        if items:
            items = items[0]
        mysql.connection.commit()
        cursor.close()
        if not items:
            return json.dumps({'message': 'Account does not exists. Please Signup before logging in.', 'error': True})
        else:
            newPasswordHash = generate_hash(password, items['salt'])
            if items['password'] != newPasswordHash:
                return json.dumps({'message': 'Invalid Password. Please Enter Correct Password.', 'error': True})
            else:
                return json.dumps({'token': generate_token({'id':items['id']}), 'error': False})
    except:
        return json.dumps({'message': 'Some Error Occured', 'error': True})


@auth.route('/details', methods=['GET'])
def getUserDetails():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        userId = decode_token(token)['id']
        cursor = mysql.connection.cursor()
        cursor.execute('''select * from users where id = %s''', (userId,))
        results = cursor.fetchall()
        items = []
        for item in results:
            items.append(item)
        items = items[0]
        return json.dumps({'data': items, 'error': False})
    except jwt.exceptions.InvalidSignatureError:
        return json.dumps({'message': 'Invalid Token', 'error': True})

@auth.route('/edit', methods=['PUT'])
def editUserDetails():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        userId = decode_token(token)['id']
        cursor = mysql.connection.cursor()
        name = request.json['name']
        email = request.json['email']
        cursor.execute('''update users set name=%s, email=%s where id=%s''', (name, email, userId,))
        mysql.connection.commit()
        cursor.close()
        return json.dumps({'message': 'User Details Edited Successfully', 'error': False})
    except:
        return json.dumps({'message': 'Some Error Occured', 'error': True})
