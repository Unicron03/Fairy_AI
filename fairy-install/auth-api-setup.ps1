# Aller dans le dossier du frontend
Set-Location "..\fairy-auth-api"

# Installer les dépendances Node.js
Write-Host ">>> Installation des dépendances frontend..."
npx prisma generate
npm install

# Lancer le serveur de développement
Write-Host ">>> Lancement du serveur frontend..."
Start-Process "npm.cmd" -ArgumentList "run dev" -NoNewWindow