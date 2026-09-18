# The Factory HKA - Evaluacion Tecnica Frontend

Este repositorio contiene el frontend para la prueba tecnica de The Factory HKA. Se ha desarrollado utilizando React, Vite, y un patron de arquitectura MVC basado en Custom Hooks para separar la logica de negocio de las vistas.

## Tecnologias Utilizadas
- React 18
- Vite
- React Router v6
- Lucide React (Iconos)
- Vitest (Pruebas Unitarias)

## Estructura del Proyecto
- src/config: Configuracion global y endpoints de la API.
- src/controllers: Custom hooks que actuan como controladores, gestionando el estado global y las llamadas a los servicios (MVC).
- src/lib: Funciones puras de utilidad (logica del carrito, formateo de fechas y moneda, manejo de errores de la API).
- src/models: Representacion estructurada de los datos consumidos.
- src/services: Clientes HTTP (Axios/Fetch) para la interaccion con el backend .NET.
- src/views: Componentes de React puros divididos en paginas (Pages) y componentes reutilizables (Components).

## Requisitos Previos
- Node.js (v18 o superior recomendado)
- NPM o Yarn
- Backend de The Factory HKA corriendo localmente (por defecto espera localhost:7017 o la URL configurada en api.config.js)

## Instalacion y Ejecucion

1. Instalar las dependencias del proyecto:
   npm install

2. Iniciar el servidor de desarrollo:
   npm run dev

3. Compilar el proyecto para produccion:
   npm run build

## Pruebas Unitarias

Se han implementado pruebas unitarias aislando la logica de negocio pura (aritmetica de moneda, logica del carrito y zona horaria). Para ejecutar la suite de pruebas utilice:

   npm test

## Manejo de Errores (ValidationProblemDetails)

El sistema esta disenado para capturar los errores 400 (Bad Request) provenientes del backend en el formato estandar ValidationProblemDetails de ASP.NET Core. Estos errores son parseados e inyectados directamente debajo del campo correspondiente en los formularios (por ejemplo, cuando el numero de documento o el codigo del producto ya existen).
