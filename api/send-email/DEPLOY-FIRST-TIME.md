# Guía de Primer Deployment - Azure Function

Esta guía te ayudará a hacer el primer despliegue de la función de email a Azure.

## Prerequisitos

1. **Azure CLI** instalado
   ```bash
   # macOS
   brew install azure-cli
   
   # Verificar instalación
   az --version
   ```

2. **Azure Functions Core Tools** instalado
   ```bash
   npm install -g azure-functions-core-tools@4
   
   # Verificar instalación
   func --version
   ```

3. **Node.js 18+** instalado
   ```bash
   node --version
   ```

4. **Credenciales de Microsoft 365** (de `EMAIL_SETUP.md`):
   - Tenant ID
   - Client ID
   - Client Secret

## Opción 1: Deployment Automático (Recomendado)

1. **Ejecutar el script de deployment:**
   ```bash
   cd api/send-email
   ./deploy.sh
   ```

2. **Seguir las instrucciones:**
   - El script te pedirá tus credenciales de Microsoft 365
   - Creará todos los recursos necesarios en Azure
   - Desplegará la función
   - Te dará la URL final

## Opción 2: Deployment Manual

### Paso 1: Login a Azure

```bash
az login
```

Se abrirá el navegador para autenticarte.

### Paso 2: Crear Resource Group

```bash
az group create \
  --name alzent-rg \
  --location eastus
```

### Paso 3: Crear Storage Account

```bash
STORAGE_NAME="alzentstorage$(date +%s | tail -c 5)"
az storage account create \
  --name $STORAGE_NAME \
  --location eastus \
  --resource-group alzent-rg \
  --sku Standard_LRS
```

### Paso 4: Crear Function App

```bash
FUNCTION_NAME="alzent-email-$(date +%s | tail -c 5)"
az functionapp create \
  --resource-group alzent-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name $FUNCTION_NAME \
  --storage-account $STORAGE_NAME
```

### Paso 5: Configurar Variables de Entorno

```bash
az functionapp config appsettings set \
  --name $FUNCTION_NAME \
  --resource-group alzent-rg \
  --settings \
    MICROSOFT_TENANT_ID="TU-TENANT-ID" \
    MICROSOFT_CLIENT_ID="TU-CLIENT-ID" \
    MICROSOFT_CLIENT_SECRET="TU-CLIENT-SECRET" \
    MICROSOFT_SENDER_EMAIL="info@alzentdigital.com" \
    MICROSOFT_RECIPIENT_EMAIL="info@alzentdigital.com" \
    FUNCTIONS_WORKER_RUNTIME=node \
    WEBSITE_NODE_DEFAULT_VERSION=~18
```

**⚠️ IMPORTANTE:** Reemplaza `TU-TENANT-ID`, `TU-CLIENT-ID`, y `TU-CLIENT-SECRET` con tus credenciales reales.

### Paso 6: Configurar CORS

```bash
# Permitir todos los orígenes (para desarrollo)
az functionapp cors add \
  --name $FUNCTION_NAME \
  --resource-group alzent-rg \
  --allowed-origins "*"

# O permitir solo tu dominio (recomendado para producción)
az functionapp cors add \
  --name $FUNCTION_NAME \
  --resource-group alzent-rg \
  --allowed-origins "https://tu-dominio.com"
```

### Paso 7: Instalar Dependencias

```bash
cd api/send-email
npm install
```

### Paso 8: Deploy

```bash
func azure functionapp publish $FUNCTION_NAME
```

### Paso 9: Obtener la URL

```bash
echo "https://${FUNCTION_NAME}.azurewebsites.net/api/send-email"
```

## Actualizar Frontend

Una vez que tengas la URL de la función, actualiza el frontend:

### Opción A: Modificar directamente el código

Edita `assets/js/email.js` línea 10:

```javascript
const EMAIL_CONFIG = {
    endpoint: 'https://tu-function-app.azurewebsites.net/api/send-email',
    // ...
};
```

### Opción B: Configurar variable global (Recomendado)

En `index.html`, antes de cargar `email.js`, agrega:

```html
<script>
    window.EMAIL_SERVICE_URL = 'https://tu-function-app.azurewebsites.net/api/send-email';
</script>
<script src="assets/js/email.js"></script>
```

## Verificar Deployment

1. **Ver logs en tiempo real:**
   ```bash
   az functionapp log tail \
     --name $FUNCTION_NAME \
     --resource-group alzent-rg
   ```

2. **Probar la función:**
   - Llena un formulario en tu página web
   - Verifica que lleguen los correos:
     - A `info@alzentdigital.com` (notificación)
     - Al email del usuario (confirmación)

3. **Ver en Azure Portal:**
   - Ve a [Azure Portal](https://portal.azure.com)
   - Busca tu Function App
   - Ve a Functions > sendEmail > Monitor
   - Revisa los logs y métricas

## Troubleshooting

### Error: "Microsoft 365 credentials not configured"
- Verifica que las variables de entorno estén configuradas en Azure Portal
- Function App > Configuration > Application settings

### Error: "Mail.Send permission denied"
- Verifica que el consentimiento de administrador esté otorgado
- Verifica la Application Access Policy (ver `EMAIL_SETUP.md`)

### Error: "CORS error"
- Verifica la configuración de CORS en Azure Portal
- Function App > CORS

### La función no responde
- Verifica que la función esté activa
- Revisa los logs en Azure Portal
- Verifica que el runtime sea Node.js 18

### No llegan los correos
- Verifica los logs de la función
- Verifica que las credenciales sean correctas
- Verifica que la Application Access Policy esté configurada correctamente

## Costos

Azure Functions en Consumption Plan:
- **Gratis:** 1 millón de ejecuciones gratuitas por mes
- **Después:** $0.000016 por ejecución
- **Storage:** ~$0.0184 por GB/mes

Para una página web típica, el costo será mínimo o gratuito.

## Seguridad

1. **Nunca commitees** las credenciales
2. **Usa Azure Key Vault** para almacenar secrets en producción
3. **Restringe CORS** a tu dominio específico
4. **Habilita HTTPS** (automático en Azure Functions)
5. **Revisa los logs** regularmente

## Próximos Pasos

1. ✅ Deployment completado
2. ⏳ Actualizar frontend con la URL
3. ⏳ Probar envío de formularios
4. ⏳ Verificar recepción de correos
5. ⏳ Configurar monitoreo y alertas (opcional)

