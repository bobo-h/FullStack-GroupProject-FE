import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import UserTable from "./component/AdminUserTable";
import UserCard from "./component/AdminUserCard";

const AdminUser = () => {
  const [sortBy, setSortBy] = useState("");
  return (
    <div className="admin-user-page">
      <Container>
        <Row>
          <Col md={2}>
            <h2>User</h2>
          </Col>
          <Col md={3}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>최신순</option>
              <option>등록순</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="table-area">
          <UserTable />
          <UserCard />
        </Row>
      </Container>
    </div>
  );
};

export default AdminUser;
