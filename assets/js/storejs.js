

//-------------ACCIONES------------------------  

let tabla_productos = document.getElementById("pr_tabla"),
btn_pr_crear = document.getElementById("btn_pr_crear"),
btn_login = document.getElementById("btn_login"),
btn_search_box = document.getElementById("pr_search_box"),
read_file = document.getElementById('pr_fileimg'),
tier_item = document.getElementById("pr_item_tier"),
scroll_bar = document.getElementById("top"),
titulo_usuario = document.getElementById("titulo_usuario"),
DOM_productosAdmin = document.querySelector(".productosAdmin"),
DOM_productosUI = document.querySelector(".productosUI"),
DOM_quanty = document.querySelector(".block_quantity__number");


//-------------ARRAYS Y CLASES------------------------
let usuarios = [{
    name: "admin",
    pass: "admin"
}]

let lista_productos = [];
let lista_pr_img = [];
let listaIMG = [];

//boton para crear un producto
if(btn_pr_crear){
    btn_pr_crear.addEventListener("click", (e)=>{
        e.preventDefault();
        set_datos();
    })
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


if(read_file){
    read_file.addEventListener('change', (e)=>{
        listaIMG.splice(0, listaIMG.length);
        let files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            listaIMG.push(files[i]);
        }
    })
}


class Producto{
    constructor(id, nombre, precio, desc, stock, categoria, oldprice){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.desc = desc;
        this.stock = stock;
        this.categoria = categoria;
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

function uploadFile (files, data) {
    let reader = new FileReader();
    reader.onloadend = () => {
        let base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
        let obj = {id: data, url: base64String};
        lista_pr_img.push(obj);
        let JSON_generar_img_pr = JSON.stringify(lista_pr_img);
        localStorage.setItem("imagenes", JSON_generar_img_pr);
    };
    reader.readAsDataURL(files);
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
        return Swal.fire({
            icon: 'error',
            title: 'Nombre incorrecto',
            text: 'Debes ingresar al menos algun caracter',
        });
    }
    let pr_precio = parseFloat(document.getElementById("pr_precio").value);
    if(isNaN(pr_precio) == true || pr_precio == ""){
        return Swal.fire({
            icon: 'error',
            title: 'Precio incorrecto',
            text: 'Debes ingresar precio, tiene que ser un numero',
        });
    }
    let pr_descuento = parseInt(document.getElementById("pr_descuento").value);
    if(isNaN(pr_descuento) == true || pr_descuento == ""){
        return Swal.fire({
            icon: 'error',
            title: 'Descuento incorrecto',
            text: 'Debes ingresar un descuento, tiene que ser un numero',
        });
    }
    let pr_stock = parseInt(document.getElementById("pr_stock").value);
    if(isNaN(pr_stock) == true || pr_stock == ""){
        return Swal.fire({
            icon: 'error',
            title: 'Stock incorrecto',
            text: 'Debes ingresar un descuento, tiene que ser un numero',
        });
    }
    let pr_categoria = document.getElementById("pr_categoria").value;
    if(typeof pr_categoria != "string" || pr_categoria == ""){
        return Swal.fire({
            icon: 'error',
            title: 'Categoria incorrecta',
            text: 'Debes ingresar una categoria',
        });
    }

    let pr_id = generar_random_id(lista_productos);
    if(!pr_id){
        return Swal.fire({
            icon: 'error',
            title: 'ID incorrecto',
            text: 'No se puedo generar un ID',
        });
    }

    for(let i = 0; i < listaIMG.length; i++){
        uploadFile(listaIMG[i], pr_id);
    }

//los valores de precio los convierte en numeros con . ej: 1000.15  1.000,15
    pr_oldprice = pr_precio + (pr_precio * (pr_descuento / 100));
    pr_oldprice = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(pr_oldprice)
    pr_precio = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(pr_precio)

    let datos = new Producto(pr_id, pr_nombre, pr_precio, pr_descuento, pr_stock, pr_categoria, pr_oldprice);

    lista_productos.push(datos);
    datos.show_producto();

    Toastify({
        text: "Producto creado con exito",
        duration: 3000,
        style: {
            background: "green",
        }
    }).showToast();

    let JSON_generar_producto = JSON.stringify(lista_productos);
    localStorage.setItem("productos", JSON_generar_producto);

    const asdasd = {...lista_productos};
    fetch('http://localhost:3000/productos', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asdasd),
      })
        .then((response) => response.json())
        .then((asdasd) => {
          console.log('Success:', asdasd);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
}

//recoje los datos guardados en el local storage
function get_datos(){
    let recibir_producto = localStorage.getItem("productos");
    let recibir_img = localStorage.getItem("imagenes");
    if(recibir_producto){
        recibir_producto = JSON.parse(recibir_producto);
        for(let productos of recibir_producto){
            lista_productos.push(productos);
        }
        recibir_img = JSON.parse(recibir_img);
        for(let productos of recibir_img){
            lista_pr_img.push(productos);
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
            let filter_img = lista_pr_img.filter(el => el.id == producto.id);
            for (let url_img of filter_img){
                var file_img = `data:image/png;base64,${url_img.url}`;
            }
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
            let filter_img = lista_pr_img.filter(el => el.id == producto.id);
            for (let url_img of filter_img){
                var file_img_render = `data:image/png;base64,${url_img.url}`;
            }
            let nombre_url = producto.nombre.split(' ').join('-');
            nombre_url = nombre_url.toLowerCase();
            console.log(nombre_url);
            result += `<div id="producto_id_${producto.id}" class="col">
            <div class="card gn_main-card text-center">
            <h5 class="card-title mt-2">${producto.nombre}</h5>
            <a href="${path}.html?=${nombre_url}">
            <img src="${file_img_render}" alt="...">
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
        let div_producto = document.createElement("div");
        if(page == "celulares" || page == "computadoras"){
            div_producto.className = "row row-cols-1 row-cols-md-3 g-4 gn_main-card-tier"
        }
        else{
            div_producto.className = "row row-cols-2 row-cols-md-4 g-4 acc gn_main-card-tier"
        }
        div_producto.innerHTML = result;
        DOM_productosUI.append(div_producto);
    }
    render_productoID(producto){
        var result = "";
        var div_prod = document.createElement("div");
        let productos_filter = lista_productos.filter(el => el.nombre.toLowerCase() == producto) ;
        productos_filter.forEach(producto =>{
            let filter_img = lista_pr_img.filter(el => el.id == producto.id);
            for (let url_img of filter_img){
                var file_img_producto = `data:image/png;base64,${url_img.url}`;
                var result2 = "";
                div_prod = document.createElement("div");
                div_prod.className = "sliderBlock p-3"
                result2 += `<ul class="sliderBlock_items p-0 m-0">
                <li class="sliderBlock_items__itemPhoto sliderBlock_items__showing">
                <img src="/assets/img/FUNDA-SAMSUNG.png" alt="headphones">
                </li>
                <li class="sliderBlock_items__itemPhoto">
                <img src="/assets/img/AURICULARES.png"  alt="headphones">
                </li>
                <li class="sliderBlock_items__itemPhoto">
                <img src="/assets/img/SMARTS20.png"  alt="headphones">
                </li>
                <li class="sliderBlock_items__itemPhoto">
                <img src="/assets/img/SMARTX30.png"  alt="headphones">
                </li>
                <li class="sliderBlock_items__itemPhoto">
                <img src="/assets/img/SMARTWATCH 1.png"  alt="headphones">
                </li>
                </ul>
                <div class="sliderBlock_controls">
                <div class="sliderBlock_controls__navigatin">
                <div class="mt-3">
                <div class="sliderBlock_controls__arrowBackward">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </div>
                <div class="sliderBlock_controls__arrowForward">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </div>
                </div>
                </div>
                <ul class="sliderBlock_positionControls p-0 m-0">
                <li class="sliderBlock_positionControls__paginatorItem sliderBlock_positionControls__active"></li>
                <li class="sliderBlock_positionControls__paginatorItem"></li>
                <li class="sliderBlock_positionControls__paginatorItem"></li>
                <li class="sliderBlock_positionControls__paginatorItem"></li>
                <li class="sliderBlock_positionControls__paginatorItem"></li>
                </ul>
                </div>
                </div>
                </div>`
                div_prod.innerHTML = result2;
            }
            result += `<div class="productCard_block carousel-dark p-0 mb-5">
                        <div class="row m-0">
                        <div class="col-sm-12 col-lg-6 p-0">
                        <div class="productCard_leftSide">
                        <div class="productCard_brendBlock">
                        <a class="productCard_brendBlock__imageBlock" href="#">
                        <img src="https://github.com/BlackStar1991/CardProduct/blob/master/app/img/brtendsLogos/logo_sennheiser.png?raw=true" alt="sennheiser">
                        </a>
                        </div>
                        <div class="col-sm-12 col-lg-6 p-0">
                        <div class="productCard_rightSide">
                        <p class="block_model">
                        <span class="block_model__text">Model: </span>
                        <span class="block_model__number">505795</span>
                        </p>
                        <div class="block_product">
                        <h2 class="block_name block_name__mainName">MOMENTUM<sup>&reg; </sup></h2>
                        <h2 class="block_name block_name__addName">Wireless Black</h2>
                        <p class="block_product__advantagesProduct">
                        Wireless headphones with integrated microphone
                        </p>
                        <div class="block_informationAboutDevice">
                        <div class="block_descriptionInformation">
                        <span>Peak performance with active noise cancelation. Sennheiser's new MOMENTUM Wireless
                        - Closed circumauralheadphone featuring <a class="block_product__link"
                        href="#">Bluetooth<sup>&reg;</sup></a>  wireless technology and NoiseGard Hybrid active noise cancelation
                        </span>
                        </div>
                        <div class="row mt-3">
                        <div class="col-lg-6 col-sm-12 py-2">
                        <div class="block_price">
                        <p class="block_price__currency">$499.95</p>
                        <a href="">Medios de envio</a>
                        </div>
                        <div class="block_quantity mt-4">
                        <span class="text_specification">Cantidad</span>
                        <div class="block_quantity__chooseBlock">
                        <input class="block_quantity__number" name="quantityNumber"
                        type="text" min="1" value="1">
                        </div>
                        </div>
                        </div>
                        <div class="col-lg-6 col-sm-12 py-2">
                        <div class="block_goodColor">
                        <span class="text_specification">Colores disponibles:</span>
                        <div class="block_goodColor__allColors">
                        <input type="radio" name="colorOfItem" class="radio_button" id="radioColor" checked/>
                        <label for="radioColor" class="block_goodColor__radio block_goodColor__black"></label>
                        <input type="radio" name="colorOfItem" class="radio_button" id="radioColor2"/>
                        <label for="radioColor2" class="block_goodColor__radio block_goodColor__silver"></label>
                        </div>
                        </div>
                        <button class="btn btn-outline-dark mt-5"> Agregar al carro </button> </div>
                        </div>
                        </div>
                        </div>
                        </div>
                        </div>
                        <div class="col-12 product-info-tabs px-0">
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Caracteristicas</button>
                        </li>
                        <li class="nav-item" role="presentation">
                        <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Profile</button>
                        </li>
                        <li class="nav-item" role="presentation">
                        <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Contact</button>
                        </li>
                        </ul>
                        <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio similique porro facere vel sapiente facilis, nobis debitis fuga commodi perferendis aspernatur officiis tempora eaque laborum placeat odit velit eos sint. Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim accusantium ad provident minus commodi repudiandae magnam voluptate illum assumenda. Totam, modi odio exercitationem eaque provident magnam ullam architecto maxime numquam.</div>
                        <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, at dolores. Dolor dolores quo consectetur pariatur voluptatibus nesciunt quod eos architecto porro, vel doloribus incidunt temporibus dignissimos atque aspernatur corporis.</div>
                        <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic, explicabo nisi. Fuga, quos dolor repellat excepturi fugit molestiae rem ratione doloremque pariatur ullam? Recusandae voluptatum consectetur ad dolorum eum reiciendis?</div>
                        </div>
                        </div>
                        </div>
                        </div>`
        });
        let div_producto = document.createElement("div");
        div_producto.className = "row"
        div_producto.innerHTML = result;
        div_producto.appendChild(div_prod);
        DOM_productosUI.append(div_producto);
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
        const query = new URLSearchParams(window.location.search);
        let id = query.get('');
        if (id){
            id = id.split('-').join(' ');
            ui.render_productoID(id);
        }
        else{
            ui.render_productosUI(lista_productos);
        }
    }
});
