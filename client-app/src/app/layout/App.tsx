import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  // second parameter of empty array is added to let the useEffect function work one time only

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
        <Route exact path="/" component={HomePage} />
        <Route
          path={"/(.+)"}
          render={() => (
            <Fragment>
              <NavBar />
              <Container style={{ marginTop: "7em" }}>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route
                  exact
                  path="/activities/:id"
                  component={ActivityDetails}
                />
                <Route
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
              </Container>
            </Fragment>
          )}
        />
      </Fragment>
    </div>
    // exact is inputed for the router to match the exact same path instead of first match wins
  );
};

export default withRouter(observer(App));
