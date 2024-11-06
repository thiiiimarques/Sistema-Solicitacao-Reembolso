// Seleciona os elementos do formulário
let form = document.querySelector('form');
let amount = document.getElementById('amount');
let expense = document.getElementById('expense');
let category = document.getElementById('category');

//Seleciona elementos da lista
let ul = document.querySelector('ul');
let expenseQuantity = document.querySelector(' aside header p span');
let expenseTotal = document.querySelector('aside header h2');

// Captura o evento de input para formatar o valor
amount.oninput = () => {
  //obtém o valor atual do input e remove as letras
  let valueWithoutLetter = amount.value.replace(/\D/g, '');

  // Transforma o valor em centavos (exemplo: 1500/100 = 1.5 que é equivalente a R$1.50).
  valueWithoutLetter = parseInt(valueWithoutLetter) / 100;

  //Atualiza o valor do input
  amount.value = formatCurrencyBRL(valueWithoutLetter);
};

function formatCurrencyBRL(value) {
  // Formata o valor como uma string de moeda brasileira
  value = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return value;
}

// criando um evento para o envio do formulário quando preenchido
form.onsubmit = event => {
  event.preventDefault();
  // Criando uma entrada em forma de objeto para todos os campos preenchidos da despesas
  let newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    amount: amount.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    created_at: new Date(),
  };

  expenseAdd(newExpense);
};

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    //Criando o elemento de li para adicionar na lista
    let expenseItem = document.createElement('li');
    expenseItem.classList.add('expense');

    // Criando o ícone da categoria
    let expenseIcon = document.createElement('img');
    expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute(
      'alt',
      `Ícone da categoria de ${newExpense.category_name}`
    );

    // Criando a descrição do item
    let expenseInfo = document.createElement('div');
    expenseInfo.classList.add('expense-info');
    expenseInfo.innerHTML = `
    <strong>${newExpense.expense}</strong>
    <span>${newExpense.category_name}</span>
    `;

    // Criando o valor do item
    let expenseAmount = document.createElement('span');
    expenseAmount.innerHTML = `
    <span class="expense-amount"><small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace('R$', '')}</span>
    `;

    // Criando o ícone de remover do item
    let removeIcon = document.createElement('img');
    removeIcon.classList.add('remove-icon');
    removeIcon.setAttribute('src', `img/remove.svg`);
    removeIcon.setAttribute('alt', `Ícone de remover item`);

    //Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    //Adiciona o Item na lista
    ul.append(expenseItem);

    updateTotals();
    clearForm();
  } catch (error) {
    alert(
      'Não foi possível atualizar a lista de despesas!, Tente mais tarde por favor!'
    );
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    //Recupera todos os itens da lista e consequentemente suas quantidades
    let itensQuantity = ul.children

    //Atualizas a quantidade de itens colocados na lista
    expenseQuantity.textContent = `${itensQuantity.length} ${itensQuantity.length > 1 ? 'Despesas' : 'Despesa'}`;

    //Soma o Valor total das despesas na lista
    let total = 0;
    for (let i = 0; i < itensQuantity.length; i++) {
      let itemAmount = itensQuantity[i].querySelector('.expense-amount')

      //Remove caracteres não numéricos e substitui a vírgula pelo ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',','.');

      value = parseFloat(value);

      if (isNaN(value)) {
        return alert('Não foi possível fazer a somatória dos valores das despesas!')
      }

      total += value;
    }

    //Atualiza o valor total das despesas
    expenseTotal.textContent = formatCurrencyBRL(total);

  } catch (error) {
    alert('Não foi possível atualizar a quantidade de Items!')
  }

}

// Remove um item da lista
ul.addEventListener('click', (event) => {
  if(event.target.classList.contains('remove-icon')) {
    event.target.parentElement.remove();
    updateTotals();
  }
})


//Método para limpar o formulário após a inserção

function clearForm() {
  form.reset();

  expense.focus();
}
