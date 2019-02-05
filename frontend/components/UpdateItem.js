import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag';
import Router from 'next/router'
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import DisplayError from './ErrorMessage';


const SINGLE_ITEM_QUERY = gql`
 query SINGLE_ITEM_QUERY($id: ID!){
     item(where: {id: $id}){
         id
         title
         description
         price
     }
 }
`

const UPDATE_ITEM_MUTATION = gql`
mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
 ){updateItem(
         id: $id
         title: $title
         description: $description
         price: $price
     ){
         id
         title
         description
         price
     }
 }
`;

class UpdateItem extends Component {
    state = {}

    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val })
    }

    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();
        console.log(this.state);
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state
            }
        });
    }

    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{
                id: this.props.id
            }}>
                {({ data, loading }) => {
                    if (loading) return <p>Loading ...</p>
                    if (!data.item) return <p>No Item Found with ID: {this.props.id}</p>
                    return (
                        <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                            {(updateItem, { loading, error }) => (
                                <Form
                                    onSubmit={e => this.updateItem(e, updateItem)}
                                >
                                    <DisplayError error={error} />
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        <label htmlFor="title">
                                            Title
                    <input
                                                type="text"
                                                id="title" name="title" onChange={this.handleChange}
                                                placeholder="Title" required
                                                defaultValue={data.item.title} />
                                        </label>
                                        <label htmlFor="description">
                                            Description
                    <input type="text"
                                                id="description" name="description" onChange={this.handleChange}
                                                placeholder="Enter the Description" required
                                                defaultValue={data.item.description} />
                                        </label>
                                        <label htmlFor="price">
                                            Price
                    <input type="number"
                                                id="price" name="price" onChange={this.handleChange}
                                                placeholder="Price" required
                                                defaultValue={data.item.price} />
                                        </label>
                                        <button type="submit">Sav{loading ? 'ing' : 'e'} changed</button>
                                    </fieldset>
                                </Form>
                            )}
                        </Mutation>
                    )
                }}
            </Query>
        );
    }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION }