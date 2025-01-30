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

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSearchType, setSelectedSearchType] = useState("All");
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    ordernum: "",
    orderitem: "",
    orderemail: "",
    category: "",
  });
  const [searchParam, setSearchParam] = useState("");

  const handleClickDashboard = () => {
    setShowModal(true);
  };

  const updateQueryParams = (newQuery) => {
    if (newQuery.ordernum === "") {
      delete newQuery.ordernum;
    }
    if (newQuery.orderemail === "") {
      delete newQuery.orderemail;
    }
    if (newQuery.orderitem === "") {
      delete newQuery.orderitem;
    }
    if (newQuery.category === "") {
      delete newQuery.category;
    }

    const params = new URLSearchParams(newQuery);

    navigate("?" + params.toString());
  };

  useEffect(() => {
    setSearchQuery({
      page: 1,
      ordernum: "",
      orderitem: "",
      orderemail: "",
      category: "",
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
    if (selectedCategory === "All") return true;
    if (selectedCategory === "고양이")
      return payment.productCategory[0] === "Cat";
    if (selectedCategory === "배경지")
      return payment.productCategory[0] === "BG_IMG";
    return false;
  });

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);

    const updatedQuery = { ...searchQuery, page: 1 };

    if (e.target.value === "All") {
      updatedQuery.category = "";
    } else {
      if (e.target.value === "고양이") {
        updatedQuery.category = "Cat";
      } else {
        updatedQuery.category = "BG_IMG";
      }
    }

    setSearchQuery(updatedQuery);
    updateQueryParams(updatedQuery);
  };

  const handleSearchTypeChange = (e) => {
    setSelectedSearchType(e.target.value);
    setSearchParam("");
    const updatedQuery = { ...searchQuery, page: 1 };
    if (e.target.value === "All") {
      updatedQuery.ordernum = "";
      updatedQuery.orderemail = "";
      updatedQuery.orderitem = "";
    }

    setSearchQuery(updatedQuery);
    updateQueryParams(updatedQuery);
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
      updatedQuery.orderitem = "";
    } else {
      updatedQuery.orderemail = "";
      updatedQuery.orderitem = "";
      updatedQuery.ordernum = "";
    }

    setSearchQuery(updatedQuery);
    updateQueryParams(updatedQuery);
  };

  return (
    <div className="admin-payment-page">
      <Container>
        <Row>
          <Col md={7} className="d-flex align-items-center payment-title">
            <h2 className="me-3 ">Payment History</h2>
            <Button onClick={handleClickDashboard}>Dashboard</Button>
          </Col>

          <Col md={6} className="d-flex align-items-center mb-3">
            <span className="me-2" style={{ flexBasis: "15%" }}>
              Category:
            </span>
            <Form.Group
              controlId="categorySelect"
              className="mb-0"
              style={{ flexBasis: "55%" }}
            >
              <Form.Select
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option>All</option>
                <option>고양이</option>
                <option>배경지</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={12} className="d-flex align-items-center mb-3">
            <span className="me-2" style={{ flexBasis: "3%" }}>
              Search:
            </span>
            <Form.Group
              controlId="searchType"
              className="mb-0"
              style={{ flexBasis: "29%" }}
            >
              <Form.Select
                value={selectedSearchType}
                onChange={handleSearchTypeChange}
                className="w-100"
              >
                <option>All</option>
                <option>Order Item</option>
                <option>User Email</option>
                <option>Order Num</option>
              </Form.Select>
            </Form.Group>
            {selectedSearchType !== "All" && (
              <>
                <Col md={4} className="ps-0">
                  <Form.Control
                    type="text"
                    placeholder={`Search ${selectedSearchType}`}
                    value={searchParam}
                    onChange={handleSearchInputChange}
                  />
                </Col>
                <Col md={2} className="ps-0">
                  <Button onClick={handleSearchClick}>Search</Button>
                </Col>
              </>
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
            <AdminPaymentTable className="unser-line" />
            {filteredPayments && filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <AdminPaymentCard key={payment._id} payment={payment} />
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
