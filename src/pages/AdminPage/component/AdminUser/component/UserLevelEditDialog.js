import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { editLevel } from "../../../../../features/admin/adminSlice";
import {
  setSelectedUser,
  clearStates,
} from "../../../../../features/admin/adminSlice";
import Button from "../../../../../common/components/Button";
import "../style/adminUser.style.css";
import CustomModal from "../../../../../common/components/CustomModal";

const UserLevelEditDialog = ({ showDialog, setShowDialog, selectedUser }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const { error, success } = useSelector((state) => state.admin);

  useEffect(() => {
    if (success) {
      setModalContent("역할이 성공적으로 변경되었습니다!");
      setShowModal(true);
    } else if (error) {
      setModalContent(`수정 실패: ${error}`);
      setShowModal(true);
    }
    return () => dispatch(clearStates());
  }, [success, error]);

  const handleClose = () => setShowDialog(false);
  const handleSave = () => {
    dispatch(editLevel({ id: selectedUser._id, level: selectedUser.level }));
  };
  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        {showModal && (
          <CustomModal
            message={modalContent}
            onClose={() => {
              setShowModal(false);
              setShowDialog(false);
              dispatch(clearStates());
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
                <Form.Check
                  type="radio"
                  id="customer"
                  label="Customer"
                  name="userLevel"
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
