$(document).ready(function() {
    // Función para agregar un producto al carrito
    window.addToCart = function(nombre, precio, cantidad) {
        // Crear un objeto que represente el producto a agregar al carrito
        const producto = {
            nombre: nombre,
            precio: parseFloat(precio.replace('$', '')), // Convertir el precio a un número
            cantidad: cantidad, // Cantidad del producto
        };

        // Agregar el producto al carrito
        carrito.push(producto);

        // Mostrar un mensaje de éxito
        alert(`"${nombre}" ha sido agregado al carrito.`);

        // Actualizar la cantidad de elementos en el carrito en la interfaz de usuario
        actualizarNumeroCarrito(carrito.length);
        console.log("Producto agregado al carrito");

        // Actualizar la visualización de los productos en el carrito
        mostrarProductos();
    };

    // Función para mostrar los productos en el carrito
    function mostrarProductos() {
        let tbody = $('#productos-carrito');
        tbody.empty();
        let total = 0;
        carrito.forEach(function(producto) {
            let subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            let tr = $('<tr>');
            tr.append($('<td>').text(producto.nombre));
            tr.append($('<td>').text('$' + producto.precio.toFixed(2)));
            tr.append($('<td>').text(producto.cantidad));
            tr.append($('<td>').text('$' + subtotal.toFixed(2)));
            tr.append($('<td>').append(
                $('<button>').addClass('button is-danger is-small').text('Eliminar').click(function() {
                    eliminarProducto(producto.nombre);
                })
            ));
            tbody.append(tr);
        });
        $('#total').text('$' + total.toFixed(2));
    }

    // Función para eliminar un producto del carrito
    function eliminarProducto(nombre) {
        carrito = carrito.filter(function(producto) {
            return producto.nombre !== nombre;
        });
        mostrarProductos();
    }

    // Mostrar productos al cargar la página
    mostrarProductos();

    // Mostrar formulario de datos del usuario al hacer clic en "Proceder al pago"
    $('#proceder-pago').click(function() {
        $('#datos-usuario').show();
    });
});
