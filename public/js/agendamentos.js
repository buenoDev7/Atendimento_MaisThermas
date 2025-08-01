
// > Função que exibe modal de confirmação de exclusão de agendamento
document.addEventListener('DOMContentLoaded', () => {
    let formDelItem = null;

    // > Ao clicar na lixeira, captura o form correspondente ao id do agendamento
    document.querySelectorAll('.btn-open-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            window.scrollTo(0, 0);
            const id = btn.getAttribute('data-id');
            formDelItem = document.querySelector(`.form-del-item[data-id="${id}"]`);
            document.getElementById('inputDelItem').value = '';
        });
    });

    // > Botão de confirmação de exclusão dentro do modal
    document.querySelector('.btn-confirm-del').addEventListener('click', () => {
        const inputDelItem = document.getElementById('inputDelItem').value;
        if (inputDelItem === 'mt#2025') {
            if (formDelItem) {
                formDelItem.submit()
            }
        } else {
            alert("Senha errada! Não tente novamente");
        }
    });

});


