const socket = io();
const table = document.getElementById('realProductsTable');
const createBtn = document.getElementById('createBtn');

const resetForm = () => {
    const inputIds = ['title', 'description', 'price', 'code', 'stock', 'category'];
    inputIds.forEach(id => {
        document.getElementById(id).value = '';
    });
};

const showAlert = (message) => {
    alert(message);
};

const handleCreateProduct = () => {
    const body = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
    };

    fetch('/api/products', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(result => result.json())
        .then(result => {
            if (result.status === 'error') {
                throw new Error(result.error);
            }
            return fetch('/api/products');
        })
        .then(result => result.json())
        .then(result => {
            if (result.status === 'error') {
                throw new Error(result.error);
            }
            socket.emit('productList', result.payload);
            showAlert(`Ok. Todo salió bien! :)\nEl producto se ha agregado con éxito!\n\nVista actualizada!`);
            resetForm();
        })
        .catch(err => showAlert(`Algo salio mal\n${err}`));
};

createBtn.addEventListener('click', handleCreateProduct);

const deleteProduct = (id) => {
    fetch(`/api/products/${id}`, {
        method: 'delete',
    })
        .then(result => result.json())
        .then(result => {
            if (result.status === 'error') {
                throw new Error(result.error);
            }
            socket.emit('productList', result.payload);
            showAlert(`Ok. Todo salió bien! :)\nEl producto eliminado con éxito!`);
        })
        .catch(err => showAlert(`Ocurrió un error :(\n${err}`));
};

socket.on('updatedProducts', data => {
    const tableHeader = `
        <tr>
            <td></td>
            <td><strong>Producto</strong></td>
            <td><strong>Descripción</strong></td>
            <td><strong>Precio</strong></td>
            <td><strong>Código</strong></td>
            <td><strong>Stock</strong></td>
            <td><strong>Categoría</strong></td>
        </tr>
    `;

    table.innerHTML = tableHeader;

    for (const product of data) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Eliminar</button></td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.code}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
        `;

        table.getElementsByTagName('tbody')[0].appendChild(tr);
    }
});
