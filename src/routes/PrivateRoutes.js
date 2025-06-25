import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoutes = ({ component: Component, ...rest }) => {
    const { user } = useContext(UserContext);

    if (user.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                user.isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/admin/login" />
                )
            }
        />
    );
};

export default PrivateRoutes;
