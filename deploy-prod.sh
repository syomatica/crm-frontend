#!/usr/bin/env bash
# Deploy del crm-frontend in produzione (istanza Planning Connect, nginx).
# Imposta server.js di produzione, pacchetta i file statici e li pubblica in nginx.
#
# Uso:
#   KEY=~/path/api.pem HOST=ec2-user@3.73.219.28 ./deploy-prod.sh
# oppure modifica i default qui sotto.
set -euo pipefail

# --- parametri (modifica o passa via env) ---
KEY="${KEY:-$HOME/percorso/api.pem}"           # chiave SSH dell'istanza PC
HOST="${HOST:-ec2-user@3.73.219.28}"           # utente@host dell'istanza PC
REMOTE="${REMOTE:-/usr/share/nginx/html/crm-frontend}"   # docroot nginx del CRM
API_URL="${API_URL:-https://crm.planning-connect.com/api/}"

SRC="$(cd "$(dirname "$0")" && pwd)"
cd "$SRC"

echo "==> server.js -> $API_URL"
printf "server = '%s';\n" "$API_URL" > server.js

echo "==> Creo il pacchetto (escludo git/script/chiavi/zip)"
TARBALL="$(mktemp -t crm-frontend).tgz"
tar czf "$TARBALL" \
  --exclude='.git' --exclude='node_modules' --exclude='*.sh' \
  --exclude='*.pem' --exclude='*.ppk' --exclude='*.zip' --exclude='*.bat' \
  --exclude='.DS_Store' \
  .

echo "==> Copio il pacchetto sull'istanza"
scp -i "$KEY" "$TARBALL" "$HOST:/tmp/crm-frontend.tgz"

echo "==> Pubblico in $REMOTE e ricarico nginx"
ssh -i "$KEY" "$HOST" "set -e; \
  sudo mkdir -p '$REMOTE'; \
  sudo tar xzf /tmp/crm-frontend.tgz -C '$REMOTE'; \
  sudo nginx -t; \
  sudo systemctl reload nginx; \
  rm -f /tmp/crm-frontend.tgz"

rm -f "$TARBALL"
echo "==> Deploy completato: https://crm.planning-connect.com/"
