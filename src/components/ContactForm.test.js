import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    render(<ContactForm />);
    const header = screen.queryByText(/contact form/i);
    expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);

    const firstNameField = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameField, 'john');

    const errors = screen.queryAllByText(/error/i);
    expect(errors.length === 1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const errors = screen.queryAllByText(/error/i);
    expect(errors.length === 3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const firstNameField = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameField, 'validfirstname');

    const lastNameField = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameField, 'validlastname');

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const errors = screen.queryAllByText(/error/i);
    expect(errors.length === 1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);

    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField, 'invalidemail');

    const emailErrorMsg = screen.getByText(/email must be a valid email address/i);
    expect(emailErrorMsg).toHaveTextContent(/email must be a valid email address/i);

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const lastNameErrorMsg = screen.getByText(/lastName is a required field/i);
    expect(lastNameErrorMsg).toHaveTextContent(/lastName is a required field/i);

});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const firstNameField = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameField, 'validfirstname');

    const lastNameField = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameField, 'validlastname');

    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField, 'validemail@email.com');

    // Checking that renders for form submission do not exist before clicking submit
    let firstNameRender = screen.queryByTestId('firstnameDisplay');
    let lastNameRender = screen.queryByTestId('lastnameDisplay');
    let emailRender = screen.queryByTestId('emailDisplay');
    expect(firstNameRender).not.toBeInTheDocument();
    expect(lastNameRender).not.toBeInTheDocument();
    expect(emailRender).not.toBeInTheDocument();

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    // Waiting for render then re-querying for text renders after submission
    await waitFor(() => {
        firstNameRender = screen.queryByTestId('firstnameDisplay');
        lastNameRender = screen.queryByTestId('lastnameDisplay');
        emailRender = screen.queryByTestId('emailDisplay');
        
        expect(firstNameRender).toHaveTextContent('First Name: validfirstname');
        expect(lastNameRender).toHaveTextContent('Last Name: validlastname');
        expect(emailRender).toHaveTextContent('Email: validemail@email.com');
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const firstNameField = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameField, 'validfirstname');

    const lastNameField = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameField, 'validlastname');

    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField, 'validemail@email.com');

    const msgField = screen.getByLabelText(/message/i);
    userEvent.type(msgField, 'this is a message');

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameRender = screen.queryByTestId('firstnameDisplay');
        const lastNameRender = screen.queryByTestId('lastnameDisplay');
        const emailRender = screen.queryByTestId('emailDisplay');
        const msgRender = screen.queryByTestId('messageDisplay');

        
        expect(firstNameRender).toHaveTextContent('First Name: validfirstname');
        expect(lastNameRender).toHaveTextContent('Last Name: validlastname');
        expect(emailRender).toHaveTextContent('Email: validemail@email.com');
        expect(msgRender).toHaveTextContent('Message: this is a message');
    });
});