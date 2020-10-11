import React, {
  useState,
  useEffect,
  Fragment,
  SyntheticEvent,
  useContext,
} from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LayoutComponent";
import ActivityStore from "../stores/activityStore";
import { observer } from "mobx-react-lite";

const App = () => {
  const activityStore = useContext(ActivityStore);
  const [activities, setActivities] = useState<IActivity[]>([]); //<IActivity[]> is added to tell that the activities is an array of type IActivity
  const [selectedActivity, setselectedActivity] = useState<IActivity | null>(
    null
  ); // | null is added so that selectedActvity could be initialized as null at first

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState("");


 

  useEffect(() => {
    //equivalent to componentDidMount
      activityStore.loadActivities();
  }, [activityStore]); // second parameter of empty array is added to let the useEffect function work one time only

  if (activityStore.loadingInitial) return <LoadingComponent content="Loading Activities..." />

  // componentDidMount(){ //after rendering of the page
  //   axios.get<IActivity[]>('http://localhost:5000/api/activities') //make the response of type IActivity
  //     .then(response => {
  //       this.setState({
  //         activities: response.data
  //       })
  //     })

  // }

  return (
    <div>
      <Fragment>
        <NavBar/>
        <Container style={{ paddingTop: "7em" }}>
          <ActivityDashboard/>
        </Container>
      </Fragment>
    </div>
  );
};

export default observer(App);
