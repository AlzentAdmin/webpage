# 🚀 Guía Rápida de Deployment - Azure Function

## ✅ Checklist de Prerequisitos

Antes de empezar, asegúrate de tener:

- [ ] **Azure CLI** instalado (`az --version`)
- [ ] **Azure Functions Core Tools** instalado (`func --version`)
- [ ] **Node.js 18+** instalado (`node --version`)
- [ ] **Credenciales de Microsoft 365** (Tenant ID, Client ID, Client Secret)
- [ ] **Cuenta de Azure** con suscripción activa

## 📋 Paso 1: Instalar Prerequisitos

### macOS:

```bash
# Instalar Azure CLI
brew install azure-cli

# Instalar Azure Functions Core Tools
npm install -g azure-functions-core-tools@4

# Verificar instalación
az --version
func --version
```

### Windows:

```powershell
# Instalar Azure CLI
# Descargar desde: https://aka.ms/installazurecliwindows

# Instalar Azure Functions Core Tools
npm install -g azure-functions-core-tools@4
```

## 📋 Paso 2: Login a Azure

```bash
az login
```

Se abrirá el navegador para autenticarte. Selecciona tu cuenta de Azure.

## 📋 Paso 3: Deployment Automático (Recomendado)

El script automatizado hace todo por ti:

```bash
cd api/send-email
./deploy.sh
```

El script te pedirá:
1. **MICROSOFT_TENANT_ID** - Tu Tenant ID de Microsoft 365
2. **MICROSOFT_CLIENT_ID** - Tu Client ID de la App Registration
3. **MICROSOFT_CLIENT_SECRET** - Tu Client Secret
4. **MICROSOFT_SENDER_EMAIL** - (default: info@alzentdigital.com)
5. **MICROSOFT_RECIPIENT_EMAIL** - (default: info@alzentdigital.com)
6. **CORS Origin** - Tu dominio (ej: https://alzent.digital) o '*' para todos

### ¿Dónde obtener las credenciales de Microsoft 365?

Si aún no las tienes configuradas, necesitas:

1. Ir a [Azure Portal](https://portal.azure.com)
2. Azure Active Directory > App registrations
3. Crear una nueva app registration o usar una existente
4. Obtener:
   - **Tenant ID**: Overview > Tenant ID
   - **Client ID**: Overview > Application (client) ID
   - **Client Secret**: Certificates & secrets > New client secret

**Importante:** La app necesita el permiso `Mail.Send` con consentimiento de administrador.

## 📋 Paso 4: Actualizar Frontend

Una vez que el deployment termine, el script te dará la URL de la función. Ejemplo:
```
https://alzent-email-12345.azurewebsites.net/api/send-email
```

### Actualizar la URL en el código:

**Opción A: Actualizar `config.js` (Recomendado)**

Edita `assets/js/config.js` línea 48:

```javascript
emailServiceUrl: 'https://alzent-email-12345.azurewebsites.net/api/send-email'
```

**Opción B: Variable global en HTML**

En `index.html`, antes de cargar los scripts, agrega:

```html
<script>
    window.EMAIL_SERVICE_URL = 'https://alzent-email-12345.azurewebsites.net/api/send-email';
</script>
```

## 📋 Paso 5: Probar

1. Abre tu página web
2. Llena un formulario (ej: Card Request)
3. Verifica que lleguen los correos:
   - ✅ Notificación a `info@alzentdigital.com`
   - ✅ Confirmación al email del usuario

## 🔍 Verificar Deployment

### Ver logs en tiempo real:

```bash
az functionapp log tail \
  --name alzent-email-XXXXX \
  --resource-group alzent-rg
```

### Ver en Azure Portal:

1. Ve a [Azure Portal](https://portal.azure.com)
2. Busca tu Function App
3. Functions > sendEmail > Monitor
4. Revisa logs y métricas

## 🆘 Troubleshooting

### Error: "Microsoft 365 credentials not configured"
- Verifica que las variables de entorno estén en Azure Portal
- Function App > Configuration > Application settings

### Error: "Mail.Send permission denied"
- Verifica que el consentimiento de administrador esté otorgado
- Verifica la Application Access Policy

### Error: "CORS error"
- Verifica la configuración de CORS en Azure Portal
- Function App > CORS

### La función no responde
- Verifica que la función esté activa
- Revisa los logs en Azure Portal
- Verifica que el runtime sea Node.js 18

## 💰 Costos

Azure Functions en Consumption Plan:
- **Gratis:** 1 millón de ejecuciones gratuitas por mes
- **Después:** $0.000016 por ejecución
- **Storage:** ~$0.0184 por GB/mes

Para una página web típica, el costo será mínimo o gratuito.

## 📚 Documentación Adicional

- `DEPLOY-FIRST-TIME.md` - Guía detallada paso a paso
- `SETUP-AND-DEPLOY.md` - Setup rápido
- `DEPLOYMENT.md` - Documentación completa
- `README.md` - Información general

