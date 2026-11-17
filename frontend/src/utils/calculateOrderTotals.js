const roundMoney = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;

const calculateOrderTotals = (items) => {
  const netAmount = roundMoney(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  const taxAmount = roundMoney(
    items.reduce(
      (sum, item) => sum + roundMoney(item.price * item.quantity * 0.19),
      0,
    ),
  );

  return {
    netAmount,
    taxAmount,
    total: roundMoney(netAmount + taxAmount),
  };
};

export default calculateOrderTotals;
