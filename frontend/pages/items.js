import Items from "../components/Items";

const Home = ({ query }) => {
    return (
        <div>
            <Items page={parseFloat(query.page)} />
        </div>
    );
};

export default Home;