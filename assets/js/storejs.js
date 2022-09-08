//-------------FUNCIONES GENERALES------------------------
document.addEventListener("DOMContentLoaded", function(){
    get_datos();
    insertar_datos();
})

//-------------BOTONES------------------------
let btn_pr_crear = document.getElementById("btn_pr_crear");
if(btn_pr_crear){
    btn_pr_crear.addEventListener("click", set_datos);
}

let btn_login = document.getElementById("btn_login")
if(btn_login){
    btn_login.addEventListener("click", check_login)
}

const read_file = document.getElementById('pr_fileimg');
if(read_file){
    read_file.addEventListener('change', (e)=>{
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            var base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
            img.push(base64String);
        };
        reader.readAsDataURL(file);
    })
}

let img = [];
console.log(img);

//-------------ARRAYS Y CLASES------------------------
let usuarios = [{
    name: "admin",
    pass: "admin"
}]
let lista_productos = [];
class Producto{
    constructor(id, nombre, precio, desc, stock, categoria, file){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.desc = desc;
        this.stock = stock;
        this.categoria = categoria;
        this.file = file;
    }
    show_producto(){
        console.log("-------------Producto creado con exito--------------");
        console.log("El nombre del producto es: ", this.nombre);
        console.log("El precio ingresado es: ", "$", this.precio);
        console.log("La cantidad de stock ingresada es: ", this.stock);
        console.log("El id del producto generado es: ", this.id);
        console.log("El desc del producto es: ", this.desc);
        console.log("La categoria del producto es: ", this.categoria);
    }
}

//guarda en la variable length la cantidad de digitos de un entero
function validate_num(num){
    var length = ~~(Math.log(num) / Math.LN10 + 1); 
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

    let datos = new Producto(pr_id, pr_nombre, pr_precio, pr_descuento, pr_stock, pr_categoria, img[0])

    lista_productos.push(datos);
    datos.show_producto();

    let JSON_generar_producto = JSON.stringify(lista_productos);
    localStorage.setItem("productos", JSON_generar_producto);
}

function get_datos(){
    let recibir_producto = localStorage.getItem("productos");
    if(recibir_producto){
        recibir_producto = JSON.parse(recibir_producto);
        for(let productos of recibir_producto){
            lista_productos.push(productos);
            console.log(lista_productos);
        }
    }
    else{
        console.log("No existen productos")
    }
}

let tabla_productos = document.getElementById("pr_tabla");
function insertar_datos(){
    if(tabla_productos){
        for (let producto of lista_productos){
            let file_img = `data:image/png;base64,${producto.file}`;
            let th_producto = document.createElement("tr");
            th_producto.innerHTML = `<td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.desc}</td>
            <td>${producto.categoria}</td>
            <td>${producto.stock}</td>
            <td><a>
            <img id="viewImage" class="img_fluid" onClick="openImage();" src="${file_img}" width="50" height="50">
            </a>
            </td>`
            tabla_productos.append(th_producto);
        }
    }
}

function openImage() {
    var largeImage = document.getElementById('viewImage');
    largeImage.style.display = 'block';
    largeImage.style.width = 200 + "px";
    largeImage.style.height = 200 + "px";

    var w = window.open();
    w.document.write(largeImage.outerHTML);
    w.document.close(); 
}
