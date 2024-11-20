import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useSearchParams } from "react-router-dom";
import ProductTable from './component/AdminProductTable';
import Button from '../../../../common/components/Button';
import ProductCard from './component/AdminProductCard';
import NewProductDialog from './component/NewProductDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProduct, getProductList, clearError } from '../../../../features/product/productSlice';
import LoadingSpinner from '../../../../common/components/LoadingSpinner';

const AdminProduct = () => {
  const dispatch = useDispatch();
  const [query] = useSearchParams();
  const productList = useSelector((state) => state.product.productList);
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const success = useSelector((state) => state.product.success);
  const loading = useSelector((state) => state.product.loading)
  const [mode, setMode] = useState("new");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체
  const [isMobile, setIsMobile] = useState(false);

  const handleClickNewItem = () => {
    //new 모드로 설정하고
    setMode("new")

    //selectedProduct 는 null로
    dispatch(setSelectedProduct(null));

    // 다이얼로그 열어주기
    setShowDialog(true);

  };

  useEffect(() => {
    if (success) {
      setShowDialog(false); // 다이얼로그 닫기
      dispatch(clearError()); // 오류 상태 초기화
    }
  }, [success, dispatch, setShowDialog]);

  useEffect(() => {
    dispatch(getProductList({ ...searchQuery }));
  }, [query])

  useEffect(() => {
    // Update isMobile state based on window size
    const handleResize = () => setIsMobile(window.innerWidth <= 770);
    window.addEventListener('resize', handleResize);
    handleResize(); // Check on mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 카테고리 필터링된 리스트 생성
  const filteredProducts = productList.filter((product) => {
    if (selectedCategory === "All") return true; // "All" 선택 시 모든 상품 표시
    if (selectedCategory === "고양이") return product.category[0] === "Cat";
    if (selectedCategory === "배경지") return product.category[0] === "BG_IMG";
    return false; // 기본적으로 필터링 조건에 맞지 않으면 제외
  });

  return (
    <div className="admin-product-page">
      <Container>
        <Row>
          <Col md={2}>
            <h2>Product</h2>
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
          <Col md={7} className='text-end'>
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
            {
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product} // 개별 `product` 객체를 `ProductCard`에 전달
                  setMode={setMode}
                  setShowDialog={setShowDialog}
                />
              ))}
          </Row>)}

      </Container>
      <NewProductDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        selectedProduct={selectedProduct} // Redux에서 가져온 `selectedProduct`를 다이얼로그에 전달
      />
    </div>
  );
};

export default AdminProduct;
