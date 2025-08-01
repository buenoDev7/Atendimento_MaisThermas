document.addEventListener('DOMContentLoaded', () => {
    let formToSubmit = null;

    // Captura o formulário a ser submetido quando um botão de item individual é clicado.
    document.querySelectorAll('.btn-open-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            window.scrollTo(0, 0);
            const id = btn.getAttribute('data-id');
            formToSubmit = document.querySelector(`.form-del-item[data-id="${id}"]`);
            document.getElementById('inputDelItem').value = '';
        });
    });

    // Captura o formulário 'formClearData' quando o botão de exclusão total é clicado.
    document.querySelector('.btn-open-modal-all').addEventListener('click', () => {
        window.scrollTo(0, 0);
        formToSubmit = document.getElementById('formClearData');
        document.getElementById('inputDelItem').value = '';
    });

    // Submete o formulário guardado se o texto de confirmação estiver correto.
    document.querySelector('.btn-confirm-del').addEventListener('click', () => {
        const inputDelItem = document.getElementById('inputDelItem').value;
        if (inputDelItem === 'mt#2025') {
            if (formToSubmit) {
                formToSubmit.submit();
            }
        } else {
            alert("Senha errada! Não tente novamente");
        }
    });

    // > Exibição de Tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});