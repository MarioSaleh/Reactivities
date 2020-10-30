import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LayoutComponent";
import { RootStoreContext } from "../../../app/stores/rootStore";
import ActivityList from "./ActivityList";



const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const{loadActivities, loadingInitial} = rootStore.activityStore;


  useEffect(() => {
    //equivalent to componentDidMount
    loadActivities();
  }, [loadActivities]);

  if (loadingInitial)
  return <LoadingComponent content="Loading Activities..." />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList/>
      </Grid.Column>
      <Grid.Column width={6}>
       <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
