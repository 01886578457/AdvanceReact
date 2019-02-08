import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form'
import Error from './ErrorMessage'

const SIGNUP_MUTATION = gql`
 mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!){
    signup(email: $email, name: $name, password: $password){
        id
        email
        password
    }
 }
`

class Signup extends Component {
    state = {
        name: '',
        email: '',
        password: ''
    }
    onChangeInput = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    render() {
        return (
            <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
                {(signup, { error, loading }) => {
                    return (
                        <Form method="post" onSubmit={async (e) => {
                            e.preventDefault();
                            await signup();
                            this.setState({
                                name: '',
                                password: '',
                                email: ''
                            })
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Signup</h2>
                                <Error error={error} />
                                <label htmlFor="email">
                                    <input type="email" name="email" placeholder="Email" value=
                                        {this.state.email} onChange={this.onChangeInput} />
                                </label>
                                <label htmlFor="name">
                                    <input type="text" name="name" placeholder="Name" value=
                                        {this.state.name} onChange={this.onChangeInput} />
                                </label>
                                <label htmlFor="password">
                                    <input type="password" name="password" placeholder="Password"
                                        value={this.state.password} onChange={this.onChangeInput} />
                                </label>
                                <button type="submit">Sign Up!</button>
                            </fieldset>
                        </Form>
                    )
                }}
            </Mutation>

        );
    }
}

export default Signup;