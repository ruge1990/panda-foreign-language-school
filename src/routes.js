/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import MyProfile from "views/MyProfile.js";
import Users from "views/Users.js";
import Classes from "views/Classes.js";
import Subjects from "views/Subjects.js";
import Login from "views/Login.js";

const adminRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "My Profile",
    icon: "nc-icon nc-circle-09",
    component: MyProfile,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "Users",
    icon: "nc-icon nc-notes",
    component: Users,
    layout: "/admin",
  },
  {
    path: "/class",
    name: "Classes",
    icon: "nc-icon nc-ruler-pencil",
    component: Classes,
    layout: "/admin",
  },
  {
    path: "/subject",
    name: "Subjects",
    icon: "nc-icon nc-planet",
    component: Subjects,
    layout: "/admin",
  },
];

const teacherRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/teacher",
  },
  {
    path: "/profile",
    name: "My Profile",
    icon: "nc-icon nc-circle-09",
    component: MyProfile,
    layout: "/teacher",
  },
  {
    path: "/subject",
    name: "My Subjects",
    icon: "nc-icon nc-planet",
    component: Subjects,
    layout: "/teacher",
  },
];

const pupilRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/pupil",
  },
  {
    path: "/profile",
    name: "My Profile",
    icon: "nc-icon nc-circle-09",
    component: MyProfile,
    layout: "/pupil",
  },
  {
    path: "/subject",
    name: "My Subjects",
    icon: "nc-icon nc-planet",
    component: Subjects,
    layout: "/pupil",
  },
];

const authRoutes = [
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  }
];

export {adminRoutes, teacherRoutes, pupilRoutes, authRoutes}