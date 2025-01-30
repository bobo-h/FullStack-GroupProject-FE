import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../style/adminUser.style.css";
import Button2 from "../../../../../common/components/Button2";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUserList,
  getIneligibleUserList,
  getEligibleUserList,
  getAllAdminList,
} from "../../../../../features/admin/adminSlice";

const UserCard = ({ sortBy, userType, onEditUser, searchResults = [] }) => {
  const dispatch = useDispatch();
  const { allUser = [] } = useSelector((state) => state.admin);
  const { ineligibleUser = [] } = useSelector((state) => state.admin);
  const { eligibleUser = [] } = useSelector((state) => state.admin);
  const { allAdmin = [] } = useSelector((state) => state.admin);

  const data =
    searchResults && searchResults.length > 0
      ? searchResults
      : userType === "allUser"
      ? allUser
      : userType === "ineligibleUser"
      ? ineligibleUser
      : userType === "eligibleUser"
      ? eligibleUser
      : allAdmin;

  useEffect(() => {
    if (searchResults && searchResults.length === 0) {
      if (userType === "allUser") {
        console.log("allUser", allUser);
        dispatch(getAllUserList());
      } else if (userType === "ineligibleUser") {
        dispatch(getIneligibleUserList());
      } else if (userType === "eligibleUser") {
        dispatch(getEligibleUserList());
      } else if (userType === "allAdmin") {
        dispatch(getAllAdminList());
      }
    }
  }, [userType, sortBy]);

  return (
    <div className="user-table-content">
      <Container>
        {searchResults === null ? (
          <p>검색된 데이터가 없습니다.</p>
        ) : data && data.length > 0 ? (
          data.map((user, index) => (
            <Row key={user.id || index} className="mb-4">
              <Col xs={1} md={1} className="d-flex align-items-center">
                {index + 1}
              </Col>
              <Col xs={3} md={3} className="d-flex align-items-center">
                {user.name}
              </Col>
              <Col xs={4} md={4} className="d-flex align-items-center email">
                {user.email}
              </Col>
              <Col xs={3} md={2} className="d-flex align-items-center">
                {user.level}
              </Col>
              <Col
                xs={1}
                md={2}
                className="d-flex align-items-center justify-content-center"
              >
                {userType !== "ineligibleUser" &&
                  userType !== "eligibleUser" && (
                    <Button2
                      className="user-table-content__btn"
                      onClick={() => onEditUser(user)}
                    >
                      수정
                    </Button2>
                  )}
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
