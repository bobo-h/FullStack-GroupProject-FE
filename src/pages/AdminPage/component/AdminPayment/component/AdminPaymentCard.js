import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../style/adminPayment.style.css";
import { useDispatch } from "react-redux";

const AdminPaymentCard = ({ payment, setMode, setShowDialog }) => {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [alertContent, setAlertContent] = useState("");

    // const handleClickEditItem = () => {
    //     // Edit 모드로 설정하고 다이얼로그 열기
    //     setMode("edit");

    //     // 선택한 상품을 Redux 상태에 저장
    //     dispatch(setSelectedProduct(product));
    //     setShowDialog(true);
    // };

    // const handleClickDeleteItem = () => {
    //     dispatch(deleteProduct(product._id))
    //         .then(() => {
    //             setAlertContent("상품 삭제 완료하였습니다!");
    //             setShowAlert(true);
    //         })
    //         .catch((error) => {
    //             setAlertContent("상품 삭제 실패!");
    //             setShowAlert(true);
    //         });
    // };

    return (
        <div className="payment-table-content">
            <Container>
                <Row className="mb-4">
                    <Col md={2} className="d-flex align-items-center">
                        {payment.orderNum}
                    </Col>
                    <Col md={2} className="d-flex align-items-center">
                        {payment.createdAt.slice(0, 10)}
                    </Col>
                    <Col md={2} className="d-flex align-items-center">
                        {payment.email}
                    </Col>
                    <Col md={2} className="d-flex align-items-center">
                        {payment.productName}
                    </Col>
                    <Col md={1} className="d-flex align-items-center">
                        <img src={payment.productId.image} alt={payment.productId.name} className="img-fluid" />
                    </Col>
                    <Col md={1} className="d-flex align-items-center">
                        {payment.productCategory[0]}
                    </Col>
                    <Col md={1} className="d-flex align-items-center">
                        {payment.price}
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default AdminPaymentCard;
