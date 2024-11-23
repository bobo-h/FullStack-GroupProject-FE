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

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loginError } = useSelector((state) => state.user);

  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    dispatch(loginWithEmail({ email, password }));
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
          <p>-외부 계정으로 이용하기-</p>
          <div className="google-login__btn">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default LoginPage;
