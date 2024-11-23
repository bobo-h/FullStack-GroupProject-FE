import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  loginWithEmail,
  loginWithGoogle,
} from "../../features/user/userSlice";
import "./style/login.style.css";
import { GoogleLogin } from "@react-oauth/google";
import CustomModal from "../../common/components/CustomModal";
import catImage1 from "../../assets/cat-images/cat-image-1.png";
import catImage2 from "../../assets/cat-images/cat-image-2.png";
import catImage3 from "../../assets/cat-images/cat-image-3.png";
import catImage4 from "../../assets/cat-images/cat-image-4.png";
import catImage5 from "../../assets/cat-images/cat-image-5.png";
import catImage6 from "../../assets/cat-images/cat-image-6.png";
import catImage7 from "../../assets/cat-images/cat-image-7.png";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const { user, loginError } = useSelector((state) => state.user);

  const images = [
    catImage1,
    catImage2,
    catImage3,
    catImage4,
    catImage5,
    catImage6,
    catImage7,
  ];

  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    dispatch(loginWithEmail({ email, password }));
  };

  const toggleOtherAccount = () => {
    setShowGoogleLogin((prev) => !prev);
  };
  const handleGoogleLogin = async (googleData) => {
    dispatch(loginWithGoogle(googleData.credential));
  };

  // if (user) {
  //   navigate("/");
  // }
  // user 상태에 따라 리다이렉션 -> 기존에는 토근 로그인 일때만 리다이렉션 해줌.
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  // 에러 초기화
  const onClose = () => {
    dispatch(clearErrors());
  };
  return (
    <Container className="login-area">
      {loginError && (
        <CustomModal
          message={loginError}
          onClose={onClose}
          redirectTo={"/"}
          showCancelButton={false}
        />
      )}

      {/* 고양이 이미지들 */}
      <div className="image-grid">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`cat-${index + 1}`}
            className="cat-image"
          />
        ))}
      </div>
      <div className="login-area__content">
        <div className="login-area__title">
          <img
            src="/logo1.png"
            alt="logo.png"
            className="login-area__logo-image"
          />
        </div>
        <Form className="login-form" onSubmit={handleLoginWithEmail}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일을 입력해주세요"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <div className="login-button-area">
            <Button className="login__btn" type="submit">
              로그인
            </Button>
            <div className="register-link-area">
              아직 계정이 없으세요?
              <Link to="/register" className="link__register">
                {" "}
                회원가입 하기
              </Link>
            </div>
          </div>

          <div className="guide-other-account">
            <Link
              to="#"
              onClick={toggleOtherAccount}
              className="other-account__link"
            >
              ∇ 외부 계정으로 이용하기 ∇
            </Link>
            {showGoogleLogin && (
              <div className="google-login__btn">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div>
            )}
          </div>
        </Form>
      </div>
      {/* 고양이 이미지들 */}
      <div className="image-grid">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`cat-${index + 1}`}
            className="cat-image"
          />
        ))}
      </div>
    </Container>
  );
};

export default LoginPage;
