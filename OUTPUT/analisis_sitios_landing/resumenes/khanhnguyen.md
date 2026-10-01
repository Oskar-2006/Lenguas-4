# khanhnguyen.design — Khanh Nguyen (diseñador independiente)

**Nota de método:** `WebFetch` bloqueó este dominio; el análisis sale del HTML descargado con `curl`. No se pudo ver el sitio renderizado, así que la UX/UI es inferida del código.

**Contenido y enfoque:** portafolio de diseñador independiente; trabajo desde 2013 (`data-start-year`), con servicios, clientes y proyectos.

**Público objetivo:** clientes y estudios que contratan diseño y desarrollo web a medida (el texto menciona Webflow, Framer o desarrollo custom).

**Estructura (7 secciones en el home):** Loading, Selected work, Services, Clients, About, More work y Contact. Cada sección es un panel de pantalla completa (`data-horizontal-panel`), lo que indica un recorrido horizontal en escritorio.

**UX/UI (según el código):** cambia el color del header según el panel, tiene navegación "Primary" y "Social" y paleta de neutros cálidos (`#faf9f6`, `#edeae6`, `#2e2b28`, `#1f1d1b`), con secciones claras y oscuras alternadas.

**Stack verificado:** Astro con Tailwind (clases utilitarias). Librería de animación, tipografía y transiciones: no detectado.

**Oportunidad de mejora:** una pantalla de carga inicial y el scroll horizontal pueden frenar a quien solo quiere ver el trabajo; no verificado visualmente.
