cp server_prod.js server.js
rm crm-frontend.zip
cd ..
zip -r crm-frontend.zip crm-frontend -x "crm-frontend/.git" "crm-frontend/.gitignore" "crm-frontend/*.sh" "crm-frontend/*.bat" "crm-frontend/*.pem" "crm-frontend/*.ppk" "cspin-frontend/*.zip"
mv crm-frontend.zip crm-frontend/crm-frontend.zip
cd crm-frontend