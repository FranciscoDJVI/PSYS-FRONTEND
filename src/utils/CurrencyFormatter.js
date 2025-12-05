// Format for prices in the page of sells.
function FormatterPesos(value) {
  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2
  });
  return formatter.format(value);
}

export default FormatterPesos;
