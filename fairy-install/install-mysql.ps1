# Chemins
$zipPath = "$env:TEMP\mysql.zip"
$mysqlDir = "C:\MySQL"
$unzipTemp = "$env:TEMP\mysql-unzip"

Write-Host "Début de l'installation MySQL..."

# Nettoyage
Write-Host "Nettoyage d'éventuels dossiers précédents..."
Remove-Item -Recurse -Force $mysqlDir -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $unzipTemp -ErrorAction SilentlyContinue

# Extraction
Write-Host "Extraction de l'archive MySQL..."
Expand-Archive -Path $zipPath -DestinationPath $unzipTemp -Force

# Trouver le dossier MySQL extrait (par exemple mysql-8.0.36-winx64)
$extractedFolder = Get-ChildItem -Path $unzipTemp | Where-Object { $_.PSIsContainer } | Select-Object -First 1

# Déplacement dans C:\MySQL
Write-Host "Déplacement vers C:\MySQL..."
Move-Item -Path $extractedFolder.FullName -Destination $mysqlDir -Force

# Initialisation du dossier de données
Write-Host "Initialisation de la base MySQL..."
& "$mysqlDir\bin\mysqld.exe" --initialize-insecure --basedir="$mysqlDir" --datadir="$mysqlDir\data"

# Lancement de MySQL en mode console
Write-Host "Démarrage de MySQL..."
Start-Process -FilePath "$mysqlDir\bin\mysqld.exe" -ArgumentList "--console --datadir=$mysqlDir\data --port=3306"

Write-Host "MySQL lancé avec succès sur le port 3306 sans mot de passe root."
