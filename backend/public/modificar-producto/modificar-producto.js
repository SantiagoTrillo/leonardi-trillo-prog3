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

        if (modalActivar) {
            modalActivar.addEventListener("click", (e) => {
                if (e.target === modalActivar) {
                    ocultarModal();
                }
            });
        }
    }
});
