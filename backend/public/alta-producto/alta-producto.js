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
});
