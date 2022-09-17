

//-------------ACCIONES------------------------  
let tabla_productos = document.getElementById("pr_tabla");
let btn_pr_crear = document.getElementById("btn_pr_crear");
let btn_login = document.getElementById("btn_login")
let btn_search_box = document.getElementById("pr_search_box");
let read_file = document.getElementById('pr_fileimg');
let tier_item = document.getElementById("pr_item_tier");
let scroll_bar = document.getElementById("top");
let titulo_usuario = document.getElementById("titulo_usuario")
let DOM_productosAdmin = document.querySelector(".productosAdmin");
let DOM_productosUI = document.querySelector(".productosUI");
const query = new URLSearchParams(window.location.search)
let id = query.get('id');


//-------------ARRAYS Y CLASES------------------------
let usuarios = [{
    name: "admin",
    pass: "admin"
}]

let lista_productos = [];
let lista_pr_img = [];

//boton para crear un producto
if(btn_pr_crear){
    btn_pr_crear.addEventListener("click", set_datos);
}

//boton para logiarse
if(btn_login){
    btn_login.addEventListener("click", (e)=>{
        e.preventDefault();
        check_login()
    })
}

//boton de busqueda en el panel admin
if (btn_search_box){
    btn_search_box.addEventListener("keyup", ()=>{ search(tabla_productos) });
}

if(titulo_usuario){
    let usuarios_on = [...usuarios];
    titulo_usuario.innerHTML = `Panel de ${usuarios_on[0].name}`
}

//guarda la direccion src en string de una imagen en un array
if(read_file){
    read_file.addEventListener('change', (e)=>{
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            let base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
            lista_pr_img.push(base64String);
        };
    reader.readAsDataURL(file);
    })
}

class Producto{
    constructor(id, nombre, precio, desc, stock, categoria, file, oldprice){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.desc = desc;
        this.stock = stock;
        this.categoria = categoria;
        this.file = file;
        this.oldprice = oldprice;
    }
    show_producto(){
        console.log("-------------Producto creado con exito--------------");
        console.log("El nombre del producto es: ", this.nombre);
        console.log("El precio ingresado es: ", "$", this.precio);
        console.log("La cantidad de stock ingresada es: ", this.stock);
        console.log("El id del producto generado es: ", this.id);
        console.log("El desc del producto es: ", this.desc);
        console.log("La categoria del producto es: ", this.categoria);
        console.log("El precio con el descuento es:", this.oldprice);
    }
}

//guarda en la variable length la cantidad de digitos de un entero
function validate_num(num){
    let length = ~~(Math.log(num) / Math.LN10 + 1); 
    return length;
}

//valida un string en que contenga algun caracter de letra
//function validate_str(value){
//    var regex = /^[a-zA-Z]+$/.test(value);
//    return regex;
//}

//genera un numero random entre 10000 y 99999 para el id del producto
function generar_random_id(arr){
    let random = parseInt(Math.random() * (99999 - 10000) + 10000);
    if(arr.some(buscar => buscar.id === random)){
        while(arr.some(buscar => buscar.id === random) || isNaN(random) == true || validate_num(random) != 5){
            alert ("El ID ya existe, tenes que generar uno manualmente \nTiene que ser de 5 cifras");
            random = prompt("Ingrese un ID usted manualmente \nPara volver al menu ingrese 'VOLVER'");
            a = random;
            random = parseInt(random);
            if(a == "VOLVER") return;
        }
    return random;
    }
    else{
        return random;
    }
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

// funcion para crear producto
//chequea que se ingresen los datos necesarios
function set_datos () {
    let pr_nombre = document.getElementById("pr_nombre").value;
    if(typeof pr_nombre != "string" || pr_nombre == ""){
        return;
    }
    let pr_precio = parseFloat(document.getElementById("pr_precio").value);
    if(isNaN(pr_precio) == true || pr_precio == ""){
        return;
    }
    let pr_descuento = parseInt(document.getElementById("pr_descuento").value);
    if(isNaN(pr_descuento) == true || pr_descuento == ""){
        return;
    }
    let pr_stock = parseInt(document.getElementById("pr_stock").value);
    if(isNaN(pr_stock) == true || pr_stock == ""){
        return;
    }
    let pr_categoria = document.getElementById("pr_categoria").value;
    if(typeof pr_categoria != "string" || pr_categoria == ""){
        return;
    }

    let pr_id = generar_random_id(lista_productos);
    if(!pr_id){
        return;
    }

    if(!lista_pr_img[0]){
        return;
    }

//los valores de precio los convierte en numeros con . ej: 1000.15  1.000,15
    pr_oldprice = pr_precio + (pr_precio * (pr_descuento / 100));
    pr_oldprice = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(pr_oldprice)
    pr_precio = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(pr_precio)

    let datos = new Producto(pr_id, pr_nombre, pr_precio, pr_descuento, pr_stock, pr_categoria, lista_pr_img[0], pr_oldprice)

    lista_productos.push(datos);
    datos.show_producto();

    let JSON_generar_producto = JSON.stringify(lista_productos);
    localStorage.setItem("productos", JSON_generar_producto);
}

//recoje los datos guardados en el local storage
function get_datos(){
    let recibir_producto = localStorage.getItem("productos");
    if(recibir_producto){
        recibir_producto = JSON.parse(recibir_producto);
        for(let productos of recibir_producto){
            lista_productos.push(productos);
        }
    }
    else{
        console.log("No existen productos")
    }
}

//crea una table en el panel admin, donde se puede ver el producto
//la imagen se puede ver en un modal completamente sola la imagien
function pr_tabla_admin(){
    if(tabla_productos){
        for (let producto of lista_productos){
            let img_id = producto.nombre + producto.id;
            let file_img = `data:image/png;base64,${producto.file}`;
            let th_producto = document.createElement("tr");
            th_producto.classList.add("pr_items");
            th_producto.innerHTML = `<td class="align-middle text-primary pr_id">${producto.id}</td>
                                    <td class="align-middle text-primary pr_name">${producto.nombre}</td>
                                    <td class="align-middle text-primary"><span class="text-primary">$</span> ${producto.precio}</td>
                                    <td class="align-middle text-primary">${producto.desc} <span class="text-primary">%</span> </td>
                                    <td class="align-middle text-primary">${producto.stock}</td>
                                    <td class="align-middle text-primary pr_categoria">${producto.categoria}</td>
                                    <td class="d-flex justify-content-center">
                                    <div class="table_img">
                                    <img id="${producto.id}" class="btn" src="${file_img}" alt="" style="max-height: 75px;">
                                    </div>
                                    <div id="${producto.nombre}" class="modal-img">
                                    <span class="close-img">&times;</span>
                                    <div class="d-flex justify-content-center">
                                    <img class="modal-content-id" id="${img_id}"></div>
                                    </div>
                                    </div>
                                    </td>`
            tabla_productos.append(th_producto);
            let modal = document.getElementById(producto.nombre);
            let pr_img = document.getElementById(producto.id);
            let modalImg = document.getElementById(img_id);
            pr_img.onclick = function(){
                modal.style.display = "block";
                modalImg.src = this.src;
            }
            let btns_modal = modal.getElementsByClassName("close-img");
            for (let i = 0; i < btns_modal.length; i++) {
                btns_modal[i].addEventListener("click", function(){
                    modal.style.display = "none";
                });
            }              
        }
    }
}


//se puede usar el buscador de arriba en el panel admin, se puede buscar por nombre, id y categoria
function search(el){
    let search_box = document.getElementById("pr_search_box").value;
    let pr_producto = document.querySelectorAll(".pr_items");
    let pr_name = el.getElementsByClassName("pr_name");
    let pr_id = el.getElementsByClassName("pr_id");
    let pr_categoria = el.getElementsByClassName("pr_categoria");

    for (let i = 0; i < pr_id.length || i < pr_name.length || i < pr_categoria.length; i++){
        let acc_search_name = pr_producto[i].getElementsByClassName("pr_name")[0];
        let acc_search_id = pr_producto[i].getElementsByClassName("pr_id")[0];
        let acc_search_categoria = pr_producto[i].getElementsByClassName("pr_categoria")[0];
        if (acc_search_name || acc_search_id || acc_search_categoria){
            let text_search = acc_search_name.textContent || acc_search_name.innerHTML;
            let text_search_id = acc_search_id.textContent || acc_search_id.innerHTML;
            let text_search_categoria = acc_search_categoria.textContent || acc_search_categoria.innerHTML;
            if (text_search.toUpperCase().indexOf(search_box.toUpperCase()) > -1){
                pr_producto[i].style.display = "";
            }
            else if (text_search_id.indexOf(search_box) > -1){
                pr_producto[i].style.display = "";
            }
            else if (text_search_categoria.toUpperCase().indexOf(search_box.toUpperCase()) > -1){
                pr_producto[i].style.display = "";
            }
            else{
                pr_producto[i].style.display = "none";
            }
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


class Render {
    render_productosAdmin(productos){
        let result = "";
        productos.forEach(producto => {
            let file_img = `data:image/png;base64,${producto.file}`;
            result += `<div class="col">
            <div class="card gn_main-card text-center">
            <h5 class="card-title mt-2">${producto.nombre}</h5>
            <a href="">
            <img src="${file_img}" alt="...">
            </a>
            <div class="card-body">
            <div class="card-oldprice">
            <span class="h6">$</span>
            <span class="h6">${producto.oldprice}</span>
            </div>
            <div class="card-newprice">
            <span class="h4">$</span>
            <span class="h4">${producto.precio}</span>
            <span class="card-newprice-off">${producto.desc}% OFF</span>
            </div>    
            </div>
            </div>
            </div>
            </div>`
        });
        DOM_productosAdmin.innerHTML = result;
    }
    render_productosUI(productos){
        let result = "";
        let path = window.location.pathname;
        let page = path.split("/").pop();
        let productos_filter = productos.filter(el => el.categoria.toLowerCase() === page.toLowerCase()) ;
        productos_filter.forEach(producto =>{
            let file_img = `data:image/png;base64,${producto.file}`;
            result += `<div id="producto_id_${producto.id}" class="col">
            <div class="card gn_main-card text-center">
            <h5 class="card-title mt-2">${producto.nombre}</h5>
            <a href="${path}.html?id=${producto.id}">
            <img src="${file_img}" alt="...">
            </a>
            <div class="card-body">
            <div class="card-oldprice">
            <span class="h6">$</span>
            <span class="h6">${producto.oldprice}</span>
            </div>
            <div class="card-newprice">
            <span class="h4">$</span>
            <span class="h4">${producto.precio}</span>
            <span class="card-newprice-off">${producto.desc}% OFF</span>
            </div>    
            </div>
            <div class="card-footer gn_main-propag-item">
            <div class="d-flex justify-content-center">
            <a href="" data-bs-toggle="modal" data-bs-target="#modal_medios-pagos">
            <p class="mb-1 mt-1">Hasta 12 cuotas sin interés</p>
            </a>
            </div>
            </div>
            </div>
            </div>`
        });
        DOM_productosUI.innerHTML = result;
    }
    render_productoID(productos){
        let result = "";
        let productos_filter = lista_productos.filter(el => el.id == productos) ;
        productos_filter.forEach(producto =>{
            let file_img = `data:image/png;base64,${producto.file}`;
            result += `<div id="producto_id_${producto.id}" class="col">
            <div class="card gn_main-card text-center">
            <h5 class="card-title mt-2">${producto.nombre}</h5>
            <a href="">
            <img src="${file_img}" alt="...">
            </a>
            <div class="card-body">
            <div class="card-oldprice">
            <span class="h6">$</span>
            <span class="h6">${producto.oldprice}</span>
            </div>
            <div class="card-newprice">
            <span class="h4">$</span>
            <span class="h4">${producto.precio}</span>
            <span class="card-newprice-off">${producto.desc}% OFF</span>
            </div>    
            </div>
            <div class="card-footer gn_main-propag-item">
            <div class="d-flex justify-content-center">
            <a href="" data-bs-toggle="modal" data-bs-target="#modal_medios-pagos">
            <p class="mb-1 mt-1">Hasta 12 cuotas sin interés</p>
            </a>
            </div>
            </div>
            </div>
            </div>`
        });
        DOM_productosUI.innerHTML = result;
    }
}


//-------------FUNCIONES GENERALES------------------------
document.addEventListener("DOMContentLoaded", function(){
    get_datos();
    pr_tabla_admin();
    scrollFunction();
    let ui = new Render();
    if(DOM_productosAdmin){
        ui.render_productosAdmin(lista_productos);
    }
    if(DOM_productosUI){
    if (id){
        ui.render_productoID(id);
    }
    else{
        ui.render_productosUI(lista_productos);
    }
    }
});

