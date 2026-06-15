document.addEventListener("DOMContentLoaded", () => {
    const selectedCategoriaText = document.getElementById("selectedCategoriaText");
    const inputCategoria = document.getElementById("inputCategoria");
    const optionCategorias = document.querySelectorAll(".option-categoria");

    optionCategorias.forEach(option => {
        option.addEventListener("click", () => {
            const val = option.getAttribute("data-value");
            const text = option.textContent.trim();

            if (selectedCategoriaText && inputCategoria) {
                selectedCategoriaText.textContent = text;
                inputCategoria.value = val;
            }
        });
    });

    const selectedEstadoText = document.getElementById("selectedEstadoText");
    const inputEstado = document.getElementById("inputEstado");
    const optionEstados = document.querySelectorAll(".option-estado");

    const modalActivar = document.getElementById("modalActivar");
    const botonConfirmarActivar = document.getElementById("botonConfirmarActivar");
    const botonCancelarActivar = document.getElementById("botonCancelarActivar");

    const modalDesactivar = document.getElementById("modalDesactivar");
    const botonConfirmarDesactivar = document.getElementById("botonConfirmarDesactivar");
    const botonCancelarDesactivar = document.getElementById("botonCancelarDesactivar");

    let valoresTemporales = null;

    if (inputEstado) {
        const estadoInicial = inputEstado.value;

        function actualizarEstado(texto, valor) {
            if (selectedEstadoText && inputEstado) {
                selectedEstadoText.textContent = texto;
                inputEstado.value = valor;
            }
        }

        function ocultarModal() {
            if (modalActivar) {
                modalActivar.classList.add("d-none");
            }
            if (modalDesactivar) {
                modalDesactivar.classList.add("d-none");
            }
            valoresTemporales = null;
        }

        optionEstados.forEach(option => {
            option.addEventListener("click", () => {
                const val = option.getAttribute("data-value");
                const text = option.textContent.trim();

                if (val === "activo" && estadoInicial === "inactivo" && inputEstado.value !== "activo") {
                    valoresTemporales = { texto: text, valor: val };
                    if (modalActivar) {
                        modalActivar.classList.remove("d-none");
                    }
                } else if (val === "inactivo" && estadoInicial === "activo" && inputEstado.value !== "inactivo") {
                    valoresTemporales = { texto: text, valor: val };
                    if (modalDesactivar) {
                        modalDesactivar.classList.remove("d-none");
                    }
                } else {
                    actualizarEstado(text, val);
                }
            });
        });

        if (botonConfirmarActivar) {
            botonConfirmarActivar.addEventListener("click", () => {
                if (valoresTemporales) {
                    actualizarEstado(valoresTemporales.texto, valoresTemporales.valor);
                }
                ocultarModal();
            });
        }

        if (botonCancelarActivar) {
            botonCancelarActivar.addEventListener("click", ocultarModal);
        }

        if (botonConfirmarDesactivar) {
            botonConfirmarDesactivar.addEventListener("click", () => {
                if (valoresTemporales) {
                    actualizarEstado(valoresTemporales.texto, valoresTemporales.valor);
                }
                ocultarModal();
            });
        }

        if (botonCancelarDesactivar) {
            botonCancelarDesactivar.addEventListener("click", ocultarModal);
        }

        if (modalActivar) {
            modalActivar.addEventListener("click", (e) => {
                if (e.target === modalActivar) {
                    ocultarModal();
                }
            });
        }

        if (modalDesactivar) {
            modalDesactivar.addEventListener("click", (e) => {
                if (e.target === modalDesactivar) {
                    ocultarModal();
                }
            });
        }
    }

    // Lógica para subida de imagen y tooltip en la vista de modificación
    const inputImagen = document.getElementById("imagenProducto");
    const fileUploadText = document.getElementById("file-upload-text");
    const fileTooltip = document.getElementById("file-name-tooltip");
    const imagenExistenteInput = document.getElementsByName("imagenExistente")[0];

    if (inputImagen && fileUploadText) {
        inputImagen.addEventListener("change", () => {
            if (inputImagen.files && inputImagen.files.length > 0) {
                const nombreArchivo = inputImagen.files[0].name;
                fileUploadText.textContent = nombreArchivo;
                fileUploadText.classList.add("file-selected");
                
                if (fileTooltip) {
                    fileTooltip.textContent = nombreArchivo;
                    fileTooltip.classList.add("has-file");
                }
            } else {
                const valorInicial = imagenExistenteInput ? imagenExistenteInput.value : "Seleccionar archivo...";
                fileUploadText.textContent = valorInicial;
                fileUploadText.classList.add("file-selected");
                
                if (fileTooltip) {
                    fileTooltip.textContent = valorInicial;
                    fileTooltip.classList.add("has-file");
                }
            }
            inputImagen.blur();
        });

        window.addEventListener("focus", () => {
            inputImagen.blur();
        }, { passive: true });
    }
});
