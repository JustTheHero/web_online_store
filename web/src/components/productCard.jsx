import React from 'react';

const ProductCard = ({ product }) => {
  const { title, price, image } = product;
  
  const handleAddToCart = () => {
    console.log(`Product "${title}" added to cart`);
    // Implement add to cart functionality here
  };
  
  return (
    <div className="card_products">
      <div className="image_products">
        <img src={image} alt={title} />
      </div>
      <div className="info_products">
        <h3 className="title_product">{title}</h3>
        <p className="price_product">${price.toFixed(2)}</p>
        <button onClick={handleAddToCart} className="btn">Add to cart</button>
      </div>
    </div>
  );
};

export default ProductCard;