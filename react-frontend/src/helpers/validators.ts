import { Product } from '../@types/product';

const validateRequired = (value: string) => !!value.length;

function validateProduct(product: Product) {
  return {
    name: !validateRequired(product.name) ? 'Nome é obrigatório' : '',
    category: !validateRequired(product.category)
      ? 'Categoria é obrigatório'
      : '',
    stock: !validateRequired(product.stock.toString())
      ? 'Estoque é obrigatório'
      : '',
  };
}

export { validateProduct, validateRequired };
