# Guía de Deployment - Azure Function Email Service

## Prerequisitos

1. **Azure CLI** instalado
2. **Azure Functions Core Tools** instalado
3. **Node.js 18+** instalado
4. Credenciales de Microsoft 365 configuradas (ver `EMAIL_SETUP.md`)

## Instalación Local

1. **Instalar dependencias:**
   ```bash
   cd api/send-email
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   # Copiar el archivo de ejemplo
   cp env.example .env
   
   # Editar .env con tus credenciales
   nano .env
   ```

3. **Instalar Azure Functions Core Tools:**
   ```bash
   npm install -g azure-functions-core-tools@4
   ```

4. **Ejecutar localmente:**
   ```bash
   # Desde la raíz del proyecto
   func start
   ```

   La función estará disponible en: `http://localhost:7071/api/send-email`

5. **Probar localmente:**
   ```bash
   # En otra terminal
   node test-local.js
   ```

## Deployment a Azure

### Opción 1: Usando Azure CLI

1. **Login a Azure:**
   ```bash
   az login
   ```

2. **Crear Resource Group (si no existe):**
   ```bash
   az group create --name alzent-rg --location eastus
   ```

3. **Crear Storage Account:**
   ```bash
   az storage account create \
     --name alzentstorage \
     --location eastus \
     --resource-group alzent-rg \
     --sku Standard_LRS
   ```

4. **Crear Function App:**
   ```bash
   az functionapp create \
     --resource-group alzent-rg \
     --consumption-plan-location eastus \
     --runtime node \
     --runtime-version 18 \
     --functions-version 4 \
     --name alzent-email-function \
     --storage-account alzentstorage
   ```

5. **Configurar variables de entorno:**
   ```bash
   az functionapp config appsettings set \
     --name alzent-email-function \
     --resource-group alzent-rg \
     --settings \
       MICROSOFT_TENANT_ID="your-tenant-id" \
       MICROSOFT_CLIENT_ID="your-client-id" \
       MICROSOFT_CLIENT_SECRET="your-client-secret" \
       MICROSOFT_SENDER_EMAIL="info@alzentdigital.com" \
       MICROSOFT_RECIPIENT_EMAIL="info@alzentdigital.com"
   ```

6. **Deploy la función:**
   ```bash
   cd api/send-email
   func azure functionapp publish alzent-email-function
   ```

### Opción 2: Usando Visual Studio Code

1. Instalar extensión "Azure Functions" en VS Code
2. Login a Azure desde VS Code
3. Click derecho en la carpeta `api/send-email`
4. Seleccionar "Deploy to Function App"
5. Seguir las instrucciones

### Opción 3: Usando GitHub Actions

Crear `.github/workflows/deploy-function.yml`:

```yaml
name: Deploy Azure Function

on:
  push:
    branches: [ main ]
    paths:
      - 'api/send-email/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd api/send-email
          npm install
      
      - name: Deploy to Azure Functions
        uses: Azure/functions-action@v1
        with:
          app-name: 'alzent-email-function'
          package-path: './api/send-email'
          publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}
```

## Configurar CORS

Para permitir requests desde tu dominio:

```bash
az functionapp cors add \
  --name alzent-email-function \
  --resource-group alzent-rg \
  --allowed-origins https://yourdomain.com
```

## Obtener la URL de la Función

```bash
az functionapp function show \
  --name alzent-email-function \
  --resource-group alzent-rg \
  --function-name sendEmail \
  --query invokeUrlTemplate \
  --output tsv
```

## Actualizar Frontend

Una vez deployada, actualiza la URL en `assets/js/email.js`:

```javascript
const EMAIL_CONFIG = {
    endpoint: 'https://alzent-email-function.azurewebsites.net/api/send-email',
    // ...
};
```

O configura la variable de entorno en el frontend:

```javascript
window.EMAIL_SERVICE_URL = 'https://alzent-email-function.azurewebsites.net/api/send-email';
```

## Monitoreo

1. **Ver logs en tiempo real:**
   ```bash
   az functionapp log tail --name alzent-email-function --resource-group alzent-rg
   ```

2. **Ver en Azure Portal:**
   - Ir a Function App > Functions > sendEmail > Monitor

## Troubleshooting

### Error: "Microsoft 365 credentials not configured"
- Verifica que las variables de entorno estén configuradas en Azure Portal
- Function App > Configuration > Application settings

### Error: "Mail.Send permission denied"
- Verifica que el consentimiento de administrador esté otorgado
- Verifica la Application Access Policy

### Error: "CORS error"
- Configura CORS en Azure Portal o usando Azure CLI
- Function App > CORS

### La función no responde
- Verifica que la función esté activa en Azure Portal
- Revisa los logs para errores
- Verifica que el runtime sea Node.js 18

