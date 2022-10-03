import React, { Component } from 'react';
import './App.css';
// import { Link } from "react-router-dom";
import { getEmbedURL } from './app/actions/embedSSO';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { push } from 'react-router-redux';
import * as edcastUserActions from './app/actions/edcastUser';

class Edgraph extends Component {
  
  constructor(props, context) {
    super(props, context);
    this.state = {
      organizations : this.props.data.organizations.map(organization => ({ label: organization.name })),
      dashboards: [],
      signedUrl: '',
      currentSelected:0
    }
    
  }

  groupAnalyticsPage = e => {
    e?.preventDefault();
    push('/edgraph/group-analytics');
  };

  channelAnalyticsPage = e => {
    e?.preventDefault();
    push('/edgraph/channel-analytics');
  }

  componentDidMount = () => {
    edcastUserActions.getEdcastUserInfo().then((user) => {
      this.setState({user: {}})
      this.setDashboard('Mauj Arora (SPARK EDCAST QA)');
    }).catch(()=>{

    })
  }

  setDashboard = (org) => {
    let dashboards = this.props.data.organizations.find(organization => organization.name === org)?.dashboards;
    if (!dashboards) {
      dashboards =  []
    }
    
    dashboards = dashboards.map(dashboard => ({ id: dashboard.id, label: dashboard.name }))
    this.setState({org, dashboards }, ()=> this.handleOnDashboardChange(0));
  }

  handleOnDashboardChange = (v) => {
    const id_v = this.state.dashboards[v].id;
    
    getEmbedURL({
      "url": `/embed/dashboards/${id_v}`,
      "models": "[concord,edcast_scratch]",
      "internal_request": "Yes",
      "stub": "No"
    }).then((signedUrl)=>{
      this.setState({ signedUrl, currentSelected:v})
    }).catch(()=> console.error('error loading == '))
  }

  a11yProps = (index) => {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  render() {
    const cur_state = this.state.user !=null;
    
    return  (cur_state &&
      <Box sx={{ flexGrow: 1, display: 'flex', height: 'auto' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={this.state.currentSelected}
        onChange={(event, value) => { this.handleOnDashboardChange(0 || value) }}
        aria-label="Vertical tabs example"
        textColor="secondary"
        indicatorColor="secondary"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {this.state.dashboards && this.state.dashboards.map((tab) => <Tab label={tab.label} {...this.a11yProps(tab.id)} />)}
      </Tabs>
      
        <div style={{ width: "100%", height: "100vh" }}>
          <iframe style={{ width: "100%", height: "100vh" }} src={this.state.signedUrl} title='iframe'></iframe>
        </div>
    </Box>
    );
  }
}

export default Edgraph
