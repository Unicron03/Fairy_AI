# Aller dans le dossier du frontend
Set-Location "C:\Users\evandepoele\Downloads\Fairy_AI-main\Fairy_AI-main\fairy-frontend"

# Installer les dépendances Node.js
Write-Host ">>> Installation des dépendances frontend..."
npm install

# Lancer le serveur de développement
Write-Host ">>> Lancement du serveur frontend..."
Start-Process "npm" -ArgumentList "run dev" -NoNewWindow
