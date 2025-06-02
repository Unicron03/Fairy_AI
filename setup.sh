#!/bin/bash

echo ">>> Création de l'environnement virtuel..."
python -m venv venv

echo ">>> Activation de l'environnement virtuel..."
source venv/bin/activate

echo ">>> Installation des dépendances..."
pip install --upgrade pip
pip install -r requirements.txt

echo ">>> Lancement du serveur FastAPI..."
uvicorn api:app --reload

curl -X POST http://127.0.0.1:8000/ask \
-H "Content-Type: application/json" \
-d "{\"question\": \"Who is the youngest?\", \"csv_data\": \"Name,Age\nAlice,30\nBob,25\"}"
