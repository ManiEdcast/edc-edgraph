import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const a11yProps = (index) => {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  };

const SideBar = ({ currentSelected, handleOnDashboardChange, dashboards }) => {
    return (
        <Tabs
        orientation="vertical"
        variant="scrollable"
        value={currentSelected}
        onChange={(event, value) => {
          handleOnDashboardChange(0 || value);
        }}
        aria-label="Vertical tabs example"
        textColor="secondary"
        indicatorColor="secondary"
        sx={{ borderRight: 0, borderColor: "divider", marginTop: '15px' }}
      >
        {dashboards &&
          dashboards.map((tab) => (
            <Tab key={tab.label} label={tab.label} {...a11yProps(tab.id)} />
          ))}
      </Tabs>
    )
}

export default SideBar;