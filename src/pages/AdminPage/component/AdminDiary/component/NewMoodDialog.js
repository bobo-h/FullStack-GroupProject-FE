import React, { useState, useEffect } from "react";
import { Form, Modal, Row, Col } from "react-bootstrap";
import CustomModal from "../../../../../common/components/CustomModal";
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

const NewMoodDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, selectedMood } = useSelector((state) => state.mood);
  const [formData, setFormData] = useState({ ...InitialFormData });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (showDialog) {
      setFormData(
        mode === "new"
          ? { ...InitialFormData }
          : selectedMood || { ...InitialFormData }
      );
    }
  }, [showDialog, mode, selectedMood]);

  useEffect(() => {
    if (error) {
      setModalContent(error);
      setShowErrorModal(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleClose = () => {
    setShowSuccessModal(false);
    setShowDialog(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === "new") {
      try {
        await dispatch(createMood(formData)).unwrap();
        setModalContent("무드 생성 완료하였습니다!");
        setShowSuccessModal(true);
      } catch (error) {
        setModalContent("무드 생성 실패! 다시 시도해주세요.");
        setShowErrorModal(true);
      }
    } else {
      try {
        await dispatch(
          editMood({ ...formData, id: selectedMood._id })
        ).unwrap();
        setModalContent("무드 수정 완료하였습니다!");
        setShowSuccessModal(true);
      } catch (error) {
        setModalContent("무드 수정 실패! 다시 시도해주세요.");
        setShowErrorModal(true);
      }
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const uploadImage = (url) => {
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
      {showErrorModal && (
        <CustomModal
          message={modalContent}
          onClose={() => setShowErrorModal(false)}
          onConfirm={() => setShowErrorModal(false)}
          showCancelButton={false}
        />
      )}
      {showSuccessModal && (
        <CustomModal
          message={modalContent}
          onClose={handleClose}
          onConfirm={handleClose}
          showCancelButton={false}
        />
      )}
      <Form className="form-container admin-modal" onSubmit={handleSubmit}>
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
            src={formData.image || "#"}
            className={`upload-image mt-2 ${
              formData.image ? "" : "blurred-image"
            }`}
            alt="uploadedimage"
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="isDeleted">
            <Form.Label>isDeleted</Form.Label>
            <Form.Select
              value={formData.isDeleted}
              onChange={(e) => {
                const newValue = e.target.value;
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

export default NewMoodDialog;
