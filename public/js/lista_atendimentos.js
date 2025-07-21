document.addEventListener('DOMContentLoaded', () => {
    let formDelItem = null

    // Ao clicar na lixeira, guarda o form correspondente
    document.querySelectorAll('.btn-open-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            window.scrollTo(0, 0)
            const id = btn.getAttribute('data-id')
            formDelItem = document.querySelector(`.form-del-item[data-id="${id}"]`)
            document.getElementById('inputDelItem').value = ''
        })
    })

    // Botão "Deletar" dentro do modal
    document.querySelector('.btn-confirm-del').addEventListener('click', () => {
        const inputDelItem = document.getElementById('inputDelItem').value.trim().toLowerCase()
        if (inputDelItem === 'deletar') {
            if (formDelItem) {
                formDelItem.submit()
            }
        } else {
            alert("Você precisa confirmar a exclusão.")
        }
    });

    // > Exibição de Tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
})