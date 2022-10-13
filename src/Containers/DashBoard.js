

import React, { Component } from "react";
import { Outlet  } from "react-router-dom";
import Box from "@mui/material/Box";
import * as edcastUserActions from "../app/actions/edcastUser";
import SideBar from "../Components/SideBar";
import { ROUTE_PATH } from "../app/constants/routePath";
import withRouter from "../Components/WithRouter";

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      organizations: this.props.data.organizations.map((organization) => ({
        label: organization.name,
      })),
      dashboards: [],
      signedUrl: "",
      loadingUrl: false,
      currentSelected: 0,
    };
  }


  componentDidMount = () => {
    edcastUserActions
      .getEdcastUserInfo()
      .then((user) => {
        this.setState({ user: {} });
        this.setDashboard("Mauj Arora (SPARK EDCAST QA)");
      })
      .catch(() => {});
  };

  setDashboard = (org) => {
    let dashboards = this.props.data.organizations.find(
      (organization) => organization.name === org
    )?.dashboards;
    if (!dashboards) {
      dashboards = [];
    }
    const paramDashBoardId = this.props.router.params.id;
    let dashboardId = 0;
    dashboards = dashboards.map((dashboard, index) => { 
      if(paramDashBoardId !== undefined && Number(paramDashBoardId) === Number(dashboard.id)) {
        dashboardId = index;
      };
      return  {
      id: dashboard.id,
      label: dashboard.name,
    }});

    this.setState({ org, dashboards }, () => this.handleOnDashboardChange(dashboardId));
  };

  handleOnDashboardChange = (v) => {
    const id_v = this.state.dashboards[v].id;
    console.log("dashboard id", this.props.router.params.id, id_v, v );
    this.setState({ currentSelected: v });

    //Temp code to get JWT token
    const searchQuery = this.props.router.location.search;
    let searchToken = searchQuery.indexOf('token') !== -1 ? searchQuery.substring(searchQuery.indexOf('token') + 5 + 1) : '';
    if(searchToken) {
      sessionStorage.setItem('token', searchToken); 
    } else {
      searchToken = sessionStorage.getItem('token') || '';
    }
    //Temp code to get JWT token

    this.props.router.navigate(`/${ROUTE_PATH.DASHBOARD}/${id_v}?token=${searchToken}`);
  };

  render() {
    const { dashboards, currentSelected, user } =
      this.state;
    return (
      user && (
        <Box>
          <Box sx={{ flexGrow: 1, display: "flex", height: "auto" }}>
            <SideBar
              currentSelected={currentSelected}
              dashboards={dashboards}
              handleOnDashboardChange={this.handleOnDashboardChange}
            />
             <Outlet />
          </Box>
        </Box>
      )
    );
  }
}

  export default withRouter(Dashboard);
