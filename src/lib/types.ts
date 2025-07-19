// lib/types.ts

// Tipo para el perfil de usuario que usamos en la página de Usuarios
export type UserProfile = {
  id: string;
  createdAt: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

// Tipo para los maestros (lo hemos añadido)
export type Maestro = {
  id: string;
  nombre: string;
  saldo: number;
  // La relación viene como un array desde Supabase
  creadoPor: {
    email: string | null;
  }[] | null;
};

// Tipo para los movimientos (corregida la propiedad 'ejecutadoPor')
export type MovimientoConUsuario = {
  id: string;
  fecha: string;
  cantidad: number;
  tipo: 'ENTRADA' | 'SALIDA';
  // Esta relación es 1:1, no un array
  ejecutadoPor: {
    email: string | null;
  } | null;
};
