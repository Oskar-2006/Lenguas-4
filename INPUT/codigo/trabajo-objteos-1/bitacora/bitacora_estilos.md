# Bitácora de exploración de estilos — Colección de héroes

**Proyecto:** cartas de héroes renderizadas desde JavaScript (`objetos-1/`)
**CodePen:** https://codepen.io/editor/Oskar-2006/pen/01a0a6c9-58bd-7da8-ad62-89c2e838d711

> Los datos de cada entrada salen del código, del historial de git y de la conversación con la IA
> (Claude) del 2026-09-15, en la que se hizo la V2. Los pedidos entre comillas son textuales.
> La conversación de la V1 (2026-09-11) no quedó guardada; donde dice **✏️ Completar**, escribe
> con tus palabras qué le pediste a la IA o qué probaste tú.

---

## Línea de tiempo

| Fecha | Versión | Qué cambió |
|---|---|---|
| 2026-09-11 | V1 | Primera versión de la colección: 12 héroes, carta generada por JS, efecto de giro 3D con brillo, modal y grid responsive. Todas las cartas usan la misma paleta amarillo/rojo. |
| 2026-09-15 | V2 | Cada héroe tiene sus propios colores (`colorPrincipal` / `colorSecundario`), un logo propio para Spider-Man y comentarios en todo el código. |
| 2026-09-15 | V3 | La colección pasa de 12 a 10 héroes (se quitan Spider-Man y Wonder Woman) para cumplir el rango de 8 a 10 objetos. |

El historial de git registra que en V1 y V2 se trabajó con IA (Claude).

---

## 1. Color

### 1.1 Paleta única para todas las cartas (V1) — ❌ reemplazada
- **Qué le pedí a la IA / qué probé:** ✏️ Completar
- **Cómo quedó en el código:**
  - `--acento: #e8b64d` (amarillo) para borde, nombre, etiquetas y barras de poder.
  - Al pasar el mouse cambia a `--acento-hover: #b23a3a` (rojo).
  - El brillo en reposo usa `rgba(255, 221, 87, 0.35)` (amarillo).
- **Resultado:** las 12 cartas tenían los mismos colores, sin importar el héroe.
- **¿Se quedó?** No. Se reemplazó en V2. Los valores siguen en `:root` como respaldo (fallback).

### 1.2 Colores propios por héroe (V2) — ✅ se quedó
- **Qué le pedí a la IA (2026-09-15):**
  > "quiero que las cards tengan colores personalizados para cada heroe, cada card debe de tener maximo 2 colores, intercambia los colores rojo y amarillo que ya existen en cada card, por los colores caracteristicos o principales de cada heroe, solo cambia los colores, no modifiques ningun hover ni nada"
- **Primer resultado:** cada carta tomó sus colores, pero **el hover dejó de cambiar al color secundario**. Se lo dije a la IA:
  > "los colores cambian con el hove al color secundario, ahora los colores no cambin con hover, arreglalo"
- **Cómo quedó en el código:**
  - Cada objeto tiene `colorPrincipal` y `colorSecundario` (por ejemplo, Flash `#b8262f` / `#f4c430`).
  - La función `aplicarColoresHeroe()` los convierte en variables CSS de cada carta (`--acento-base`, `--acento-hover`…).
  - La función `hexARgb()` convierte el hex a `r, g, b` para armar las versiones transparentes con `rgba()`.
  - Al pasar el mouse, la clase `.interactuando` cambia el color principal por el secundario.
- **Por qué falló el hover:** el JS ponía `--acento` directo en línea (`style`), y un estilo inline le gana a la regla `.card.interactuando` de la hoja de estilos. La solución fue guardar los colores en variables `-base` y `-hover`, y dejar que el CSS elija cuál usar según la clase.
- **¿Se quedó?** Sí.

### 1.3 Fondo de la página — ✅ se quedó
- **Qué le pedí a la IA / qué probé:** ✏️ Completar
- **Cómo quedó:** fondo `#10141c` con rayas diagonales (`repeating-linear-gradient` a `-20deg`) al 4 % de opacidad.
- **¿Se quedó?** Sí.

---

## 2. Forma de la carta

### 2.1 Esquina cortada tipo "carta de colección" — ✅ se quedó
- **Qué le pedí a la IA / qué probé:** ✏️ Completar
- **Cómo quedó:**
  - `clip-path: polygon(...)` corta la esquina inferior izquierda.
  - `border-radius: 4px 16px 4px 4px` y `border-left: 4px` con el color del héroe.
  - `box-shadow` para separar la carta del fondo.
- **¿Se quedó?** Sí.

---

## 3. Layout

### 3.1 Grilla de cartas — ✅ se quedó
- **Qué le pedí a la IA / qué probé:** ✏️ Completar
- **Cómo quedó:** grid mobile-first de 1 columna, 2 desde `700px` y 3 desde `1300px`.
- **Antes:** según los comentarios del CSS, antes había "una sola carta gigante centrada". Con varias cartas por fila se bajaron los tamaños.
- **¿Se quedó?** Sí.

### 3.2 Distribución interna de la carta — ✅ se quedó
- **Qué le pedí a la IA / qué probé:** ✏️ Completar
- **Cómo quedó:** dos columnas (imagen y descripción a la izquierda, datos a la derecha), separadas con `border-left`. En desktop la columna de imagen se centra con `flex`.
- **Pista de una versión anterior:** el CSS de desktop fuerza `border-top: none` "por si algún estilo lo pisara", lo que sugiere que antes el separador era horizontal. ✏️ Confirmar si probaste esa versión.
- **¿Se quedó?** Sí.

### 3.3 Poderes en grilla con barras — ✅ se quedó
- **Qué le pedí a la IA / qué probé:** ✏️ Completar
- **Cómo quedó:** `ul.poderes` en grid de 2 columnas. Cada poder tiene una barra cuyo ancho (`width: X%`) lo pone el JS según `nivel`.
- **¿Se quedó?** Sí.

---

## 4. Transforms y transitions

### 4.1 Giro 3D tipo carta Pokémon — ✅ se quedó
- **Qué le pedí a la IA / qué probé:** ✏️ Completar
- **Cómo quedó:**
  - Con `mousemove`, la carta gira según la posición del cursor: `perspective(900px) rotateX() rotateY()`, máximo 10° por lado, más `scale(1.02)`.
  - Con `mouseleave` vuelve a 0°.
  - `transition: transform 0.15s ease-out` suaviza el movimiento.
- **¿Se quedó?** Sí.

### 4.2 Franja de brillo que sigue al mouse — ✅ se quedó (con una observación)
- **Qué le pedí a la IA / qué probé:** ✏️ Completar
- **Cómo quedó:** un `div.brillo` con `linear-gradient` a 115° que el JS mueve según el cursor, desplazado 25 % para que no quede justo debajo. Tiene `pointer-events: none` para no bloquear los clics.
- **Observación:** en V2 se creó `--brillo-color` con el color de cada héroe, pero durante el `mousemove` el JS reemplaza el fondo por un rojo fijo (`rgba(178, 58, 58, 0.45)`). Como en reposo el brillo está oculto (`opacity: 0`), el color por héroe no se llega a ver. Esto pasó porque en el pedido de colores dije "no modifiques ningun hover ni nada", así que la IA no tocó la función `activarEfectoMouse()`, que es donde se pinta el brillo.
- **¿Se quedó?** Sí.

### 4.3 Logo que se agranda lento — ✅ se quedó
- **Qué le pedí a la IA / qué probé:** ✏️ Completar
- **Cómo quedó:** `.card:hover .imagen { transform: scale(1.5) }` con `transition: transform 2s`. La duración larga hace que el logo "flote" en vez de saltar.
- **¿Se quedó?** Sí.

### 4.4 Transición de colores — ✅ se quedó
- **Cómo quedó:** `transition: color / border-color / background-color 0.2s` en nombre, etiquetas, separadores y barras, para que el cambio al color secundario no sea brusco.

---

## 5. Imágenes

### 5.1 Logo de Batman con fondo blanco — ✅ se quedó
- **Qué le pedí a la IA / qué probé:** ✏️ Completar
- **Problema:** `batman.jpg` tiene fondo blanco sólido; el resto de los logos son SVG/PNG transparentes.
- **Solución:** clase `.imagen--fondo-blanco` con `mix-blend-mode: multiply`, activada con la propiedad booleana `imagenFondoBlanco: true`. Solo se aplica a esa imagen, porque en las demás oscurecería los logos.
- **¿Se quedó?** Sí.

### 5.2 Logo propio de Spider-Man (V2) — ❌ no se usa al final
- **Qué le pedí a la IA (2026-09-15):**
  > "cambia el logo de spiderman, solo el logo de este heroe"
- **Resultado:** el `spiderman.svg` original no era el emblema de la araña, sino un texto dibujado (un wordmark). La IA lo reemplazó por un ícono propio con el mismo estilo plano que los demás: círculo de fondo `#4F5D73`, una araña negra de 8 patas al centro y el mismo `viewBox` de 64×64.
- **Pregunta que hice:** "los demas logos los creaste o buscaste?". Respuesta: los demás ya estaban en `IMG objetos-1/` desde antes y solo se creó el de Spider-Man.
- **¿Se quedó?** No. Spider-Man salió de la colección en V3 para dejar 10 objetos. El archivo sigue en `IMG objetos-1/`.

---

## 6. Modal de detalle — ✅ se quedó
- **Estructura del modal (V1):** ✏️ Completar
- **Qué le pedí a la IA sobre su color (2026-09-15):** después de poner colores por héroe, el modal seguía amarillo:
  > "cuando le das click a la card se abre con todas las propiedas, pero los colore siguen siendo amarillo, cambia el color de las cards al darle click al color principal de cada heroe"
- **Por qué pasaba:** el modal no es una `.card`, así que nunca recibía las variables de color del héroe.
- **Cómo quedó:**
  - Un solo modal reutilizable. Al abrirlo, el JS le pone el `colorPrincipal` del héroe.
  - Tiene fondo oscuro al 70 %, `max-height: 85vh` con scroll interno, y se cierra con la X, clic afuera o Escape.
- **¿Se quedó?** Sí.

---

## 7. Tipografía
- **Cómo quedó:** `Arial, sans-serif` en toda la página. El nombre usa `letter-spacing: 1px` y las etiquetas van en negrita con el color del héroe.
- **Otras fuentes probadas:** no hay registro de otra fuente en el código ni en el historial. ✏️ Completar si probaste otra.

---

## Cierre
✏️ Completar: qué aprendiste explorando los estilos y qué te costó más.
