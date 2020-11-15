import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Field, Form as FinalForm } from "react-final-form";
import { Button, Form, Grid, Header, Segment, Tab } from "semantic-ui-react";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import TextInput from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import {
  combineValidators,
  isRequired,
} from "revalidate";

const validate = combineValidators({
  displayName: isRequired({ message: "The Display Name is required" })
});

const ProfileAbout = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    updateProfile,
    loading,
  } = rootStore.profileStore;

  const [isEdit, setIsEdit] = useState(false);

  const handleFinalFormSubmit = (values: any) => {
    updateProfile(values).then(() => setIsEdit(false));
  };
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            icon="user"
            floated="left"
            content={`About ${profile?.displayName}`}
          />
          {isEdit && (
            <Button
              onClick={() => setIsEdit(false)}
              floated="right"
              content="Cancel"
            />
          )}
          {!isEdit && isCurrentUser && (
            <Button
              onClick={() => setIsEdit(true)}
              floated="right"
              content="Edit Profile"
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          <Segment style={{display:'inline-block', width:'100%'}}>
            {isEdit && isCurrentUser ? (
              <FinalForm
                validate={validate}
                initialValues={profile!}
                onSubmit={handleFinalFormSubmit}
                render={({ handleSubmit, invalid, pristine }) => (
                  <Form onSubmit={handleSubmit} loading={loading}>
                    <Field
                      name="displayName"
                      placeholder="Display Name"
                      value={profile?.displayName}
                      component={TextInput}
                    />
                    <Field
                      name="bio"
                      rows={3}
                      placeholder="Bio"
                      value={profile?.bio}
                      component={TextAreaInput}
                    />
                    <Button
                      disabled={loading || invalid || pristine}
                      loading={loading}
                      floated='right'
                      positive
                      type="submit"
                      content="Update Profile"
                    />
                  </Form>
                )}
              />
            ) : (
              <span>{profile!.bio}</span>
            )}
          </Segment>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileAbout);
