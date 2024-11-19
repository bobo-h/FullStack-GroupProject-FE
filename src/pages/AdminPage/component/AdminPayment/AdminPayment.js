import React, { useEffect, useState } from "react";
import { Col, Row, Form, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { getOrderList } from '../../../../features/order/orderSlice';
import OrderTable from "./component/OrderTable";
import LoadingSpinner from "../../../../common/components/LoadingSpinner";
import "./style/adminPayment.style.css";
import Button from '../../../../common/components/Button';

import OrderCard from "./component/OrderCard";

const AdminOrderPage = () => {
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { orderList, loading } = useSelector((state) => state.order);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    ordernum: query.get("ordernum") || "",
  });

  useEffect(() => {
    dispatch(getOrderList({ ...searchQuery }));
  }, [query]);

//주문도 필터링..?
// 필터링 카테고리 옵션 선택 시 검색박스 등장
// 검색박스에 검색어 없이 검색버튼 클릭 시 해당 카테고리의 전 항목 출력
// 검색박스에 검색어 포함 검색버튼 클릭 시 해당 카테고리의 검색 결과 항목 출력
// ex. 카테고리 User 선택 후 검색어 없이 클릭 -> 구매내역이 있는 전 유저 출력
// ex. 카테고리 Product 선택 후 검색어 "스노우" -> "스노우" 상품이 구매된 리스트 출력

  // useEffect(() => {
  //   if (searchQuery.ordernum === "") {
  //     delete searchQuery.ordernum;
  //   }
  //   const params = new URLSearchParams(searchQuery);
  //   const queryString = params.toString();

  //   navigate("?" + queryString);
  // }, [searchQuery]);

const handleCategoryChange = (e) => {
  setSelectedCategory(e.target.value);
  setSearchQuery(''); 
};


const handleSearchInputChange = (e) => {
  setSearchQuery(e.target.value);
};

const handleSearchClick = () => {
  let filtered = orderList;

  if (selectedCategory !== 'All') {
    filtered = filtered.filter(order => {
      if (selectedCategory === 'User') {
        return order.name.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (selectedCategory === 'Product') {
        return order.productName.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });
  }

  setFilteredOrders(filtered);
};

useEffect(() => {
  dispatch(getOrderList());
}, [dispatch]);

useEffect(() => {
  if (selectedCategory === 'All') {
    setFilteredOrders(orderList);
  }
}, [selectedCategory, orderList]);

  return (
        <div className="admin-payment-page">
          <Container>
            <Row>
              <Col md={2}>
                <h2>Payment</h2>
              </Col>
              <Col md={3}>
          <Form.Select
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option>All</option>
            <option>Product</option>
            <option>User</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          {selectedCategory !== 'All' && (
            <Form.Control
              type="text"
              placeholder={`Search ${selectedCategory}`}
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          )}
        </Col>
        <Col md={3}>
        {selectedCategory !== 'All' && (
          <Button onClick={handleSearchClick}>Search</Button>
        )}
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
                <OrderTable className="unser-line" />
                {orderList.length > 0 ? (
                  orderList.map((order, index) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      index={index}
                    />
                  ))
                ) : (
                  <p>No order available.</p>
                )}
              </Row>
            )}
          </Container>
        </div>
      )}



export default AdminOrderPage;
