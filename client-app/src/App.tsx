import React,{Component} from 'react';
import './App.css';
import axios from 'axios';
import {Header,Icon,List} from 'semantic-ui-react';

class App extends Component {
  state = {
    activities:[]
  }

  componentDidMount(){ //after rendering of the page
    axios.get('http://localhost:5000/api/activities')
      .then(response => {
        this.setState({
          activities: response.data
        })
      })
   
  }

  render(){
  return (
    <div>
       <Header as='h2'>
          <Icon name='users' />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
         {this.state.activities.map((activity : any) => ( //any type is given to value so it becomes like javascript instead of typeScript
            <List.Item key={activity.id}>{activity.description}</List.Item>
         ))}
         </List>
    </div>
  );
  }
}


export default App;
