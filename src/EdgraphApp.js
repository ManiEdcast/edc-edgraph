import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import { Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import { getEmbedURL } from './app/actions/embedSSO';
// import { push } from 'react-router-redux';

const defaultHistory = createBrowserHistory();
class EdgraphApp extends Component {
  
  constructor(props, context) {
    super(props, context);
    this.state = {
      organizations : this.props.data.organizations.map(organization => ({ label: organization.name })),
      dashboards: [],
      signedUrl: ''
    }
  }

  groupAnalyticsPage = e => {
    e?.preventDefault();
    console.log('this.props = ', this.props.history)
    console.log('history = ', defaultHistory)

    defaultHistory.push('/edgraph/group-analytics');
    // this.props.handleClose();
  };

  channelAnalyticsPage = e => {
    e?.preventDefault();
    console.log('this.props = ', this.props.history)
    console.log('history = ', defaultHistory)
    defaultHistory.push('/edgraph/channel-analytics');
    // this.props.handleClose();
  }

  handleOnOrgChange = (e, v) => {
    e?.preventDefault();
    let dashboards = this.props.data.organizations.find(organization => organization.name === v)?.dashboards;
    console.log('1 dashboards = ', dashboards);
    if (!dashboards) {
      dashboards =  []
    }
    
    console.log('2 dashboards = ', dashboards);
    dashboards = dashboards.map(dashboard => ({ id: dashboard.id, label: dashboard.name }))
    this.setState({org: v,dashboards });
  }

  handleOnDashboardChange = (e, v) => {
    e?.preventDefault();
    console.log('handleOnDashboardChange v == ', v)
    getEmbedURL({
      "url": "/embed/dashboards/34",
      "models": "[concord,edcast_scratch]",
      "internal_request": "Yes",
      "stub": "No"
    }).then((signedUrl)=>{
      console.log('signedUrl == ', signedUrl)
      this.setState({ signedUrl })
    }).catch(()=> console.error('error loading == '))

  }

  render() {
    
    const signedUrl = this.props.signedUrl;
    const data = this.props.data;

    const organizations = data.organizations.map(organization => ({ label: organization.name }))
    
    console.log('organizations = ', organizations);
    
    return (
      <div style={{
        height: "auto",
        padding: "50px"
  
      }}>
  
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          paddingBottom: "25px"
        }}>
          <div style={{
            flex: "1 1 200px",
            height: "50px",
            paddingRight: "5px"
          }}>
            <Autocomplete
              id="organizations"
              options={organizations}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              renderInput={(params) => <TextField {...params} label="Select an User/Organization" />}
              onInputChange={this.handleOnOrgChange}
            />
          </div>
          <div style={{
            flex: "1 1 200px",
            height: "50px",
          }}>
            <Autocomplete
              id="dashboards"
              options={this.state.dashboards}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              renderInput={(params) => <TextField {...params} label="Select a Dashboard" />}
              onInputChange={this.handleOnDashboardChange}
            />
          </div>
  
        </div>
        <div style={{ width: "100%", height: "100vh" }}>
          <iframe style={{ width: "100%", height: "100vh" }} src={signedUrl} title='iframe'></iframe>
        </div>
      </div >
    );
  }
}

export default EdgraphApp
