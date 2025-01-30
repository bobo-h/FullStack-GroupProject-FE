import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ProductTable from "./component/AdminProductTable";
import Button from "../../../../common/components/Button";
import ProductCard from "./component/AdminProductCard";
import NewProductDialog from "./component/NewProductDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedProduct,
  getProductList,
  clearError,
} from "../../../../features/product/productSlice";
import LoadingSpinner from "../../../../common/components/LoadingSpinner";

const AdminProduct = () => {
  const dispatch = useDispatch();
  const [query] = useSearchParams();
  const productList = useSelector((state) => state.product.productList);
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const success = useSelector((state) => state.product.success);
  const loading = useSelector((state) => state.product.loading);
  const [mode, setMode] = useState("new");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  });
  const [isMobile, setIsMobile] = useState(false);

  const handleClickNewItem = () => {
    setMode("new");
    dispatch(setSelectedProduct(null));
    setShowDialog(true);
  };

  useEffect(() => {
    if (success) {
      setShowDialog(false);
      dispatch(clearError());
    }
  }, [success, dispatch, setShowDialog]);

  useEffect(() => {
    dispatch(getProductList({ ...searchQuery }));
  }, [query]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 770);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProducts = productList.filter((product) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "고양이") return product.category[0] === "Cat";
    if (selectedCategory === "배경지") return product.category[0] === "BG_IMG";
    return false;
  });

  return (
    <div className="admin-product-page">
      <Container>
        <Row>
          <Col md={2} className="product-header">
            <h2>Product</h2>
            <button
              className="open-admin-button web-none"
              onClick={handleClickNewItem}
            >
              <i className="ri-add-line"></i>
            </button>
          </Col>
          <Col md={3}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All</option>
              <option>고양이</option>
              <option>배경지</option>
            </Form.Select>
          </Col>
          <Col md={7} className="text-end mobile-none">
            <Button onClick={handleClickNewItem}>add Item</Button>
          </Col>
        </Row>
        {loading ? (
          <div className="text-align-center">
            <LoadingSpinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </LoadingSpinner>
          </div>
        ) : (
          <Row className="table-area">
            {!isMobile && <ProductTable className="unser-line" />}
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                setMode={setMode}
                setShowDialog={setShowDialog}
              />
            ))}
          </Row>
        )}
      </Container>
      <NewProductDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default AdminProduct;
