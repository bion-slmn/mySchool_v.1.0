import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/login.css'; // Ensure you have a CSS file for styling
import { useState } from 'react';
import SubmitButton from './submitButton';
import { useAuth } from '../service/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitted Email:', auth);
    console.log('Submitted Email:', email);
    console.log('Submitted Password:', password);
    setIsLoading(true);

    try {
      await auth.loginAction({ email, password });
    }catch (error) {
      console.error('Error logging in', error);
    }
    finally {
      setIsLoading(false);
    }

  };

  return (
    <Form className="login-form" onSubmit={handleSubmit}>
      <h1>Let's Login ...</h1>
      <br />
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          value={email}
          onChange={handleInput}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={handleInput}
        />
      </Form.Group>

        <SubmitButton text="Login" isLoading={false} />
    </Form>
  );
}

export default Login;
