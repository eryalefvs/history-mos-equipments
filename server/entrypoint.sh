#!/bin/sh
set -e

echo "🌱 Executando seed..."
node dist/infra/seed.js || echo "⚠️ Seed falhou ou não havia dados para importar."

echo "🚀 Iniciando servidor..."
exec node dist/index.js
