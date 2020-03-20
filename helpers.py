import secrets
import hashlib
import jwt

def generate_salt():
    return secrets.token_urlsafe(16)

def generate_hash(string, salt):
    md5 = hashlib.md5()
    hash_string = salt + string + salt
    for _ in range(50):
        md5.update(hash_string.encode('UTF-8'))
        hash_string = md5.hexdigest()
    return hash_string

def generate_token(data):
    return jwt.encode(data, 'ryder', algorithm='HS256').decode()

def decode_token(token):
    return jwt.decode(token, 'ryder', algorithms=['HS256'])