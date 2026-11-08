const categoryLabels = {
  shonen: 'Shonen',
  romance: 'Romance',
  accion: 'Acción',
  comedia: 'Comedia',
  drama: 'Drama',
};

export const getCatalogGenreLabel = (genre) => {
  const normalizedGenre = String(genre || '').toLowerCase();
  return categoryLabels[normalizedGenre] || genre;
};

export const getCatalogCategories = (products) => {
  const counts = products.reduce((categoryCounts, product) => {
    const genre = String(product.genre || '').toLowerCase();

    if (categoryLabels[genre]) {
      categoryCounts[genre] = (categoryCounts[genre] || 0) + 1;
    }

    return categoryCounts;
  }, {});

  return Object.entries(counts).map(([id, count]) => ({
    id,
    name: categoryLabels[id],
    count,
  }));
};
