import React, { useState } from "react";
import { Container, Row, Col, Form, Tab, Tabs } from "react-bootstrap";
import UserTable from "./component/AdminUserTable";
import UserCard from "./component/AdminUserCard";

const AdminUser = () => {
  const [sortBy, setSortBy] = useState("");
  const [activeTab, setActiveTab] = useState("allUser"); // 초기 탭 설정
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
          {/* 탭 메뉴 */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            {/* 회원 리스트 탭 */}
            <Tab eventKey="allUser" title="회원 리스트">
              <UserTable />
              <UserCard sortBy={sortBy} userType="allUser" />
            </Tab>

            {/* 탈퇴 회원 탭 */}
            <Tab eventKey="ineligibleUsers" title="탈퇴회원 (90일이내)">
              <UserTable />
              <UserCard sortBy={sortBy} userType="ineligibleUser" />
            </Tab>

            {/* 탈퇴 회원 탭 */}
            <Tab eventKey="eligibleUsers" title="탈퇴회원 (90일이상)">
              <UserTable />
              <UserCard sortBy={sortBy} userType="eligibleUser" />
            </Tab>
          </Tabs>
          {/* <UserTable />
          <UserCard /> */}
        </Row>
      </Container>
    </div>
  );
};

export default AdminUser;
