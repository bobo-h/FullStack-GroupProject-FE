import React, { useState, useEffect } from "react";
import { Form, Modal, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../../../../../utils/CloudinaryUploadWidget";
import { CATEGORY, IS_ACTIVE } from "../../../../../constants/product.constants";
import "../style/adminProduct.style.css";
import Button from '../../../../../common/components/Button';
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
  category: [],
  is_active: "active",
  price: 0,
};

const NewProductDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, success, selectedProduct } = useSelector(
    (state) => state.product
  );
  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : selectedProduct
  );
  const dispatch = useDispatch();

  // 성공 시 다이얼로그 닫기
  useEffect(() => {
    if (success) setShowDialog(false);
  }, [success]);

  // 다이얼로그가 열리면, 모드에 따라 초기 데이터 설정
  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      if (mode === "edit") {
        setFormData(selectedProduct);
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
      //새 상품 만들기
      console.log("formData??", formData)
      dispatch(createProduct(formData))
    } else {
      // 상품 수정하기
      console.log("selectedProduct??", selectedProduct)
      console.log("formData??", formData)
      dispatch(editProduct({ ...formData, id: selectedProduct._id })
      );
    };

  };

  const handleChange = (event) => {
    //form에 데이터 넣어주기
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  }

  const handleCategoryChange = (value) => {
    setFormData((prevFormData) => {
      const updatedCategory = [value]; // 기존 값을 지우고 새로 선택된 값만 배열로 저장
      console.log("Updated category:", updatedCategory); // 디버깅 로그
      return { ...prevFormData, category: updatedCategory };
    });
  };

  const uploadImage = (url) => {
    //이미지 업로드
    setFormData({ ...formData, image: url })
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
      {error && (
        <div className="error-message">
          <Alert variant="danger">{error}</Alert>
        </div>
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

          {/* 조건부 렌더링: 이미지가 있을 때만 보여줍니다 */}
          {/* {formData.image && ( */}
          {/* <img
            id="uploadedimage"
            src={formData.image}
            className="upload-image mt-2"
            alt="uploadedimage"
          /> */}
          {/* 이미지가 있을 때 불투명도 조정 */}
          <img
            id="uploadedimage"
            src={formData.image || "#"} // 이미지가 없을 때 기본 이미지나 빈 값 사용
            className={`upload-image mt-2 ${formData.image ? "" : "blurred-image"}`}
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
              value={formData.category[0] || ""} // 첫 번째 선택된 값을 표시
              onChange={(e) => handleCategoryChange(e.target.value)} // 변경 핸들러 호출
              required
            >
              {CATEGORY.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="is_active">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.is_active}
              onChange={handleChange}
              required
            >
              {IS_ACTIVE.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
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
