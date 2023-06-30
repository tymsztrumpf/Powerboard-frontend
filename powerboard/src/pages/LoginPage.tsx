import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {SyntheticEvent, useState} from "react";
import FormContainer from "../components/FormContainer";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {AuthApi} from "../api/AuthApi";

const LoginPage = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = async (e: SyntheticEvent) => {
        e.preventDefault()

        const response = await AuthApi.signIn({
            email: email,
            password: password,
        })

        localStorage.setItem('token', response.data.token);
        navigate('/');
        toast.success("Logged in");
    }

    return (
        <FormContainer>
            <h1>Login</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group className="my-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}/>
            </Form.Group>

            <Form.Group className="my-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
            </Form.Group>
            <Button className="my-3" variant="primary" type="submit">
                Submit
            </Button>
        </Form>
        </FormContainer>
    )
}
export default LoginPage;