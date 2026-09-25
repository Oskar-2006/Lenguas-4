const patron = /hola/;

console.log(patron.test("hola mundo"));        // → true (contiene "hola")
console.log(patron.test("chao mundo"));        // → false

console.log("hola mundo".match(patron));       // → ["hola", index: 0, ...]
console.log("hola mundo".replace(patron, "chao")); // → "chao mundo"



// segunda parte
// ( ) agrupa varios caracteres para tratarlos como una unidad
const soloNumeros = /^\d+$/;
// ^ = debe empezar aquí, \d+ = uno o más dígitos, $ = debe terminar aquí
// es decir: TODO el string, de principio a fin, deben ser dígitos

console.log(soloNumeros.test("12345"));   // → true
console.log(soloNumeros.test("123a5"));   // → false (la "a" rompe el patrón)
console.log(soloNumeros.test(""));        // → false (+ exige al menos uno)

// grupos y alternancias
// ( ) agrupa varios caracteres para tratarlos como una unidad
const repetido = /^(ab)+$/;
console.log(repetido.test("ababab"));  // → true ("ab" repetido 3 veces)
console.log(repetido.test("aba"));     // → false (no termina en un "ab" completo)

// | significa "o" (alternancia)
const gatoOPerro = /^(gato|perro)$/;
console.log(gatoOPerro.test("gato"));   // → true
console.log(gatoOPerro.test("perro"));  // → true
console.log(gatoOPerro.test("loro"));   // → false