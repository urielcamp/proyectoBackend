const socket = io()

// Crear producto

const table = document.getElementById('productsTable')


document.getElementById('createBtn').addEventListener('click', () => {
    const body = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value, 
    }
    fetch("/api/products", {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(result => result.json())
        .then(result => {
            if (result.status === 'error') throw new Error(result.error)
        })
        .then(() => fetch('/api/products'))
        .then(result => result.json())
        .then(result => {
            if(result.status === 'error') throw new Error(result.error)
            socket.emit('productList', result.payload)

            alert('El producto se agrego correctamente!')

            document.getElementById('title').value = ''
            document.getElementById('description').value = ''
            document.getElementById('price').value = ''
            document.getElementById('code').value = ''
            document.getElementById('stock').value = ''
            document.getElementById('category').value = '' 
        })
        .catch(err => alert(`Ups, hubo un error :\n${err}`))

})

//Borrar producto

deleteProduct = (id) => {
    fetch(`/api/products/${id}`, {
        method: 'delete',
    })
        .then(result => result.json())
        .then(result => {
            if (result.status === 'error') throw new Error(result.error)
            socket.emit('productList', result.payload)
            alert('El producto se elimino correctamente')
        })
        .catch(err => alert(`Ocurrio un error :\n${err}`))

}
socket.on('updatedProducts', data => {
    table.innerHTML = 
        `
            <tr>
                <td></td>
                <td>product</td>
                <td>description</td>
                <td>price</td>
                <td>code</td>
                <td>stock</td>
                <td>category</td>
            </tr>
        `;
        for(product of data) {
            let tr = document.createElement('tr')
            tr.innerHTML=
                        `
                            <td><button class="btn btn-danger" onclick = "deleteProduct(${product.id})">Eliminar</td>
                            <td>${product.title}</td>
                            <td>${product.description}</td>
                            <td>${product.price}</td>
                            <td>${product.code}</td>
                            <td>${product.stock}</td>
                            <td>${product.category}</td>
                        `;
                    table.getElementsByTagName('tbody')[0].appendChild(tr);
        }
})