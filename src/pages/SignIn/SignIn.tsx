import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAlert from '../../hooks/useAlert';
import useAuth from '../../hooks/useAuth';
import api, { FormDataLogin } from '../../services/api';
import { AxiosError } from 'axios';
import { Input, Form, Title, SideLogo } from '../../components/FormComponents/index';
import FormContainer from '../../components/FormComponents/FormContainer';
import { Box, Container, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';

const style = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxInputContainer: {
    width: '100%',
    height: '45px',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-beteween',
    paddingLeft: '10px',
    borderRadius: '10px'
  },
  boxIconContainer: {
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    backgroundColor: '#BF0000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  icon: {
    color: '#fff',
    width: '15px'
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '14px',
    backgroundColor: '#191919',
    width: '100%',
    borderRadius: '10px',
    ':hover': {
      backgroundColor: '#191919'
    }
  },
  loadingButton: {
    backgroundColor: 'rgba(25,25,25, 0.5)',
    width: '100%',
    borderRadius: '10px',
  },
  login: {
    fontSize: '12px',
    color: '#fff',
    '&:hover': {
      cursor: 'pointer'
    }
  }
};

export default function SignIn() {

  const { setMessage } = useAlert();
  const { auth, login } = useAuth();
  const [formData, setFormData] = useState<FormDataLogin>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate('/home');
    }
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!formData.password ||
      !formData.email
    ) {
      setMessage({ type: 'warning', text: 'Preencha todos os campos corretamente.' });
      return;
    }

    const { email, password } = formData;

    setIsLoading(true);
    try {
      const response = await api.signIn({ password, email });
      setMessage({ type: 'success', text: 'Login efetuado com sucesso.' });
      login(response.data);
      navigate('/home');

    } catch (error: AxiosError | Error | any) {
      setIsLoading(false);
      setMessage({ type: 'error', text: error.response.data });
      setFormData({ ...formData, password: '' });
    }
  }

  return (
    <FormContainer>
      <SideLogo />
      <Container sx={style.container}>
        <Title text="LOGIN"></Title>
        <Form >
          <Box
            component="div"
            sx={style.boxInputContainer}>
            <Box
              component="div"
              sx={style.boxIconContainer}>
              <MailIcon sx={style.icon} />
            </Box>
            <Input
              label="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Box>

          <Box
            component="div"
            sx={style.boxInputContainer}>
            <Box
              component="div"
              sx={style.boxIconContainer}>
              <LockIcon sx={style.icon} />
            </Box>
            <Input
              label="password"
              placeholder="Senha"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </Box>

          {!isLoading ?
            <Button sx={style.button}
              variant="contained"
              onClick={handleSubmit}

            >
              Entrar
            </Button>
            :
            <LoadingButton loading variant="outlined" sx={style.loadingButton}>
              Submit
            </LoadingButton>
          }

          <Box component="div" onClick={() => navigate('/signup')} sx={style.login}>
            Cadastre-se
          </Box>
        </Form>
      </Container>
    </FormContainer>
  );
}

export {
  SignIn
};