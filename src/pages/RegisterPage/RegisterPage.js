import React from "react";
import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "./style/resgister.style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  registerUser,
  ClearSuccess,
} from "../../features/user/userSlice";
import CustomModal from "../../common/components/CustomModal";

const RegisterPage = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    birthday: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });

  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);

  const { registrationError, registrationSuccess } = useSelector(
    (state) => state.user
  );

  const onCloseForError = () => {
    dispatch(clearErrors());
  };

  const onCloseForSuccess = () => {
    dispatch(ClearSuccess());
  };

  const register = (event) => {
    event.preventDefault();
    const { email, name, password, confirmPassword, birthday, policy } =
      formData;

    const checkConfirmPassword = password === confirmPassword;
    if (!checkConfirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!policy) {
      setPolicyError(true);
      return;
    }

    setPasswordError("");
    setPolicyError(false);
    dispatch(registerUser({ name, email, password, birthday }));
  };

  const handleChange = (event) => {
    event.preventDefault();
    let { id, type, value, checked } = event.target;
    if (id === "confirmPassword" && passwordError) setPasswordError("");
    if (type === "checkbox") {
      if (policyError) setPolicyError(false);
      setFormData((preState) => ({ ...preState, [id]: checked }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  return (
    <Container className="register-area">
      {registrationError && (
        <div>
          <CustomModal
            message={registrationError}
            onClose={onCloseForError}
            showCancelButton={false}
          />
        </div>
      )}

      {registrationSuccess && (
        <div>
          <CustomModal
            message={registrationSuccess}
            onClose={onCloseForSuccess}
            redirectTo={"/login"}
            showCancelButton={false}
          />
        </div>
      )}
      <div className="register-area__title">
        <h2>회원가입</h2>
      </div>
      <Form onSubmit={register}>
        <Form.Group controlId="formEmail">
          <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="이메일을 입력해주세요"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formName">
          <Form.Label>이름</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="이름을 입력해주세요"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formBirthday">
          <Form.Label>생년월일</Form.Label>
          <Form.Control
            type="date"
            id="birthday"
            placeholder="생년월일을 입력해주세요"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formConfirmPassword">
          <Form.Label>비밀번호 재확인</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="비밀번호 재확인"
            onChange={handleChange}
            required
            isInvalid={passwordError}
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
          />
        </Form.Group>
        <Button className="resgister__button" type="submit">
          회원가입
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
