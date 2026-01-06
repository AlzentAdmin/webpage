# 📚 Documentación del Proyecto ALZENT Digital

## 📋 Tabla de Contenidos

1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Funcionalidades Implementadas](#funcionalidades-implementadas)
4. [Sistema de Envío de Correos](#sistema-de-envío-de-correos)
5. [Configuración y Deployment](#configuración-y-deployment)
6. [Arquitectura Técnica](#arquitectura-técnica)
7. [Guías de Uso](#guías-de-uso)
8. [Troubleshooting](#troubleshooting)
9. [Mantenimiento](#mantenimiento)

---

## 🎯 Resumen del Proyecto

**ALZENT Digital** es una página web corporativa que presenta servicios financieros digitales, incluyendo tarjetas Mastercard®, servicios de trading, tokenización de activos, gestión de tesorería y servicios OTC. El proyecto incluye un sistema completo de formularios con envío de correos electrónicos automatizado mediante Azure Functions y Microsoft Graph API.

### Características Principales

- ✅ Página web multiidioma (6 idiomas: EN, ES, PT, IT, RU, ZH)
- ✅ Sistema de navegación por secciones
- ✅ Formularios seguros con validación y protección CSRF
- ✅ Integración con Azure Functions para envío de correos
- ✅ Integración con Microsoft 365 para envío de emails
- ✅ Diseño responsive y moderno
- ✅ Seguridad implementada (CSP, rate limiting, sanitización)

---

## 📁 Estructura del Proyecto

```
webpage/
├── api/                          # Backend - Azure Functions
│   ├── host.json                 # Configuración de Azure Functions
│   └── send-email/               # Función para envío de correos
│       ├── index.js              # Código principal de la función
│       ├── function.json         # Configuración de la función (legacy, no usado en v4)
│       ├── package.json          # Dependencias Node.js
│       ├── deploy.sh             # Script de deployment automatizado
│       ├── templates/            # Plantillas HTML de emails
│       │   ├── notification.html # Email de notificación a info@
│       │   └── confirmation.html # Email de confirmación al usuario
│       ├── env.example           # Template de variables de entorno
│       └── *.md                  # Documentación de deployment
│
├── assets/                        # Recursos estáticos
│   ├── css/                      # Estilos CSS
│   │   ├── main.css             # Estilos principales
│   │   ├── components.css       # Estilos de componentes
│   │   └── utilities.css       # Utilidades CSS
│   │
│   ├── js/                       # JavaScript modular
│   │   ├── config.js            # Configuración global
│   │   ├── security.js          # Funciones de seguridad
│   │   ├── validation.js        # Validación de formularios
│   │   ├── i18n.js              # Sistema de traducciones
│   │   ├── navigation.js        # Navegación entre secciones
│   │   ├── graph.js             # Gráficos de devaluación
│   │   ├── forms.js             # Manejo de formularios
│   │   ├── email.js             # Integración con Azure Function
│   │   ├── events.js            # Event listeners
│   │   └── main.js              # Inicialización principal
│   │
│   ├── translations/             # Archivos de traducción
│   │   ├── en.json              # Inglés
│   │   ├── es.json              # Español
│   │   ├── pt.json              # Portugués
│   │   ├── it.json              # Italiano
│   │   ├── ru.json              # Ruso
│   │   └── zh.json              # Chino
│   │
│   ├── images/                   # Imágenes y favicons
│   └── fontawesome/              # Iconos Font Awesome
│
├── index.html                    # Página principal
├── package.json                  # Dependencias del proyecto
├── DEPLOYMENT.md                 # Guía de deployment
├── SECURITY.md                   # Documentación de seguridad
└── DOCUMENTATION.md              # Este archivo
```

---

## ⚙️ Funcionalidades Implementadas

### 1. Sistema Multiidioma (i18n)

**Archivo:** `assets/js/i18n.js`

- Soporte para 6 idiomas: Inglés, Español, Portugués, Italiano, Ruso, Chino
- Cambio dinámico de idioma sin recargar la página
- Traducciones almacenadas en archivos JSON
- Persistencia de preferencia de idioma en localStorage

**Uso:**
```javascript
// Cambiar idioma
changeLanguage('es');

// Obtener traducción
const text = getTranslation('hero_title_1');
```

### 2. Navegación por Secciones

**Archivo:** `assets/js/navigation.js`

- Navegación suave entre secciones sin recargar la página
- Secciones disponibles:
  - `home`: Página principal
  - `card`: Información de tarjetas
  - `intelligence`: Market Intelligence
  - `wealth`: Private Wealth
  - `institutional`: Servicios institucionales
  - `why-us`: Por qué elegirnos
  - `service-trading`: Multi-Asset Trading
  - `service-tokenization`: RWA Tokenization
  - `service-treasury`: Treasury Management
  - `service-otc`: OTC Desk
  - `service-card`: Solicitud de tarjeta

**Uso:**
```javascript
navigateTo('card');
```

### 3. Sistema de Seguridad

**Archivos:** `assets/js/security.js`, `assets/js/validation.js`, `assets/js/forms.js`

#### Características de Seguridad:

- **CSRF Protection**: Tokens CSRF generados y validados
- **Rate Limiting**: Límite de 5 intentos por minuto, cooldown de 5 minutos
- **Honeypot Fields**: Campos ocultos para detectar bots
- **Input Sanitization**: Sanitización de todos los inputs
- **Content Security Policy**: CSP configurado en HTML
- **Validación en Cliente**: Validación antes de enviar

**Rate Limiter:**
```javascript
const rateLimit = RateLimiter.check('form-id');
if (!rateLimit.allowed) {
    // Bloquear envío
}
```

### 4. Formularios Seguros

**Archivo:** `assets/js/forms.js`

Cada formulario incluye:
- Validación en tiempo real
- Sanitización de inputs
- Protección CSRF
- Rate limiting
- Honeypot anti-bot
- Manejo de errores

**Tipos de Formularios:**
- `trading`: Multi-Asset Trading
- `tokenization`: RWA Tokenization
- `treasury`: Treasury Management
- `otc`: OTC Desk
- `card-request`: Solicitud de tarjeta ALZENT

### 5. Gráficos de Devaluación

**Archivo:** `assets/js/graph.js`

- Visualización de devaluación de monedas (ARS, COP, BRL)
- Comparación con USD
- Actualización dinámica de barras y porcentajes

---

## 📧 Sistema de Envío de Correos

### Arquitectura

```
Frontend (index.html)
    ↓
Formulario (forms.js)
    ↓
Validación y Sanitización
    ↓
email.js → Azure Function (send-email)
    ↓
Microsoft Graph API
    ↓
Microsoft 365 → 2 Emails
    ├─→ Notificación a info@alzentdigital.com
    └─→ Confirmación al usuario
```

### Componentes

#### 1. Frontend - `assets/js/email.js`

**Responsabilidades:**
- Preparar datos del formulario
- Enviar POST a Azure Function
- Manejar estados de carga (loading, success, error)
- Retry logic (1 reintento)
- Traducciones de mensajes

**Configuración:**
```javascript
const EMAIL_CONFIG = {
    endpoint: 'https://alzent-email-4413.azurewebsites.net/api/sendemail',
    timeout: 30000,
    retryAttempts: 1,
    retryDelay: 2000,
    recipientEmail: 'info@alzentdigital.com'
};
```

**Flujo:**
1. Usuario llena formulario
2. `forms.js` valida y llama a `handleEmailSubmission()`
3. `email.js` prepara datos y envía a Azure Function
4. Muestra estado de carga
5. Muestra mensaje de éxito/error
6. Cierra modal si es card-request

#### 2. Backend - Azure Function `api/send-email/index.js`

**Tecnologías:**
- Node.js 18
- Azure Functions v4 (Programming Model)
- Microsoft Graph Client
- Microsoft 365 API

**Funcionalidades:**
- Recibe datos del formulario vía POST
- Valida y sanitiza datos
- Obtiene token de acceso de Microsoft Identity Platform
- Construye 2 emails HTML usando plantillas
- Envía emails vía Microsoft Graph API
- Retorna respuesta JSON

**Autenticación:**
```javascript
// Obtiene token directamente de Microsoft Identity Platform
async function getAccessToken() {
    const tokenEndpoint = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    // ... OAuth2 client_credentials flow
}
```

**Emails Enviados:**

1. **Notificación** (a `info@alzentdigital.com`):
   - Asunto: `[ALZENT] Nueva Solicitud: [Servicio]`
   - Contenido: Todos los datos del formulario
   - Idioma: Según el idioma del usuario

2. **Confirmación** (al usuario):
   - Asunto: `[ALZENT] Confirmación de Solicitud Recibida`
   - Contenido: Mensaje de confirmación profesional
   - Idioma: Según el idioma del usuario

**Plantillas HTML:**
- `templates/notification.html`: Email de notificación
- `templates/confirmation.html`: Email de confirmación

### Configuración de Microsoft 365

**Requisitos:**
1. App Registration en Azure AD
2. Permisos:
   - `Mail.Send` (Application permission)
   - Consentimiento de administrador otorgado
3. Credenciales:
   - Tenant ID
   - Client ID
   - Client Secret

**Variables de Entorno en Azure:**
```
MICROSOFT_TENANT_ID=fa506f5d-ddae-4afb-a2b1-249a14c44ba4
MICROSOFT_CLIENT_ID=3c043e66-e960-490a-b8a4-9fc5b99a4870
MICROSOFT_CLIENT_SECRET=[SECRET]
MICROSOFT_SENDER_EMAIL=info@alzentdigital.com
MICROSOFT_RECIPIENT_EMAIL=info@alzentdigital.com
```

---

## 🚀 Configuración y Deployment

### Prerequisitos

- Node.js 18+
- Azure CLI
- Azure Functions Core Tools v4
- Cuenta de Azure con suscripción activa
- Microsoft 365 con Exchange Online
- App Registration en Azure AD configurada

### Deployment de Azure Function

#### Opción 1: Script Automatizado (Recomendado)

```bash
cd api/send-email
./deploy.sh
```

El script:
1. Verifica prerequisitos
2. Hace login en Azure
3. Crea Resource Group
4. Crea Storage Account
5. Crea Function App
6. Configura variables de entorno
7. Configura CORS
8. Instala dependencias
9. Despliega función
10. Muestra URL final

#### Opción 2: Manual

Ver `api/send-email/DEPLOY-FIRST-TIME.md` para instrucciones detalladas.

### Configuración del Frontend

**Archivo:** `assets/js/config.js`

```javascript
emailServiceUrl: 'https://alzent-email-4413.azurewebsites.net/api/sendemail'
```

**O vía variable global:**
```html
<script>
    window.EMAIL_SERVICE_URL = 'https://alzent-email-4413.azurewebsites.net/api/sendemail';
</script>
```

### Content Security Policy

**Archivo:** `index.html`

El CSP debe incluir el dominio de Azure Functions:
```html
<meta http-equiv="Content-Security-Policy" 
      content="... connect-src 'self' ... https://*.azurewebsites.net; ...">
```

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

**Frontend:**
- HTML5
- CSS3 (Custom + Tailwind CDN)
- JavaScript (ES6+)
- Font Awesome (Local)

**Backend:**
- Azure Functions (Node.js 18)
- Microsoft Graph API
- Microsoft 365

**Seguridad:**
- CSRF Tokens
- Rate Limiting
- Input Sanitization
- Content Security Policy
- Honeypot Fields

### Flujo de Datos

```
Usuario → Formulario HTML
    ↓
forms.js (Validación + CSRF)
    ↓
email.js (Preparación de datos)
    ↓
HTTPS POST → Azure Function
    ↓
index.js (Validación + Sanitización)
    ↓
Microsoft Graph API
    ↓
Microsoft 365 → Emails
```

### Módulos JavaScript

| Módulo | Responsabilidad |
|--------|----------------|
| `config.js` | Configuración global, constantes |
| `security.js` | Funciones de sanitización |
| `validation.js` | Validación de campos |
| `i18n.js` | Sistema de traducciones |
| `navigation.js` | Navegación entre secciones |
| `graph.js` | Gráficos de devaluación |
| `forms.js` | Manejo de formularios, CSRF, rate limiting |
| `email.js` | Integración con Azure Function |
| `events.js` | Event listeners globales |
| `main.js` | Inicialización de la aplicación |

---

## 📖 Guías de Uso

### Agregar un Nuevo Formulario

1. **Agregar HTML en `index.html`:**
```html
<form class="space-y-6" data-form-id="nuevo-formulario" novalidate>
    <input type="text" class="form-input" name="entity_name" required>
    <input type="email" class="form-input" name="email" required>
    <button type="submit">SUBMIT</button>
</form>
```

2. **Agregar mapeo en `email.js`:**
```javascript
const FORM_SERVICE_MAP = {
    // ...
    'nuevo-formulario': 'Nuevo Servicio'
};
```

3. **Agregar traducciones** en archivos JSON de `assets/translations/`

### Agregar un Nuevo Idioma

1. Crear archivo `assets/translations/[codigo].json`
2. Agregar código a `config.js`:
```javascript
supportedLangs: ['en', 'es', 'pt', 'it', 'ru', 'zh', 'nuevo']
```
3. Agregar botón de idioma en `index.html`

### Modificar Plantillas de Email

Editar archivos en `api/send-email/templates/`:
- `notification.html`: Email de notificación
- `confirmation.html`: Email de confirmación

Variables disponibles:
- `{{serviceName}}`
- `{{entityName}}`
- `{{email}}`
- `{{timestamp}}`
- etc.

---

## 🔧 Troubleshooting

### Error: "CSP violation"

**Problema:** El Content Security Policy bloquea la conexión a Azure Function.

**Solución:** Agregar `https://*.azurewebsites.net` a `connect-src` en CSP.

### Error: "Network request failed"

**Problema:** La Azure Function no puede obtener token de Microsoft Identity Platform.

**Soluciones:**
1. Verificar que las variables de entorno estén configuradas
2. Verificar que el Client Secret no haya expirado
3. Verificar permisos de la App Registration
4. Verificar que el consentimiento de administrador esté otorgado

### Error: "Mail.Send permission denied"

**Problema:** La App Registration no tiene permisos para enviar correos.

**Solución:**
1. Azure Portal > App registrations > API permissions
2. Agregar `Mail.Send` (Application permission)
3. Grant admin consent

### La función no aparece en Azure Portal

**Problema:** La función no se detecta después del deployment.

**Soluciones:**
1. Verificar que `host.json` esté en el directorio correcto
2. Usar `--javascript` flag en deployment
3. Verificar que no haya `function.json` (conflicto con v4)

### Los correos no llegan

**Verificaciones:**
1. Revisar logs de Azure Function
2. Verificar que `info@alzentdigital.com` exista en Azure AD
3. Verificar que el email del usuario sea válido
4. Revisar spam/junk folder

---

## 🔄 Mantenimiento

### Actualizar Client Secret

1. Azure Portal > App registrations > Certificates & secrets
2. Crear nuevo secret
3. Actualizar en Azure Function:
```bash
az functionapp config appsettings set \
  --name alzent-email-4413 \
  --resource-group alzent-rg \
  --settings MICROSOFT_CLIENT_SECRET="nuevo-secret"
```

### Monitoreo

**Azure Portal:**
- Function App > Monitor: Ver métricas y logs
- Function App > Functions > sendEmail: Ver ejecuciones

**Logs en tiempo real:**
```bash
az functionapp log tail --name alzent-email-4413 --resource-group alzent-rg
```

### Actualizar Dependencias

**Azure Function:**
```bash
cd api/send-email
npm update
func azure functionapp publish alzent-email-4413 --javascript
```

### Backup

**Importante:**
- Guardar credenciales de forma segura
- Documentar cambios en configuración
- Mantener backups de plantillas de email
- Versionar cambios en código

---

## 📊 Métricas y Costos

### Azure Functions (Consumption Plan)

- **Gratis:** 1 millón de ejecuciones/mes
- **Después:** $0.000016 por ejecución
- **Storage:** ~$0.0184 por GB/mes

**Estimación:** Para una página web típica, el costo será mínimo o gratuito.

### Microsoft 365

- Incluido en la suscripción de Microsoft 365
- Sin costos adicionales por envío de correos

---

## 🔐 Seguridad

### Implementado

- ✅ CSRF Protection
- ✅ Rate Limiting
- ✅ Input Sanitization
- ✅ Content Security Policy
- ✅ Honeypot Anti-Bot
- ✅ Validación en Cliente y Servidor
- ✅ HTTPS obligatorio
- ✅ Credenciales en variables de entorno

### Recomendaciones

- Revisar logs regularmente
- Rotar Client Secret periódicamente
- Monitorear intentos fallidos
- Considerar Azure Key Vault para secrets en producción
- Restringir CORS a dominio específico en producción

---

## 📝 Notas de Desarrollo

### Decisiones Técnicas

1. **Azure Functions v4 Programming Model:**
   - Usa `app.http()` en lugar de `function.json`
   - Más moderno y flexible

2. **Autenticación Directa:**
   - Obtiene token directamente vía HTTPS
   - Evita problemas con SDK de Azure Identity

3. **Módulos JavaScript:**
   - Código modular y mantenible
   - Separación de responsabilidades

4. **Content Security Policy:**
   - Permite `unsafe-inline` para Tailwind CDN
   - Considerar build process para CSP más estricto

### Mejoras Futuras

- [ ] Sistema de notificaciones toast en lugar de alerts
- [ ] Build process para CSS/JS
- [ ] Tests automatizados
- [ ] Analytics integrado
- [ ] Dashboard de administración
- [ ] Sistema de templates de email más flexible

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisar esta documentación
2. Revisar logs de Azure Function
3. Verificar configuración en Azure Portal
4. Consultar documentación de Microsoft Graph API

---

**Última actualización:** Enero 2025  
**Versión del Proyecto:** 1.0.0  
**Mantenido por:** Equipo ALZENT Digital

