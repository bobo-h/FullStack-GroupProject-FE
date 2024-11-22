import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import AdminPaymentTable from "./component/AdminPaymentTable";
import Button from "../../../../common/components/Button";
import AdminPaymentCard from "./component/AdminPaymentCard";
import { getOrderList } from "../../../../features/order/orderSlice";
import "./style/adminPayment.style.css";
import LoadingSpinner from "../../../../common/components/LoadingSpinner";
import ReactPaginate from "react-paginate";
import AdminDashboard from "./component/AdminDashboard";

const AdminPaymentPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { orderList, totalPageNum, loading } = useSelector(
    (state) => state.order
  );
  // const [mode, setMode] = useState("new");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSearchType, setSelectedSearchType] = useState("All");
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    ordernum: "",
    orderitem: "",
    orderemail: "",
  });
  const [searchParam, setSearchParam] = useState("");

  const handleClickDashboard = () => {
    setShowModal(true);
  };

  // URL 업데이트 및 query 초기화
  const updateQueryParams = (newQuery) => {

    if (newQuery.ordernum === '') { delete newQuery.ordernum; }
    if (newQuery.orderemail === '') { delete newQuery.orderemail; }
    if (newQuery.orderitem === '') { delete newQuery.orderitem; }
    
    const params = new URLSearchParams(newQuery);

    navigate("?" + params.toString());
  };

  // 페이지 진입 시 query 초기화
  useEffect(() => {
    setSearchQuery({
      page: 1,
      ordernum: "",
      orderitem: "",
      orderemail: "",
    });
    updateQueryParams({});
  }, []);

  useEffect(() => {
    dispatch(getOrderList({ ...searchQuery }));
  }, [searchQuery]);

  const handlePageClick = ({ selected }) => {
    const updatedQuery = { ...searchQuery, page: selected + 1 };
    setSearchQuery(updatedQuery);
    updateQueryParams(updatedQuery);
  };

  const filteredPayments = orderList.filter((payment) => {
    if (selectedCategory === "All") return true; // "All" 선택 시 모든 상품 표시
    if (selectedCategory === "고양이")
      return payment.productCategory[0] === "Cat";
    if (selectedCategory === "배경지")
      return payment.productCategory[0] === "BG_IMG";
    return false; // 기본적으로 필터링 조건에 맞지 않으면 제외
  });

  const handleSearchTypeChange = (e) => {
    setSelectedSearchType(e.target.value);
    setSearchParam("");

    if (e.target.value === "All") {
      // 초기 상태로 설정
      setSearchQuery({
        page: 1,
        ordernum: "",
        orderitem: "",
        orderemail: "",
      });
      updateQueryParams({});
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchParam(e.target.value);
  };

  const handleSearchClick = () => {

    const updatedQuery = { ...searchQuery, page: 1 };

    if (selectedSearchType === "User Email") {
      updatedQuery.orderemail = searchParam;
      updatedQuery.orderitem = "";
      updatedQuery.ordernum = "";
    } else if (selectedSearchType === "Order Item") {
      updatedQuery.orderitem = searchParam;
      updatedQuery.orderemail = "";
      updatedQuery.ordernum = "";
    } else if (selectedSearchType === "Order Num") {
      updatedQuery.ordernum = searchParam;
      updatedQuery.orderemail = "";
      updatedQuery.orderitem = ""
    } else {
      updatedQuery.orderemail = "";
      updatedQuery.orderitem = "";
      updatedQuery.ordernum = "";
    }

    setSearchQuery(updatedQuery);
    updateQueryParams(updatedQuery);

  };

  // useEffect(() => {
  //   if (loading === false) {
  //     if ((selectedCategory === "All") & (selectedSearchType === "All")) {
  //       setFilteredOrders(orderList);
  //     } else {
  //       setFilteredOrders(filteredPayments);
  //     }
  //   }
  // }, [loading, selectedSearchType, selectedCategory, searchParam]);

  return (
    <div className="admin-payment-page">
      <Container>
        <Row>
          <Col md={2}>
            <h2>Payment History</h2>
          </Col>
          <Col md={2}>
            <Form.Group controlId="categorySelect">
              <Form.Label> Category </Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All</option>
                <option>고양이</option>
                <option>배경지</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group controlId="searchType">
              <Form.Label>Search</Form.Label>
              <Form.Select
                value={selectedSearchType}
                onChange={handleSearchTypeChange}
              >
                <option>All</option>
                <option>Order Item</option>
                <option>User Email</option>
                <option>Order Num</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            {selectedSearchType !== "All" && (
              <Form.Control
                type="text"
                placeholder={`Search ${selectedSearchType}`}
                value={searchParam}
                onChange={handleSearchInputChange}
              />
            )}
          </Col>
          <Col md={2}>
            {selectedSearchType !== "All" && (
              <Button onClick={handleSearchClick}>Search</Button>
            )}
          </Col>

          <Col md={2} >
            <Button onClick={handleClickDashboard}>Dashboard</Button>
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
            <AdminPaymentTable className="unser-line" />
            {filteredPayments && filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <AdminPaymentCard
                  key={payment._id}
                  payment={payment} // 개별 `product` 객체를 `ProductCard`에 전달
                />
              ))
            ) : (
              <div className="text-center">
                <p>No Payments List</p>
              </div>
            )}
          </Row>
        )}

        <ReactPaginate
          className="pagination"
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum}
          forcePage={searchQuery.page - 1}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </Container>
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Dashboard</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AdminDashboard showModal={showModal} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminPaymentPage;
