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
import React, {useState, useEffect} from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import MainLayout from "layouts/Main.js";
import AuthLayout from "layouts/Auth.js";
import { getToken, setUserSession, removeUserSession } from "Utils/Common.js";

function App(props) {
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            return;
        }
        axios.get(`https://digital-grading-system.herokuapp.com/api/v1/user/verify?token=${token}`).then(response => {
            setTimeout(() => {
                setUserSession(response.data);
                setAuthLoading(false);
            }, 500);

        }).catch(error => {
            removeUserSession();
            setAuthLoading(false);
        });
    }, []);

    if (authLoading && getToken()) {
        return <div>Checking Authentication...</div>
    }

    return (
    <BrowserRouter>
        <Switch>
            <Route path="/login" render={(props) => !getToken() ? <AuthLayout {...props}/> : <Redirect to="/dashboard" />} />
            <Route path="/" render={(props) => getToken() ? <MainLayout {...props}/> : <Redirect to="/login" />} />
            <Redirect from="*" to="/dashboard" />
        </Switch>
    </BrowserRouter>
    );
}

export default App;