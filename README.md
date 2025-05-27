# Vinilos Frontend

**Autor:** Adrián Montes Bastida

Este proyecto es el frontend desarrollado en **React** para una tienda de vinilos online. Permite a los usuarios:

✔️ Navegar vinilos,
✔️ Gestionar su carrito,
✔️ Hacer pedidos,
✔️ Dejar valoraciones,
✔️ Y al administrador, gestionar todo el contenido (vinilos, usuarios, direcciones, pedidos, proveedores) desde un panel administrativo completo.

---

## 📦 Estructura principal del proyecto

```
/src
 ├── /assets             → imágenes y logos
 ├── /components         → componentes comunes (navbar, carrito, sidebar)
 ├── /pages
 │    ├── /public        → pantallas públicas (home, detalle vinilo)
 │    ├── /auth          → login, registro
 │    ├── /user          → perfil, direcciones, pedidos usuario
 │    └── /admin         → panel de administración (vinilos, usuarios, pedidos, proveedores, direcciones)
 ├── App.jsx            → configuración de rutas
 ├── index.jsx          → punto de arranque
```

---

## ⚙️ Instalación y configuración

1️⃣ Clonar el repositorio:

```bash
git clone <REPO_URL>
```

2️⃣ Entrar al proyecto:

```bash
cd vinilos-frontend
```

3️⃣ Instalar dependencias:

```bash
npm install
```

---

## 🚀 Levantar el proyecto

```bash
npm run dev
```

La aplicación estará corriendo normalmente en:

```
http://localhost:5173
```

---

## 🌐 Conexión con el backend

Este frontend espera que el backend Laravel esté corriendo en:

```
http://localhost:8000
```

Si lo tienes en otro puerto, asegúrate de modificar las URLs en los `fetch` de los componentes o configurar las variables de entorno.

---

## 🔑 Funcionalidades principales

✅ Navegar catálogo de vinilos
✅ Buscar y filtrar por artista, género y precio
✅ Ver detalle de cada vinilo (con carrusel de imágenes)
✅ Añadir vinilos al carrito y tramitar pedidos
✅ Dejar y gestionar valoraciones (comentarios)
✅ Ver y gestionar tus pedidos como usuario
✅ Panel de administración con CRUD completo de:

* Vinilos
* Usuarios
* Direcciones
* Pedidos
* Proveedores

---

## 📦 Dependencias clave

* **React 18+**
* **React Router Dom** → para el enrutado
* **Tailwind CSS** → para el estilado rápido y responsivo
* **Vite** → como bundler (rápido y moderno)

---

## 🛠 Recomendaciones

✅ Usa **Chrome** o **Firefox** actualizado para mejor compatibilidad.
✅ Si ves errores de **CORS**, asegúrate de que el backend tiene correctamente configurado Sanctum y los permisos.
✅ Usa siempre cuentas con rol **admin** para entrar al panel de administración.

---

## 💻 Autor

Proyecto desarrollado con ❤️ por **Adrián Montes Bastida**.
