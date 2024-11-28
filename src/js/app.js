document.addEventListener('DOMContentLoaded', StartApp);

function StartApp() {
    noneSelect(); // Eliminar boton
    initMap(); // Inicializa el mapa al cargar la página
    detectScroll();
    scroll();
    scrollheader();
}

function noneSelect() {
    const btn = document.getElementById('contacto');
    const ruta = window.location.pathname;

    if (ruta == "/contacto.html") {
        btn.style.display = "none";
    } 
}

function initMap() {
    const lat = 19.9787, lng = -99.1639; // Coordenadas de Apaxco

    // Crear el contenedor del mapa
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('No se encontró el elemento #map');
        return;
    }

    // Inicializar el mapa
    const map = L.map('map').setView([lat, lng], 13);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Agregar marcador
    L.marker([lat, lng]).addTo(map)
        .bindPopup('Apaxco, Estado de México')
        .openPopup();
}

function detectScroll(){
    const section = document.querySelector('.conocimiento');
    console.log(section)

    document.addEventListener('scroll', () => {
        const position = section.getBoundingClientRect();
        if(position.top<window.innerHeight && position.bottom >= 0){
            section.classList.add('visible')
        }
    });
}

function scroll(){
    const link = document.querySelector(".linkabout")
    const seccion = document.querySelector(".content-about")
    link.addEventListener('click', function(e){
        e.preventDefault();
        seccion.scrollIntoView({
            behavior: 'smooth'
        });
    })
}

function scrollheader() {
    const footer = document.querySelector(".footer");
    const aboutSection = document.querySelector("#about");

    window.addEventListener("scroll", () => {
        // Obtener la posición del scroll y la sección "about"
        const scrollPosition = window.scrollY; // Posición actual del scroll
        const aboutPosition = aboutSection.offsetTop; // Posición de inicio de la sección "about"

        if (scrollPosition >= aboutPosition) {
            footer.classList.add("header-visible"); // Mostrar como header
        } else {
            footer.classList.remove("header-visible"); // Ocultar el footer
        }
    });
}


