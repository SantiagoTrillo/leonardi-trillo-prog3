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

    optionEstados.forEach(option => {
        option.addEventListener("click", () => {
            const val = option.getAttribute("data-value");
            const text = option.textContent.trim();

            if (selectedEstadoText && inputEstado) {
                selectedEstadoText.textContent = text;
                inputEstado.value = val;
            }
        });
    });

    const inputImagen = document.getElementById("imagenProducto");
    const fileUploadText = document.getElementById("file-upload-text");
    const fileTooltip = document.getElementById("file-name-tooltip");

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
                fileUploadText.textContent = "Seleccionar archivo...";
                fileUploadText.classList.remove("file-selected");
                
                if (fileTooltip) {
                    fileTooltip.textContent = "";
                    fileTooltip.classList.remove("has-file");
                }
            }
            inputImagen.blur();
        });

        // Quitar foco del input para evitar que quede el borde naranja al cerrar/cancelar el diálogo
        window.addEventListener("focus", () => {
            inputImagen.blur();
        }, { passive: true });
    }
});