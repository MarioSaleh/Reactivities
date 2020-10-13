import React, {FormEvent, useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import {v4 as uuid} from 'uuid';
import ActivityStore from "../../../app/stores/activityStore"
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({match,history}) => {
  const activityStore = useContext(ActivityStore);
  const{clearActivity,loadActivity,createActivity,editActivity,submitting,activity: initialFormState} = activityStore;
  
  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: ""
    }); //initializes state of page

  useEffect(() => {
    if(match.params.id && activity.id.length === 0){
      loadActivity(match.params.id).then(() => {
        initialFormState && setActivity(initialFormState);
      });
    }

    return() => {
      clearActivity();
    }
   
  },[loadActivity,clearActivity,match.params.id,initialFormState,activity.id.length]);

  
 


  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    if(activity.id.length === 0){
        let newActivity = {
            ...activity,
            id: uuid()
        }
        createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
    }
    else{
        editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
      <Segment clearing>
      <Form>
        <Form.Input
          onChange={(e) => handleInputChange(e)}
          name="title"
          placeholder="Title"
          value={activity?.title}
        />
        <Form.TextArea
          onChange={handleInputChange}
          name="description"
          rows={2}
          placeholder="Description"
          value={activity?.description}
        />
        <Form.Input
          onChange={(e) => handleInputChange(e)}
          placeholder="Category"
          name="category"
          value={activity?.category}
        />
        <Form.Input
          onChange={(e) => handleInputChange(e)}
          type="datetime-local"
          name="date"
          placeholder="Date"
          value={activity?.date}
        />
        <Form.Input
          onChange={(e) => handleInputChange(e)}
          placeholder="City"
          name="city"
          value={activity?.city}
        />
        <Form.Input
          onChange={(e) => handleInputChange(e)}
          placeholder="Venue"
          name="venue"
          value={activity?.venue}
        />
        <Button
          loading={submitting}
          onClick={handleSubmit}
          floated="right"
          positive
          type="submit"
          content="Submit"
        />
        <Button
          floated="right"
          type="button"
          content="Cancel"
          onClick={() => history.push('/activities')}
        />
      </Form>
    </Segment>
      </Grid.Column>
    </Grid>
    
  );
};

export default observer(ActivityForm); // observer to observer state changes in mobx activityStore
