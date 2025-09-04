#!/bin/bash

TEXTO_A_REMOVER="		\"react-chat-elements\": \"^12.0.18\","
NOME_DO_ARQUIVO="./package.json"

echo "PREPARANDO PARA INSTALAR NOVA LIB"
rm -rf .node_modules/
rm -rf .next/
echo  "ANTIGAS LIBS APAGADAS"

echo "REMOVENDO LINHA DO PACKAGE.JSON"
sed -i "/${TEXTO_A_REMOVER}/d" "$NOME_DO_ARQUIVO"
echo "LINHA REMOVIDA COM SUCESSO"

echo "INSTALANDO NOVA LIB..."
$1
echo "NOVA LIB INSTALADA"

echo "INSTALANDO A LIB DE CHAT UI"
npm i react-chat-elements --legacy-peer-deps

