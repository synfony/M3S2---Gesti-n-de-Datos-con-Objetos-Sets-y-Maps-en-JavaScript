const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");
const inventoryBody = document.getElementById("inventoryBody");

let inventory = {
    1: {id: 1, name: "laptop", amount: 1, value: 1500},
    2: {id: 2, name: "mouse", amount: 1, value: 2000},
    3: {id: 3, name: "teclado", amount: 1, value: 3000}
};
let nextId = 4;

// Función para renderizar la tabla y asignar event listeners a botones dinámicos
function renderTable() {
    inventoryBody.innerHTML = "";
    for (let key in inventory) {
        const item = inventory[key];
        const total = item.amount * item.value;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.value}</td>
            <td>${item.amount}</td>
            <td>${total}</td>
            <td>
              <button class="deleteBtn" data-id="${item.id}">Borrar</button>
            </td>
            <td>
              <button class="editBtn" data-id="${item.id}">Editar</button>
            </td>
        `;
        inventoryBody.appendChild(row);
    }

    // Asignar listeners a botones borrar
    const deleteButtons = document.querySelectorAll(".deleteBtn");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const confirmar = confirm("¿Estás seguro que quieres borrar este producto?");
            if (confirmar) {
                delete inventory[id];
                renderTable();
                message.textContent = "Producto borrado.";
            }
        });
    });
    // Asignar listeners a botones editar
    const editButtons = document.querySelectorAll(".editBtn");
    editButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const product = inventory[id];
            const confirmar = confirm("¿Estás seguro que quieres editar este producto?");
            if (confirmar) {
                document.getElementById("name").value = product.name;
                document.getElementById("price").value = product.value;
                document.getElementById("amount").value = product.amount;
                // Guardamos el id para saber que estamos editando
                submitBtn.setAttribute("data-editing-id", id);

                message.textContent = `Editando producto ID ${id}. Cambia los valores y presiona Agregar para guardar.`;
            }
        });
    });
}
// Función para verificar si existe un nombre duplicado, excluyendo un ID opcional
function nombreExiste(nombre, idExcluido = null) {
    return Object.values(inventory).some(item =>
        item.name.toLowerCase() === nombre.toLowerCase() &&
        item.id !== idExcluido
    );
}
// Evento al hacer click en el botón Agregar / Guardar
submitBtn.addEventListener("click", function () {
    let productPrice = parseFloat(document.getElementById("price").value);
    let productAmount = parseInt(document.getElementById("amount").value);
    const productName = document.getElementById("name").value.trim();
    if (!productName || isNaN(productPrice) || isNaN(productAmount)) {
        message.textContent = "Ingrese un valor correcto por favor";
        return;
    }
    const editingId = submitBtn.getAttribute("data-editing-id");

    // Validar si el nombre ya existe
    if (nombreExiste(productName, editingId ? parseInt(editingId) : null)) {
        message.textContent = "Ese nombre ya está registrado. Use uno diferente.";
        return;
    }
    else {
        if (editingId) {
            // Actualizar producto existente
            inventory[editingId] = {
                id: parseInt(editingId),
                name: productName,
                value: productPrice,
                amount: productAmount
            };
            submitBtn.removeAttribute("data-editing-id");
            message.textContent = `Producto editado: ${productName}`;
        } else {
            // Agregar nuevo producto
            const product = {
                id: nextId++,
                name: productName,
                value: productPrice,
                amount: productAmount
            };
            inventory[product.id] = product;
            message.textContent = `Producto agregado: ${product.name}`;
        }

        renderTable();

        // Limpiar formulario
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("amount").value = "";
    }
});
renderTable();
