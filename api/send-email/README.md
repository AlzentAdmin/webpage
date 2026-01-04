# ALZENT Email Service - Azure Function

Azure Function para enviar correos electrónicos usando Microsoft Graph API cuando se envían formularios desde la página web.

## Configuración

1. **Instalar dependencias:**
   ```bash
   cd api/send-email
   npm install
   ```

2. **Configurar variables de entorno:**
   - Copia `.env.example` a `.env`
   - Completa con tus credenciales de Microsoft 365:
     - `MICROSOFT_TENANT_ID`
     - `MICROSOFT_CLIENT_ID`
     - `MICROSOFT_CLIENT_SECRET`
     - `MICROSOFT_SENDER_EMAIL` (info@alzentdigital.com)
     - `MICROSOFT_RECIPIENT_EMAIL` (info@alzentdigital.com)

3. **Para desarrollo local:**
   ```bash
   # Instalar Azure Functions Core Tools
   npm install -g azure-functions-core-tools@4
   
   # Ejecutar localmente
   func start
   ```

4. **Para deployment en Azure:**
   - Crea una Function App en Azure Portal
   - Configura las variables de entorno en Application Settings
   - Deploy el código usando Azure Functions Core Tools o GitHub Actions

## Funcionalidad

Cuando se envía un formulario desde la página web:

1. **Recibe** los datos del formulario vía POST
2. **Valida y sanitiza** los datos
3. **Envía 2 correos:**
   - **Notificación** a `info@alzentdigital.com` con todos los datos del formulario
   - **Confirmación** al usuario con un mensaje de confirmación

## Estructura

```
api/send-email/
├── function.json          # Configuración de la función
├── index.js               # Código principal
├── package.json           # Dependencias
├── templates/            # Plantillas HTML de email
│   ├── notification.html  # Plantilla para notificación a info
│   └── confirmation.html  # Plantilla para confirmación al usuario
├── .env.example          # Template de variables de entorno
└── README.md            # Esta documentación
```

## Endpoint

- **URL:** `https://your-function-app.azurewebsites.net/api/send-email`
- **Método:** POST
- **Content-Type:** application/json

## Payload Esperado

```json
{
  "formId": "trading",
  "serviceName": "Multi-Asset Trading",
  "entityName": "Company Name",
  "email": "user@example.com",
  "amount": null,
  "language": "en",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "formData": {
    "entity_name": "Company Name",
    "email": "user@example.com"
  }
}
```

## Respuesta

**Éxito (200):**
```json
{
  "success": true,
  "message": "Emails sent successfully",
  "notificationSent": true,
  "confirmationSent": true
}
```

**Error (400/500):**
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

## CORS

La función está configurada para aceptar requests desde cualquier origen (`Access-Control-Allow-Origin: *`). Para producción, considera restringir esto a tu dominio específico.

## Seguridad

- Las credenciales de Microsoft 365 se almacenan en variables de entorno
- Los datos se validan y sanitizan antes de enviar
- Se recomienda usar Azure Key Vault para almacenar secrets en producción

