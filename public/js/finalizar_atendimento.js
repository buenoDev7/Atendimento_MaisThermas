// > Função pra preencher automaticamente a idade do cliente e do acompanhante
function calcularIdade(dataNascStr) {
    if (!dataNascStr) return "";
    const hoje = new Date();
    const nascimento = new Date(dataNascStr);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

// > Função pra preencher automaticamente a idade do cliente e do acompanhante
window.addEventListener('DOMContentLoaded', () => {
    const dataNasc1 = document.getElementById('dataNasc1')?.value;
    const dataNasc2 = document.getElementById('dataNasc2')?.value;

    const idadeCliente = calcularIdade(dataNasc1);
    const idadeAcompanhante = calcularIdade(dataNasc2);

    if (idadeCliente) {
        document.getElementById('idadeCliente').value = idadeCliente;
    }

    if (idadeAcompanhante) {
        document.getElementById('idadeAcompanhante').value = idadeAcompanhante;
    }
});

// > Tooltips de dicas dos botões de Imprimir, Salvar e Sair
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// > Exibição de Toast de confirmação de atendimento concluido
  function exibirToast(event) {
    event.preventDefault();

    const toastEl = document.getElementById('toastConfirmacao');
    const toast = new bootstrap.Toast(toastEl);
    window.scroll(0, 0)
    toast.show();

    setTimeout(() => {
      event.target.submit();
    }, 2000);

    return false;
  }
