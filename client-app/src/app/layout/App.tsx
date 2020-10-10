import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import axios from "axios";
import { Container} from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import LoadingComponent from "./LayoutComponent";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]); //<IActivity[]> is added to tell that the activities is an array of type IActivity
  const [selectedActivity, setselectedActivity] = useState<IActivity | null>(
    null
  ); // | null is added so that selectedActvity could be initialized as null at first

  const [editMode, setEditMode] = useState(false);
  const[loading, setLoading] = useState(true);
  const[submitting, setSubmitting] = useState(false);
  const [target,setTarget] = useState('');

  const handleSelectActivity = (id: string) => {
    setselectedActivity(activities.filter((a) => a.id === id)[0]); //filter is used on an array to determine which elements you want (like where in C#)
  };

  const handleOpenCreateForm = () => {
    setselectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setselectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id),activity]);
      setselectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>,id : string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)]);
    }).then(() => setSubmitting(false));
  }

  useEffect(() => {
    //equivalent to componentDidMount
    agent.Activities.list()
      .then((response) => {
        let activities : IActivity[] = [];
        response.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        });
        setActivities(activities);
      }).then(() => setLoading(false));
  }, []); // second parameter of empty array is added to let the useEffect function work one time only

  if(loading) return <LoadingComponent content='Loading Activities...'/>

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
        <NavBar openCreateForm={handleOpenCreateForm}/>
        <Container style={{ paddingTop: "7em" }}>
          <ActivityDashboard
            activities={activities}
            selectActivity={handleSelectActivity}
            selectedActivity={selectedActivity} 
            editMode={editMode}
            setEditMode={setEditMode}
            setselectedActivity={setselectedActivity}
            createActivity={handleCreateActivity}
            editActivity={handleEditActivity}
            deleteActivity={handleDeleteActivity}
            submitting={submitting}
            target={target}
          />
        </Container>
      </Fragment>
    </div>
  );
};

export default App;
