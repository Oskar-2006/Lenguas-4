---
name: analizar-sitio-web
description: Analiza un sitio web de referencia y entrega tres cosas juntas (un resumen .md, la estructura semántica en .xml y una fila para la matriz comparativa en OUTPUT/analisis_sitios_landing/). Use when the user gives a URL (or has a site open in the browser panel) and asks to analyze it, compare reference sites, or add a site to the comparison matrix.
---

`OUTPUT/analisis_sitios_landing/matriz_comparativa.csv` es acumulativa: cada corrida agrega una
fila y nunca se borran las anteriores. Aquí sí se evalúa el diseño, la UX y la UI, porque es un
sitio de referencia, no el trabajo del estudiante.

Cuando se active esta skill:

1. Toma la URL que dio el estudiante, o el sitio abierto en el browser panel. Si no hay ninguno,
   pídela.
2. Si `matriz_comparativa.csv` ya tiene una fila con esa URL, avisa y pregunta antes de agregar
   una fila duplicada.
3. Revisa el sitio (contenido, código fuente, estilos y scripts cargados) y define el nombre base
   de los archivos a partir del dominio, en minúsculas y con guiones (ej. `nombre-del-sitio`).
4. Produce los 3 entregables, siempre los tres juntos y claramente marcados:

   **Entregable 1 — Resumen.** Menos de 300 palabras, en
   `OUTPUT/analisis_sitios_landing/resumenes/[nombre-base].md`: contenido del sitio, enfoque,
   público objetivo, estructura, UX y UI.

   **Entregable 2 — Estructura semántica.** En `OUTPUT/analisis_sitios_landing/xml/[nombre-base].xml`,
   con este esquema (etiquetas semánticas de HTML5, sin inventar nombres nuevos):

   ```xml
   <sitio nombre="..." url="...">
     <header>
       <logo>...</logo>
       <nav tipo="fija | hamburguesa | mega-menu | overlay-fullscreen">
         <enlace>...</enlace>
       </nav>
     </header>
     <main>
       <section tipo="hero">...</section>
       <section tipo="...">...</section>
     </main>
     <footer>
       <redes>...</redes>
       <contacto>...</contacto>
     </footer>
   </sitio>
   ```

   **Entregable 3 — Fila de la matriz.** Exactamente estos 14 campos, en este orden, separados
   por " ; ":

   ```
   url ; tipo_de_sitio ; cms_o_builder ; libreria_animacion ; libreria_frontend ; patron_navegacion ; num_secciones_home ; transicion_entre_paginas ; tipografia_principal ; estilo_visual ; fortaleza_ux ; oportunidad_mejora ; nombre_archivo_md ; nombre_archivo_xml
   ```

   Agrega la fila al final de `OUTPUT/analisis_sitios_landing/matriz_comparativa.csv`. Si el
   archivo no existe, créalo con esa línea de encabezado en la primera línea.

5. Muestra en el chat los tres entregables y las rutas donde quedaron guardados.

Reglas:

- El `.md` y el `.xml` de un mismo sitio llevan el mismo nombre base, y esos mismos nombres de
  archivo van en los dos últimos campos de la fila.
- Si un dato no se puede verificar en el sitio (CMS, librerías, tipografía, transiciones), escribe
  `no detectado`. No lo deduzcas ni lo inventes.
- Ningún campo de la fila puede contener " ; " ni saltos de línea, para no romper las columnas.
- `num_secciones_home` debe coincidir con la cantidad de `<section>` dentro de `<main>` en el `.xml`.
