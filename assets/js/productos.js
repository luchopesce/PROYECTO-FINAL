const imgAPIKEY = "Client-ID 31bb3c26d2cda2d";
const PUTjsonAPIKEY = "$2b$10$G20e8zwTUOErj9uM0LchO.qt2RGvQs8fMYzS5j6U.Dihq2Pb1bXsG";
const GETjsonAPIKEY = "$2b$10$N8OVssiHovLwnoBzIjWpQu59A7Q8be/6D5lGUwmh8SB3o4sR4pa7O";

let read_file = document.getElementById('pr_fileimg'),
btn_pr_crear = document.getElementById("btn_pr_crear");

function charIsLetter(char) {
    if (typeof char !== 'string' || char.length <= 4) {
        return false;
    }

    return (
        /[A-Za-z]/.test(char)
    );
}

export class Producto{
    constructor(){
        this.id = this.id;
        this.nombre = this.nombre;
        this.subtitulo = this.subtitulo;
        this.precio = this.precio;
        this.desc = this.desc;
        this.categoria = this.categoria;
        this.oldprice = this.oldprice;
        this.color = this.color;
        this.stock = this.stock;
        this.desc = this.desc;
        this.img = [];
    }

    _uploadIMG(){
        if(read_file){
            read_file.addEventListener('change', (e)=>{
            let files = e.target.files;
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("image", files[i])
                formData.append("name", files[i].name);
                fetch("https://api.imgur.com/3/image/", {
                    method: "post",
                    headers: {
                        Authorization: imgAPIKEY,
                    },
                    body: formData, 
                })
                .then((data) => {
                    if (data.ok) {
                    return data.json();
                    }
                    return Promise.reject(); 
                })
                .then(data=>{
                    Toastify({
                        text: `Imagen ${data.data.name} cargada con exito`,
                        duration: 3000,
                        style: {
                            background: "green",
                        }
                        }).showToast();
                    this.img.push(data.data.link);
                    console.log(data);
                })
                .catch(() => {
                    Toastify({
                        text: `Problemas al cargar la imagen ${files[i].name}`,
                        duration: 3000,
                        style: {
                            background: "red",
                        }
                        }).showToast();
                });
            }
        });
    }
    }

    _showProducto(){
        console.log("-----Producto creado con exito-----");
        console.log("ID: ", this.id);
        console.log("NOMBRE: ", this.nombre);
        console.log("SUBTITULO: ", this.subtitulo);
        console.log("PRECIO: ", "$", this.precio);
        console.log("PRECIO ANTIGUO: ", "$", this.oldprice);
        console.log("DESCUENTO: ", "%", this.desc);
        console.log("COLOR: ", this.color);
        console.log("STOCK: ", this.stock);
        console.log("CATEGORIA: ", this.categoria);
        console.log("DESCRIPCION: ", this.desc);
        console.log("URL IMAGENES:", this.img);
    }

    async _setDatos(){
        let datos = await this._getDatos();
        let pr_nombre = document.getElementById("pr_nombre").value,
        pr_subtitulo = document.getElementById("pr_subtitulo").value,
        pr_precio = parseFloat(document.getElementById("pr_precio").value),
        pr_descuento = parseInt(document.getElementById("pr_descuento").value),
        pr_color = document.getElementById("pr_color").value,
        pr_stock_total = parseInt(document.getElementById("pr_stock_total").value),
        pr_categoria = document.getElementById("pr_categoria").value,
        pr_desc = document.getElementById("pr_desc").value,
        pr_oldprice = pr_precio + (pr_precio * (pr_descuento / 100)),
        pr_id = parseInt(Math.random() * (99999 - 10000) + 10000);

        if(datos.some((el)=>el.id === pr_id)){
            return Swal.fire({
                icon: 'error',
                title: 'ID incorrecto',
                text: 'El ID ya existe, contactate con el programador',
            });
        }
        else{
            this.id = pr_id;
        }

        if(charIsLetter(pr_nombre) == false){
            return Swal.fire({
                icon: 'error',
                title: 'Nombre incorrecto',
                text: 'Debes ingresar minimo 4 caracteres',
            });
        }

        else if(datos.some((el)=>el.nombre.toLowerCase() === pr_nombre.toLowerCase())){
            return Swal.fire({
                icon: 'error',
                title: 'Nombre existente',
                text: 'El nombre ingresado ya existe, ingrese otro',
            });
        }
        else{
            this.nombre = pr_nombre;
        }

        if(charIsLetter(pr_subtitulo) == false){
            return Swal.fire({
                icon: 'error',
                title: 'Subtitulo incorrecto',
                text: 'Debes ingresar minimo 4 caracteres',
            });
        }
        else{
            this.subtitulo = pr_subtitulo;
        }

        if(isNaN(pr_precio) == true || pr_precio == ""){
            return Swal.fire({
                icon: 'error',
                title: 'Precio incorrecto',
                text: 'Debes ingresar precio, tiene que ser un numero',
            });
        }
        else{
            pr_precio = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(pr_precio);
            this.precio = pr_precio;
        }

        if(isNaN(pr_descuento) == true || pr_descuento == ""){
            return Swal.fire({
                icon: 'error',
                title: 'Descuento incorrecto',
                text: 'Debes ingresar un descuento, tiene que ser un numero',
            });
        }
        else{
            this.desc = pr_descuento;
            pr_oldprice = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(pr_oldprice)
            this.oldprice = pr_oldprice;
        }

        if(typeof pr_color != "string" || pr_color == ""){
            return Swal.fire({
                icon: 'error',
                title: 'Color incorrecto',
                text: 'Debes ingresar un color',
            });
        }
        else{
            this.color = pr_color;
        }

        if(isNaN(pr_stock_total) == true || pr_stock_total == "" || pr_stock_total == 0){
            return Swal.fire({
                icon: 'error',
                title: 'Stock total incorrecto',
                text: 'Debes ingresar un stock, tiene que ser un numero',
            });
        }
        else{
            this.stock = pr_stock_total;
        }

        if(typeof pr_desc != "string" || pr_desc == ""){
            return Swal.fire({
                icon: 'error',
                title: 'Descripcion incorrecta',
                text: 'Debes ingresar una descripcion',
            });
        }
        else{
            this.desc = pr_desc;
        }

        if(typeof pr_categoria != "string" || pr_categoria == ""){
            return Swal.fire({
                icon: 'error',
                title: 'Categoria incorrecta',
                text: 'Debes ingresar una categoria',
            });
        }
        else{
            this.categoria = pr_categoria;
        }
        console.log("_setDatos OK")
    }

    async _getDatos(){
        try{
            let response = await fetch('https://api.jsonbin.io/v3/b/633b5be02b3499323bd204f4',{
                                method: 'GET', 
                                headers: {
                                    "X-Access-Key": GETjsonAPIKEY,
                                    "X-Bin-Meta": false,
                                },
                                })
            let datos = await response.json();
            return datos;
        }
        catch{
            return new Error("No se pudo leer el json");
        }
    }

    async _createProducto(){
        let result = await this._setDatos();
        if(!result){
            if(this.img.length > 0){
                this._getDatos()
                .then((res) =>{
                    let arrProduct = []
                    arrProduct.push(...res, this);
                    fetch('https://api.jsonbin.io/v3/b/633b5be02b3499323bd204f4',{
                        method: 'PUT', 
                        headers: {
                        "X-Access-Key": PUTjsonAPIKEY,
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(arrProduct),
                    })
                    .then((res) => res.json())
                    .then((res) => {
                        this._showProducto();
                        Toastify({
                            text: "Producto creado con exito",
                            duration: 5000,
                            style: {
                            background: "green",
                            }
                        }).showToast();
                        console.log('Success:', res);
                    })
                    .catch((error) => {
                        Toastify({
                            text: "No se pudo cargar el producto",
                            duration: 5000,
                            style: {
                            background: "red",
                            }
                        }).showToast();
                        console.error('Error:', error);
                    });
                })
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Todavia no se cargo una imagen',
                    text: 'Falta cargar la imagen',
                });
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function(){
    const product = new Producto();
    product._uploadIMG();
    if(btn_pr_crear){
        btn_pr_crear.addEventListener("click", (e)=>{
            e.preventDefault();
            product._createProducto();
        })
    }
});