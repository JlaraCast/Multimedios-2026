// Estado de la calculadora
let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldResetScreen = false;

const screen = document.getElementById('screen');
const expression = document.getElementById('expression');

function updateScreen(value) {
  screen.value = value;
}

function appendNumber(num) {
  if (shouldResetScreen) {
    currentValue = num;
    shouldResetScreen = false;
  } else {
    currentValue = currentValue === '0' ? num : currentValue + num;
  }
  updateScreen(currentValue);
}

function appendDecimal() {
  if (shouldResetScreen) {
    currentValue = '0.';
    shouldResetScreen = false;
    updateScreen(currentValue);
    return;
  }
  // Evitar múltiples puntos decimales
  if (currentValue.includes('.')) return;
  currentValue += '.';
  updateScreen(currentValue);
}

function chooseOperator(op) {
  // Si hay operación pendiente, calcular primero
  if (operator && !shouldResetScreen) {
    calculate(true);
  }

  if (currentValue === '' || currentValue === 'Error') return;

  previousValue = currentValue;
  operator = op;
  shouldResetScreen = true;

  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  expression.textContent = `${previousValue} ${symbols[op]}`;
}

function calculate(chainedCall = false) {
  if (!operator || previousValue === '') return;

  const prev = parseFloat(previousValue);
  const curr = parseFloat(currentValue);

  // Validar entradas vacías o NaN
  if (isNaN(prev) || isNaN(curr)) {
    showError('Entrada inválida');
    return;
  }

  // Validar división entre cero
  if (operator === '/' && curr === 0) {
    showError('No se puede dividir entre 0');
    return;
  }

  let result;
  switch (operator) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/': result = prev / curr; break;
  }

  // Evitar NaN en el resultado
  if (isNaN(result) || !isFinite(result)) {
    showError('Error de cálculo');
    return;
  }

  // Redondear para evitar imprecisiones de punto flotante
  result = parseFloat(result.toPrecision(12));

  if (!chainedCall) {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    expression.textContent = `${previousValue} ${symbols[operator]} ${currentValue} =`;
  }

  currentValue = String(result);
  operator = null;
  previousValue = '';
  shouldResetScreen = true;
  updateScreen(currentValue);
}

function clearAll() {
  currentValue = '0';
  previousValue = '';
  operator = null;
  shouldResetScreen = false;
  expression.textContent = ' ';
  updateScreen('0');
}

function showError(msg) {
  updateScreen(msg);
  expression.textContent = ' ';
  currentValue = '0';
  previousValue = '';
  operator = null;
  shouldResetScreen = true;
}

// Soporte de teclado con addEventListener
document.addEventListener('keydown', function (e) {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') appendDecimal();
  else if (e.key === '+') chooseOperator('+');
  else if (e.key === '-') chooseOperator('-');
  else if (e.key === '*') chooseOperator('*');
  else if (e.key === '/') { e.preventDefault(); chooseOperator('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') clearAll();
});
