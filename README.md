# Frontend Tomar Lista

Aplicación web construida con **Next.js 14**, **React**, **TypeScript**, **Tailwind CSS** y componentes visuales inspirados en **React Bits**. Consume el backend documentado en `server/README.md` para gestionar autenticación, alumnos, clases, asistencias y reportes.

## Requisitos
- Node.js 18 o superior
- npm 9+

## Puesta en marcha
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia `.env.example` a `.env.local` y ajusta `NEXT_PUBLIC_API_URL` hacia la URL de tu backend (por defecto `http://localhost:3001`).
3. Ejecuta en modo desarrollo:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:3000` en tu navegador.

### Otros scripts
- `npm run build`: genera la build de producción.
- `npm run start`: sirve la build previa.
- `npm run lint`: analiza el código con ESLint.
- `npm run server`: inicia el backend Express disponible en `./server`.

## Estructura destacada
```
/src
  /app                 # Rutas con App Router (login, dashboard, módulos CRUD y reportes)
  /components          # UI reutilizable (fondos, hero, listas React Bits, formularios)
  /hooks               # Hooks personalizados como useAuth/useRoleGuard
  /lib                 # Cliente HTTP y utilidades de autenticación
  /styles              # Tailwind + estilos globales
```

## Integración con React Bits
Los componentes `UiBackground`, `Hero`, `UiCards` y `UiList` incluyen los efectos y props documentados en React Bits.

- Para añadir nuevos componentes desde React Bits visita [https://reactbits.dev](https://reactbits.dev) y copia el snippet deseado.
- Algunos componentes pueden importarse con el CLI oficial:
  ```bash
  npx reactbits add <nombre-componente>
  ```
  > Ajusta las rutas a `src/components/ui` y expón las props relevantes (color, velocidad, densidad, etc.).

Cada archivo tiene comentarios `// ReactBits:` con la referencia exacta del efecto utilizado.

## Buenas prácticas de theming
- Los colores principales (`primary`, `accent`) están configurados en `tailwind.config.ts`. Úsalos mediante clases `bg-primary`, `text-primary-foreground`, etc.
- Define variaciones adicionales en `extend.colors` para mantener una paleta consistente.
- Aprovecha los helpers de Tailwind (`@apply`) en `src/styles/globals.css` para reglas reutilizables y tokens tipográficos.

## Autenticación y roles
- El token JWT se persiste en cookies + `localStorage` y se añade automáticamente a cada request protegida.
- `useAuth` obtiene el perfil (`/api/auth/perfil`) y protege las rutas redirigiendo al login cuando no hay sesión válida.
- `useRoleGuard('admin')` restringe secciones administrativas como `/admin/usuarios`.

## Variables de entorno
| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL base del backend (por ejemplo `http://localhost:3001`). |

> **TODO:** reemplaza el valor por el host/puerto definitivo en tu despliegue.

## Flujo recomendado para desarrollo
1. Arranca el backend (`npm run server` o desde `/server`).
2. Arranca el frontend (`npm run dev`).
3. Autentícate con un usuario existente o registra uno nuevo (si el backend lo permite).
4. Gestiona alumnos, clases e inscripciones desde el panel, registra asistencias y explora los reportes en tiempo real.

¡Listo! Con esta base puedes extender vistas, estilos o métricas según las necesidades del colegio.
