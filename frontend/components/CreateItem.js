import React, { Component } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag';
import Router from 'next/router'
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import DisplayError from './ErrorMessage';


const CREATE_ITEM_MUTATION = gql`
 mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
 ){createItem(
         title: $title
         description: $description
         price: $price
         image: $image
         largeImage: $largeImage
     ){
         id
     }
 }
`;

class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 120
    }

    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val })
    }

    uploadFile = async (e) => {
        const { files } = e.target;
        const data = new FormData();
        data.append('file', files[0])
        data.append('upload_preset', 'SickReact')

        const res = await fetch('https://api.cloudinary.com/v1_1/didtw1zwf/image/upload',
            {
                method: 'POST', body: data
            })
        const file = await res.json();
        this.setState({
            image: file.secure_url,
            largeImage: file.eager.secure_url
        })

    }
    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error }) => (
                    <Form onSubmit={async (e) => {
                        e.preventDefault();
                        const res = await createItem();
                        console.log(res);
                        Router.push({
                            pathname: '/item',
                            query: { id: res.data.createItem.id }
                        })
                    }}>
                        <DisplayError error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="title">
                                Title
                    <input type="text" id="title" name="title" onChange={this.handleChange}
                                    placeholder="Title" required value={this.state.title} />
                            </label>
                            <label htmlFor="description">
                                Description
                    <input type="text" id="description" name="description" onChange={this.handleChange}
                                    placeholder="Enter the Description" required value={this.state.description} />
                            </label>
                            <label htmlFor="price">
                                Price
                    <input type="number" id="price" name="price" onChange={this.handleChange}
                                    placeholder="Price" required value={this.state.price} />
                            </label>
                            <label htmlFor="file">
                                Image
                                <input type="file" id="file" name="file" onChange={this.uploadFile}
                                    placeholder="Upload Image" required />
                                {this.state.image && (
                                    <img width="200" src={this.state.image} alt="Upload Preview" />
                                )}
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION }