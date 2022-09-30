import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import EdgraphApp from './EdgraphApp';
import Edgraph from './Edgraph';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
// import { Provider } from 'react-redux'
import { Data } from './app/actions/const';


// import configureStore from './configureStore'

// const store = configureStore()

function App(history){
  

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/edgraph" element={<Edgraph history={history} data={Data}/>}  />
        {/* <Route path="/edgraph/channel-analytics" element={<div>this is channel analytics</div>} />
        <Route path="/edgraph/group-analytics" element={<div>this is group analytics</div>} /> */}
        <Route path="/" element={<Navigate replace to="/edgraph" />} history={history}/>
      </Routes>
    </BrowserRouter>
  )

}


window.renderedgraph = (containerId, history) => {
  const root = ReactDOM.createRoot(document.getElementById(containerId));
  // <Provider store={store}>
  //   </Provider>
  root.render(
    <App history={history} />
  );

  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept('./components/App', renderApp)
  // }
};

window.unmountedgraph = containerId => {
  // const edgraph_root = root(containerId)
  // edgraph_root.unmount()
};

if (!document.getElementById('edgraph-container')) {
  const root_inner = ReactDOM.createRoot(document.getElementById('root'));
  root_inner.render(
    <App/>
  );
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
