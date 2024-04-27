// 3. Devuelve un listado con el nombre, apellidos y email de los empleados cuyo jefe tiene un código de jefe igual a 7.


export const getAllEmployeesWithBossAndCodeSeven = async() =>{
    let rest = await fetch ("http://localhost:5502/employees?code_boss=7")
    let data = await rest.json();
    let dataUpdate = [];
    data.forEach(val => {
        let [email] = val.email.match(/(?<=\[)[^\[\]]+@[^@\[\]]+(?=\])/)
        dataUpdate.push({
            nombre: val.name,
            apellidos: `${val.lastname1} ${val.lastname2}`,
            email
        });
    });
    return dataUpdate;
}

// 4. Devuelve el nombre del puesto, nombre, apellidos y email del jefe de la empresa.

export const getBossFullNameAndEmail = async() => {
    let res = await fetch ("http://localhost:5502/employees")
    let data = await res.json();
    let dataUpdate = [];

    data.forEach(val =>{
        if(val.code_boss == null){
            dataUpdate.nombre = val.name
            dataUpdate.apellidos = `${val.lastname1} ${val.lastname2}`
            dataUpdate.email = val.email.match(/(?<=\[)[^\[\]]+@[^@\[\]]+(?=\])/)[0]
        }
    })
    return dataUpdate;
}

// 5. Devuelve un listado con el nombre, apellidos y puesto de aquellos empleados que no sean representantes de ventas.

export const getAllNonSalesRepresentativeEmployees = async () => {
    let res = await fetch("http://localhost:5502/employees?position_ne=Representante%20Ventas")
    let data = await res.json();
    let dataUpdate = [];
    data.forEach(val => {
        dataUpdate.push({
            nombre: val.name,
            apellidos: `${val.lastname1} ${val.lastname2}`,
            puesto: val.position
        })
    });
    return dataUpdate;
}



// ------------------------------------------------------------------------------



// Consultas multitabla (Composición interna)

// 7. Devuelve el nombre de los clientes y el nombre de sus representantes 
// junto con la ciudad de la oficina a la que pertenece el representante.


// Obtener la informacion de un empleado por su codigo

export const getEmployByCode = async(code) =>{
    let res = await fetch(`http://localhost:5502/employees?employee_code=${code}`);
    let dataClients = await res.json();
    return dataClients;
}

// 1. Obtén un listado con el nombre de cada cliente y el nombre y apellido de su representante de ventas.

export const getEmployeeData = async (code) => {
    let res = await fetch(`http://localhost:5502/employees?employee_code=${code}`);
    let dataClients = await res.json();
    return dataClients;
}

// 2. Muestra el nombre de los clientes que hayan realizado pagos junto con el nombre de sus representantes de ventas.
// 3. Muestra el nombre de los clientes que no hayan realizado pagos junto con el nombre de sus representantes de ventas.
// 4.Devuelve el nombre de los clientes que han hecho pagos y el nombre de sus representantes junto con la ciudad de la oficina a la que pertenece el representante.
// 5. Devuelve el nombre de los clientes que no hayan hecho pagos y el nombre de sus representantes junto con la ciudad de la oficina a la que pertenece el representante.

export const getEmployeesSales = async (code) => {
    let res = await fetch(`http://localhost:5502/employees?employee_code=${code}`);
    let dataClients = await res.json();
    return dataClients;
}



export const getAllEmploy = async() =>{
    let res = await fetch(`http://localhost:5502/employees`);
    let data = await res.json();
    return data;
}
//9. Devuelve un listado que muestre el nombre de cada empleados, el nombre de su jefe y el nombre del jefe de sus jefe.

export const getAll = async () => {
    let dataEmployees = await getAllEmploy();
    for (let i = 0; i < dataEmployees.length; i++) {
        let { code_boss, name, lastname1, lastname2 } = dataEmployees[i];
        let listBoss = [];
        if (!code_boss) continue;
        do {
            let [boss] = await getEmployByCode(code_boss);
            if (!boss) break;
            listBoss.push(boss.name); // Almacenamos solo el nombre del jefe
            code_boss = boss.code_boss;
        } while (code_boss);
        dataEmployees[i] = { name, lastname1, lastname2, code_boss: listBoss };
    }
    return dataEmployees.map(({ name, lastname1, lastname2, code_boss }) => ({ name, lastname1, lastname2, code_boss }));
};

// 8.Devuelve un listado con el nombre de los empleados junto con el nombre de sus jefes.

export const getEmployeesWithBoss = async () => {
    // Obtiene la lista de empleados del servidor
    let res = await fetch("http://localhost:5502/employees");
    let employees = await res.json();

    // Función para obtener el nombre del jefe a partir del código del jefe
    const getBossName = (bossCode) => {
        if (bossCode === null) return null; // Si el código del jefe es nulo, devuelve nulo
        const boss = employees.find(employee => employee.id === bossCode);
        return boss ? `${boss.name} ${boss.lastname1} ${boss.lastname2}` : null;
    };

    // Itera sobre cada empleado para agregar el nombre del jefe
    for (let i = 0; i < employees.length; i++) {
        let {
            name,
            lastname1,
            lastname2,
            code_boss,
            ...employUpdate
        } = employees[i];

        // Agrega el nombre del jefe al objeto del empleado
        employUpdate.bossName = getBossName(code_boss);

        // Actualiza el objeto del empleado en el array
        employees[i] = employUpdate;
    }

    // Devuelve la lista de empleados con el nombre del jefe agregado
    return employees;
};