import {Producto} from './productos.js';

let tabla_productos = document.getElementById("pr_tabla"),
btn_search_box = document.getElementById("pr_search_box"),
DOM_productosAdmin = document.querySelector(".productosAdmin"),
DOM_productosUI = document.querySelector(".productosUI");

const arrProductos = [];

function slideIMG(){
    let slides = document.getElementsByClassName("sliderBlock_items__itemPhoto");
    let next = document.getElementsByClassName("sliderBlock_controls__arrowForward")[0];
    let previous = document.getElementsByClassName("sliderBlock_controls__arrowBackward")[0];
    let items = document.getElementsByClassName("sliderBlock_positionControls")[0];
    let currentSlideItem = document.getElementsByClassName("sliderBlock_positionControls__paginatorItem");
    let currentSlide = 0;
      
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }
      
        function previousSlide() {
            goToSlide(currentSlide - 1);
        }
      
        function goToSlide(n) {
            slides[currentSlide].className = 'sliderBlock_items__itemPhoto';
            items.children[currentSlide].className = 'sliderBlock_positionControls__paginatorItem';
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].className = 'sliderBlock_items__itemPhoto sliderBlock_items__showing';
            items.children[currentSlide].className = 'sliderBlock_positionControls__paginatorItem sliderBlock_positionControls__active';
        }
      
        if(next){
          next.onclick = function () {
            nextSlide();
        };
        }
      
        if(previous){
          previous.onclick = function () {
            previousSlide();
        };
        }
      
        function goToSlideAfterPushTheMiniBlock() {
            for (let i = 0; i < currentSlideItem.length; i++) {
                currentSlideItem[i].onclick = function (i) {
                    let index = Array.prototype.indexOf.call(currentSlideItem, this);
                    goToSlide(index);
                }
            }
        }
      
        goToSlideAfterPushTheMiniBlock();
}

class Render {

    _searchTabla(){
        let search_box = document.getElementById("pr_search_box").value;
        let pr_producto = document.querySelectorAll(".pr_items");
        let pr_name = tabla_productos.getElementsByClassName("pr_name");
        let pr_id = tabla_productos.getElementsByClassName("pr_id");
        let pr_categoria = tabla_productos.getElementsByClassName("pr_categoria");
    
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
    _tablaProductos(){
            if (btn_search_box){
                btn_search_box.addEventListener("keyup", ()=>{ this._searchTabla() });
            }
            arrProductos.forEach(producto => {
                let img_id = producto.nombre + producto.id;
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
                                        <img id="${producto.id}" class="btn" src="${producto.img[0]}" alt="" style="max-height: 75px;">
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
                
            });
    }
    _productosAdmin(){
        let result = "";
        arrProductos.forEach(producto => {
            result += `<div class="col">
            <div class="card gn_main-card text-center">
            <h5 class="card-title mt-2">${producto.nombre}</h5>
            <a href="">
            <img src="${producto.img[0]}" alt="...">
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
    _productosUI(){
        let result = "";
        let path = window.location.pathname;
        let page = path.split("/").pop();
        let productos_filter = arrProductos.filter(el => el.categoria.toLowerCase() === page.toLowerCase()) ;
        productos_filter.forEach(producto =>{
            let nombre_url = producto.nombre.split(' ').join('-');
            nombre_url = nombre_url.toLowerCase();
            result += `<div id="producto_id_${producto.id}" class="col">
            <div class="card gn_main-card text-center">
            <h5 class="card-title mt-2">${producto.nombre}</h5>
            <a href="${path}.html?=${nombre_url}">
            <img src="${producto.img[0]}" alt="...">
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
    _productosUI_ID(id){
        let productos_filter = arrProductos.filter(el => el.nombre.toLowerCase() == id) ;
        productos_filter.forEach(producto =>{

        console.log(producto.img.length)

        let rowDiv = document.createElement("div"),
        rowDiv_tier = document.createElement("div"),
        rowDiv_tier_first = document.createElement("div"),
        tf_1 = document.createElement('div'),
        tf_2 = document.createElement('div'),
        tf_3 = document.createElement('div'),
        tf_1_tier = document.createElement('div'),
        tf_1_tier_div = document.createElement('div'),
        tf1_tierdiv_ul = document.createElement('ul'),
        tf1_tierdiv_div = document.createElement('div'),
        ulTF_1_div = document.createElement('ul'),
        result_tf_2 = "",
        resultTF_1_ul = "",
        resultTF_1_div = "",
        resultulTF_1_div = '';

        for (let i = 0; i < producto.img.length; i++){
                if(i == 0){
                    resultTF_1_ul += `<li class="sliderBlock_items__itemPhoto sliderBlock_items__showing">
                    <img src="${producto.img[i]}"  alt="">
                    </li>`
                    resultulTF_1_div += `<li class="sliderBlock_positionControls__paginatorItem sliderBlock_positionControls__active"></li>`
                }
                else{
                    resultTF_1_ul += `<li class="sliderBlock_items__itemPhoto">
                    <img src="${producto.img[i]}"  alt="">
                    </li>`
                    resultulTF_1_div += `<li class="sliderBlock_positionControls__paginatorItem"></li>`
                }
        }

        rowDiv.className = "row"
        rowDiv_tier.className = "productCard_block carousel-dark p-0 mb-5"
        rowDiv_tier_first.className = "row m-0"
        tf_1.className = "col-sm-12 col-lg-6 p-0"
        tf_2.className = "col-sm-12 col-lg-6 p-0"
        tf_3.className = "col-12 product-info-tabs px-0"
        tf_1_tier.className = 'productCard_leftSide'
        tf_1_tier_div.className = 'sliderBlock p-3'
        tf1_tierdiv_ul.className = 'sliderBlock_items p-0 m-0'
        tf1_tierdiv_div.className = 'sliderBlock_controls'
        ulTF_1_div.className = 'sliderBlock_positionControls p-0 m-0'

        result_tf_2 += `<div class="productCard_rightSide">
        <p class="block_model">
            <span class="block_model__text">Producto: </span>
            <span class="block_model__number">${producto.id}</span>
        </p>
        <div class="block_product">
            <h2 class="block_name block_name__mainName">${producto.nombre}</h2>

            <p class="block_product__advantagesProduct">
            ${producto.subtitulo}
            </p>

            <div class="block_informationAboutDevice">

                <div class="block_descriptionInformation">
                    <span>${producto.desc}
                    </span>
                </div>

                <div class="row mt-3">
                    <div class="col-lg-6 col-sm-12 py-2">
                        <div class="block_price">
                            <p class="block_price__currency">$${producto.precio}</p>
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
                            <span class="text_specification">Color:</span>
                            <div class="block_goodColor__allColors">
                                <input type="radio" name="colorOfItem" class="radio_button"
                                       id="radioColor" checked/>
                                <label for="radioColor"
                                       class="block_goodColor__radio block_goodColor__${producto.color.toLowerCase()}"></label>
                            </div>
                        </div>
                        <button class="btn btn-outline-dark mt-5">
                            Agregar al carro
                        </button>
                    </div>
      
                </div>
            </div>
        </div>
                        </div>`
        tf_2.innerHTML = result_tf_2;

        resultTF_1_div += `<div class="sliderBlock_controls__navigatin">
        <div class="mt-3">
            <div class="sliderBlock_controls__arrowBackward">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            </div>
            <div class="sliderBlock_controls__arrowForward">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
            </div>
        </div>
                        </div>`

        ulTF_1_div.innerHTML = resultulTF_1_div;
        tf1_tierdiv_div.innerHTML = resultTF_1_div;
        tf1_tierdiv_ul.innerHTML = resultTF_1_ul;
        tf1_tierdiv_div.appendChild(ulTF_1_div);
        tf_1_tier_div.append(tf1_tierdiv_ul, tf1_tierdiv_div);
        tf_1_tier.appendChild(tf_1_tier_div);
        tf_1.appendChild(tf_1_tier);
        rowDiv_tier_first.append(tf_1,tf_2,tf_3);
        rowDiv_tier.appendChild(rowDiv_tier_first);
        rowDiv.appendChild(rowDiv_tier);
        DOM_productosUI.append(rowDiv);
    });
    }
}

document.addEventListener("DOMContentLoaded", async function(){
    let product = new Producto();
    let result = await product._getDatos();
    arrProductos.push(...result);
    let ui = new Render();
    if(tabla_productos){
        ui._tablaProductos();
    }
    if(DOM_productosAdmin){
        ui._productosAdmin();
    }
    if(DOM_productosUI){
        const query = new URLSearchParams(window.location.search);
        let id = query.get('');
        if (id){
            id = id.split('-').join(' ');
            ui._productosUI_ID(id);
        }
        else{
            ui._productosUI();
        }
    }
    slideIMG();
});