import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Dropdown, DropdownButton, FloatingLabel, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {SyntheticEvent, useState} from "react";
import {AuthApi} from "../api/AuthApi";
import {BoardApi} from "../api/BoardApi";
import {toast} from "react-toastify";

function Header() {
    const [title, setTitle] = useState('');
    const saveBoard = async (e: SyntheticEvent) => {
        e.preventDefault()

        await BoardApi.createBoard({
            title: title,
        })

        toast.success("Board created");
    }

    return (
        <Navbar bg='dark' variant='dark' expand="lg" collapseOnSelect>
            <Container>
                <Navbar.Brand href="/">BoardPro</Navbar.Brand>
                <DropdownButton variant="info" id="dropdown-basic-button" title="Create">
                    <Dropdown.Item href="#/action-1">New Board</Dropdown.Item>
                    <Container>
                        <Form onSubmit={saveBoard}>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Title"
                        className="mb-3"
                    >
                        <Form.Control type="title" placeholder="title" value={title} onChange={e => setTitle(e.target.value)}/>
                    </FloatingLabel>
                        <Button variant="info" type="submit">Save</Button>
                        </Form>
                    </Container>
                </DropdownButton>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/signup">Sign Up</Nav.Link>
                        <Nav.Link href="/login">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header