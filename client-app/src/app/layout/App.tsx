import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import {ToastContainer} from 'react-toastify';

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
        <ToastContainer position='bottom-right'/>
        <Route exact path="/" component={HomePage} />
        <Route
          path={"/(.+)"}
          render={() => (
            <Fragment>
              <NavBar />
              <Container style={{ marginTop: "7em" }}>
                <Switch> {/*only one route is loaded when Switch is added*/}
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
                <Route component={NotFound}/>
                </Switch>
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
