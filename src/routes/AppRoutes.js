import { Switch, Route, Redirect } from "react-router-dom";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import Users from "../components/ManageUsers/Users";
import PrivateRoutes from "./PrivateRoutes";
import Role from "../components/Role/Role";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import GroupRole from "../components/GroupRole/GroupRole";
import Home from "../components/Home/Home";
import About from "../components/About/About";
import Doctor from "../components/Doctor/Doctor";



const AppRoutes = () => {
    const { user } = useContext(UserContext);
    const Project = () => {
        return (
            <div className="container mt-3">
                <h4>Todo...</h4>
            </div>
        );
    };


    // Đợi load user xong rồi mới render route
    if (user.isLoading) return null;

    return (
        <Switch>
            <PrivateRoutes path="/users" component={Users} />
            <PrivateRoutes path="/projects" component={Project} />
            <PrivateRoutes path="/roles" component={Role} />
            <PrivateRoutes path="/group-role" component={GroupRole} />

            <Route path="/login">
                <Login />
            </Route>
            <Route path="/register">
                <Register />
            </Route>
            <Route path="/doctor">
                <Doctor />
            </Route>

            <Route path="/" exact>
                <Home />
            </Route>

            <Route path="*">
                <div className="container">404 not found...</div>
            </Route>
        </Switch>
    );
};

export default AppRoutes;
