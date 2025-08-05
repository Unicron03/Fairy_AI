Write-Host ">>> Création de l'environnement virtuel..."
python -m venv venv

Write-Host ">>> Activation de l'environnement virtuel..."
& ".\venv\Scripts\Activate.ps1"

Write-Host ">>> Installation des dépendances..."
pip install --upgrade pip
pip install -r requirements.txt

Write-Host ">>> Lancement du serveur FastAPI..."
uvicorn api:app --reload
