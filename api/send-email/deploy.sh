#!/bin/bash

# Script de deployment para Azure Function - ALZENT Email Service
# Uso: ./deploy.sh

set -e

echo "🚀 ALZENT Email Service - Deployment Script"
echo "============================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que Azure CLI está instalado
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI no está instalado.${NC}"
    echo "Instala Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Verificar que func está instalado
if ! command -v func &> /dev/null; then
    echo -e "${YELLOW}⚠️  Azure Functions Core Tools no está instalado.${NC}"
    echo "Instalando..."
    npm install -g azure-functions-core-tools@4
fi

# Variables configurables
RESOURCE_GROUP="alzent-rg"
LOCATION="eastus"
STORAGE_ACCOUNT="alzentstorage$(date +%s | tail -c 5)"
FUNCTION_APP_NAME="alzent-email-$(date +%s | tail -c 5)"
APP_SERVICE_PLAN="alzent-plan"

echo -e "${YELLOW}Configuración:${NC}"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  Function App: $FUNCTION_APP_NAME"
echo ""

# Login a Azure
echo -e "${YELLOW}1. Verificando login en Azure...${NC}"
if ! az account show &> /dev/null; then
    echo "Por favor, inicia sesión en Azure:"
    az login
fi

ACCOUNT=$(az account show --query name -o tsv)
echo -e "${GREEN}✓${NC} Conectado como: $ACCOUNT"
echo ""

# Crear Resource Group
echo -e "${YELLOW}2. Creando Resource Group...${NC}"
if az group show --name $RESOURCE_GROUP &> /dev/null; then
    echo -e "${GREEN}✓${NC} Resource Group ya existe"
else
    az group create --name $RESOURCE_GROUP --location $LOCATION
    echo -e "${GREEN}✓${NC} Resource Group creado"
fi
echo ""

# Crear Storage Account
echo -e "${YELLOW}3. Creando Storage Account...${NC}"
if az storage account show --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${GREEN}✓${NC} Storage Account ya existe"
else
    az storage account create \
        --name $STORAGE_ACCOUNT \
        --location $LOCATION \
        --resource-group $RESOURCE_GROUP \
        --sku Standard_LRS
    echo -e "${GREEN}✓${NC} Storage Account creado"
fi
echo ""

# Crear Function App
echo -e "${YELLOW}4. Creando Function App...${NC}"
if az functionapp show --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${GREEN}✓${NC} Function App ya existe"
else
    az functionapp create \
        --resource-group $RESOURCE_GROUP \
        --consumption-plan-location $LOCATION \
        --runtime node \
        --runtime-version 18 \
        --functions-version 4 \
        --name $FUNCTION_APP_NAME \
        --storage-account $STORAGE_ACCOUNT
    echo -e "${GREEN}✓${NC} Function App creada"
fi
echo ""

# Solicitar credenciales
echo -e "${YELLOW}5. Configurando variables de entorno...${NC}"
echo "Por favor, ingresa las siguientes credenciales:"
echo ""

read -p "MICROSOFT_TENANT_ID: " TENANT_ID
read -p "MICROSOFT_CLIENT_ID: " CLIENT_ID
read -sp "MICROSOFT_CLIENT_SECRET: " CLIENT_SECRET
echo ""
read -p "MICROSOFT_SENDER_EMAIL [info@alzentdigital.com]: " SENDER_EMAIL
SENDER_EMAIL=${SENDER_EMAIL:-info@alzentdigital.com}
read -p "MICROSOFT_RECIPIENT_EMAIL [info@alzentdigital.com]: " RECIPIENT_EMAIL
RECIPIENT_EMAIL=${RECIPIENT_EMAIL:-info@alzentdigital.com}

# Configurar variables de entorno
az functionapp config appsettings set \
    --name $FUNCTION_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
        MICROSOFT_TENANT_ID="$TENANT_ID" \
        MICROSOFT_CLIENT_ID="$CLIENT_ID" \
        MICROSOFT_CLIENT_SECRET="$CLIENT_SECRET" \
        MICROSOFT_SENDER_EMAIL="$SENDER_EMAIL" \
        MICROSOFT_RECIPIENT_EMAIL="$RECIPIENT_EMAIL" \
        FUNCTIONS_WORKER_RUNTIME=node \
        WEBSITE_NODE_DEFAULT_VERSION=~18

echo -e "${GREEN}✓${NC} Variables de entorno configuradas"
echo ""

# Configurar CORS
echo -e "${YELLOW}6. Configurando CORS...${NC}"
read -p "Dominio permitido para CORS (ej: https://alzent.digital) o '*' para todos: " CORS_ORIGIN
CORS_ORIGIN=${CORS_ORIGIN:-*}

az functionapp cors add \
    --name $FUNCTION_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --allowed-origins "$CORS_ORIGIN"

echo -e "${GREEN}✓${NC} CORS configurado"
echo ""

# Instalar dependencias
echo -e "${YELLOW}7. Instalando dependencias...${NC}"
cd "$(dirname "$0")"
npm install
echo -e "${GREEN}✓${NC} Dependencias instaladas"
echo ""

# Deploy
echo -e "${YELLOW}8. Desplegando función...${NC}"
func azure functionapp publish $FUNCTION_APP_NAME
echo -e "${GREEN}✓${NC} Función desplegada"
echo ""

# Obtener URL
FUNCTION_URL="https://${FUNCTION_APP_NAME}.azurewebsites.net/api/send-email"
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETADO${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Function URL: $FUNCTION_URL"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo "1. Actualiza el frontend con esta URL:"
echo "   En assets/js/email.js línea 10:"
echo "   endpoint: '$FUNCTION_URL',"
echo ""
echo "2. O configura la variable global:"
echo "   window.EMAIL_SERVICE_URL = '$FUNCTION_URL';"
echo ""
echo "3. Prueba llenando un formulario en la página"
echo ""

