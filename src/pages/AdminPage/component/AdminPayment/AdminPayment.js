import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
// import OrderDetailDialog from "./component/OrderDetailDialog";
import OrderTable from "./component/OrderTable";
import {
  getOrderList,
  setSelectedOrder,
} from "../../../../features/order/orderSlice";
import "./style/adminPayment.style.css";
import LoadingSpinner from "../../../../common/components/LoadingSpinner";

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { orderList, totalPageNum, loading } = useSelector((state) => state.order);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    ordernum: query.get("ordernum") || "",
  });
  const [open, setOpen] = useState(false);

  const tableHeader = [
    "#",
    "Order#",
    "Order Date",
    "User",
    "Order Item",
    "Category",
    "Price",
  ];

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

  const openEditForm = (order) => {
    setOpen(true);
    dispatch(setSelectedOrder(order));
  };

  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {loading ? (
        <div className="text-align-center">
          <LoadingSpinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </LoadingSpinner>
        </div>
      ) : (
        <OrderTable
          header={tableHeader}
          data={orderList}
          openEditForm={openEditForm}
        />
      )}

    </div>
  );
};

export default AdminOrderPage;
