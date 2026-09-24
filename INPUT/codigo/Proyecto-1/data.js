// ============================================================
// DATOS: ARRAY DE HEROES
// ============================================================
// este archivo guarda SOLO los datos, separados de la logica que los
// dibuja (esa vive en index.js). la ventaja es que para agregar o
// cambiar un heroe no hay que tocar el codigo que arma las cartas.
//
// "heroes" es un ARRAY que contiene 10 objetos "heroe". todos tienen las
// mismas propiedades (nombre, imagen, edad, poderes, etc.) para que la
// misma plantilla de carta sirva para cualquiera de ellos.
//
// "id" es un numero unico que identifica a cada heroe y NO cambia nunca,
// aunque el heroe se mueva de puesto o se edite. el indice del array no
// sirve para eso: si se borra o se mueve un heroe, los indices de los
// demas se corren. los nuevos que se crean desde gestion.html siguen la
// cuenta desde 11 (ver "siguienteId" en storage.js y gestion.js).
//
// "poderes" es un array de objetos { nombre, nivel } donde "nivel" (0-100)
// se usa para dibujar la barrita de fuerza de cada poder.
//
// las rutas de "imagen" son relativas al index.html (que esta en la raiz
// de Proyecto-1), no a este archivo: por eso empiezan en "img/".

const heroes = [
    {
        id: 1,
        nombre: "Flash",
        imagen: "img/bolt.svg",
        edad: 24,
        poderes: [
            { nombre: "Super velocidad", nivel: 90 },
            { nombre: "Viajar en el tiempo", nivel: 45 },
            { nombre: "Super reflejos", nivel: 75 },
            { nombre: "Curación acelerada", nivel: 55 },
            { nombre: "Vibración molecular", nivel: 30 },
            { nombre: "Fuerza de velocidad", nivel: 65 },
        ],
        descripcion: "El Flash es un superhéroe con la capacidad de moverse a velocidades superiores a la luz.",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 85,
        activo: true,
        colorPrincipal: "#b8262f",
        colorSecundario: "#f4c430",
    },
    {
        id: 2,
        nombre: "Superman",
        imagen: "img/superman.svg",
        edad: 35,
        poderes: [
            { nombre: "Vuelo", nivel: 95 },
            { nombre: "Superfuerza", nivel: 98 },
            { nombre: "Visión de calor", nivel: 80 },
            { nombre: "Invulnerabilidad", nivel: 90 },
            { nombre: "Superoído", nivel: 70 },
        ],
        descripcion: "Superman es el último hijo de Krypton, protector de la Tierra gracias a los poderes que le da nuestro sol amarillo.",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 99,
        activo: true,
        colorPrincipal: "#2456c4",
        colorSecundario: "#d21f2f",
    },
    {
        id: 3,
        nombre: "Batman",
        imagen: "img/batman.jpg",
        // esta imagen es un .jpg con fondo blanco solido (no transparente
        // como el resto), asi que necesita una clase extra en el CSS
        imagenFondoBlanco: true,
        edad: 40,
        poderes: [
            { nombre: "Estrategia", nivel: 95 },
            { nombre: "Artes marciales", nivel: 90 },
            { nombre: "Detective", nivel: 92 },
            { nombre: "Uso de gadgets", nivel: 85 },
            { nombre: "Riqueza infinita", nivel: 100 },
        ],
        descripcion: "Batman es un vigilante de Ciudad Gótica que combate el crimen sin poderes sobrehumanos, solo entrenamiento y tecnología.",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 60,
        activo: true,
        colorPrincipal: "#4b5160",
        colorSecundario: "#f2c14e",
    },
    {
        id: 4,
        nombre: "Iron Man",
        imagen: "img/ironman.svg",
        edad: 45,
        poderes: [
            { nombre: "Armadura tecnológica", nivel: 95 },
            { nombre: "Vuelo asistido", nivel: 85 },
            { nombre: "Inteligencia", nivel: 98 },
            { nombre: "Repulsores", nivel: 80 },
            { nombre: "Soporte de IA", nivel: 75 },
        ],
        descripcion: "Iron Man es Tony Stark, un genio inventor que usa una armadura tecnológica para proteger al mundo.",
        bando: "Heroe",
        universo: "Marvel Comics",
        niveldefuerza: 78,
        activo: true,
        colorPrincipal: "#a3202b",
        colorSecundario: "#d4a017",
    },
    {
        id: 5,
        nombre: "Captain America",
        imagen: "img/capamerica.svg",
        edad: 105,
        poderes: [
            { nombre: "Superfuerza", nivel: 75 },
            { nombre: "Uso del escudo", nivel: 90 },
            { nombre: "Liderazgo", nivel: 95 },
            { nombre: "Resistencia", nivel: 85 },
            { nombre: "Estrategia militar", nivel: 88 },
        ],
        descripcion: "Captain America es Steve Rogers, un soldado potenciado por el suero del supersoldado que lucha por la justicia.",
        bando: "Heroe",
        universo: "Marvel Comics",
        niveldefuerza: 72,
        activo: true,
        colorPrincipal: "#2a4d94",
        colorSecundario: "#c8202f",
    },
    {
        id: 6,
        nombre: "Thor",
        imagen: "img/thor.svg",
        edad: 1500,
        poderes: [
            { nombre: "Control del rayo", nivel: 95 },
            { nombre: "Superfuerza", nivel: 96 },
            { nombre: "Vuelo", nivel: 85 },
            { nombre: "Invulnerabilidad", nivel: 80 },
            { nombre: "Manejo del Mjolnir", nivel: 92 },
        ],
        descripcion: "Thor es el dios asgardiano del trueno, capaz de invocar rayos con su martillo Mjolnir.",
        bando: "Heroe",
        universo: "Marvel Comics",
        niveldefuerza: 97,
        activo: true,
        colorPrincipal: "#a3202b",
        colorSecundario: "#b08d3e",
    },
    {
        id: 7,
        nombre: "Wolverine",
        imagen: "img/wolverine.svg",
        edad: 200,
        poderes: [
            { nombre: "Factor curativo", nivel: 95 },
            { nombre: "Garras de adamantium", nivel: 90 },
            { nombre: "Sentidos animales", nivel: 80 },
            { nombre: "Fuerza", nivel: 65 },
            { nombre: "Resistencia al dolor", nivel: 85 },
        ],
        descripcion: "Wolverine es Logan, un mutante con garras retráctiles y un factor de curación acelerado.",
        bando: "Heroe",
        universo: "Marvel Comics",
        niveldefuerza: 75,
        activo: true,
        colorPrincipal: "#f0c419",
        colorSecundario: "#1c3f7a",
    },
    {
        id: 8,
        nombre: "Green Lantern",
        imagen: "img/greenlantern.svg",
        edad: 32,
        poderes: [
            { nombre: "Anillo de poder", nivel: 95 },
            { nombre: "Constructos de energía", nivel: 90 },
            { nombre: "Vuelo", nivel: 80 },
            { nombre: "Fuerza de voluntad", nivel: 92 },
            { nombre: "Escudo de energía", nivel: 78 },
        ],
        descripcion: "Green Lantern es Hal Jordan, miembro del Green Lantern Corps, capaz de crear cualquier cosa con su anillo de poder.",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 80,
        activo: true,
        colorPrincipal: "#1f9d55",
        colorSecundario: "#9ad84b",
    },
    {
        id: 9,
        nombre: "Black Panther",
        imagen: "img/blackpanther.svg",
        edad: 32,
        poderes: [
            { nombre: "Traje de vibranio", nivel: 88 },
            { nombre: "Agilidad felina", nivel: 85 },
            { nombre: "Combate cuerpo a cuerpo", nivel: 90 },
            { nombre: "Sentidos mejorados", nivel: 80 },
            { nombre: "Liderazgo", nivel: 82 },
        ],
        descripcion: "Black Panther es T'Challa, rey de Wakanda, protegido por un traje de vibranio y habilidades felinas potenciadas.",
        bando: "Heroe",
        universo: "Marvel Comics",
        niveldefuerza: 76,
        activo: true,
        colorPrincipal: "#6c3fa8",
        colorSecundario: "#b8bec9",
    },
    {
        id: 10,
        nombre: "Aquaman",
        imagen: "img/aquaman.svg",
        edad: 34,
        poderes: [
            { nombre: "Control de la vida marina", nivel: 90 },
            { nombre: "Superfuerza", nivel: 82 },
            { nombre: "Resistencia bajo el agua", nivel: 95 },
            { nombre: "Natación", nivel: 92 },
            { nombre: "Uso del tridente", nivel: 85 },
        ],
        descripcion: "Aquaman es Arthur Curry, rey de Atlantis, con fuerza sobrehumana y la capacidad de comunicarse con la vida marina.",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 84,
        activo: true,
        colorPrincipal: "#d9731c",
        colorSecundario: "#1c8f8f",
    },
];
