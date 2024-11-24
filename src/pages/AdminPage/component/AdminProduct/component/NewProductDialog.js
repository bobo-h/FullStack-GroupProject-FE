import React, { useState, useEffect } from "react";
import { Form, Modal, Row, Col } from "react-bootstrap";
import CustomModal from "../../../../../common/components/CustomModal";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../../../../../utils/CloudinaryUploadWidget";
import {
  CATEGORY,
  DEFAULT_PRODUCT,
  IS_ACTIVE,
} from "../../../../../constants/product.constants";
import "../style/adminProduct.style.css";
import Button from "../../../../../common/components/Button";
import {
  clearError,
  createProduct,
  editProduct,
} from "../../../../../features/product/productSlice";

const InitialFormData = {
  id: "",
  name: "",
  image: "",
  description: "",
  category: ["Cat"],
  isActive: "Active",
  price: 0,
  defaultProduct: "No",
};

const NewProductDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, selectedProduct } = useSelector((state) => state.product);
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
          : selectedProduct || { ...InitialFormData }
      );
    }
  }, [showDialog, mode, selectedProduct]);

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
        await dispatch(createProduct(formData)).unwrap();
        setModalContent("상품 생성 완료하였습니다!");
        setShowSuccessModal(true);
      } catch (error) {
        setModalContent("상품 생성 실패! 다시 시도해주세요.");
        setShowErrorModal(true);
      }
    } else {
      try {
        await dispatch(
          editProduct({ ...formData, id: selectedProduct._id })
        ).unwrap();
        setModalContent("상품 수정 완료하였습니다!");
        setShowSuccessModal(true);
      } catch (error) {
        setModalContent("상품 수정 실패! 다시 시도해주세요.");
        setShowErrorModal(true);
      }
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCategoryChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: [value],
    }));
  };

  const uploadImage = (url) => {
    setFormData({ ...formData, image: url });
  };

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        {mode === "new" ? (
          <Modal.Title>Create New Product</Modal.Title>
        ) : (
          <Modal.Title>Edit Product</Modal.Title>
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
      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="id">
            <Form.Label>Product ID</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="string"
              placeholder="Enter Product Id"
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
          <Form.Group as={Col} controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={formData.price}
              required
              onChange={handleChange}
              type="number"
              placeholder="0"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={formData.category[0] || ""}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
            >
              {CATEGORY.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="defaultProduct">
            <Form.Label>DefaultProduct</Form.Label>
            <Form.Select
              value={formData.defaultProduct}
              onChange={(e) =>
                setFormData({ ...formData, defaultProduct: e.target.value })
              }
              required
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="isActive">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.isActive}
              onChange={handleChange}
              required
            >
              {IS_ACTIVE.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit">
          {mode === "new" ? "Submit" : "Edit"}
        </Button>
      </Form>
    </Modal>
  );
};

export default NewProductDialog;
