// 8. Devuelve un listado con el código de cliente de aquellos clientes que realizaron algún pago en 2008. Tenga en cuenta que deberá eliminar aquellos códigos de cliente que aparezcan repetidos. Resuelva la consulta:

// Utilizando la función YEAR de MySQL.
// Utilizando la función DATE_FORMAT de MySQL.
// Sin utilizar ninguna de las funciones anteriores.

export const getUniqueClientCodesWithPaymentsIn2008 = async () => {
    let res = await fetch("http://172.16.101.146:5345/payments");
    let data = await res.json();
    let dataUpdate = [];

    data.forEach(val => {
        let year = new Date(val.date_payment).getFullYear();

        if (year === 2008) {
            dataUpdate.push({
                codigo: val.code_client,
                Año: val.date_payment
            });
        }
    });
    return dataUpdate;
};

// 13. Devuelve un listado con todos los pagos que se realizaron en el año 2008 mediante Paypal. Ordene el resultado de mayor a menor.
export const getPaypalPayments2008OrderedDescending = async () =>{
    let res = await fetch("http://172.16.101.146:5345/payments?payment=PayPal");
    let data = await res.json();
    let dataUpdate = [];

    data.forEach(val => {
        let year08 = new Date(val.date_payment).getFullYear();

        if (year08 === 2008) {
            dataUpdate.push(val);
        }
    });
    dataUpdate.sort((a, b) => b.total - a.total)
    return dataUpdate;
}

// 14.Devuelve un listado con todas las formas de pago que aparecen en la tabla pago. Tenga en cuenta que no deben aparecer formas de pago repetidas.

export const getAllUniquePaymentMethods = async () => {
    let res = await fetch("http://172.16.101.146:5345/payments");
    let data = await res.json();
    let dataUpdate = new Set();

    data.forEach(val => {
        dataUpdate.add(val.payment)
    });
    let dataPayment = Array.from(dataUpdate);
    return dataPayment;
}




// -------------------------------------------------------------------

// Consultas multitabla (Composición interna)

// 2. Muestra el nombre de los clientes que hayan realizado pagos junto con el nombre de sus representantes de ventas.
// 3. Muestra el nombre de los clientes que no hayan realizado pagos junto con el nombre de sus representantes de ventas.

export const getPaymentsWithSales = async (code) => {
    let res = await fetch(`http://172.16.101.146:5345/payments?code_client=${code}`);
    let dataClients = await res.json();
    return dataClients;
}


export const getAllPayments = async () => {
    let res = await fetch("http://172.16.101.146:5345/payments");
    let data = await res.json();
    return data;
};