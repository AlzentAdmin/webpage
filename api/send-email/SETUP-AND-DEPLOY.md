# Setup y Deployment Rápido

## Paso 1: Instalar Prerequisitos

### Instalar Azure CLI (macOS)

```bash
brew install azure-cli
```

### Instalar Azure Functions Core Tools

```bash
npm install -g azure-functions-core-tools@4
```

### Verificar instalación

```bash
az --version
func --version
```

## Paso 2: Login a Azure

```bash
az login
```

Se abrirá el navegador para autenticarte.

## Paso 3: Ejecutar Deployment

```bash
cd api/send-email
./deploy.sh
```

El script te pedirá:
- Tenant ID
- Client ID  
- Client Secret
- Email sender (default: info@alzentdigital.com)
- Email recipient (default: info@alzentdigital.com)
- CORS origin (tu dominio o * para todos)

## Paso 4: Actualizar Frontend

Una vez que el script termine, tendrás la URL de la función. Actualiza `assets/js/email.js`:

```javascript
const EMAIL_CONFIG = {
    endpoint: 'https://tu-function-app.azurewebsites.net/api/send-email',
    // ...
};
```

## Alternativa: Deployment desde Azure Portal

Si prefieres usar la interfaz web:

1. Ve a [Azure Portal](https://portal.azure.com)
2. Crea un nuevo recurso > Function App
3. Completa el formulario:
   - Subscription: Tu suscripción
   - Resource Group: Crear nuevo "alzent-rg"
   - Function App name: alzent-email-XXXXX (único)
   - Publish: Code
   - Runtime stack: Node.js
   - Version: 18 LTS
   - Region: East US (o la más cercana)
4. Review + Create
5. Una vez creada, ve a Configuration > Application settings
6. Agrega las variables de entorno
7. Ve a Deployment Center y conecta tu repositorio o sube el código

