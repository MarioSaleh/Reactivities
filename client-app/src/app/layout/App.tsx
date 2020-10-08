import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Container} from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]); //<IActivity[]> is added to tell that the activities is an array of type IActivity
  const [selectedActivity, setselectedActivity] = useState<IActivity | null>(
    null
  ); // | null is added so that selectedActvity could be initialized as null at first

  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    setselectedActivity(activities.filter((a) => a.id === id)[0]); //filter is used on an array to determine which elements you want (like where in C#)
  };

  const handleOpenCreateForm = () => {
    setselectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);
    setselectedActivity(activity);
    setEditMode(false);
  }

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id != activity.id),activity]);
    setselectedActivity(activity);
    setEditMode(false);
  }

  const handleDeleteActivity = (id : string) => {
    setActivities([...activities.filter(a => a.id !== id)]);
  }

  useEffect(() => {
    //equivalent to componentDidMount
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities") //make the response of type IActivity
      .then((response) => {
        let activities : IActivity[] = [];
        response.data.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        });
        setActivities(activities);
      });
  }, []); // second parameter of empty array is added to let the useEffect function work one time only

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
          />
        </Container>
      </Fragment>
    </div>
  );
};

export default App;
