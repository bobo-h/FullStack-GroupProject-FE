import React from "react";
import "./style/productCard.style.css";

const ProductCard = ({ item, handleOpenPaymentModal }) => {
  return (
    <div className="product-card-area"
      onClick={() => handleOpenPaymentModal(item)}>

      <div className="product-card">
        <div className="cat-id">#{item.id}</div>

        <div className="image-container">
          <img
            src={item.image}
            alt={item.name}
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h3 className="name">{item.name}</h3>
          <p className="description">{item.description}</p>
          <div className="price">{item.price}₩</div>
        </div>
      </div>
    </div>

  );
};

export default ProductCard;
