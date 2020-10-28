import React, { useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import {
  ActivityFormValues,
  IActivityFormValues,
} from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/options/categoryOptions";
import DateInput from "../../../app/common/form/DateInput";
import { combineDateAndTime } from "../../../app/common/util/util";
import {
  combineValidators,
  composeValidators,
  hasLengthGreaterThan,
  isRequired,
} from "revalidate";

const validate = combineValidators({
  title: isRequired({ message: "The title is required" }),
  category: isRequired("Category"),
  description: composeValidators(
    isRequired("Description"),
    hasLengthGreaterThan(4)({
      message: "Description needs to be at least 5 characters",
    })
  )(),
  city: isRequired("City"),
  venue: isRequired("Venue"),
  date: isRequired("Date"),
  time: isRequired("Time"),
});

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    loadActivity,
    createActivity,
    editActivity,
    submitting,
  } = activityStore;

  const [activity, setActivity] = useState<IActivityFormValues>(
    new ActivityFormValues()
  ); //initializes state of page
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then((activity) => {
          setActivity(new ActivityFormValues(activity));
        })
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activity?.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  rows={3}
                  placeholder="Description"
                  value={activity?.description}
                  component={TextAreaInput}
                />
                <Field
                  placeholder="Category"
                  name="category"
                  options={category}
                  value={activity?.category}
                  component={SelectInput}
                />
                <Form.Group widths="equal">
                  <Field
                    name="date"
                    placeholder="Date"
                    date={true}
                    value={activity.date}
                    component={DateInput}
                  />
                  <Field
                    name="time"
                    time={true}
                    placeholder="Time"
                    value={activity.time}
                    component={DateInput}
                  />
                </Form.Group>
                <Field
                  placeholder="City"
                  name="city"
                  component={TextInput}
                  value={activity?.city}
                />
                <Field
                  placeholder="Venue"
                  name="venue"
                  component={TextInput}
                  value={activity?.venue}
                />
                <Button
                  disabled={loading || invalid || pristine}
                  loading={submitting}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                  onClick={() => {
                    if (activity.id) history.push(`/activities/${activity.id}`);
                    else history.push("/activities");
                  }}
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm); // observer to observer state changes in mobx activityStore
