import "./components/clock.js";


// -----------------------------Primera parte ----------------------------------------------------------------
// -----------------------------Ejercicio 1----------------------------------------------------------------

import { getAllOfficesCodeAndCity } from "./module/offices.js";
const queryAboutTable01 = document.querySelector("#queryAboutTable01");
queryAboutTable01.addEventListener("click", async(e)=>{
    let [,report__container] = queryAboutTable01.children
    if(!report__container.innerHTML){
        let data = await getAllOfficesCodeAndCity();
        let plantilla = "";
        console.log(data);
        data.forEach(val => {
            plantilla += `
                <div class="report__card">
                <div class="card__title">
                    <div>Oficinas</div>
                </div>
                <div class="card__body">
                    <div class="body__marck">
                        <p><b>Codigo Oficina: </b>${val.codigo}</p>
                        <p><b>Ciudad: </b>${val.ciudad}</p>
                    </div>
                </div>
            </div>
            `;
        });
        report__container.innerHTML = plantilla;
    }
})



// -----------------------------Ejercicio 2----------------------------------------------------------------

import { getAllOfficesFromSpainCityAndMovil } from "./module/offices.js";
const queryAboutTable02 = document.querySelector("#queryAboutTable02");
queryAboutTable02.addEventListener("click", async(e)=>{
    let [,report__container] = queryAboutTable02.children
    if(!report__container.innerHTML){
        let data = await getAllOfficesFromSpainCityAndMovil();
        let plantilla = "";
        console.log(data);
        data.forEach(val => {
            plantilla += `
                <div class="report__card">
                <div class="card__title">
                    <div>Oficinas</div>
                </div>
                <div class="card__body">
                    <div class="body__marck">
                        <p><b>ID: </b>${val.id}</p>
                        <p><b>Ciudad: </b>${val.ciudad}</p>
                        <p><b>Telefono: </b>${val.telefono}</p>
                    </div>
                </div>
            </div>
            `;
        });
        report__container.innerHTML = plantilla;
    }
})


// -----------------------------Ejercicio 3----------------------------------------------------------------

import { getAllEmployeesWithBossAndCodeSeven } from "./module/employees.js";
const queryAboutTable02 = document.querySelector("#queryAboutTable02");
queryAboutTable02.addEventListener("click", async(e)=>{
    let [,report__container] = queryAboutTable02.children
    if(!report__container.innerHTML){
        let data = await getAllEmployeesWithBossAndCodeSeven();
        let plantilla = "";
        console.log(data);
        data.forEach(val => {
            plantilla += `
                <div class="report__card">
                <div class="card__title">
                    <div>Oficinas</div>
                </div>
                <div class="card__body">
                    <div class="body__marck">
                        <p><b>ID: </b>${val.id}</p>
                        <p><b>Ciudad: </b>${val.ciudad}</p>
                        <p><b>Telefono: </b>${val.telefono}</p>
                    </div>
                </div>
            </div>
            `;
        });
        report__container.innerHTML = plantilla;
    }
})








// -----------------------------Segunda Parte----------------------------------------------------------------
// -----------------------------Ejercicio 7----------------------------------------------------------------

import { getClientsEmploy } from "./module/clients.js";
const queryAboutTable7 = document.querySelector("#queryAboutTable7");
queryAboutTable7.addEventListener("click", async(e)=>{
    let [,report__container] = queryAboutTable7.children
    if(!report__container.innerHTML){
        let data = await getClientsEmploy();
        let plantilla = "";
        console.log(data);
        data.forEach(val => {
            plantilla += `
                <div class="report__card">
                <div class="card__title">
                    <div>${val.client_name}</div>
                </div>
                <div class="card__body">
                    <div class="body__marck">
                        <p><b>Nombre del empleado: </b>${val.name_employee}</p>
                        <p><b>Ciudad: </b>${val.city}</p>
                    </div>
                </div>
            </div>
            `;
        });
        report__container.innerHTML = plantilla;
    }
})