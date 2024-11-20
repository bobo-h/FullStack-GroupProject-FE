import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import AdminPaymentTable from "./component/AdminPaymentTable";
import Button from '../../../../common/components/Button';
import AdminPaymentCard from "./component/AdminPaymentCard";
import { getOrderList } from "../../../../features/order/orderSlice";
import "./style/adminPayment.style.css";
import LoadingSpinner from "../../../../common/components/LoadingSpinner";

const AdminPaymentPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { orderList, totalPageNum, loading } = useSelector((state) => state.order);
  const [mode, setMode] = useState("new");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSearchType, setSelectedSearchType] = useState("All")
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    ordernum: query.get("ordernum") || "",
  });
  const [searchParam, setSearchParam] = useState("")
  const [open, setOpen] = useState(false);

  const handleClickNewItem = () => {
    //new 모드로 설정하고
    setMode("new")

    //selectedProduct 는 null로
    // dispatch(setSelectedProduct(null));

    // 다이얼로그 열어주기
    setShowDialog(true);

  };

  useEffect(() => {
    dispatch(getOrderList({ ...searchQuery }));
  }, [query]);

  useEffect(() => {
    if (searchQuery.ordernum === "") {
      delete searchQuery.ordernum;
    }
    const params = new URLSearchParams(searchQuery);
    const queryString = params.toString();

    navigate("?" + queryString);
  }, [searchQuery]);

  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filteredPayments = orderList.filter((payment) => {
    if (selectedCategory === "All") return true; // "All" 선택 시 모든 상품 표시
    if (selectedCategory === "고양이") return payment.productCategory[0] === "Cat";
    if (selectedCategory === "배경지") return payment.productCategory[0] === "BG_IMG";
    return false; // 기본적으로 필터링 조건에 맞지 않으면 제외
  });

  const handleSearchTypeChange = (e) => {
    setSelectedSearchType(e.target.value);
    setSearchParam('');
  };

  const handleSearchInputChange = (e) => {
    setSearchParam(e.target.value);
  };

  const handleSearchClick = () => {
    let filtered = filteredPayments;
    if (selectedSearchType !== 'All') {
      filtered = filtered.filter(order => {
        if (selectedSearchType === 'User Email') {
          return order.email.toLowerCase().includes(searchParam.toLowerCase());
        } else if (selectedSearchType === 'Order Item') {
          return order.productName.toLowerCase().includes(searchParam.toLowerCase());
        }
        return false;
      });
    }
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    if(loading === false){
      if (selectedCategory === "All" & selectedSearchType === 'All') {
        setFilteredOrders(orderList);
      } else {
        setFilteredOrders(filteredPayments);
      }
    }
  }, [loading, selectedSearchType, selectedCategory, searchParam]);


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
              </Form.Select>
            </Form.Group>

          </Col>
          <Col md={2}>
            {selectedSearchType !== 'All' && (
              <Form.Control
                type="text"
                placeholder={`Search ${selectedSearchType}`}
                value={searchParam}
                onChange={handleSearchInputChange}
              />
            )}

          </Col>
          <Col md={2}>
            {selectedSearchType !== 'All' && (
              <Button onClick={handleSearchClick}>Search</Button>
            )}
          </Col>

          {/* <Col md={2} className='text-end'>
            <Button onClick={handleClickNewItem}>Dashboard</Button>
          </Col> */}
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
            {
              filteredOrders && filteredOrders.length > 0 ? (
                filteredOrders.map((payment) => (
                  <AdminPaymentCard
                    key={payment._id}
                    payment={payment} // 개별 `product` 객체를 `ProductCard`에 전달
                    setMode={setMode}
                    setShowDialog={setShowDialog}
                  />
                ))
              ) : (
                <div className="text-center">
                  <p>No Payments List</p>
                </div>
              )
            }
          </Row>)}

        <ReactPaginate className="pagination"
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
    </div>
  );
};

export default AdminPaymentPage;
