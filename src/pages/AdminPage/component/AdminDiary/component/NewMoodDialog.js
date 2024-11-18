import React, { useState, useEffect } from "react";
import { Form, Modal, Row, Col } from "react-bootstrap";
import Alert from "../../../../../common/components/Alert";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../../../../../utils/CloudinaryUploadWidget";
import "../style/adminMood.style.css";
import Button from "../../../../../common/components/Button";
import {
  clearError,
  createMood,
  editMood,
} from "../../../../../features/mood/moodSlice";

const InitialFormData = {
  id: "",
  name: "",
  image: "",
  description: "",
  isDeleted: "No",
};

const NewProductDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, success, selectedMood } = useSelector((state) => state.mood);
  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : selectedMood
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const dispatch = useDispatch();

  // 성공 시 다이얼로그 닫기
  // useEffect(() => {
  //   if (success) setShowDialog(false);
  // }, [success]);

  // 다이얼로그가 열리면, 모드에 따라 초기 데이터 설정
  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      if (mode === "edit") {
        setFormData(selectedMood);
      } else {
        setFormData({ ...InitialFormData });
      }
    }
  }, [showDialog]);

  const handleClose = () => {
    // 다이얼로그 닫아주기
    setShowDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === "new") {
      //새 무드 만들기
      dispatch(createMood(formData))
        .then(() => {
          setAlertContent("무드 생성 완료하였습니다!");
          setShowAlert(true);
        })
        .catch((error) => {
          setAlertContent("무드 생성 실패!");
          setShowAlert(true);
        });
    } else {
      // 무드 수정하기
      dispatch(editMood({ ...formData, id: selectedMood._id }))
        .then(() => {
          setAlertContent("무드 수정 완료하였습니다!");
          setShowAlert(true);
        })
        .catch((error) => {
          setAlertContent("무드 수정 실패!");
          setShowAlert(true);
        });
    }
  };

  const handleChange = (event) => {
    //form에 데이터 넣어주기
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const uploadImage = (url) => {
    //이미지 업로드
    setFormData({ ...formData, image: url });
  };

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        {mode === "new" ? (
          <Modal.Title>Create New Mood</Modal.Title>
        ) : (
          <Modal.Title>Edit Mood</Modal.Title>
        )}
      </Modal.Header>
      {error && (
        <div className="error-message">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
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
      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="id">
            <Form.Label>Mood ID</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Enter Mood Id"
              required
              value={formData.id}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Name"
              required
              value={formData.name}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="string"
            placeholder="Description"
            as="textarea"
            onChange={handleChange}
            rows={3}
            value={formData.description}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="Image" required>
          <Form.Label>Image</Form.Label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />
          <img
            id="uploadedimage"
            src={formData.image || "#"} // 이미지가 없을 때 기본 이미지나 빈 값 사용
            className={`upload-image mt-2 ${formData.image ? "" : "blurred-image"
              }`}
            alt="uploadedimage"
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="isDeleted">
            <Form.Label>isDeleted</Form.Label>
            <Form.Select
              value={formData.isDeleted} // 초기값이 "No"로 설정되었는지 확인
              onChange={(e) => {
                const newValue = e.target.value;
                console.log("Updated isDeleted:", newValue); // 값 디버깅
                setFormData({ ...formData, isDeleted: newValue });
              }}
              required
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Form.Select>
          </Form.Group>
        </Row>
        {mode === "new" ? (
          <Button variant="primary" type="submit">
            Submit
          </Button>
        ) : (
          <Button variant="primary" type="submit">
            Edit
          </Button>
        )}
      </Form>
    </Modal>
  );
};

export default NewProductDialog;
