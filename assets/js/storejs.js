//-------------FUNCIONES GENERALES------------------------

document.addEventListener("DOMContentLoaded", function(){
    get_datos();
    insertar_datos();
})

//guarda en la variable length la cantidad de digitos de un entero
function validate_num(num){
    var length = ~~(Math.log(num) / Math.LN10 + 1); 
    return length;
}

//valida un string en que contenga algun caracter de letra
function validate_str(value){
    var regex = /^[a-zA-Z]+$/.test(value);
    return regex;
}

//genera un numero random para el id del producto
function generar_random_id(arr){
    let random = parseInt(Math.random() * (99999 - 10000) + 10000); //genera un numero random entra 10000 y 99999 para el id del producto
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


let btn_login = document.getElementById("btn_login")
if(btn_login){
    btn_login.addEventListener("click", check_login)
}



// arrays de objetos
let usuarios = [{
    name: "admin",
    pass: "admin"
}]

let lista_productos = [];

//clase de producto general
class Producto{
    constructor(id, nombre, precio, desc, stock, categoria){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.desc = desc;
        this.stock = stock;
        this.categoria = categoria;
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

function set_datos (){
    let pr_nombre = document.getElementById("pr_nombre").value;
    let pr_precio = document.getElementById("pr_precio").value;
    let pr_descuento = document.getElementById("pr_descuento").value;
    let pr_stock = document.getElementById("pr_stock").value;
    let pr_categoria = document.getElementById("pr_categoria").value;
    let pr_id = generar_random_id(lista_productos);

    let datos = new Producto(pr_id, pr_nombre, pr_precio, pr_descuento, pr_stock, pr_categoria)

    lista_productos.push(datos);
    datos.show_producto();

    let JSON_generar_producto = JSON.stringify(lista_productos);
    localStorage.setItem("productos", JSON_generar_producto);
}

function get_datos(){
    let recibir_producto = localStorage.getItem("productos");
    recibir_producto = JSON.parse(recibir_producto);

    for(let productos of recibir_producto){
        lista_productos.push(productos);
        console.log(lista_productos);
    }
}

function insertar_datos(){
    let tabla_productos = document.getElementById("pr_tabla");

    for (let producto of lista_productos){
        let th_producto = document.createElement("tr");
        th_producto.innerHTML = `<td>${producto.id}</td>
        <td>${producto.nombre}</td>
        <td>data</td>
        <td>placeholder</td>
        <td>text</td>
        <td>text</td>`
        tabla_productos.append(th_producto);
    }
}

let btn_pr_crear = document.getElementById("btn_pr_crear");
if(btn_pr_crear){
    btn_pr_crear.addEventListener("click", set_datos);
}





