# Bitácora de reflexiones — Agente de Talleres

Una entrada breve por sesión de clase: qué se aprendió o qué costó más, escrita al cierre de cada
sesión. **No es la bitácora del curso** (esa la lleva el profesor, en `bitacora_sesiones_curso.csv`,
fuera de esta carpeta) — esta es la reflexión personal del estudiante sobre su propio proceso.

## 2026-08-20

Hoy entendí la diferencia entre declarar una variable con `let` y usarla sin declararla — el
`ReferenceError` dejó de sentirse aleatorio en cuanto vi que siempre es la misma causa: un nombre
que nunca definí.

## 2026-08-22

Me costó organizar las referencias visuales por tema en vez de por sitio de origen. Al principio
quería agruparlas por dónde las encontré, pero agruparlas por lo que inspiran (color, tipografía,
layout) tiene más sentido para el proyecto.

## 2026-09-03

Primera clase de interacción con CSS/JS en el navegador. Trabajé sobre un grid básico
(`INPUT/codigo/Css1/Index.html`) agregando botones e ítems clicables con `addEventListener`.
Lo más difícil fue entender `addEventListener`: cómo un elemento del DOM "escucha" un evento
de clic y dispara una función en respuesta, en vez de que el código simplemente se ejecute de
arriba a abajo. También aprendí que cualquier elemento (no solo `<button>`) puede escuchar
clics, y que un `classList.toggle()` no hace nada visible si la clase CSS no está definida.

## 2026-09-10

Dificultad media, pero en general bien. Seguí trabajando sobre `Index.html` (más grids, dark
mode extendido a varios contenedores) y armé una landing page nueva (`3.html`) con secciones
que se muestran u ocultan según el tamaño de pantalla. También tocó resolver un conflicto de
merge en Git porque había trabajado el mismo archivo en dos sesiones distintas — combinar
ambas versiones sin perder ninguna.

## 2026-09-15

Sesión de repaso, sin contenido nuevo de clase: seguí trabajando sobre el ejercicio de cartas
de superhéroes (`INPUT/codigo/Css1/objetos-1/`) reforzando lo ya visto — variables CSS, cómo un
estilo inline le gana a una regla de la hoja de estilos, y cómo se arma el HTML de una carta
desde un objeto en JS.

## 2026-09-17

Trabajé sobre el ejercicio de arrays (`INPUT/codigo/Css1/Arrays/ar1/arr2.html`): agregué botones
para mostrar la lista y buscar un elemento, y corregí errores de código (un typo en un nombre de
método y un `pop()` que debía ser `shift()`). Aprendí que `indexOf()` es importante de cara al
examen que viene, y reforcé cómo se declaran y usan funciones en JS.

## 2026-09-18

Hoy se aprendió a crear un gestor de arrays para una página HTML. Fue algo enredado, pero nada
que pensar detenidamente no solucione.

Arranqué `INPUT/codigo/Proyecto-1/` separando los datos (`data.js`) de la lógica (`index.js`), y
terminé con un CRUD completo en `gestion.html`: crear, leer/buscar, actualizar y eliminar héroes.
También agregué al ejercicio de arrays de clase los botones de eliminar y cambiar elemento.

Lo que más costó entender fue por qué un héroe creado desde `gestion.html` no aparecía en
`index.html`: el `push()` estaba bien, pero los cambios vivían solo en memoria. Un archivo `.js`
no se puede reescribir desde el navegador, y cada página HTML arranca un contexto de JavaScript
nuevo. Se resolvió con `localStorage` (`storage.js`), guardando el array como texto con
`JSON.stringify` y reconstruyéndolo con `JSON.parse`.

## 2026-09-19

Al revisar la tarea de la colección de objetos contra el enunciado, tuve que ajustar el trabajo
ya terminado (bajar de 12 a 10 héroes y armar la bitácora de estilos). Aprendí a leer las
instrucciones primero y luego hacer el trabajo, para no tener que modificarlo al terminar.

## 2026-09-24

Hoy corregí algunas cosas para la entrega del trabajo. También pensé en cómo presentar esta
actividad para lograr una mejor exposición.

## 2026-09-25

Hoy "creamos" un juego con ayuda del profe usando las cartas que ya teníamos: un memory
(`INPUT/codigo/Proyecto-1/game.html`) adaptado de un ejemplo de flip cards, que reparte héroes de
`listaHeroes` y guarda las partidas de cada usuario. También aprendí sobre los signos de las
expresiones regulares que arman secuencias: `()` agrupa, `[]` define un conjunto de caracteres,
`{}` indica cuántas veces se repite, `-` marca un rango dentro de `[]` (como `A-Z`), `$` marca el
final (o un `$` literal si va con `\`), `+` es "uno o más" y `*` es "cero o más". Los usé en el
login para validar el email y la contraseña.

## 2026-10-01

La reflexión es hacer la tarea, porque cuando la piden es para usarla.

## 2026-10-15

Primera clase de Supabase (guía de la semana 11): crear la tabla `productos_practica` y leerla
desde JS con el cliente de Supabase. Arranqué `INPUT/codigo/Supabase-1/` con una lista de tareas
de prueba y `prueba.js`, que trae los productos de la tabla. Al crear una política salió un error
porque llamaba a una función SQL que no existía.

## 2026-10-22

Pasé el CRUD de héroes de `Proyecto-1` de `localStorage` a Supabase: tabla `heroes`, funciones
de `gestion.js` con `async`/`await` y las imágenes nuevas en Supabase Storage. Ahora los héroes
ya no viven en el navegador, sino en una base que cualquier página puede leer. En clase
insertamos productos en `productos_practica` desde JS, con una columna nueva `image_url` para
las fotos. El error del día fue usar `db` cuando el cliente se llamaba `clienteSupabase`.

## 2026-10-30

La actividad de hoy fue el proceso de inicio y registro de sesión en Supabase, para que los
clientes puedan tener un correo con el cual ingresar a la página del e-commerce.

De tarea quedó una barra lateral en `cliente.html` con "Configuración de usuario" abajo, donde el
cliente actualiza sus datos con un `update`. El correo y el rol se muestran pero no se editan.

## 2026-11-03

No fui a la clase de productos, así que la recuperé con la guía del panel de administrador.
Creé la tabla `productos` del e-commerce (sin "_practica", con las columnas de la semana 11 más
`plataforma`) y el panel `admin.html`, con el CRUD de productos y la sección "Mis clientes". Las
políticas para que solo el admin cree, edite y borre quedan para cuando se active RLS.

## 2026-11-05

Hoy aprendimos sobre RLS (Row Level Security): qué es, por qué es necesario y cómo aplicarlo en
Supabase. La tabla `clientes` no tenía RLS activado, así que hicimos una prueba de seguridad real:
desde el inspector del navegador sacamos la clave `anon` (que es pública por diseño) y con un
comando `curl` insertamos una fila falsa en `clientes` sin tener sesión iniciada — confirmando que
sin RLS cualquiera con la clave puede leer y escribir en la tabla.

También creamos `catalogo.html` y `js/catalogo.js` para que un visitante pueda ver los productos
sin iniciar sesión, con la misma estructura visual de la vista con sesión (barra lateral +
contenido).

Pendiente para la próxima: activar RLS en `clientes` con las políticas de select/update/insert,
proteger la columna `rol` para que nadie se haga admin, y aprender a usar archivos `.env` para no
dejar las claves en texto plano en el código.
