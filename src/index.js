import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import EdgraphApp from './EdgraphApp';
import reportWebVitals from './reportWebVitals';

// import { Provider } from 'react-redux'
import App from './App';


// import configureStore from './configureStore'

// const store = configureStore()

  




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
