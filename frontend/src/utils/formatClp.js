const clpNumberFormatter = new Intl.NumberFormat('es-CL', {
  maximumFractionDigits: 0,
});

const formatClp = (price) => {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    throw new TypeError('El precio debe ser un número válido');
  }

  return `$${clpNumberFormatter.format(amount)}`;
};

export default formatClp;
