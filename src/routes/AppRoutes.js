import { Switch, Route } from "react-router-dom";
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
import AppointmentForm from "../components/Client/Appointment/AppointmentForm";
import DoctorDetailPage from "../components/Client/Doctor/DoctorDetailPage";
import NewsForm from "../components/Admin/News/NewsForm";
import NewsList from "../components/Client/News/NewsList";
import NewsDetail from "../components/Client/News/NewsDetail";
import DoctorTable from "../components/Admin/Doctor/DoctorTable";
import DoctorEdit from "../components/Admin/Doctor/DoctorEdit";
import DoctorCreate from "../components/Admin/Doctor/DoctorCreate";

// Specialty (admin)
import SpecialtyTable from "../components/Admin/Specialty/SpecialtyTable";
import SpecialtyEdit from "../components/Admin/Specialty/SpecialtyEdit";
import SpecialtyCreate from "../components/Admin/Specialty/SpecialtyCreate";

// Specialty (client)
import SpecialtyGallery from "../components/Client/Specialty/SpecialtyGallery";
import SpecialtyDetailPage from "../components/Client/Specialty/SpecialtyDetailPage";

// Device (admin)
import DeviceTable from "../components/Admin/Device/DeviceTable";
import DeviceCreate from "../components/Admin/Device/DeviceCreate";
import DeviceEdit from "../components/Admin/Device/DeviceEdit";

// Device (client)
import DeviceGallery from "../components/Client/Device/DeviceGallery";
import DeviceDetailPage from "../components/Client/Device/DeviceDetailPage";
import DoctorDayOffTable from "../components/Admin/Doctor/DoctorDayOffTable";



const AppRoutes = () => {
    const { user } = useContext(UserContext);

    const Project = () => (
        <div className="container mt-3">
            <h4>Todo...</h4>
        </div>
    );

    if (user.isLoading) return null;

    return (
        <Switch>
            {/* Admin - Private routes */}
            <PrivateRoutes path="/admin/users" component={Users} />
            <PrivateRoutes path="/admin/projects" component={Project} />
            <PrivateRoutes path="/admin/roles" component={Role} />
            <PrivateRoutes path="/admin/group-role" component={GroupRole} />
            <PrivateRoutes path="/admin" exact component={Home} />

            {/* Doctor admin */}
            <PrivateRoutes path="/admin/doctor" exact component={DoctorTable} />
            <PrivateRoutes path="/admin/doctor/new" exact component={DoctorCreate} />
            <PrivateRoutes path="/admin/doctor/edit/:doctorId" component={DoctorEdit} />
            <PrivateRoutes path="/admin/doctor-day-off" component={DoctorDayOffTable} />

            {/* Specialty admin */}
            <PrivateRoutes path="/admin/specialty" exact component={SpecialtyTable} />
            <PrivateRoutes path="/admin/specialty/create" exact component={SpecialtyCreate} />
            <PrivateRoutes path="/admin/specialty/edit/:id" component={SpecialtyEdit} />

            {/* News admin */}
            <PrivateRoutes path="/admin/news" exact component={NewsForm} />

            {/* Device admin */}
            <PrivateRoutes path="/admin/device" exact component={DeviceTable} />
            <PrivateRoutes path="/admin/device/new" exact component={DeviceCreate} />
            <PrivateRoutes path="/admin/device/edit/:id" component={DeviceEdit} />


            {/* Public Admin */}
            <Route path="/admin/login" component={Login} />
            <Route path="/admin/register" component={Register} />

            {/* Client */}
            <Route path="/" exact component={HomeClient} />
            <Route path="/doctors" exact component={DoctorGallery} />
            <Route path="/doctor/detail/:doctorId" component={DoctorDetailPage} />
            <Route path="/booking" component={AppointmentForm} />

            {/* Specialty client */}
            <Route path="/specialties" exact component={SpecialtyGallery} />
            <Route path="/specialty/:id" component={SpecialtyDetailPage} />

            {/* News client */}
            <Route path="/news" exact component={NewsList} />
            <Route path="/news/:id" component={NewsDetail} />

            {/* Device client */}
            <Route path="/devices" exact component={DeviceGallery} />
            <Route path="/device/:id" component={DeviceDetailPage} />

            {/* Fallback */}
            <Route path="*">
                <div className="container">404 not found...</div>
            </Route>
        </Switch>
    );
};

export default AppRoutes;
