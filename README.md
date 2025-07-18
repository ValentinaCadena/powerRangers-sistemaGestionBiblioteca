# 📚 Sistema de Gestión Biblioteca - Power Rangers

![GitHub repo size](https://img.shields.io/github/repo-size/jonathand77/monitor-system-os)
![GitHub contributors](https://img.shields.io/github/contributors/jonathand77/monitor-system-os)
![GitHub last commit](https://img.shields.io/github/last-commit/jonathand77/monitor-system-os)
![License](https://img.shields.io/badge/license-BSD%202--Clause-blue)
![Languages](https://img.shields.io/github/languages/count/jonathand77/monitor-system-os)

---

## 👥 Equipo

| 👨‍💻 Nombre | 📧 Correo | 🐙 GitHub |
|---|---|---|
| **Jonathan David Fernandez Vargas** | jonathand.fernandez@udea.edu.co | [jonathand77](https://github.com/jonathand77) |
| **Valeria Alvarez Fernandez** | valeria.alvarezf@udea.edu.co | [vaf88](https://github.com/vaf88) |
| **Valentina Cadena Zapata** | valentina.cadenaz@udea.edu.co | [ValentinaCadena](https://github.com/ValentinaCadena) |

---

## 🚀 Tecnologías Utilizadas

- [Next.js 14+](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Auth y DB)
- [Prisma ORM](https://www.prisma.io/) (PostgreSQL)
- [React](https://react.dev/)
- [Recharts](https://recharts.org/) (Gráficas)
- [Vercel](https://vercel.com/) (Despliegue)

---

## 📦 Estructura del Proyecto

```
src/
  app/                # Páginas y rutas principales
    dashboard/        # Dashboard con módulos: transacciones, maestros, usuarios
    login/            # Página de autenticación
    auth/             # Callback de autenticación
  components/         # Componentes reutilizables (Sidebar, LogoutButton)
  lib/                # Tipos, cliente Supabase, utilidades
  prisma/             # Esquema y migraciones de la base de datos
  styles/             # Estilos globales
```

---

## 🛠️ Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/jonathand77/monitor-system-os.git
   cd monitor-system-os
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configura las variables de entorno:**
   Crea un archivo `.env.local` en la raíz con:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   DATABASE_URL=postgresql://usuario:contraseña@host:puerto/db
   ```

4. **Ejecuta migraciones de Prisma:**
   ```bash
   npx prisma migrate dev
   ```

---

## ▶️ Ejecución

```bash
npm run dev
# o
yarn dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧩 Funcionalidades Principales

- **Autenticación:** Google/GitHub vía Supabase.
- **Gestión de Usuarios:** Solo admins pueden ver y editar roles.
- **Gestión de Maestros:** Crear, listar y ver saldos.
- **Transacciones:** Registrar entradas/salidas y ver historial con gráficas.
- **Sidebar Dinámico:** Opciones según rol (ADMIN/USER).
- **Logout seguro.**

---

## 👤 Ejemplo de Usuario y Admin para Pruebas

### Usuario ADMIN
- Acceso a: Transacciones, Maestros, Usuarios.
- Puede editar roles y crear maestros.

### Usuario NORMAL
- Acceso a: Transacciones, Maestros.
- No puede editar roles ni crear maestros.

#### Para probar:
1. Regístrate creando una cuenta y aceptando el correo de confirmación o utilizando:
Usuario: jonathanfdez62@gmail.com
Contraseña: 123456
2. En la tabla `User` de la base de datos, cambia el campo `role` a `ADMIN` para tu usuario.
3. Ingresa y verifica las opciones extra en el dashboard.

---

## 📚 Ejemplo de Uso

1. **Login:** Ingresa con Google/GitHub.
2. **Dashboard:** Accede a transacciones y maestros.
3. **Admin:** Si eres admin, gestiona usuarios y crea nuevos maestros.
4. **Transacciones:** Agrega movimientos y visualiza el saldo en gráficas.

---

## 📝 Buenas Prácticas

- Código tipado con TypeScript.
- Rutas protegidas según rol.
- Acciones seguras en el backend.
- Componentes desacoplados y reutilizables.
- Migraciones versionadas con Prisma.
- Variables de entorno fuera del código fuente.
- Estilos con Tailwind y clases utilitarias.
- Documentación clara y actualizada.

---

## 📖 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

---

## 🚀 Despliegue

Despliega fácilmente en [Vercel](https://vercel.com).

---

## 🏷️ Licencia

BSD 2
