

//-------------ACCIONES------------------------  

let btn_login = document.getElementById("btn_login"),
scroll_bar = document.getElementById("top"),
titulo_usuario = document.getElementById("titulo_usuario");

//-------------ARRAYS Y CLASES------------------------
let usuarios = [{
    name: "admin",
    pass: "admin"
}]

//boton para logiarse
if(btn_login){
    btn_login.addEventListener("click", (e)=>{
        e.preventDefault();
        check_login()
    })
}

//login simple
function check_login (){
    let usuario = document.getElementById("acc_login").value
    let password = document.getElementById("acc_password").value

    for(let i = 0; i < usuarios.length; i++){
        if(usuario == usuarios[i].name && password == usuarios[i].pass){
            window.location.href="/account/admin.html";
        }
        else{
            alert("Usuario incorrecto")
        }
    }
}

//funcion que esconde el navbar de las paginas principales cuando haces scroll para abajo, al subir automaticamente lo despliega de nuevo
function scrollFunction() {
    if (scroll_bar){
        let prevScrollpos = window.pageYOffset;
        window.onscroll = function() {
            if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                let navbar = document.getElementById('top');
                let currentScrollPos = window.pageYOffset;
                //funcion ternario
                prevScrollpos > currentScrollPos ? navbar.classList.remove("scrolled") : navbar.classList.add("scrolled");
                prevScrollpos = currentScrollPos;
            }
        }
    }
}


//-------------FUNCIONES GENERALES------------------------
document.addEventListener("DOMContentLoaded", function(){
    scrollFunction();
});
