$mysqlZip = "C:\temp\mysql.zip"
$mysqlDir = "C:\MySQL"
$unzipDir = "C:\temp\mysql-unzip"

# Nettoyage
Remove-Item -Recurse -Force "$unzipDir" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$mysqlDir" -ErrorAction SilentlyContinue

# Extraction
Expand-Archive -Path $mysqlZip -DestinationPath $unzipDir -Force
$folder = Get-ChildItem $unzipDir | Where-Object { $_.PSIsContainer } | Select-Object -First 1
Move-Item $folder.FullName $mysqlDir -Force

# Initialisation (sans mot de passe)
& "$mysqlDir\bin\mysqld.exe" --initialize-insecure --basedir="$mysqlDir" --datadir="$mysqlDir\data"

# Ajout au service Windows
& "$mysqlDir\bin\mysqld.exe" --install MySQL
Start-Service MySQL

# Démarrage de MySQL en arrière-plan
Start-Process "$mysqlDir\bin\mysqld.exe" -ArgumentList "--console --datadir=$mysqlDir\data --port=3306"
Start-Sleep -Seconds 10  # Laisse le temps au serveur de démarrer

# Définir le mot de passe root
& "$mysqlDir\bin\mysqladmin.exe" -u root password "Uk89Lu12&*"


