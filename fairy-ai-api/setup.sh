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