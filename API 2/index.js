const table = document.getElementById("cuentosTable");
const mensaje = document.getElementById("mensaje");
const form = document.getElementById("cuentoForm");
const cancelButton = document.getElementById("cancelButton");
const url = "https://647bfffdc0bae2880ad0541f.mockapi.io/cuentos";


function getAllCuentos() {
  fetch(url)
    .then(response => response.json())
    .then(cuentos => {
      if (cuentos.length === 0) {
        showNoCuentoMessage(); // Mostrar mensaje si no hay cuentos
      } else {
        cuentos.forEach(cuento => {
          const row = createTableRow(cuento);
          table.querySelector("tbody").appendChild(row);
        });
      }
    })
    .catch(error => {
      console.log("Error al obtener los datos de los cuentos:", error);
    });
}


function createTableRow(cuento) {
  const row = document.createElement("tr");
  
  const idCell = document.createElement("td");
  idCell.textContent = cuento.id;
  row.appendChild(idCell);

  const tituloCell = document.createElement("td");
  tituloCell.textContent = cuento.titulo;
  row.appendChild(tituloCell);

  const autorCell = document.createElement("td");
  autorCell.textContent = cuento.autor;
  row.appendChild(autorCell);

  const contenidoCell = document.createElement("td");
  contenidoCell.textContent = cuento.contenido;
  row.appendChild(contenidoCell);

  const accionesCell = document.createElement("td");
  const editButton = document.createElement("button");
  editButton.textContent = "Editar";
  editButton.addEventListener("click", () => {
    fillFormForEdit(cuento);
  });
  accionesCell.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () => {
    deleteCuento(cuento.id);
  });
  accionesCell.appendChild(deleteButton);

  row.appendChild(accionesCell);

  return row;
}


function showNoCuentoMessage() {
  mensaje.textContent = "El cuento no existe";
  mensaje.style.color = "red";
  setTimeout(() => {
    mensaje.textContent = "";
    mensaje.style.color = "";
  }, 2000);
}
function createCuento(cuento) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cuento)
  })
    .then(response => response.json())
    .then(newCuento => {
      const row = createTableRow(newCuento);
      table.querySelector("tbody").appendChild(row);
    })
    .catch(error => {
      console.log("Error al crear el cuento:", error);
    });
}


function editCuento(cuentoId, cuento) {
  const editUrl = `${url}/${cuentoId}`;
  fetch(editUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cuento)
  })
    .then(response => response.json())
    .then(editedCuento => {
      const editedRow = table.querySelector(`tr[data-cuento-id="${cuentoId}"]`);
      const newRow = createTableRow(editedCuento);
      table.querySelector("tbody").replaceChild(newRow, editedRow);
    })
    .catch(error => {
      console.log("Error al editar el cuento:", error);
    });
}


function deleteCuento(cuentoId) {
  const deleteUrl = `${url}/${cuentoId}`;
  fetch(deleteUrl, {
    method: "DELETE"
  })
    .then(() => {
      const deletedRow = table.querySelector(`tr[data-cuento-id="${cuentoId}"]`);
      table.querySelector("tbody").removeChild(deletedRow);
    })
    .catch(error => {
      console.log("Error al eliminar el cuento:", error);
    });
}


function fillFormForEdit(cuento) {
  form.dataset.mode = "edit";
  form.dataset.cuentoId = cuento.id;
  document.getElementById("titulo").value = cuento.titulo;
  document.getElementById("autor").value = cuento.autor;
  document.getElementById("contenido").value = cuento.contenido;
}


function resetForm() {
  form.reset();
  form.dataset.mode = "create";
  form.dataset.cuentoId = "";
}


form.addEventListener("submit", event => {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const contenido = document.getElementById("contenido").value;

  if (titulo.trim() === "" || autor.trim() === "" || contenido.trim() === "") {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const cuento = {
    titulo: titulo,
    autor: autor,
    contenido: contenido
  };

  const isNewCuento = form.dataset.mode === "create";

  if (isNewCuento) {
    createCuento(cuento);
  } else {
    const cuentoId = form.dataset.cuentoId;
    editCuento(cuentoId, cuento);
  }

  resetForm();
});


cancelButton.addEventListener("click", () => {
  resetForm();
});


getAllCuentos();