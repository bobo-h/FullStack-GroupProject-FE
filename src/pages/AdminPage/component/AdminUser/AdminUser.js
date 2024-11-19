import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Tab, Tabs, Button } from "react-bootstrap";
import UserTable from "./component/AdminUserTable";
import UserCard from "./component/AdminUserCard";
import UserLevelEditDialog from "./component/UserLevelEditDialog";
import {
  setSelectedUser,
  deleteAllEligibleUsers,
} from "../../../../features/admin/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import Button2 from "../../../../common/components/Button2";
import Alert from "../../../../common/components/Alert";

const AdminUser = () => {
  const [sortBy, setSortBy] = useState("");
  const [activeTab, setActiveTab] = useState("allUser");
  const [showDialog, setShowDialog] = useState(false); // 다이얼로그 열림 상태 관리
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const selectedUser = useSelector((state) => state.admin.selectedUser);
  const { error, success, message } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  // 상태 변경 감지 및 Alert 표시
  useEffect(() => {
    if (success) {
      setAlertContent(message);
      setShowAlert(true);
    } else if (error) {
      setAlertContent("삭제에 실패하였습니다.");
      setShowAlert(true);
    }
  }, [success, error]);

  // 수정 버튼 클릭 시 호출
  const handleEditUser = (user) => {
    dispatch(setSelectedUser(user)); // 선택된 유저 정보를 Redux 상태에 저장
    setShowDialog(true); // 다이얼로그 열기
  };

  const handleDeleteAllEligibleUsers = () => {
    dispatch(deleteAllEligibleUsers());
  };

  return (
    <div className="admin-user-page">
      <Container>
        {showAlert && (
          <Alert
            message={alertContent}
            onClose={() => {
              setShowAlert(false);
            }}
            redirectTo="/admin"
          />
        )}
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
              <UserCard
                sortBy={sortBy}
                userType="allUser"
                onEditUser={handleEditUser}
              />
            </Tab>

            {/* 탈퇴 회원 탭 */}
            <Tab eventKey="ineligibleUsers" title="탈퇴회원 (90일이내)">
              <UserTable />
              <UserCard
                sortBy={sortBy}
                userType="ineligibleUser"
                onEditUser={handleEditUser}
              />
            </Tab>

            {/* 탈퇴 회원 탭 */}
            <Tab eventKey="eligibleUsers" title="탈퇴회원 (90일이상)">
              <Button2 onClick={handleDeleteAllEligibleUsers}>
                전체 삭제
              </Button2>
              <UserTable />
              <UserCard
                sortBy={sortBy}
                userType="eligibleUser"
                onEditUser={handleEditUser}
              />
            </Tab>
            {/* 관리자 */}
            <Tab eventKey="allAdmin" title="관리자">
              <UserTable />
              <UserCard
                sortBy={sortBy}
                userType="allAdmin"
                onEditUser={handleEditUser}
              />
            </Tab>
          </Tabs>
        </Row>
      </Container>
      {/* EditDialog 추가 */}
      <UserLevelEditDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default AdminUser;
