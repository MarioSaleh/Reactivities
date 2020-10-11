import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import {v4 as uuid} from 'uuid';
import ActivityStore from "../../../app/stores/activityStore"
import { observer } from "mobx-react-lite";



const ActivityForm: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const{createActivity,editActivity,submitting,cancelFormOpen,selectedActivity} = activityStore;
  const initializeForm = () => {
  if (selectedActivity != undefined) {
    return selectedActivity;
  } else {
    return {
      id: "",
      title: "",
      category: "",
      description: "",
      date: "",
      city: "",
      venue: ""
    };
  }
};
const [activity, setActivity] = useState<IActivity>(initializeForm);


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
        createActivity(newActivity);
    }
    else{
        editActivity(activity);
    }
  };

  return (
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
          onClick={cancelFormOpen}
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm); // observer to observer state changes in mobx activityStore
