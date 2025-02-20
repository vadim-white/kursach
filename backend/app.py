import os
from flask import Flask, request, jsonify  # Импортируем request и jsonify

from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))  # Получаем путь к текущей директории
DB_PATH = os.path.join(BASE_DIR, '../database/data.db')  # Указываем путь к базе данных

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'  # Указываем полный путь к БД

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)


# Модель карточки
class Card(db.Model):
    __tablename__ = 'cards'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    link = db.Column(db.String(200), nullable=False)
    device_type = db.Column(db.String(100), nullable=False)
    device_characteristics = db.Column(db.String(200), nullable=False)
    device_functions = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f'<Card {self.name}>'
class Admin(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Admin {self.name}>'
# Эндпоинт для добавления карточки
@app.route('/api/cards', methods=['POST'])
def add_card():
    data = request.get_json()

    # Создаем новую карточку
    new_card = Card(
        name=data['name'],
        link=data['link'],
        device_type=data['device_type'],
        device_characteristics=data['device_characteristics'],
        device_functions=data['device_functions']
    )

    # Добавляем карточку в базу данных
    db.session.add(new_card)
    db.session.commit()

    return jsonify({"message": "Карточка добавлена!", "card": data}), 201

# Эндпоинт для получения всех карточек
@app.route('/api/cards', methods=['GET'])
def get_cards():
    cards = Card.query.all()  # Получаем все карточки из базы данных
    return jsonify([{
        'id': card.id,
        'name': card.name,
        'link': card.link,
        'device_type': card.device_type,
        'device_characteristics': card.device_characteristics,
        'device_functions': card.device_functions
    } for card in cards]) 

# Эндпоинт для удаления карточки
@app.route('/api/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    # Находим карточку по id
    card = Card.query.get_or_404(card_id)
    
    # Удаляем карточку из базы данных
    db.session.delete(card)
    db.session.commit()
    
    return jsonify({"message": "Карточка успешно удалена", "card_id": card_id}), 200


@app.route('/api/admin', methods=['GET', 'PATCH'])
def admin():
    admin = Admin.query.first()

    if not admin:
        return jsonify({"error": "Администратор не найден"}), 404

    if request.method == 'GET':
        # Возвращаем текущие данные администратора
        return jsonify({
            "id": admin.id,
            "name": admin.name,
            "status": admin.status
        }), 200

    elif request.method == 'PATCH':
        data = request.get_json()

        # Обновляем данные администратора
        if 'name' in data:
            admin.name = data['name']
        if 'status' in data:
            admin.status = data['status']

        db.session.commit()
        return jsonify({"message": "Данные администратора обновлены", "admin": {
            "id": admin.id,
            "name": admin.name,
            "status": admin.status
        }}), 200
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
