# Nodejs express API REST buenas prácticas ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Proyecto base de ejemplo de buenas prácticas de una API REST con Nodejs, express, Typescript y MongoDB. El objetivo del proyecto es tener una base de desarrollo basado en capas MVC implementando patrones y otras cualidades básicas de un proyecto a considerar, como lo son; la captura de errores, testing, nomenclaturas y validaciones.

## Instalación

```bash
> npm install
```

## Docker

```bash
> docker build -t api .
> docker run -d -p 3000:3000 api
```

## Desarrollo

Ejecutar `npm run dev` para levantar un servidor en modo desarrollo. Navegar a `http://localhost:3000/`.

```
> npm run dev
```

## Pruebas con Jest

Ejecutar `npm run test` para realizar las pruebas de la unidad a través de [jest](https://jestjs.io/).

```bash
> npm run test
```

## Pruebas con Jest y supertest

Ejecutar `npm run test:e2e` para realizar las pruebas de extremo a extremo a través de [jest](https://jestjs.io/) y [supertest](https://github.com/ladjs/supertest#readme) 

```bash
> npm run test:e2e
```

## Coverage

Ejecutar `npm run test:cov` para generar el reporte de cobertura. Este comando construirá una carpeta llamada coverage ubicada en la raíz del proyecto.

```bash
# Covertura de test unitarios
> npm run test:cov
# Covertura de test e2e
> npm run test:e2e:cov
```

## Compilación

Ejecutar `npm run build` para empaquetar el proyecto. Los artefactos de la construcción serán almacenados en el directorio `dist/`.

```bash
> npm run build
```

## Equipo

Desarrollado por Diego Cortés

* dcortes.net@gmail.com