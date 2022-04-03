import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import {loginUser} from '@store/reducers/auth';
import {Button} from '@components';
import {faEye, faEyeSlash} from '@fortawesome/free-regular-svg-icons';
import {setWindowClass} from '@app/utils/helpers';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {COLOR_VARIANTS} from '@app/utils/themes';
import styled from 'styled-components';

import * as Yup from 'yup';

import {Form, InputGroup} from 'react-bootstrap';
import * as AuthService from '../../services/auth';

const InnerIcon = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 100;
  cursor: default;
`;

const Login = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [t] = useTranslation();

  const login = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      const token = await AuthService.loginByAuth(email, password);
      toast.success('Login is succeed!');
      setAuthLoading(false);
      dispatch(loginUser(token));
      navigate('/');
    } catch (error: any) {
      setAuthLoading(false);
      toast.error(error.message || 'Failed');
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const {handleChange, values, handleSubmit, touched, errors} = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required')
    }),
    onSubmit: (values) => {
      login(values.email, values.password);
    }
  });

  setWindowClass('hold-transition login-page');

  return (
    <div className="login-box">
      <div className="card card-outline">
        <div className="card-header text-center border-0">
          <Link to="/" className="h1">
            <b>Logo Nelaru</b>
          </Link>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={values.email}
                  isInvalid={touched.email && !!errors.email}
                />
                {touched.email && errors.email ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                ) : null}
              </Form.Group>
            </div>
            <div className="mb-3">
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="password"
                    type={passwordShown ? 'text' : 'password'}
                    onChange={handleChange}
                    value={values.password}
                    isInvalid={touched.password && !!errors.password}
                    autoComplete="on"
                  />
                  {touched.password && errors.password ? (
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  ) : (
                    <InputGroup.Append>
                      <InnerIcon onClick={togglePassword}>
                        <FontAwesomeIcon
                          icon={passwordShown ? faEyeSlash : faEye}
                          style={{color: '#6c757d'}}
                        />
                      </InnerIcon>
                    </InputGroup.Append>
                  )}
                </InputGroup>
              </Form.Group>
            </div>
            <Button
              className="mb-3"
              block
              type="submit"
              isLoading={isAuthLoading}
            >
              {/* @ts-ignore */}
              {t('login.button.signIn.label')}
            </Button>
          </form>
          <p className="mb-3 text-center">
            <Link
              to="/forgot-password"
              style={{color: COLOR_VARIANTS[1].value}}
            >
              {t('login.label.forgotPass')}
            </Link>
          </p>
          <Button
            className="mb-3"
            block
            type="submit"
            theme="light"
            style={{color: COLOR_VARIANTS[1].value}}
            onClick={() => navigate('/register')}
          >
            {/* @ts-ignore */}
            {t('login.label.registerNew')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
