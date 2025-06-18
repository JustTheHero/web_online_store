import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Desestruturação das propriedades do produto
  const { id, title, price, image, category, quantity, stock } = product;
  const navigate = useNavigate();
  
  // Navega para página de detalhes do produto
  const handleProductClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="card_products" onClick={handleProductClick}>
      <div className="image_products">
        <img src={image} alt={title} />
      </div>
      <div className="info_products">
        <h3 className="title_product">{title}</h3>
        <p className="price_product">R$ {price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;