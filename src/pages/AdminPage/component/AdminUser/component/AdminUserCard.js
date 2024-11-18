import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../style/adminUser.style.css";
import Button2 from "../../../../../common/components/Button2";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUserList,
  getIneligibleUserList,
  getEligibleUserList,
} from "../../../../../features/admin/adminSlice";

const UserCard = ({ sortBy, userType }) => {
  const dispatch = useDispatch();
  const { allUser = [] } = useSelector((state) => state.admin);
  const { ineligibleUser = [] } = useSelector((state) => state.admin);
  const { eligibleUser = [] } = useSelector((state) => state.admin);

  const data =
    userType === "allUser"
      ? allUser
      : userType === "ineligibleUser"
      ? ineligibleUser
      : eligibleUser;

  useEffect(() => {
    //API 호출
    if (userType === "allUser") {
      console.log("allUser", allUser);
      dispatch(getAllUserList());
    } else if (userType === "ineligibleUser") {
      dispatch(getIneligibleUserList());
    } else if (userType === "eligibleUser") {
      dispatch(getEligibleUserList());
    }
  }, [userType, sortBy]);

  return (
    <div className="user-table-content">
      <Container>
        {data && data.length > 0 ? (
          data.map((user, index) => (
            <Row className="mb-4">
              <Col md={1} className="d-flex align-items-center">
                {index}
              </Col>
              <Col md={3} className="d-flex align-items-center">
                {user.name}
              </Col>
              <Col md={3} className="d-flex align-items-center">
                {user.email}
              </Col>
              <Col md={2} className="d-flex align-items-center">
                {user.level}
              </Col>
              <Col
                md={3}
                className="d-flex align-items-center justify-content-center"
              >
                <Button2>수정</Button2>
                <Button2>삭제</Button2>
              </Col>
            </Row>
          ))
        ) : (
          <p>데이터가 존재하지 않습니다.</p>
        )}
      </Container>
    </div>
  );
};

export default UserCard;
