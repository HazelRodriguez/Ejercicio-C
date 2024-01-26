function iniciarDB() {

    const request = indexedDB.open('veterinaria')

    request.onupgradeneeded = function() {

        const db = request.result
        const store = db.createObjectStore('mascotas', { keyPath: 'id' })
        store.createIndex('by_id', 'id', { unique: true })
        store.createIndex('by_especie', 'especie', { unique: false })
        store.createIndex('by_raza', 'raza', { unique: false })
        store.createIndex('by_genero', 'genero', { unique: false })
        console.log('Base de Datos creada')
    }

    request.onsuccess = function() {
        db = request.result
        console.log('Éxito')
    }

    request.onerror = function(e) {
        alert('Error: ' + e.code + ' ' + e.message)
    }
}

function cargar() {
    datos = document.getElementById('cajadatos')
    document.getElementById('guardar').onclick = guardarUno
    document.getElementById('todo').onclick = mostrarTodo
    iniciarDB()
}

function guardarUno() {
    const id = document.getElementById('id').value
    const nombre = document.getElementById('nombre').value
    const especie = document.getElementById('especie').value
    const raza = document.getElementById('raza').value
    const genero = document.getElementById('genero').value
    const color = document.getElementById('color').value
    const propietario = document.getElementById('propietario').value


    const tx = db.transaction('mascotas', 'readwrite')
    const store = tx.objectStore('mascotas')
    store.put({ id: id, nombre: nombre, especie: especie, raza: raza, genero: genero, color: color, propietario: propietario })

    tx.oncomplete = mostrarTodo
    const idHTML = document.getElementById('id')
    idHTML.value = ''
    idHTML.readOnly = false
    document.getElementById('nombre').value = ''
    document.getElementById('especie').value = ''
    document.getElementById('raza').value = ''
    document.getElementById('genero').value = ''
    document.getElementById('color').value = ''
    document.getElementById('propietario').value = ''
    document.getElementById('guardar').value = 'Guardar'
}

function mostrar(id) {
    const tx = db.transaction('mascotas', 'readonly')
    const store = tx.objectStore('mascotas')
    const index = store.index('by_id')

    const request = index.get(id)

    request.onsuccess = function() {
        const result = request.result
        datos.innerHTML = '<div>' + result.id + ' - ' + result.nombre + ' - ' + result.especie + ' - ' + result.especie + ' - ' + result.genero + ' - ' + result.color + ' - ' + result.propietario + '</div>'
    }
}

function mostrarTodo() {
    datos.innerHTML = ''
    let txtHTML = '<table><tr><th>ID</th><th>Nombre</th><th>Especie</th><th>Raza</th><th>Género</th><th>Color</th><th>Propietario</th><th>Opciones</th></tr>'
    const tx = db.transaction('mascotas', 'readonly')
    const store = tx.objectStore('mascotas')

    const request = store.openCursor()

    request.onsuccess = function() {
        const cursor = request.result

        if (cursor) {
            txtHTML += '<tr><td>' + cursor.value.id + '</td><td>' + cursor.value.nombre + '</td><td>' + cursor.value.especie + '</td><td>' + cursor.value.raza + '</td><td>' + cursor.value.genero + '</td><td>' + cursor.value.color + '</td><td>' + cursor.value.propietario +
                '</td><td><input type="button" onclick="modificar(\'' + cursor.value.id + '\')" value="Editar">' +
                '<input type="button" onclick="eliminar(\'' + cursor.value.id + '\')" value="Eliminar"></td></tr>'
            cursor.continue()
        } else {
            txtHTML += '</table>'
        }
        datos.innerHTML = txtHTML
    }
}

function modificar(id) {
    const tx = db.transaction('mascotas', 'readonly')
    const store = tx.objectStore('mascotas')
    const index = store.index('by_id')

    const request = index.get(id)

    request.onsuccess = function() {
        const result = request.result
        const id = document.getElementById('id')
        id.value = result.id
        id.readOnly = true
        document.getElementById('nombre').value = result.nombre
        document.getElementById('especie').value = result.especie
        document.getElementById('raza').value = result.raza
        document.getElementById('genero').value = result.genero
        document.getElementById('color').value = result.color
        document.getElementById('propietario').value = result.propietario

        document.getElementById('guardar').value = 'Actualizar'
    }
}

function eliminar(id) {

    if (confirm('¿Seguro que desea eliminar el registro?')) {
        const tx = db.transaction('mascotas', 'readwrite')
        const store = tx.objectStore('mascotas')

        const request = store.delete(id)

        request.onsuccess = mostrarTodo
    }
}

window.onload = cargar