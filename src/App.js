import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
  } from "react-router-dom";
  import CircularProgress from "@mui/material/CircularProgress";
import { Data } from './app/actions/const';
import { ROUTE_PATH } from "./app/constants/routePath";
import Dashboard from "./Containers/DashBoard";
import TopBar from "./Components/TopBar";
import LookerIframe from "./Containers/LookerIframe";
import "./App.css";


export const Build = () => {
    return (
        <div
        style={{
          width: "100%",
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </div>
    )
}

export const Property = () => {
    return (
        <div
        style={{
          width: "100%",
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </div>
    )
}

const App = ({ history }) => {
  return (
    <BrowserRouter>
          <TopBar />
      <Routes>
        <Route
          path={`/${ROUTE_PATH.DASHBOARD}`}
          element={<Dashboard history={history} data={Data} />}
        >
            <Route path=":id" element={<LookerIframe />} />
        </Route>
                <Route
          path={`/${ROUTE_PATH.BUILD}`}
          element={<Build/>}
        />
                <Route
          path={`/${ROUTE_PATH.PROPERTY}`}
          element={<Property/>}
        />
        {/* <Route path="/edgraph/channel-analytics" element={<div>this is channel analytics</div>} />
                  <Route path="/edgraph/group-analytics" element={<div>this is group analytics</div>} /> */}
        <Route
          path="/"
          element={<Navigate replace to={`/${ROUTE_PATH.DASHBOARD}`} />}
          history={history}
        />
      </Routes>

    </BrowserRouter>
  );
};

export default App;
