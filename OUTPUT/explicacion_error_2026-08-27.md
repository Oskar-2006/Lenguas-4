# Explicación de error — 2026-08-27

## Código

```js
for (let i = 0; i > 10; i++) {
  console.log(i + 1);
}
```

## Tipo de error
Error de **lógica** — el código es válido y no lanza excepción, pero no hace lo que se espera: el bucle nunca ejecuta el bloque.

## Causa puntual
La condición de corte es `i > 10`. Como `i` arranca en `0`, esa condición (`0 > 10`) es falsa desde la primera evaluación, así que el `for` termina antes de correr ni una vez.

## Concepto detrás
Un `for` evalúa la condición **antes** de cada vuelta: si es `true`, ejecuta el bloque; si es `false`, corta ahí. Cuando `i` aumenta con `i++`, la condición tiene que comparar contra el límite superior con `<` (o `<=`), no con `>`, porque `>` es la comparación que usarías si `i` fuera decreciendo.

## Corrección sugerida

```js
for (let i = 0; i < 10; i++) {
  console.log(i + 1);
}
```

## Estrategia de acompañamiento
Se le pidió al estudiante evaluar a mano la condición `i > 10` con el valor inicial de `i` (`0 > 10`), para que viera que da `false` antes de mostrarle la corrección.
