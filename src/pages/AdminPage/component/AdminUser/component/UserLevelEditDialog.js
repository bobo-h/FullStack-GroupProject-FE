import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { editLevel } from "../../../../../features/admin/adminSlice";
import { setSelectedUser } from "../../../../../features/admin/adminSlice";
import Alert from "../../../../../common/components/Alert";

const UserLevelEditDialog = ({ showDialog, setShowDialog, selectedUser }) => {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const { error, success } = useSelector((state) => state.admin);

  // 상태 변경 감지 및 Alert 표시
  useEffect(() => {
    if (success) {
      setAlertContent("역할이 성공적으로 변경되었습니다!");
      setShowAlert(true);
    } else if (error) {
      setAlertContent(`수정 실패: ${error}`);
      setShowAlert(true);
    }
  }, [success, error]);

  const handleClose = () => setShowDialog(false);
  const handleSave = () => {
    dispatch(editLevel({ id: selectedUser._id, level: selectedUser.level }));
  };
  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        {showAlert && (
          <Alert
            message={alertContent}
            onClose={() => {
              setShowAlert(false);
              setShowDialog(false);
            }}
            redirectTo="/admin"
          />
        )}
        <Modal.Title>회원 정보 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedUser ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedUser.name}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>이메일</Form.Label>
              <Form.Control
                type="email"
                defaultValue={selectedUser.email}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Level</Form.Label>
              <div>
                {/* Customer 선택 */}
                <Form.Check
                  type="radio"
                  id="customer"
                  label="Customer"
                  name="userLevel" // 같은 name으로 그룹화
                  value="customer"
                  checked={selectedUser.level === "customer"}
                  onChange={(e) =>
                    dispatch(
                      setSelectedUser({
                        ...selectedUser,
                        level: e.target.value,
                      })
                    )
                  }
                />
                {/* Admin 선택 */}
                <Form.Check
                  type="radio"
                  id="admin"
                  label="Admin"
                  name="userLevel"
                  value="admin"
                  checked={selectedUser.level === "admin"}
                  onChange={(e) =>
                    dispatch(
                      setSelectedUser({
                        ...selectedUser,
                        level: e.target.value,
                      })
                    )
                  }
                />
              </div>
            </Form.Group>
          </Form>
        ) : (
          <p>선택된 유저가 없습니다.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSave}>
          수정
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserLevelEditDialog;
