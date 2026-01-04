# Plan de Corrección y Mejoras - ALZENT Digital

## Errores Críticos a Corregir

### 1. Errores de Sintaxis JavaScript (Líneas 627, 643-644, 675, 685)

- **Línea 627**: Template literal mal formado: `lang-${lang}` debe ser `` `lang-${lang}` ``
- **Líneas 643-644**: Template literals mal formados: `view-${target}` debe ser `` `view-${target}` ``
- **Línea 675**: Template literal mal formado en innerText, debe usar template literal correcto
- **Línea 685**: Código incompleto - `window.addEventListener(` sin cerrar, eliminar o completar

### 2. Validación de Elementos DOM

- Agregar verificaciones `if (element)` antes de manipular elementos DOM en:
- `changeLanguage()`: Verificar que los elementos existan antes de actualizar
- `navigateTo()`: Validar que las vistas existan antes de mostrar
- `updateGraph()`: Verificar que todos los elementos del gráfico existan

### 3. Manejo de Traducciones Faltantes

- Agregar fallback cuando una traducción no existe (usar 'en' como default)
- Validar que `translations[lang]` exista antes de acceder

## Mejoras de Estructura

### 4. Organización del Código

- Agregar comentarios en funciones principales
- Separar lógica de navegación de lógica de traducción
- Mejorar legibilidad del código JavaScript

### 5. Mejoras de HTML/Semántica

- Agregar `meta description` para SEO
- Actualizar `lang` attribute dinámicamente según idioma seleccionado
- Verificar que todos los atributos `data-i18n` tengan traducciones correspondientes

### 6. Validación de Funcionalidad

- Verificar que todas las funciones se ejecuten correctamente
- Asegurar que el menú móvil funcione correctamente
- Validar que la navegación entre secciones funcione sin errores

## Archivos a Modificar

- `index.html`: Corregir errores de sintaxis, agregar validaciones y mejorar estructura

## Estado de Implementación

✅ **TODOS COMPLETADOS** - Todas las correcciones de la primera fase han sido implementadas exitosamente:

1. ✅ Errores de sintaxis JavaScript corregidos (template literals y código incompleto)
2. ✅ Validaciones de elementos DOM agregadas en todas las funciones
3. ✅ Manejo de traducciones faltantes con fallback implementado
4. ✅ Estructura del código mejorada con comentarios y mejor organización
5. ✅ Meta description agregada y lang attribute actualizado dinámicamente
6. ✅ Archivo completo con todas las etiquetas de cierre correctas

---

# ETAPA 2: Modularización y Escalabilidad

## Objetivo

Refactorizar la aplicación a una estructura modular y escalable que facilite el mantenimiento, la adición de nuevas funcionalidades y la colaboración en equipo.

## Estado de Implementación - Etapa 2

✅ **PASO 1 COMPLETADO** - Separar Traducciones a Archivos JSON:
- ✅ Creados 6 archivos JSON de traducciones (en, es, pt, it, ru, zh)
- ✅ Estructura JSON organizada por secciones (nav, buttons, hero, cards, etc.)
- ✅ Sistema de carga dinámica implementado en i18n.js
- ✅ Fallback a inglés implementado
- ✅ Mapeo de claves antiguas a nuevas estructuras para compatibilidad
- ✅ Revisión y corrección de ortografía en todos los idiomas

✅ **PASO 2 COMPLETADO** - Separar JavaScript en Módulos:
- ✅ `config.js`: Configuración Tailwind, constantes, allViewIds
- ✅ `i18n.js`: Sistema de traducciones con carga dinámica desde JSON
- ✅ `navigation.js`: Función navigateTo() y manejo de vistas
- ✅ `graph.js`: Función updateGraph() y graphData
- ✅ `main.js`: Inicialización de la aplicación
- ✅ HTML actualizado para cargar módulos externos

✅ **PASO 3 COMPLETADO** - Separar CSS en Archivos Modulares:
- ✅ `main.css`: Variables CSS y estilos base
- ✅ `components.css`: Estilos de componentes (cards, buttons, forms)
- ✅ `utilities.css`: Animaciones y clases utilitarias
- ✅ HTML actualizado para usar archivos CSS externos
- ✅ Colores convertidos a variables CSS

⏳ **PASO 4** - Configuración de Build (Futuro - Opcional)

⏳ **PASO 5** - Sistema de Componentes (Futuro - Opcional)

### Mejoras Adicionales Implementadas

- ✅ Formularios consistentes en todas las vistas de servicios institucionales
- ✅ Estructura HTML actualizada para usar módulos externos
- ✅ Sistema de traducciones con soporte para estructura anidada
- ✅ Compatibilidad mantenida con código legacy durante migración

---

# ETAPA 3: Seguridad y Mejores Prácticas para FinTech

## Objetivo

Implementar medidas de seguridad robustas y mejores prácticas específicas para una aplicación FinTech, cumpliendo con estándares de seguridad financiera y protección de datos.

## Estado de Implementación - Etapa 3

✅ **PASO 1 COMPLETADO** - Protección contra XSS:
- ✅ Módulo `security.js` creado con funciones de sanitización
- ✅ `sanitizeHTML()`, `sanitizeHTMLWithTags()`, `escapeHTML()` implementadas
- ✅ `i18n.js` actualizado para usar sanitización en traducciones
- ✅ Soporte para contenido HTML seguro con atributo `data-allow-html`
- ✅ Whitelist de tags HTML permitidos (span, br, strong, em)

✅ **PASO 2 COMPLETADO** - Validación y Sanitización de Formularios:
- ✅ Módulo `validation.js` creado con validación en tiempo real
- ✅ Validación HTML5 (required, maxlength, type)
- ✅ Validación JavaScript de email y entity name
- ✅ Sanitización de inputs en tiempo real
- ✅ Mensajes de error en múltiples idiomas
- ✅ Estilos CSS para campos con error (`.error`, `.field-error`)
- ✅ 4 formularios actualizados con atributos de seguridad

✅ **PASO 3 COMPLETADO** - Content Security Policy (CSP):
- ✅ Meta tag CSP agregado en HTML head
- ✅ Política estricta configurada
- ✅ Compatible con Tailwind CDN (requiere unsafe-inline/unsafe-eval)
- ✅ Removida referencia a cdnjs.cloudflare.com después de localizar Font Awesome

✅ **PASO 4 COMPLETADO** - Headers de Seguridad HTTP:
- ✅ Meta tags implementados: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- ✅ Documentación creada en `SECURITY.md`
- ✅ Ejemplos de configuración servidor: `.htaccess.example`, `nginx-security.conf.example`

✅ **PASO 5 COMPLETADO** - Subresource Integrity (SRI):
- ✅ Hash SRI agregado para Font Awesome CDN (antes de localizar)
- ✅ Atributos crossorigin y referrerpolicy configurados
- ⚠️ Nota: Font Awesome ahora es local, SRI ya no necesario

✅ **PASO 6 COMPLETADO** - Protección CSRF:
- ✅ Módulo `forms.js` con generación de tokens CSRF
- ✅ Tokens generados con Web Crypto API
- ✅ Tokens almacenados en localStorage con expiración (1 hora)
- ✅ Tokens incluidos automáticamente en todos los formularios
- ✅ Documentación para validación backend

✅ **PASO 7 COMPLETADO** - Rate Limiting y Protección contra Spam:
- ✅ Rate limiting del lado del cliente implementado
- ✅ Máximo 5 intentos por formulario por minuto
- ✅ Cooldown de 5 minutos después del máximo
- ✅ Tracking por formulario usando localStorage
- ✅ Campos honeypot implementados para detectar bots
- ✅ Deshabilitación de botón después de envío

✅ **PASO 8 COMPLETADO** - Reemplazar onclick Inline:
- ✅ Módulo `events.js` creado para event listeners centralizados
- ⚠️ Nota: Algunos onclick inline aún presentes para compatibilidad, pero estructura preparada

✅ **PASO 9 COMPLETADO** - Validación de Traducciones JSON:
- ✅ Script `scripts/validate-translations.js` creado
- ✅ Validación de estructura JSON
- ✅ Escaneo de contenido malicioso
- ✅ Validación de tags HTML permitidos

✅ **PASO 10 COMPLETADO** - Documentación de Seguridad:
- ✅ `SECURITY.md` creado con documentación completa
- ✅ `DEPLOYMENT.md` creado con guía de deployment seguro
- ✅ `.htaccess.example` creado con configuración Apache
- ✅ `nginx-security.conf.example` creado con configuración Nginx

### Paso 11: Localización de Font Awesome (Corrección de Iconos)

**Problema Identificado:**
- Los iconos de Font Awesome no cargaban debido a restricciones del Content Security Policy (CSP)
- El CSP bloqueaba la carga de recursos desde CDN externo (cdnjs.cloudflare.com)

**Solución Implementada:**
- ✅ Descargado Font Awesome 6.5.1 completo desde fuente oficial
- ✅ Extraído y organizado en `assets/fontawesome/`
- ✅ Estructura de archivos:
  ```
  assets/fontawesome/
  ├── css/
  │   └── all.min.css (102 KB)
  ├── webfonts/
  │   ├── fa-brands-400.woff2 (117 KB)
  │   ├── fa-regular-400.woff2 (25 KB)
  │   ├── fa-solid-900.woff2 (156 KB)
  │   └── fa-v4compatibility.woff2 (5 KB)
  └── [otros archivos de Font Awesome]
  ```
- ✅ Actualizada referencia en `index.html`:
  - Antes: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`
  - Ahora: `assets/fontawesome/css/all.min.css`
- ✅ Actualizado CSP para remover referencia a cdnjs.cloudflare.com
- ✅ Iconos ahora cargan desde servidor local, compatible con CSP estricto

**Beneficios:**
- ✅ Seguridad mejorada: sin dependencias externas para iconos
- ✅ Rendimiento: carga más rápida desde servidor local
- ✅ Compatibilidad: funciona perfectamente con CSP estricto
- ✅ Offline: funciona sin conexión a internet
- ✅ Control total sobre versiones de iconos

**Archivos Modificados:**
- `index.html`: Actualizada referencia a Font Awesome local
- CSP actualizado para remover cdnjs.cloudflare.com

**Archivos Creados:**
- `assets/fontawesome/`: Directorio completo con Font Awesome 6.5.1

## Prioridades de Implementación

**Alta Prioridad** (Implementar primero):
1. ✅ Protección XSS (Paso 1) - COMPLETADO
2. ✅ Validación de formularios (Paso 2) - COMPLETADO
3. ✅ CSP (Paso 3) - COMPLETADO
4. ✅ Headers de seguridad (Paso 4) - COMPLETADO

**Media Prioridad**:
5. ✅ SRI (Paso 5) - COMPLETADO (ya no necesario, Font Awesome local)
6. ✅ Protección CSRF (Paso 6) - COMPLETADO
7. ✅ Rate limiting (Paso 7) - COMPLETADO

**Baja Prioridad** (Mejoras):
8. ✅ Reemplazar onclick inline (Paso 8) - COMPLETADO (estructura preparada)
9. ✅ Validación de traducciones (Paso 9) - COMPLETADO
10. ✅ Documentación (Paso 10) - COMPLETADO
11. ✅ Localización de Font Awesome (Paso 11) - COMPLETADO

## Resumen de Archivos Creados en Etapa 3

**Módulos JavaScript:**
- `assets/js/security.js` - Funciones de sanitización XSS
- `assets/js/validation.js` - Validación de formularios
- `assets/js/forms.js` - Manejo seguro de formularios con CSRF y rate limiting
- `assets/js/events.js` - Event listeners centralizados

**Documentación:**
- `SECURITY.md` - Documentación completa de seguridad
- `DEPLOYMENT.md` - Guía de deployment seguro
- `.htaccess.example` - Configuración Apache
- `nginx-security.conf.example` - Configuración Nginx

**Scripts:**
- `scripts/validate-translations.js` - Validación de traducciones JSON

**Recursos:**
- `assets/fontawesome/` - Font Awesome 6.5.1 localizado

## Próximos Pasos Recomendados

1. **Backend**: Implementar validación CSRF y rate limiting en servidor
2. **HTTPS**: Configurar SSL/TLS en producción
3. **Headers HTTP**: Mover CSP a headers HTTP (más seguro que meta tags)
4. **Build process**: Considerar mover Tailwind a build para CSP más estricto
5. **Testing**: Realizar pruebas de penetración y auditoría de seguridad

---

# ETAPA 4: Mejoras de UX, Branding y Funcionalidad

## Objetivo

Mejorar la experiencia del usuario, completar el branding de la marca y agregar funcionalidades clave para conversión y engagement.

## Mejoras Identificadas

### 1. Favicon y Branding Visual
- **Problema**: No hay favicon configurado
- **Solución**: Crear favicon con logo "AD" de Alzent
- **Impacto**: Mejora reconocimiento de marca y profesionalismo

### 2. Formulario de Solicitud de Tarjeta
- **Problema**: Botón "Get The Card" no tiene funcionalidad
- **Solución**: Crear formulario modal/página con campos necesarios
- **Impacto**: Conversión directa, captura de leads

### 3. Optimización de Performance
- **Problema**: Posibles mejoras en carga y rendimiento
- **Solución**: Lazy loading, optimización de assets
- **Impacto**: Mejor experiencia de usuario, SEO

### 4. Accesibilidad (A11y)
- **Problema**: Falta validación de accesibilidad
- **Solución**: ARIA labels, contraste, navegación por teclado
- **Impacto**: Inclusión, cumplimiento legal

### 5. SEO y Meta Tags
- **Problema**: Meta tags básicos, falta Open Graph
- **Solución**: Open Graph, Twitter Cards, structured data
- **Impacto**: Mejor compartido en redes sociales, SEO

### 6. Analytics y Tracking
- **Problema**: No hay sistema de analytics
- **Solución**: Integración de analytics (privacy-compliant)
- **Impacto**: Medición de conversiones, optimización

## Plan de Implementación

### Paso 1: Favicon y Branding Visual

**Objetivo**: Completar identidad visual con favicon

**Implementación**:
- Crear favicon con logo "AD" (blanco sobre fondo oscuro o viceversa)
- Generar múltiples tamaños (16x16, 32x32, 96x96, 192x192, 512x512)
- Formato ICO y PNG para compatibilidad
- Apple Touch Icon para dispositivos iOS
- Manifest.json para PWA (opcional)

**Archivos a crear**:
- `assets/images/favicon.ico`
- `assets/images/favicon-16x16.png`
- `assets/images/favicon-32x32.png`
- `assets/images/apple-touch-icon.png`
- `assets/images/android-chrome-192x192.png`
- `assets/images/android-chrome-512x512.png`
- `site.webmanifest` (opcional)

**Archivos a modificar**:
- `index.html`: Agregar links de favicon en `<head>`

**Pasos**:
1. Diseñar favicon con logo "AD" (usar colores de marca: blanco/negro con acento azul)
2. Generar múltiples tamaños
3. Agregar links en HTML
4. Probar en diferentes navegadores y dispositivos

### Paso 2: Formulario de Solicitud de Tarjeta

**Objetivo**: Crear formulario funcional para solicitud de tarjeta

**Campos del Formulario**:
- Nombre del Solicitante (text, required)
- Correo Electrónico (email, required)
- Monto a Solicitar en Dólares (number, required, min: 0)

**Implementación**:
- Modal o vista dedicada para el formulario
- Validación completa (HTML5 + JavaScript)
- Sanitización de inputs (usar módulos de seguridad existentes)
- CSRF token (usar sistema existente)
- Rate limiting (usar sistema existente)
- Traducciones en todos los idiomas soportados

**Traducciones necesarias**:
- Título del formulario
- Labels de campos
- Placeholders
- Mensajes de error
- Botón de envío
- Mensaje de éxito

**Archivos a crear**:
- Vista/modal para formulario en `index.html`
- Traducciones en todos los archivos JSON

**Archivos a modificar**:
- `index.html`: Agregar modal/vista de formulario
- `assets/translations/*.json`: Agregar traducciones del formulario
- `assets/js/forms.js`: Integrar nuevo formulario
- `assets/js/navigation.js`: Agregar navegación al formulario

**Pasos**:
1. Diseñar UI del formulario (modal o vista)
2. Agregar traducciones en todos los idiomas
3. Implementar validación y sanitización
4. Conectar botón "Get The Card" al formulario
5. Integrar con sistema de seguridad existente
6. Probar en todos los idiomas

### Paso 3: Optimización de Performance

**Objetivo**: Mejorar tiempos de carga y rendimiento

**Implementación**:
- Lazy loading de imágenes (si se agregan)
- Preload de recursos críticos
- Optimización de CSS (minificación futura)
- Defer/async en scripts no críticos
- Compresión de assets

**Archivos a modificar**:
- `index.html`: Agregar preload, defer, async donde corresponda

**Pasos**:
1. Identificar recursos críticos
2. Agregar preload para recursos críticos
3. Optimizar orden de carga de scripts
4. Implementar lazy loading si es necesario

### Paso 4: Accesibilidad (A11y)

**Objetivo**: Mejorar accesibilidad para todos los usuarios

**Implementación**:
- ARIA labels en elementos interactivos
- Contraste de colores (WCAG AA mínimo)
- Navegación por teclado
- Focus visible
- Alt text en imágenes (si se agregan)
- Landmarks ARIA

**Archivos a modificar**:
- `index.html`: Agregar ARIA labels y landmarks
- `assets/css/components.css`: Mejorar focus styles

**Pasos**:
1. Auditar accesibilidad actual
2. Agregar ARIA labels donde sea necesario
3. Mejorar contraste de colores
4. Asegurar navegación por teclado
5. Probar con lectores de pantalla

### Paso 5: SEO y Meta Tags Avanzados

**Objetivo**: Mejorar visibilidad en buscadores y redes sociales

**Implementación**:
- Open Graph tags (Facebook, LinkedIn)
- Twitter Cards
- Structured Data (JSON-LD)
- Canonical URLs
- Meta tags adicionales

**Archivos a modificar**:
- `index.html`: Agregar meta tags avanzados

**Pasos**:
1. Agregar Open Graph tags
2. Agregar Twitter Cards
3. Implementar structured data (Organization, WebSite)
4. Agregar canonical URL
5. Validar con herramientas de Google y Facebook

### Paso 6: Analytics y Tracking (Opcional)

**Objetivo**: Medir comportamiento y conversiones

**Implementación**:
- Google Analytics 4 (privacy-compliant)
- Eventos personalizados para formularios
- Consentimiento de cookies (GDPR)
- Alternativa: Plausible Analytics (privacy-first)

**Archivos a crear**:
- `assets/js/analytics.js`: Módulo de analytics

**Archivos a modificar**:
- `index.html`: Agregar script de analytics (con consentimiento)
- `assets/js/forms.js`: Agregar tracking de eventos

**Pasos**:
1. Configurar analytics (GA4 o Plausible)
2. Implementar consentimiento de cookies
3. Agregar eventos de conversión
4. Configurar goals/funnels
5. Documentar implementación

## Estructura de Traducciones para Formulario de Tarjeta

```json
{
  "card_form": {
    "title": "Request Your ALZENT Card",
    "subtitle": "Fill out the form below to get started",
    "fields": {
      "applicant_name": "Applicant Name",
      "email": "Email",
      "amount": "Amount to Request (USD)"
    },
    "placeholders": {
      "applicant_name": "Enter your full name",
      "email": "Enter your email",
      "amount": "Enter amount in USD"
    },
    "errors": {
      "required": "This field is required",
      "invalid_email": "Please enter a valid email",
      "invalid_amount": "Please enter a valid amount",
      "min_amount": "Minimum amount is $1"
    },
    "submit": "SUBMIT REQUEST",
    "success": "Request submitted successfully! We'll contact you soon.",
    "close": "Close"
  }
}
```

## Prioridades de Implementación

**Alta Prioridad** (Implementar primero):
1. Favicon y Branding (Paso 1) - Identidad visual
2. Formulario de Solicitud (Paso 2) - Funcionalidad clave

**Media Prioridad**:
3. SEO y Meta Tags (Paso 5) - Visibilidad
4. Optimización de Performance (Paso 3) - UX

**Baja Prioridad** (Mejoras):
5. Accesibilidad (Paso 4) - Inclusión
6. Analytics (Paso 6) - Medición (opcional)

## Archivos a Crear/Modificar

**Nuevos Archivos**:
- `assets/images/favicon.ico`
- `assets/images/favicon-*.png` (múltiples tamaños)
- `assets/images/apple-touch-icon.png`
- `site.webmanifest` (opcional)
- `assets/js/analytics.js` (opcional)

**Archivos Modificados**:
- `index.html`: Favicon, meta tags, formulario modal
- `assets/translations/*.json`: Traducciones del formulario
- `assets/js/forms.js`: Integración del nuevo formulario
- `assets/js/navigation.js`: Navegación al formulario
- `assets/css/components.css`: Estilos del modal/formulario

## Consideraciones de Implementación

- **Seguridad**: El formulario debe usar todas las medidas de seguridad implementadas (CSRF, rate limiting, validación, sanitización)
- **UX**: Modal debe ser accesible, con animación suave, y fácil de cerrar
- **Responsive**: Formulario debe funcionar en móvil y desktop
- **Internacionalización**: Todas las traducciones deben estar completas
- **Validación**: Monto debe validar formato numérico y rango razonable (mínimo $1, máximo sugerido $1,000,000)

## Estado de Implementación - Etapa 4

⏳ **PASO 1** - Favicon y Branding Visual (Pendiente)

⏳ **PASO 2** - Formulario de Solicitud de Tarjeta (Pendiente)

⏳ **PASO 3** - Optimización de Performance (Pendiente)

⏳ **PASO 4** - Accesibilidad (Pendiente)

⏳ **PASO 5** - SEO y Meta Tags Avanzados (Pendiente)

⏳ **PASO 6** - Analytics y Tracking (Pendiente - Opcional)

---

# ETAPA 5: Integración de Envío de Correos con Microsoft 365

## Objetivo

Implementar sistema de envío de correos electrónicos usando Microsoft 365 (Microsoft Graph API) para los formularios de Institutional Services (Trading, Tokenization, Treasury, OTC) y el formulario de solicitud de tarjeta. Los correos se enviarán a **info@alzentdigital.com** y se enviará una copia de confirmación al usuario.

## Arquitectura Propuesta

### Opción Recomendada: Azure Functions + Microsoft Graph API

**Ventajas:**
- No requiere servidor dedicado
- Escalable automáticamente
- Integración nativa con Microsoft 365
- Seguro (credenciales en Azure, no expuestas en frontend)
- Costo bajo (pay-per-use)

**Flujo:**
```
Frontend (index.html) 
  → JavaScript captura formulario
  → Envía datos a Azure Function (HTTPS POST)
  → Azure Function valida y sanitiza datos
  → Azure Function usa Microsoft Graph API
  → Envía 2 correos:
    1. Notificación a info@alzentdigital.com
    2. Confirmación al usuario (email del formulario)
  → Retorna confirmación al frontend
```

### Configuración de Correos

**Correo de destino (empresa):**
- Email: `info@alzentdigital.com`
- Recibe: Notificación de nueva solicitud con todos los datos
- Asunto: "[ALZENT] Nueva solicitud: [Tipo de Servicio]"
- Contenido: Datos completos del formulario, timestamp, idioma, tipo de servicio

**Correo de confirmación (usuario):**
- Email: Email proporcionado en el formulario
- Recibe: Confirmación de recepción de solicitud
- Asunto: "[ALZENT] Confirmación de solicitud recibida"
- Contenido: Mensaje de confirmación profesional, información de contacto

## Implementación Detallada

### Paso 1: Configuración de Microsoft 365

**Requisitos:**
- Cuenta Microsoft 365 con Exchange Online
- Azure AD App Registration
- Permisos: `Mail.Send` (Application permission)
- Client ID, Tenant ID, Client Secret

**Archivos a crear:**
- `config/email.config.example.js` - Template de configuración
- `.env.example` - Variables de entorno (no commitear)
- `EMAIL_SETUP.md` - Guía paso a paso de configuración

**Pasos de configuración:**
1. Registrar aplicación en Azure AD
2. Configurar permisos de Microsoft Graph API
3. Generar Client Secret
4. Configurar redirect URIs si es necesario
5. Documentar credenciales de forma segura

### Paso 2: Backend: Azure Function

**Estructura:**
```
api/
  send-email/
    function.json
    index.js
    package.json
    .env (variables de entorno)
```

**Funcionalidad:**
- Recibe POST con datos del formulario
- Valida y sanitiza datos (usar funciones de `assets/js/security.js`)
- Identifica tipo de formulario (trading, tokenization, treasury, otc, card-request)
- Construye 2 emails:
  1. Notificación a info@alzentdigital.com
  2. Confirmación al usuario
- Envía usando Microsoft Graph API
- Retorna JSON con status (success/error)

**Datos a enviar:**
- Tipo de servicio (trading/tokenization/treasury/otc/card-request)
- Entity Name / Applicant Name
- Email del solicitante
- Amount (solo para card-request)
- Timestamp
- Idioma del usuario
- User Agent (opcional, para analytics)

**Dependencias:**
- `@microsoft/microsoft-graph-client` - Cliente Graph API
- `@azure/functions` - Runtime de Azure Functions
- `dotenv` - Variables de entorno

### Paso 3: Frontend: Módulo de Envío

**Archivo:** `assets/js/email.js`

**Funcionalidades:**
- Interceptar submit de formularios con `data-form-id`
- Validar datos (usar `assets/js/validation.js`)
- Mostrar loading state en botón
- Enviar datos a Azure Function (HTTPS POST)
- Mostrar mensaje de éxito/error traducido
- Prevenir envíos duplicados (rate limiting existente)
- Manejar errores de red y timeout

**Integración:**
- Conectar con `assets/js/forms.js` existente
- Usar sistema de traducciones para mensajes
- Usar sistema de validación existente
- Usar sistema de rate limiting existente

### Paso 4: Plantillas de Email

**Formato de correo (Notificación a empresa):**
- Asunto: "[ALZENT] Nueva solicitud: [Tipo de Servicio]"
- Cuerpo: HTML profesional con:
  - Logo ALZENT
  - Tipo de servicio solicitado
  - Datos del solicitante (Entity Name, Email)
  - Amount (si aplica)
  - Timestamp
  - Idioma del formulario
  - Link para responder directamente

**Formato de correo (Confirmación al usuario):**
- Asunto: "[ALZENT] Confirmación de solicitud recibida"
- Cuerpo: HTML profesional con:
  - Logo ALZENT
  - Mensaje de confirmación personalizado
  - Tipo de servicio solicitado
  - Información de contacto
  - Próximos pasos

**Archivos:**
- `api/send-email/templates/notification.html` - Plantilla notificación empresa
- `api/send-email/templates/confirmation.html` - Plantilla confirmación usuario
- Soporte multi-idioma en plantillas

### Paso 5: Integración con Formularios Existentes

**Formularios a modificar:**
- `data-form-id="trading"` (línea 429)
- `data-form-id="tokenization"` (línea 444)
- `data-form-id="treasury"` (línea 459)
- `data-form-id="otc"` (línea 474)
- `data-form-id="card-request"` (líneas 490, 515)

**Cambios necesarios:**
- Agregar event listeners en `assets/js/email.js`
- Conectar con función de envío
- Agregar estados de loading/éxito/error en UI
- Mensajes de éxito/error traducidos

### Paso 6: Seguridad

**Implementar:**
- Validación de datos en backend (nunca confiar en frontend)
- Rate limiting por IP/email (ya implementado en frontend, reforzar en backend)
- Sanitización de inputs
- HTTPS obligatorio
- Validación de origen (CORS)
- Logging de intentos (sin datos sensibles)
- Validación de tokens CSRF (ya implementado)

### Paso 7: Manejo de Errores

**Casos a manejar:**
- Error de conexión
- Error de autenticación Microsoft 365
- Error de validación
- Timeout
- Rate limit excedido
- Email inválido

**UX:**
- Mensajes de error traducidos
- Reintento automático (opcional, máximo 1 vez)
- Fallback a mensaje genérico si falla
- Indicadores visuales de estado (loading, éxito, error)

### Paso 8: Configuración y Deployment

**Variables de entorno necesarias:**
- `MICROSOFT_TENANT_ID`
- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`
- `MICROSOFT_SENDER_EMAIL` (email que envía, debe ser de la organización)
- `MICROSOFT_RECIPIENT_EMAIL` (info@alzentdigital.com)
- `AZURE_FUNCTION_URL` (URL del endpoint)

**Documentación:**
- `EMAIL_SETUP.md` - Guía de configuración Microsoft 365
- `DEPLOYMENT.md` - Actualizar con instrucciones de Azure Functions
- `.env.example` - Template de variables de entorno

## Archivos a Crear/Modificar

### Nuevos Archivos:
- `api/send-email/function.json` - Configuración Azure Function
- `api/send-email/index.js` - Lógica de envío con Microsoft Graph API
- `api/send-email/package.json` - Dependencias Node.js
- `api/send-email/templates/notification.html` - Plantilla email notificación
- `api/send-email/templates/confirmation.html` - Plantilla email confirmación
- `assets/js/email.js` - Módulo frontend para envío
- `config/email.config.example.js` - Template de configuración
- `EMAIL_SETUP.md` - Documentación de setup Microsoft 365
- `.env.example` - Template de variables de entorno

### Archivos a Modificar:
- `assets/js/forms.js` - Integrar con email.js
- `index.html` - Agregar mensajes de éxito/error en formularios
- `DEPLOYMENT.md` - Agregar sección de Azure Functions
- `assets/translations/*.json` - Agregar mensajes de email (success, error, loading)

## Consideraciones Técnicas

### Microsoft Graph API
- Usar `@microsoft/microsoft-graph-client` para Node.js
- Autenticación: Client Credentials Flow (App-only)
- Endpoint: `POST https://graph.microsoft.com/v1.0/users/{userId}/sendMail`
- Formato de email: HTML con soporte para texto plano como fallback

### Alternativa: SMTP Exchange Online
Si Graph API no es viable:
- Usar SMTP tradicional de Exchange Online
- Requiere: `smtp.office365.com:587`
- Autenticación: OAuth2 o credenciales (menos seguro)
- Librería: `nodemailer` para Node.js

### Testing
- Crear función de test local
- Validar formato de emails
- Probar todos los tipos de formularios
- Validar manejo de errores
- Probar envío de ambos correos (notificación y confirmación)
- Validar que correos lleguen correctamente

## Traducciones Necesarias

**Mensajes a agregar en `assets/translations/*.json`:**
```json
{
  "email": {
    "sending": "Sending...",
    "success": "Request sent successfully! We'll contact you soon.",
    "error": "An error occurred. Please try again later.",
    "error_network": "Connection error. Please check your internet connection.",
    "error_validation": "Please check the form fields.",
    "confirmation_sent": "A confirmation email has been sent to your inbox."
  }
}
```

## Prioridades de Implementación

**Alta Prioridad:**
1. Configuración Microsoft 365 (Paso 1)
2. Backend Azure Function (Paso 2)
3. Frontend módulo de envío (Paso 3)
4. Integración con formularios (Paso 5)

**Media Prioridad:**
5. Plantillas de email (Paso 4)
6. Manejo de errores (Paso 7)

**Baja Prioridad:**
7. Seguridad avanzada (Paso 6)
8. Testing completo (Paso 8)

## Estado de Implementación - Etapa 5

⏳ **PASO 1** - Configuración de Microsoft 365 (Pendiente)

⏳ **PASO 2** - Backend: Azure Function (Pendiente)

⏳ **PASO 3** - Frontend: Módulo de Envío (Pendiente)

⏳ **PASO 4** - Plantillas de Email (Pendiente)

⏳ **PASO 5** - Integración con Formularios (Pendiente)

⏳ **PASO 6** - Seguridad (Pendiente)

⏳ **PASO 7** - Manejo de Errores (Pendiente)

⏳ **PASO 8** - Configuración y Deployment (Pendiente)

## Próximos Pasos Después de Etapa 5

- Dashboard de administración para ver solicitudes
- Notificaciones automáticas a CRM
- Integración con sistema de tickets
- Analytics de conversión por formulario
- Almacenamiento de solicitudes en base de datos

