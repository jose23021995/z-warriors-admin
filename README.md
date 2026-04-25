# z-warriors-admin
Desarrollar una SPA (Single Page Application) administrativa para gestionar la base de datos de guerreros Z. El candidato debe demostrar dominio de Angular 21 (Signals), consumo de APIs REST con Paginación en Servidor y manejo avanzado de UI con PrimeNG v21.



*Estructura
```
src/app/
│
├── core/               # Singleton: Servicios globales, Guards e Interceptors
│   ├── guards/         # canActivateFn (Seguridad de rutas)
│   ├── interceptors/   # Manejo de errores de API (Interceptor funcional)
│   └── services/       # dragon-ball-api.service.ts
│
├── features/           # Módulos de lógica (Pantallas principales)
│   ├── auth/           # Login
│   ├── dashboard/      # Layout principal (Sidebar, Toolbar)
│   └── characters/     # Tabla de personajes y Dynamic Dialog
│
├── shared/             # Reutilizables
│   ├── components/     # Botones personalizados, loaders
│   ├── interfaces/     # Modelos de datos (Character, API Response)
│   └── pipes/          # Formateo de texto
│
├── app.config.ts       # Configuración global (PrimeNG, Rutas)
├── app.routes.ts       # Definición de rutas
└── app.ts              # Componente raíz
```