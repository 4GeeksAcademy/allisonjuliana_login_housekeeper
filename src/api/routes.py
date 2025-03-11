from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, HouseKeeper, Branches
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
import datetime
import jwt

api = Blueprint('api', __name__)
CORS(api)

SECRET_KEY = "your_secret_key"

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/housekeepers', methods=['POST'])
def create_housekeeper():
    data = request.get_json()
    if not data.get('nombre') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing data"}), 400
    new_housekeeper = HouseKeeper(
        nombre=data['nombre'],
        email=data['email'],
        password=data['password'],
        id_branche=data.get('id_branche')
    )
    db.session.add(new_housekeeper)
    db.session.commit()
    return jsonify(new_housekeeper.serialize()), 201

@api.route('/housekeepers', methods=['GET'])
def get_housekeepers():
    housekeepers = HouseKeeper.query.all()
    return jsonify([housekeeper.serialize() for housekeeper in housekeepers]), 200

@api.route('/housekeepers/<int:id>', methods=['GET'])
def get_housekeeper(id):
    housekeeper = HouseKeeper.query.get(id)
    if not housekeeper:
        return jsonify({"error": "Housekeeper not found"}), 404
    return jsonify(housekeeper.serialize()), 200

@api.route('/housekeepers/<int:id>', methods=['PUT'])
def update_housekeeper(id):
    housekeeper = HouseKeeper.query.get(id)
    if not housekeeper:
        return jsonify({"error": "Housekeeper not found"}), 404
    data = request.get_json()
    housekeeper.nombre = data.get('nombre', housekeeper.nombre)
    housekeeper.email = data.get('email', housekeeper.email)
    housekeeper.password = data.get('password', housekeeper.password)
    housekeeper.id_branche = data.get('id_branche', housekeeper.id_branche)
    db.session.commit()
    return jsonify(housekeeper.serialize()), 200

@api.route('/housekeepers/<int:id>', methods=['DELETE'])
def delete_housekeeper(id):
    housekeeper = HouseKeeper.query.get(id)
    if not housekeeper:
        return jsonify({"error": "Housekeeper not found"}), 404
    db.session.delete(housekeeper)
    db.session.commit()
    return jsonify({"message": "Housekeeper deleted successfully"}), 200

@api.route('/branches', methods=['GET'])
def get_branches():
    branches = Branches.query.all()
    return jsonify([branch.serialize() for branch in branches]), 200

@api.route('/loginHouseKeeper', methods=['POST'])
def login_housekeeper():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
    housekeeper = HouseKeeper.query.filter_by(email=email).first()
    if not housekeeper:
        return jsonify({"error": "Invalid housekeeper credentials"}), 401
    if housekeeper.password != password:
        return jsonify({"error": "Invalid password credentials"}), 401
    token = jwt.encode({
        'housekeeper_id': housekeeper.id,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=5)
    }, SECRET_KEY, algorithm='HS256')
    return jsonify({'token': token}), 200
