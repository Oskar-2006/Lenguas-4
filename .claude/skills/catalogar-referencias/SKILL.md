---
name: catalogar-referencias
description: Organiza referencias visuales recolectadas para un proyecto por tema o elemento que inspiran. Use when the user wants to organize, group, or make sense of collected visual references.
---

`OUTPUT/catalogo_referencias.md` es un documento vivo, no un snapshot fechado
como en las otras skills: refleja siempre el estado acumulado actual de
`INPUT/referencias_proyecto.md`, así que se sobrescribe intencionalmente en
cada corrida.

Cuando se active esta skill:

1. Lee `INPUT/referencias_proyecto.md`.
2. Agrupa las referencias por qué elemento del proyecto inspiran (ej. tipografía, color, layout, movimiento).
3. Por cada grupo, resume en una línea qué característica compartida hace que esas referencias encajen juntas.
4. Guarda el catálogo agrupado en `OUTPUT/catalogo_referencias.md`, sobrescribiendo la versión anterior, con un encabezado `_Última actualización: [fecha de hoy]_` al inicio del archivo.
