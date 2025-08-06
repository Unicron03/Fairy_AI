# Définir les chemins
$baseDir = "$PSScriptRoot\mariadb"
$dataDir = "$baseDir\data"
$mysqlExe = "$baseDir\bin\mysql.exe"
$mysqldExe = "$baseDir\bin\mysqld.exe"
$databaseName = "evolea_ai"

# Créer le dossier 'data' s'il n'existe pas
if (-Not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir | Out-Null
}

# Initialiser la base de données
& $mysqldExe --initialize-insecure --basedir=$baseDir --datadir=$dataDir

# Lancer le serveur MariaDB
Start-Process -FilePath $mysqldExe -ArgumentList "--console --basedir=$baseDir --datadir=$dataDir --port=3306" -NoNewWindow

# Attendre que le serveur soit prêt
Start-Sleep -Seconds 10

# Créer la base de données
& $mysqlExe --host=localhost --port=3306 --user=root --execute="CREATE DATABASE IF NOT EXISTS $databaseName;"
