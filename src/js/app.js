document.addEventListener('DOMContentLoaded', StartApp);

function StartApp(){
    noneSelect();
}

function noneSelect(){
    const btn = document.getElementById('contacto');
    const ruta = window.location.pathname;

    if(ruta == "/contacto.html"){
       btn.style.display = "none";
    } else {
       btn.style.display = "block";
    }
}

