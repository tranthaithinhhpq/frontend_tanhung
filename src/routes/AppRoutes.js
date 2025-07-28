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
import NewsCreate from "../components/Admin/News/NewsCreate";
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


import DeviceTable from "../components/Admin/Device/DeviceTable";
import DeviceCreate from "../components/Admin/Device/DeviceCreate";
import DeviceEdit from "../components/Admin/Device/DeviceEdit";

// Service Price (admin)
import ServicePriceTable from "../components/Admin/Price/ServicePriceTable";

// Drug Price (admin)
import DrugPriceTable from "../components/Admin/Price/DrugPriceTable";

// PageImageContent (admin)
import PageImageContentTable from "../components/Admin/PageImageContentTable/PageImageContentTable";

// Banner Price (admin)
import BannerTable from "../components/Admin/Banner/BannerTable";

// Device (client)
import DeviceGallery from "../components/Client/Device/DeviceGallery";
import DeviceDetailPage from "../components/Client/Device/DeviceDetailPage";
import DoctorDayOffTable from "../components/Admin/Doctor/DoctorDayOffTable";

// Booking
import PatientBookingTable from "../components/Admin/Booking/PatientBookingTable";
import BookingCreate from "../components/Admin/Booking/BookingCreate";
import BookingEdit from "../components/Admin/Booking/BookingEdit";


//Service Price(client)
import ServicePrice from "../components/Client/ServicePrice/ServicePrice";
import DrugPrice from "../components/Client/DrugPrice/DrugPrice";


//Page
import PageAdmin from "../components/Admin/Page/PageAdmin";
import PageCreate from "../components/Admin/Page/PageCreate";
import PageEdit from "../components/Admin/Page/PageEdit";
import ClientPage from "../components/Client/Page/ClientPage";

//News admin
import NewsTable from "../components/Admin/News/NewsTable";
import NewsEdit from "../components/Admin/News/NewsEdit";


//Question 
import QuestionTable from "../components/Admin/Question/QuestionTable";
import QuestionForm from "../components/Client/Question/QuestionForm";




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
            <PrivateRoutes path="/admin/news" exact component={NewsTable} />
            <PrivateRoutes path="/admin/news/create" exact component={NewsCreate} />
            <PrivateRoutes path="/admin/news/edit/:id" exact component={NewsEdit} />

            {/* Device admin */}
            <PrivateRoutes path="/admin/device" exact component={DeviceTable} />
            <PrivateRoutes path="/admin/device/new" exact component={DeviceCreate} />
            <PrivateRoutes path="/admin/device/edit/:id" component={DeviceEdit} />

            {/* Service Price admin */}
            <PrivateRoutes path="/admin/service-price" exact component={ServicePriceTable} />

            {/* Banner admin */}
            <PrivateRoutes path="/admin/banner" exact component={BannerTable} />

            {/* Question admin */}
            <PrivateRoutes path="/admin/question" exact component={QuestionTable} />

            {/* Drug Price admin */}
            <PrivateRoutes path="/admin/drug-price" exact component={DrugPriceTable} />

            {/* Booking admin */}
            <PrivateRoutes path="/admin/booking" exact component={PatientBookingTable} />
            <PrivateRoutes path="/admin/booking/new" exact component={BookingCreate} />
            <PrivateRoutes path="/admin/booking/:id" exact component={BookingEdit} />

            {/* PageImage admin */}
            <PrivateRoutes path="/admin/page-image" exact component={PageImageContentTable} />

            {/* PageAdmin admin */}
            <PrivateRoutes path="/admin/page" exact component={PageAdmin} />
            <PrivateRoutes path="/admin/page-new" exact component={PageCreate} />
            <PrivateRoutes path="/admin/page/edit/:id" exact component={PageEdit} />

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

            {/* QuestionForm client */}
            <Route path="/question" exact component={QuestionForm} />

            {/* News client */}
            <Route path="/news" exact component={NewsList} />
            <Route path="/news/:id" component={NewsDetail} />

            {/* Device client */}
            <Route path="/devices" exact component={DeviceGallery} />
            <Route path="/device/:id" component={DeviceDetailPage} />

            {/* Service Prices client */}
            <Route path="/service-prices" exact component={ServicePrice} />

            {/* Drug Prices client */}
            <Route path="/drug-prices" exact component={DrugPrice} />

            {/* Page client */}
            <Route path="/:slug" exact component={ClientPage} />




            {/* Fallback */}
            <Route path="*">
                <div className="container">404 not found...</div>
            </Route>
        </Switch>
    );
};

export default AppRoutes;
