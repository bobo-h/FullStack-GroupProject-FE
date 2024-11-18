import React, { useEffect, useState } from "react";
import { Form, Col, Row, Image, Container } from "react-bootstrap";
import Button from "../../../common/components/Button";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../../../common/components/Alert";
import Alert3 from "../../../common/components/Alert3";
import {
  editUserInfo,
  clearErrors,
  deleteUserInfo,
} from "../../../features/user/userSlice";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import userDefaultLogo from "../../../assets/userDefaultLogo.png";
import "../style/userInfo.style.css";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, editError, deleteError } = useSelector((state) => state.user);

  // formData 상태 초기화
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    profileImage: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [deleteShowAlert, setDeleteShowAlert] = useState(false);

  // user 정보가 변경되면 formData 갱신
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        birthday: user.birthday?.slice(0, 10) || "", // YYYY-MM-DD 형식으로 설정
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  //form에 데이터 넣어주기
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };
  // 프로필 사진 변경 핸들러
  const uploadImage = (url) => {
    setFormData({ ...formData, profileImage: url });
  };

  // 정보 업데이트 핸들러
  const handleUpdate = () => {
    if (isEditing) {
      // 업데이트 BE
      if (!formData.name) {
        setAlertMessage("이름은 필수 입력 값입니다.");
        setShowAlert(true);
        return;
      }
      dispatch(editUserInfo({ id: user?._id, formData }));
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };
  // Alert창 닫을 때의 설정 (에러 초기화)
  const handleCloseAlert = () => {
    dispatch(clearErrors());
    setShowAlert(false);
    setDeleteShowAlert(false);
  };

  const handleDelete = () => {
    setDeleteShowAlert(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteUserInfo({ id: user?._id, navigate }));
    setDeleteShowAlert(false);
  };

  return (
    <div className="user-info-page">
      <Container>
        <Row className="d-flex justify-content-center align-items-center">
          <Col xs={12} md={4} className="profile-image-area">
            <Image
              id="uploadedimage"
              src={
                formData.profileImage && formData.profileImage.trim() !== ""
                  ? formData.profileImage
                  : userDefaultLogo
              }
              className="upload-image-style"
              alt="uploadedimage"
              roundedCircle
              width={150}
              height={150}
            />

            <Form.Group className="profile-image__upload__btn">
              <div className="form-label-container">
                <Form.Label>프로필 사진</Form.Label>
              </div>
              {isEditing ? (
                <CloudinaryUploadWidget
                  className="cloudinary-style"
                  uploadImage={uploadImage}
                />
              ) : (
                ""
              )}
            </Form.Group>
          </Col>
          <Col xs={12} md={8} className="userInfo-form-style">
            <Form>
              <Form.Group as={Row} controlId="name" className="mb-3">
                <Form.Label column sm={3} className="label-item-style">
                  이름
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    className="form-item-style"
                    type="text"
                    value={formData.name}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="birthday" className="mb-3">
                <Form.Label column sm={3} className="label-item-style">
                  생일
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    className="form-item-style"
                    type="date"
                    value={formData.birthday}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                </Col>
              </Form.Group>
              <div className="userInfo-form__btnList">
                <Button
                  onClick={handleUpdate}
                  className="userInfo-form__btn__modify"
                >
                  {isEditing ? "수정 완료" : "회원정보 수정"}
                </Button>
                <Button
                  className="userInfo-form__btn__delete"
                  onClick={handleDelete}
                >
                  회원탈퇴
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>

      {showAlert && <Alert onClose={handleCloseAlert}>{alertMessage}</Alert>}
      {editError && <Alert onClose={handleCloseAlert}>{editError}</Alert>}

      {deleteShowAlert && (
        <Alert3
          onClose={handleCloseAlert}
          buttonText="확인"
          onButtonClick={handleConfirmDelete}
        >
          <p>
            회원 탈퇴를 하면 90일 동안 해당 이메일을 사용하실 수 없습니다.
            정말로 탈퇴하시겠습니까?
          </p>
        </Alert3>
      )}
    </div>
  );
};

export default UserInfo;
