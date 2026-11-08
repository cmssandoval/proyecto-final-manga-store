import catalogItems from './catalogItems.js';

const featuredProductIds = [1, 2, 3, 4];
const featuredProducts = catalogItems.filter((product) => featuredProductIds.includes(product.id));

export default featuredProducts;