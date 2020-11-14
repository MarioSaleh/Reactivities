import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Segment, Image, Header, Button, Item } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { format } from "date-fns";
import { RootStoreContext } from "../../../app/stores/rootStore";

interface IProps {
  activity: IActivity;
}

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

const ActivityDetailedHeader: React.FC<IProps> = ({ activity }) => {
  const host = activity.attendees.filter(x => x.isHost)[0];
  const rootStore = useContext(RootStoreContext);
  const{cancelAttendance, attendActivity,loading} = rootStore.activityStore;
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                <p>{format(activity.date, "eeee do MMM")}</p>
                <p>
                  Hosted by <Link to={`/profile/${host.username}`}><strong>{host.displayName}</strong></Link> 
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <Button
            color="orange"
            as={Link}
            to={`/manage/${activity.id}`}
            floated="right"
          >
            Manage Event
          </Button>
        ) : activity.isGoing ? (
          <Button loading={loading} onClick={cancelAttendance}>Cancel attendance</Button>
        ) : (
          <Button loading={loading} onClick={attendActivity}>Attend Event</Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
