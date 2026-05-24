# 🎈 PequePlan

**PequePlan** es una plataforma digital diseñada para centralizar la información sobre actividades infantiles en la ciudad de Barranquilla. Nuestro objetivo es facilitar a los padres y tutores la búsqueda de opciones educativas, deportivas y culturales cercanas, seguras y confiables para sus hijos.

🔗 **URL en producción:** [https://pequeplan.vercel.app](https://pequeplan.vercel.app)

---

## 🎯 ¿Qué problema resuelve?

Actualmente, la información sobre actividades infantiles está dispersa en diferentes redes sociales, sitios web y volantes, lo que hace difícil encontrar opciones adecuadas en un solo lugar. **PequePlan** nace como una solución para organizar todas estas actividades, permitiendo buscar, filtrar y explorar actividades categorizadas por edad, zona y horario en una sola plataforma unificada.

---

## ✨ Características Principales (MVP)

El Producto Mínimo Viable (MVP) actual se enfoca en resolver las necesidades básicas de búsqueda y organización de información:

- 🔍 **Buscador y Filtros:** Búsqueda por texto libre, filtrado por categorías, rango de edad, zonas de la ciudad y días de la semana.
- 🗂️ **Ordenamiento:** Organiza los resultados por nombre, precio, zona, edad y horario.
- ℹ️ **Detalle de Actividad:** Visualiza toda la información relevante de una actividad (horarios, contacto, ubicación, etc.).
- ❤️ **Favoritos:** Guarda y gestiona las actividades que más te gusten.
- 🔗 **Compartir:** Genera enlaces y comparte actividades fácilmente (Web Share API integrada).
- 🛠️ **Panel de Administración:** Gestión completa del catálogo de actividades, categorías y rangos de edad (CRUD), además de importación y exportación de datos (JSON/CSV).
- 💾 **Persistencia Local:** Almacenamiento rápido en `localStorage` (ideal para esta fase sin backend externo) con precarga automática de datos.

---

## 💻 Stack Tecnológico

El proyecto ha sido desarrollado utilizando tecnologías modernas y eficientes para garantizar el mejor rendimiento:

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **UI:** React
- **Testing:** Vitest
- **Despliegue:** Vercel

---

## 🚀 Instalación y Uso Local

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/SoulOfSparda/pequeplan.git
   cd pequeplan
   ```

2. **Instala las dependencias:**
   Puedes usar `npm`, `yarn`, `pnpm` o `bun`:
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre la aplicación:**
   Visita [http://localhost:3000](http://localhost:3000) en tu navegador para ver la plataforma en funcionamiento.

---

## 📂 Estructura de Rutas

- `/` — Catálogo público (buscar, filtrar, ordenar).
- `/actividad/[id]` — Vista detallada de cada actividad.
- `/favoritas` — Lista de actividades guardadas por el usuario.
- `/admin` — Panel principal de administración.
- `/admin/actividades/*` — Gestión de actividades.
- `/admin/categorias` y `/admin/rangos-edad` — Gestión de taxonomías.
- `/admin/datos` — Importación/Exportación de información.

---

## 👨‍💻 Autores

- Ana Torres
- Kevin Escalante
- Jhonatan Lozano

*Proyecto Universitario (Mayo 2026).*
