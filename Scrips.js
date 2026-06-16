// ==============================
// CAPTURAMOS ELEMENTOS DEL HTML
// ==============================

const inputPais = document.getElementById("inputpais");
const botonBuscar = document.getElementById("botonbuscar");
const botonFavorito =document.getElementById("botonFavorito");

const temperatura = document.getElementById("temperatura");
const estadoClima = document.getElementById("estadoClima");
const humedad = document.getElementById("humedad");
const viento = document.getElementById("viento");

const btnTema = document.getElementById("btnTema");

const traducciones = {

    "españa": "spain",
    "japon": "japan",
    "alemania": "germany",
    "francia": "france",
    "italia": "italy",
    "estados unidos": "united states",
    "reino unido": "united kingdom",
    "corea del sur": "south korea",
    "china": "china",
    "rusia": "russia",
    "brasil": "brazil",
     "corea del sur": "south korea",
    "corea del norte": "north korea"

};

const regiones = {

    "South America": "América del Sur",
    "North America": "América del Norte",
    "Central America": "América Central",
    "Europe": "Europa",
    "Asia": "Asia",
    "Africa": "África",
    "Oceania": "Oceanía"

};

const monedas = {

    "US Dollar": "Dólar estadounidense",
    "Colombian Peso": "Peso colombiano",
    "Euro": "Euro",
    "Japanese Yen": "Yen japonés",
    "Brazilian Real": "Real brasileño",
    "Mexican Peso": "Peso mexicano",
    "Pound Sterling": "Libra esterlina",
    "Chinese Yuan": "Yuan chino",
    "Canadian Dollar": "Dólar canadiense",
    "Australian Dollar": "Dólar australiano",
    "Swiss Franc": "Franco suizo",
    "Russian Ruble": "Rublo ruso"

};

const idiomasTraducidos = {

    "English": "Inglés",
    "Spanish": "Español",
    "French": "Francés",
    "German": "Alemán",
    "Japanese": "Japonés",
    "Chinese": "Chino",
    "Portuguese": "Portugués",
    "Italian": "Italiano",
    "Russian": "Ruso",
    "Arabic": "Árabe",
    "Korean": "Coreano"

};

const cantidad = document.getElementById("cantidad");
const monedaOrigen = document.getElementById("monedaOrigen");
const monedaDestino = document.getElementById("monedaDestino");
const botonConvertir = document.getElementById("botonConvertir");
const resultadoConversion = document.getElementById("resultadoConversion");
botonConvertir.addEventListener("click", convertirMoneda);

//Favoritos
let paisActual = "";
let favoritos =
JSON.parse(localStorage.getItem("favoritos")) || [];
document.getElementById("totalfavoritos").textContent =
    favoritos.length;

// Historial
let historial =
JSON.parse(localStorage.getItem("historial")) || [];
document.getElementById("totalpaises").textContent =
    historial.length;


let atraccionesFavoritas =
JSON.parse(localStorage.getItem("atraccionesFavoritas")) || [];

document.getElementById("totalatraccionesfav").textContent =
    atraccionesFavoritas.length;

const loginContainer =
document.getElementById("loginContainer");

const inputNombre =
document.getElementById("inputNombre");

const btnIngresar =
document.getElementById("btnIngresar");

const saludoUsuario =
document.getElementById("saludoUsuario");

// =========================
// VERIFICAR USUARIO GUARDADO
// =========================

let nombreUsuario =
localStorage.getItem("nombreUsuario");

if(
    nombreUsuario &&
    nombreUsuario !== "null" &&
    nombreUsuario.trim() !== ""
){

    loginContainer.style.display = "none";

    saludoUsuario.innerHTML =
    `¡Hola <span class="nombreUsuario">${nombreUsuario}</span>, qué gusto tenerte aquí!`;

}

// =========================
// LOGIN
// =========================

btnIngresar.addEventListener("click", function(){

    const nombre =
    inputNombre.value.trim();

    if(nombre === ""){

        alert("Ingresa tu nombre");

        return;

    }

    localStorage.setItem(
        "nombreUsuario",
        nombre
    );

    saludoUsuario.innerHTML =
    `¡Hola <span class="nombreUsuario">${nombre}</span>, qué gusto tenerte aquí!`;

    loginContainer.style.display = "none";

});

    ///Mostar datos
    mostrarFavoritos();
    mostrarAtraccionesFavoritas();
    actualizarAtraccionesDashboard();
    mostrarHistorial();

botonFavorito.addEventListener(
    "click",
    agregarFavorito
);

const temaGuardado =
localStorage.getItem("tema");

if(temaGuardado === "oscuro"){

    document.body.classList.add("dark-mode");

}


// ==============================
// EVENTO DEL BOTÓN BUSCAR
// ==============================


botonBuscar.addEventListener("click", function(event){

    // Evita que el formulario recargue la página
    event.preventDefault();

    // Obtiene el nombre escrito por el usuario
    let paisBuscado =
    inputPais.value.toLowerCase();

    if(traducciones[paisBuscado]){
        paisBuscado =
            traducciones[paisBuscado];
    }

    console.log("País buscado:", paisBuscado);

    // Busca la información del país
    buscarPais(paisBuscado);

});

// ==============================
// FUNCIÓN PARA BUSCAR UN PAÍS
// ==============================

async function buscarPais(nombrePais){

    try{

        // ==================================
        // PRIMERA CONSULTA
        // Buscar país y obtener su código
        // ==================================

        const respuesta = await fetch(
            `https://geoapi.info/api/countries/search?q=${nombrePais}`
        );

        const datos = await respuesta.json();

        // Primer resultado encontrado
        const pais = datos.results[0];

        // Código del país (CO, JP, US, etc.)
        const codigoPais = pais.code;

        console.log("Código encontrado:", codigoPais);

        // ==================================
        // SEGUNDA CONSULTA
        // Obtener información completa
        // ==================================

        const respuestaDetalle = await fetch(
            `https://geoapi.info/api/country?code=${codigoPais}`
        );

        const detallePais = await respuestaDetalle.json();

        // Activar tarjetas cuando haya información
        document.getElementById("panelpais")
            .classList.add("activo");

        document.getElementById("clima")
            .classList.add("activo");

        //Esto es para favoritos
        paisActual = detallePais.name;
        if(!historial.includes(paisActual)){
        historial.push(paisActual);
        localStorage.setItem(
                "historial",
            JSON.stringify(historial)
         );

    document.getElementById("totalpaises").textContent =
        historial.length;

}

        
        document.getElementById("mensajePais").style.display = "none";

        document.getElementById("contenidoPais").style.display = "block";

        // ==============================
        // GUARDAR EN HISTORIAL
        // ==============================

        
        historial.push(detallePais.name);
        localStorage.setItem(
        "historial",
        JSON.stringify(historial)
        );

actualizarDashboard();

        // Traducción de región
        const regionTraducida =
        regiones[detallePais.continent] ||
        detallePais.continent;

        // Traducción de moneda
        const monedaTraducida =
        monedas[detallePais.currencyName] ||
        detallePais.currencyName;

        console.log(detallePais);

        // ==================================
        // MOSTRAR DATOS DEL PAÍS
        // ==================================

        document.getElementById("nombrePais").textContent =
            detallePais.name;

        document.getElementById("capitalPais").textContent =
            "Capital: " + detallePais.capitalCity;

        document.getElementById("regionPais").textContent =
            "Región: " + regionTraducida;

        document.getElementById("poblacionPais").textContent =
            "Población: " +
            detallePais.population.toLocaleString();

        document.getElementById("monedaPais").textContent =
            "Moneda: " + monedaTraducida;

        //Idioma de paises
       let idiomas = detallePais.languages
         .slice(0, 2)
         .map(idioma =>
            idiomasTraducidos[idioma] || idioma
        )
        .join(", ");

        if(detallePais.languages.length > 2){
        idiomas += "...";
        }

        document.getElementById("idiomaPais").textContent =
        "Idiomas: " + idiomas;

        // Mostrar bandera

        document.getElementById("banderaPais").src =
            "https://geoapi.info" +
            detallePais.flags.rectangular;

        // ==================================
        // OBTENER COORDENADAS DEL PAÍS
        // ==================================

        const latitud =
            (detallePais.coordinates.north +
             detallePais.coordinates.south) / 2;

        const longitud =
            (detallePais.coordinates.east +
             detallePais.coordinates.west) / 2;

        console.log("Latitud:", latitud);
        console.log("Longitud:", longitud);

        // ==================================
        // BUSCAR CLIMA DEL PAÍS
        // ==================================

        buscarClima(latitud, longitud);
        buscarAtracciones(latitud, longitud);

        document.getElementById("mensajeClima").style.display = "none";
        document.getElementById("contenidoClima").style.display = "block";

    }catch(error){

        console.log("Error:", error);

    }

}

// ==============================
// FUNCIÓN PARA OBTENER EL CLIMA
// ==============================

async function buscarClima(latitud, longitud){

    try{

        const respuesta = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );

        const datos = await respuesta.json();

        console.log(datos);

        // ==========================
        // CÓDIGO DEL CLIMA
        // ==========================

        const codigo = datos.current.weather_code;

        let estado = "";

        if(codigo === 0){
            estado = "☀️ Despejado";
        }
        else if(codigo === 1){
            estado = "🌤️ Mayormente despejado";
        }
        else if(codigo === 2){
            estado = "⛅ Parcialmente nublado";
        }
        else if(codigo === 3){
            estado = "☁️ Nublado";
        }
        else if(codigo === 45){
            estado = "🌫️ Neblina";
        }
        else if(codigo === 61){
            estado = "🌧️ Lluvia ligera";
        }
        else if(codigo === 63){
            estado = "🌧️ Lluvia moderada";
        }
        else if(codigo === 65){
            estado = "🌧️ Lluvia fuerte";
        }
        else{
            estado = "🌦️ Clima no disponible";
        }

        // ==========================
        // MOSTRAR DATOS DEL CLIMA
        // ==========================

        temperatura.textContent =
            datos.current.temperature_2m + " °C";

        estadoClima.textContent =
            estado;

        humedad.textContent =
            "💧 Humedad: " +
            datos.current.relative_humidity_2m +
            "%";

        viento.textContent =
            "💨 Viento: " +
            datos.current.wind_speed_10m +
            " km/h";

    }catch(error){

        console.log("Error:", error);

    }
}

//////
////Convertidor de moneda
//////

async function convertirMoneda(){

    try{

        const valor = cantidad.value;
        const origen = monedaOrigen.value;
        const destino = monedaDestino.value;

        if(valor === ""){

            resultadoConversion.textContent =
            "Ingrese una cantidad";

            return;

        }

        const respuesta = await fetch(
            "https://open.er-api.com/v6/latest/USD"
        );

        const datos = await respuesta.json();

        const tasaOrigen =
            datos.rates[origen];

        const tasaDestino =
            datos.rates[destino];

        const valorUSD =
            valor / tasaOrigen;

        const resultado =
            valorUSD * tasaDestino;

        resultadoConversion.textContent =
            `${valor} ${origen} = ${resultado.toFixed(2)} ${destino}`;

    }catch(error){

        console.log(error);

    }

}


// ==============================
// ACTUALIZAR DASHBOARD
// ==============================

function actualizarDashboard(){

    let historial = JSON.parse(
        localStorage.getItem("historial")
    ) || [];

    document.getElementById("totalpaises").textContent =
        historial.length;

}

function actualizarAtraccionesDashboard(){

    let atraccionesFavoritas =
    JSON.parse(
        localStorage.getItem("atraccionesFavoritas")
    ) || [];

    document.getElementById(
        "totalatraccionesfav"
    ).textContent =
    atraccionesFavoritas.length;

}
actualizarDashboard();

function agregarFavorito(){

    if(paisActual === ""){
        return;
    }

    if(favoritos.includes(paisActual)){

        alert("Este país ya lo agregaste a favoritos");
        return;

    }

    favoritos.push(paisActual);

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

    document.getElementById("totalfavoritos").textContent =
        favoritos.length;
        mostrarFavoritos();

}

function mostrarFavoritos(){

    const lista =
    document.getElementById("listaFavoritos");

    lista.innerHTML = "";

    favoritos.forEach(function(pais){

        const item =
        document.createElement("li");

        const texto =
        document.createElement("span");

        texto.textContent =
        "⭐ " + pais;

        const botonEliminar =
        document.createElement("button");

        botonEliminar.textContent = "❌";

        botonEliminar.addEventListener(
            "click",
            function(){

                eliminarFavorito(pais);

            }
        );

        item.appendChild(texto);
        item.appendChild(botonEliminar);

        lista.appendChild(item);

    });

}

function eliminarFavorito(pais){

    favoritos =
    favoritos.filter(function(item){

        return item !== pais;

    });

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

    document.getElementById(
        "totalfavoritos"
    ).textContent =
    favoritos.length;

    mostrarFavoritos();
   

}

async function buscarAtracciones(latitud, longitud){

    try{

        console.log("Buscando atracciones...");

        const respuesta = await fetch(
            `https://api.opentripmap.com/0.1/en/places/radius?radius=50000&lon=${longitud}&lat=${latitud}&limit=5&apikey=5ae2e3f221c38a28845f05b616f61748d2ba7764a23d003392340cc1`
        );

        console.log("Status:", respuesta.status);

        const datos = await respuesta.json();

        console.log("Datos:", datos);

        const listaAtracciones =
        document.getElementById("listaAtracciones");

        listaAtracciones.innerHTML = "";

        for(const lugar of datos.features){

    const xid = lugar.properties.xid;

    try{

        const respuestaDetalle = await fetch(
            `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=5ae2e3f221c38a28845f05b616f61748d2ba7764a23d003392340cc1`
        );

        const detalle = await respuestaDetalle.json();
        console.log(detalle);


        const nombre =
            detalle.name || "Sin nombre";

        const categoria =
            detalle.kinds
            ? detalle.kinds.split(",")[0]
            : "Sin categoría";

        const categorias = {
        view_points: "Mirador",
        museums: "Museo",
        architecture: "Arquitectura",
        historic_architecture: "Arquitectura histórica",
        interesting_places: "Lugar turístico"
        };

    const categoriaMostrar =
    categorias[categoria] || categoria;

        const descripcion =
    detalle.wikipedia_extracts?.text ||
    detalle.info?.descr ||
    `Lugar turístico de tipo ${categoria}`;

       console.log("Preview:", detalle.preview);
        console.log("Image:", detalle.image);

        const imagen =
            detalle.preview?.source ||
            detalle.image ||
    "       https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";

        const ubicacion =
        detalle.address
            ? `${detalle.address.county || ""}, ${detalle.address.state || ""}`
            : "Ubicación desconocida";

        const popularidad =
        detalle.rate || "Sin calificación";

        const card =
            document.createElement("div");

        card.classList.add("cardAtraccion");

        card.innerHTML = `
    <div class="atraccion-card">

        <img src="${imagen}" alt="${nombre}">

        <div class="info-atraccion">

            <h4>${nombre}</h4>

            <button class="btnFavoritoAtraccion">
                ❤️
            </button>

            <p class="ubicacion">
                📍 ${ubicacion}
            </p>

            <p class="categoria">
                🏞️ ${categoriaMostrar}
            </p>

            <p class="popularidad">
                ⭐ Nivel ${popularidad}
            </p>

        </div>

    </div>
`;

        listaAtracciones.appendChild(card);
        const botonFavorito = card.querySelector(".btnFavoritoAtraccion");
        
        botonFavorito.addEventListener("click", function(){

    let atraccionesFavoritas =
        JSON.parse(localStorage.getItem("atraccionesFavoritas")) || [];

    const existe = atraccionesFavoritas.some(
        atraccion => atraccion.nombre === nombre
    );

    if(existe){

        alert("Esta atracción ya está en favoritos");
        return;

    }

    atraccionesFavoritas.push({

        nombre: nombre,
        ubicacion: ubicacion,
        categoria: categoriaMostrar,
        nivel: popularidad

    });

    localStorage.setItem(
        "atraccionesFavoritas",
        JSON.stringify(atraccionesFavoritas)
    );

    actualizarAtraccionesDashboard();
    mostrarAtraccionesFavoritas();

    console.log("Atracción guardada");

});


    }catch(error){

        console.log(error);

    }

}
       
    }catch(error){

        console.log("Error OpenTripMap:", error);

    }

}

//Mostrar atracciones
function mostrarAtraccionesFavoritas(){

    let atraccionesFavoritas =
    JSON.parse(
        localStorage.getItem("atraccionesFavoritas")
    ) || [];

    const lista =
    document.getElementById(
        "listaAtraccionesFavoritas"
    );

    lista.innerHTML = "";

    atraccionesFavoritas.forEach(
        function(atraccion, indice){

            const li =
            document.createElement("li");

            li.innerHTML = `
                <strong>${atraccion.nombre}</strong>
                <br>
                📍 ${atraccion.ubicacion}
                <br>
                🏞️ ${atraccion.categoria}
                <br>
                ⭐ Nivel ${atraccion.nivel}

                <button
                    onclick="eliminarAtraccion(${indice})">
                    ❌
                </button>
            `;

            lista.appendChild(li);

        }
    );

}

function eliminarAtraccion(indice){

    let atraccionesFavoritas =
    JSON.parse(
        localStorage.getItem("atraccionesFavoritas")
    ) || [];

    atraccionesFavoritas.splice(
        indice,
        1
    );

    localStorage.setItem(
        "atraccionesFavoritas",
        JSON.stringify(
            atraccionesFavoritas
        )
    );

    actualizarAtraccionesDashboard();

    mostrarAtraccionesFavoritas();

}

btnTema.addEventListener("click", function(event){

    event.preventDefault();

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        localStorage.setItem(
            "tema",
            "oscuro"
        );

    }else{

        localStorage.setItem(
            "tema",
            "claro"
        );

    }

});


//Mostrar historial
function mostrarHistorial(){

    const historial =
    JSON.parse(
        localStorage.getItem("historial")
    ) || [];

    const lista =
    document.getElementById(
        "listaHistorial"
    );

    lista.innerHTML = "";

    historial.forEach(function(pais){

        const li =
        document.createElement("li");

        li.textContent = pais;

        lista.appendChild(li);

    });

}
