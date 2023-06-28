import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {SyntheticEvent, useState} from "react";
import FormContainer from "../components/FormContainer";

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = (e: SyntheticEvent) => {
        e.preventDefault()
        console.log("submitted")
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