// 6.Devuelve un listado con el nombre de los todos los clientes españoles.

export const getAllSpanishClientsNames =  async() =>{
    let res = await fetch ("http://172.16.101.146:5341/clients?country=Spain")
    let data = await res.json();
    let dataUpdate = [];
    data.forEach(val => {
        dataUpdate.push({
            nombre: val.client_name,
        })
    });
    return dataUpdate;

}
// 16.Devuelve un listado con todos los clientes que sean de la ciudad de Madrid y cuyo representante de ventas tenga el código de empleado 11 o 30.

export const getClientsInMadridWithSalesRep11Or30 = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients?city=Madrid");
    let data = await res.json();
    let dataUpdate = [];

    data.forEach(val => {
        if (val.code_employee_sales_manager === 11 || val.code_employee_sales_manager === 30){
            dataUpdate.push(val);    
        }
    });
    return dataUpdate;
}







// ------------------------------------------------------------------------------


// importes aqui

import { 
    getEmployByCode,
    getEmployeeData,
    getEmployeesSales,
    getEmployeesCodeOffice
} from "./employees.js";

import { 
    getOfficesByCode,
    getAllOffices
} from "./offices.js";

import {
    getPaymentsWithSales,
    getAllPayments
} from "./payments.js"

import{
    getAllPaymentsStatus,
    getRequests,
    getAllRequests
} from "./requests.js"



// -------------------------------------------------------

// Consultas multitabla (Composición interna)

// 7. Devuelve el nombre de los clientes y el nombre de sus representantes 
// junto con la ciudad de la oficina a la que pertenece el representante.

export const getClientsEmploy = async() =>{
    let res = await fetch("http://172.16.101.146:5341/clients");
    let clients = await res.json();
    for (let i = 0; i < clients.length; i++) {
        let {
            client_code,
            contact_name,
            contact_lastname,
            phone,
            fax,
            address1:address1Client,
            address2:address2Client,
            city,
            region:regionClients,
            country:countryClients,
            postal_code:postal_codeClients,
            limit_credit,
            id:idClients,
            ...clientsUpdate
        } = clients[i];

        let [employ] = await getEmployByCode(clientsUpdate.code_employee_sales_manager)
        let {
            extension,
            email,
            code_boss,
            position,
            id:idEmploy,
            name,
            lastname1,
            lastname2,
            employee_code,
            ...employUpdate
        } = employ

        let [office] = await getOfficesByCode(employUpdate.code_office)

        let {
            country:countryOffice,
            region:regionOffice,
            postal_code:postal_codeOffice,
            movil,
            address1:address1Office,
            address2:address2Office,
            id:idOffice,
            ...officeUpdate
        } = office


        let data = {...clientsUpdate, ...employUpdate, ...officeUpdate};
        let {
            code_employee_sales_manager,
            code_office,
            ...dataUpdate       
        }=data;

        dataUpdate.name_employee = `${name} ${lastname1} ${lastname2}`
        clients[i] = dataUpdate
    }
    // [
    //     {
    //         city: "San Francisco"
    //         client_name : "GoldFish Garden"
    //         name_employee: "Walter Santiago Sanchez Lopez"
    //     }
    // ]
    return clients;
}

// 1. Obtén un listado con el nombre de cada cliente y el nombre y apellido de su representante de ventas.

export const getEmployeesCode = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients");
    let clients = await res.json();
    for (let i = 0; i < clients.length; i++) {
        let {
            client_code,
            contact_name,
            contact_lastname,
            phone,
            fax,
            address1:address1Client,
            address2:address2Client,
            city,
            region:regionClients,
            country:countryClients,
            postal_code:postal_codeClients,
            limit_credit,
            id:idClients,
            code_employee_sales_manager,
            ...clientsUpdate
        } = clients[i];

        let [employ] = await getEmployeeData(code_employee_sales_manager);
        let {
            extension,
            email,
            code_boss,
            position,
            id: idEmploy,
            name,
            lastname1,
            lastname2,
            code_office,
            employee_code,
            ...employUpdate
        } = employ;

        let data = {...clientsUpdate, ...employUpdate};
        let {
            code_employee_sales_manager: codeEmployeeSalesManager,
            ...dataUpdate       
        } = data;

        dataUpdate.name_employee = `${name} ${lastname1} ${lastname2}`;
        clients[i] = dataUpdate;
    }
    return clients;
};


// 2. Muestra el nombre de los clientes que hayan realizado pagos junto con el nombre de sus representantes de ventas.

export const getClientsWithSalesRepresentatives = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients");
    let clients = await res.json();
    let clientsWithPayments = [];

    for (let i = 0; i < clients.length; i++) {
        let {
            client_code,
            contact_name,
            contact_lastname,
            phone,
            fax,
            address1: address1Client,
            address2: address2Client,
            city,
            region: regionClients,
            country: countryClients,
            postal_code: postal_codeClients,
            limit_credit,
            id: idClients,
            code_employee_sales_manager,
            ...clientsUpdate
        } = clients[i];


        let [pay] = await getPaymentsWithSales(client_code);

        // Si hay pagos asociados, incluir al cliente en la lista de clientes con pagos
        if (pay) {
            let [employ] = await getEmployeesSales(code_employee_sales_manager);
            let {
                client_code,
                extension,
                email,
                code_boss,
                position,
                id: idEmploy,
                name,
                lastname1,
                lastname2,
                code_office,
                employee_code,
                ...employUpdate
            } = employ;

            let {
                code_client,
                payment: paymentClients,
                id_transaction: transactionClients,
                date_payment,
                total,
                id: idPayments,
                ...paymentsUpdate
            } = pay;

            let dataUpdate = {
                ...clientsUpdate,
                ...employUpdate,
                ...paymentsUpdate
            };

            dataUpdate.name_employee = `${name} ${lastname1} ${lastname2}`;
            clientsWithPayments.push(dataUpdate);
        }
    }
    return clientsWithPayments;
};




// 3. Muestra el nombre de los clientes que no hayan realizado pagos junto con el nombre de sus representantes de ventas.

export const getClientsWithoutPayments = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients");
    let clients = await res.json();
    let clientsWithoutPayments = [];

    for (let i = 0; i < clients.length; i++) {
        let {
            client_code,
            contact_name,
            contact_lastname,
            phone,
            fax,
            address1: address1Client,
            address2: address2Client,
            city,
            region: regionClients,
            country: countryClients,
            postal_code: postal_codeClients,
            limit_credit,
            id: idClients,
            code_employee_sales_manager,
            ...clientsUpdate
        } = clients[i];

        // Obtener los pagos asociados al cliente
        let [pay] = await getPaymentsWithSales(client_code);

        // Si no hay pagos asociados, incluir al cliente en la lista de clientes sin pagos
        if (!pay) {
            let [employ] = await getEmployeesSales(code_employee_sales_manager);
            let {
                extension,
                email,
                code_boss,
                position,
                id: idEmploy,
                name,
                lastname1,
                lastname2,
                code_office,
                employee_code,
                ...employUpdate
            } = employ;

            let dataUpdate = {
                ...clientsUpdate,
                ...employUpdate
            };

            dataUpdate.name_employee = `${name} ${lastname1} ${lastname2}`;
            clientsWithoutPayments.push(dataUpdate);
        }
    }
    return clientsWithoutPayments;
};




// 4.Devuelve el nombre de los clientes que han hecho pagos y el nombre de sus representantes junto con la ciudad de la oficina a la que pertenece el representante.


export const getClientsWithPaymentsAndSalesRepresentativesAndOfficeCity = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients");
    let clients = await res.json();
    let clientsWithPayments = [];

    for (let i = 0; i < clients.length; i++) {
        let {
            client_code,
            contact_name,
            contact_lastname,
            phone,
            fax,
            address1: address1Client,
            address2: address2Client,
            city,
            region: regionClients,
            country: countryClients,
            postal_code: postal_codeClients,
            limit_credit,
            id: idClients,
            code_employee_sales_manager,
            ...clientsUpdate
        } = clients[i];

        let [pay] = await getPaymentsWithSales(client_code);

        // Si hay pagos asociados, incluir al cliente en la lista de clientes con pagos
        if (pay) {
            let [employ] = await getEmployeesSales(code_employee_sales_manager);
            let {
                extension,
                email,
                code_boss,
                position,
                id: idEmploy,
                name,
                lastname1,
                lastname2,
                code_office,
                employee_code,
                ...employUpdate
            } = employ;

            let {
                code_client,
                payment: paymentClients,
                id_transaction: transactionClients,
                date_payment,
                total,
                id: idPayments,
                ...paymentsUpdate
            } = pay;

            let [office] = await getOfficesByCode(code_office);

            if (office) {
                let {
                    country: countryOffice,
                    region: regionOffice,
                    postal_code: postal_codeOffice,
                    movil,
                    code_office,
                    address1: address1Office,
                    address2: address2Office,
                    id: idOffice,
                    ...officeUpdate
                } = office;

                let dataUpdate = {
                    ...clientsUpdate,
                    ...employUpdate,
                    ...paymentsUpdate,
                    ...officeUpdate
                };

                dataUpdate.name_employee = `${name} ${lastname1} ${lastname2}`;
                clientsWithPayments.push(dataUpdate);
            } 
        }
    }
    return clientsWithPayments;
};



// 5. Devuelve el nombre de los clientes que no hayan hecho pagos y el nombre de sus representantes junto con la ciudad de la oficina a la que pertenece el representante.

export const getClientsWithoutPaymentsAndSalesRepresentativesAndOfficeCity = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients");
    let clients = await res.json();
    let clientsWithoutPayments = [];

    for (let i = 0; i < clients.length; i++) {
        let {
            client_code,
            contact_name,
            contact_lastname,
            phone,
            fax,
            address1: address1Client,
            address2: address2Client,
            city,
            region: regionClients,
            country: countryClients,
            postal_code: postal_codeClients,
            limit_credit,
            id: idClients,
            code_employee_sales_manager,
            ...clientsUpdate
        } = clients[i];

        // Obtener los pagos asociados al cliente
        let [pay] = await getPaymentsWithSales(client_code);

        // Si no hay pagos asociados, incluir al cliente en la lista de clientes sin pagos
        if (!pay) {
            let [employ] = await getEmployeesSales(code_employee_sales_manager);
            let {
                extension,
                email,
                code_boss,
                position,
                id: idEmploy,
                name,
                lastname1,
                lastname2,
                code_office,
                employee_code,
                ...employUpdate
            } = employ;

            // Obtener la información de la oficina a partir del código de la oficina del representante
            let [office] = await getOfficesByCode(code_office);
            if (office) {
                let {
                    country: countryOffice,
                    region: regionOffice,
                    postal_code: postal_codeOffice,
                    movil,
                    code_office,
                    address1: address1Office,
                    address2: address2Office,
                    id: idOffice,
                    ...officeUpdate
                } = office;

                let dataUpdate = {
                    ...clientsUpdate,
                    ...employUpdate,
                    ...officeUpdate
                };

                dataUpdate.name_employee = `${name} ${lastname1} ${lastname2}`;
                clientsWithoutPayments.push(dataUpdate);
            }
        }
    }
    return clientsWithoutPayments;
};


// 6. Lista la dirección de las oficinas que tengan clientes en Fuenlabrada.

export const getOfficesClientsInFuenlabrada = async() => {
    let resClients = await fetch("http://172.16.101.146:5341/clients?city=Fuenlabrada");
    let dataClients = await resClients.json();
    let dataEmployees = await getEmployeesCodeOffice();
    let dataOffices = await getAllOffices();
    let dataUpdate = []

    for (let clientes of dataClients) {
        for (let employees of dataEmployees) {
            if (clientes.code_employee_sales_manager === employees.employee_code){
                for (let offices of dataOffices) {
                    if(employees.code_office === offices.code_office) {
                        dataUpdate.push({
                            codigo: clientes.code_employee_sales_manager,
                            direccion1: offices.address1,
                            direccion2: offices.address2
                        })
                    }
                }
            }
        }
    }

    return dataUpdate
}



// 10.Devuelve el nombre de los clientes a los que no se les ha entregado a tiempo un pedido.

export const getDelayedOrdersPayPalClients = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients");
    let clients = await res.json();

    for (let i = 0; i < clients.length; i++) {
        let client = clients[i];

        let payments = await getAllPaymentsStatus(client.code_client); // Suponiendo que la función getAllPaymentsStatus acepta un código de cliente como parámetro

        for (let j = 0; j < payments.length; j++) {
            let payment = payments[j];

            let dataUpdate = {
                client_name: client.client_name,
                status: payment.status, // Asegúrate de que status sea la propiedad correcta
            };

            clients[i] = dataUpdate;
        }
    }

    return clients;
};



export const getClientByCode = async (code) => {
    let res = await fetch(`http://172.16.101.146:5341/clients?client_code=${code}`)
    let dataClient = await res.json()
    return dataClient
}



// -------------------------------------------------------

// Consultas multitabla (Composición externa)

// 1. Devuelve un listado que muestre solamente los clientes que no han realizado ningún pago.

export const clientsNoPayments = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients");
    let clients = await res.json();
    let clientsWithoutPayments = [];

    for (let i = 0; i < clients.length; i++) {
        let {
            client_code,
            contact_name,
            contact_lastname,
            phone,
            fax,
            address1: address1Client,
            address2: address2Client,
            city,
            region: regionClients,
            country: countryClients,
            postal_code: postal_codeClients,
            limit_credit,
            id: idClients,
            code_employee_sales_manager,
            ...clientsUpdate
        } = clients[i];

        // Obtener los pagos asociados al cliente
        let [pay] = await getPaymentsWithSales(client_code);

        // Si no hay pagos asociados, incluir al cliente en la lista de clientes sin pagos
        if (!pay) {
            let [employ] = await getEmployeesSales(code_employee_sales_manager);
            let {
                extension,
                email,
                code_boss,
                position,
                id: idEmploy,
                name,
                lastname1,
                lastname2,
                code_office,
                employee_code,
                ...employUpdate
            } = employ;

            let dataUpdate = {
                ...clientsUpdate,
                ...employUpdate
            };


            clientsWithoutPayments.push(dataUpdate);
        }
    }
    return clientsWithoutPayments;
};


// 2.Devuelve un listado que muestre solamente los clientes que no han realizado ningún pedido.


export const clientsNoOrder = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients");
    let clients = await res.json();
    let clientsWithoutOrder = [];

    for (let i = 0; i < clients.length; i++) {
        let {
            client_code,
            contact_name,
            contact_lastname,
            phone,
            fax,
            address1: address1Client,
            address2: address2Client,
            city,
            region: regionClients,
            country: countryClients,
            postal_code: postal_codeClients,
            limit_credit,
            id: idClients,
            code_employee_sales_manager,
            ...clientsUpdate
        } = clients[i];

        // Obtener las solicitudes asociadas al cliente
        let requests = await getRequests(client_code);

        // Verificar si el cliente tiene solicitudes asociadas
        if (requests.length === 0) {
            clientsWithoutOrder.push(clientsUpdate);
        }
    }
    return clientsWithoutOrder;
};


// 3. Devuelve un listado que muestre los clientes que no han realizado ningún pago y los que no han realizado ningún pedido.

export const clientsNoPaymentsAndNoOrder = async () => {
    // Obtener clientes sin pagos
    const clientsWithoutPayments = await clientsNoPayments();

    // Obtener clientes sin pedidos
    const clientsWithoutOrders = await clientsNoOrder();

    // Combinar las listas de clientes sin pagos y sin pedidos
    const combinedClientsList = [...clientsWithoutPayments, ...clientsWithoutOrders];

    // Eliminar duplicados basados en el nombre del cliente
    const uniqueClientsList = combinedClientsList.filter((client, index, self) =>
        index === self.findIndex(c => c.client_name === client.client_name)
    );

    return uniqueClientsList;
};




export const getClientsOk = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients?code_employee_sales_manager");
    let dataOffices = await res.json();
    return dataOffices;
}


// 11. Devuelve un listado con los clientes que han realizado algún pedido pero no han realizado ningún pago.


// Devuelve un listado que muestre solamente los clientes que han realizado ningún pedido.
export const clientsWithOrder = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients");
    let clients = await res.json();
    let clientsWithOrder = [];

    for (let i = 0; i < clients.length; i++) {
        let {
            client_code,
            contact_name,
            contact_lastname,
            phone,
            fax,
            address1: address1Client,
            address2: address2Client,
            city,
            region: regionClients,
            country: countryClients,
            postal_code: postal_codeClients,
            limit_credit,
            id: idClients,
            code_employee_sales_manager,
            ...clientsUpdate
        } = clients[i];

        // Obtener las solicitudes asociadas al cliente
        let requests = await getRequests(client_code);

        // Verificar si el cliente tiene solicitudes asociadas
        if (requests.length > 0) {
            clientsWithOrder.push(clientsUpdate);
        }
    }
    return clientsWithOrder;
};

// 11 solucion 

export const clientsWithOrderNoPayments = async () => {
    let res = await fetch("http://172.16.101.146:5341/clients");
    let clients = await res.json();
    let clientsWithOrderNoPayments = [];

    for (let i = 0; i < clients.length; i++) {
        let {
            client_code,
            contact_name,
            contact_lastname,
            phone,
            fax,
            address1: address1Client,
            address2: address2Client,
            city,
            region: regionClients,
            country: countryClients,
            postal_code: postal_codeClients,
            limit_credit,
            id: idClients,
            code_employee_sales_manager,
            ...clientsUpdate
        } = clients[i];

        // Obtener las solicitudes asociadas al cliente
        let requests = await getRequests(client_code);

        // Obtener los pagos asociados al cliente
        let [pay] = await getPaymentsWithSales(client_code);

        // Verificar si el cliente tiene solicitudes asociadas pero no pagos
        if (requests.length > 0 && !pay) {
            clientsWithOrderNoPayments.push(clientsUpdate);
        }
    }

    if (clientsWithOrderNoPayments.length === 0) {
        return "No hay clientes que han realizado su pedido y no han pagado";
    }

    return clientsWithOrderNoPayments;
};