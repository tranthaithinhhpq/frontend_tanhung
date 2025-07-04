import { Switch, Route, Redirect } from "react-router-dom";
import Login from "../components/Admin/Login/Login";
import Register from "../components/Admin/Register/Register";
import Users from "../components/Admin/ManageUsers/Users";
import PrivateRoutes from "./PrivateRoutes";
import Role from "../components/Admin/Role/Role";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import GroupRole from "../components/Admin/GroupRole/GroupRole";
import Home from "../components/Admin/Home/Home";
import HomeClient from "../components/Client/Home/Home";
import DoctorGallery from "../components/Client/Doctor/DoctorGallery";
import Doctor from "../components/Admin/Doctor/Doctor";
import AppointmentForm from "../components/Client/Appointment/AppointmentForm";
import DoctorDetailPage from "../components/Client/Doctor/DoctorDetailPage";
import NewsForm from "../components/Admin/News/NewsForm";
import NewsList from "../components/Client/News/NewsList";
import NewsDetail from "../components/Client/News/NewsDetail";

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
            {/* Admin - bảo vệ bằng PrivateRoutes */}
            <PrivateRoutes path="/admin/users" component={Users} />
            <PrivateRoutes path="/admin/projects" component={Project} />
            <PrivateRoutes path="/admin/roles" component={Role} />
            <PrivateRoutes path="/admin/group-role" component={GroupRole} />
            <PrivateRoutes path="/admin" exact component={Home} />
            <PrivateRoutes path="/admin/doctor" exact component={Doctor} />
            <PrivateRoutes path="/admin/news" exact component={NewsForm} />



            {/* Public Admin */}
            <Route path="/admin/login" component={Login} />
            <Route path="/admin/register" component={Register} />


            {/* Client */}
            <Route path="/" exact component={HomeClient} />
            <Route path="/doctors" exact component={DoctorGallery} />
            <Route path="/doctor/detail/:userId" component={DoctorDetailPage} />
            <Route path="/booking" component={AppointmentForm} />
            <Route path="/news" exact component={NewsList} />
            <Route path="/news/:id" component={NewsDetail} />


            {/* 404 fallback */}
            <Route path="*">
                <div className="container">404 not found...</div>
            </Route>
        </Switch>
    );
};

export default AppRoutes;
