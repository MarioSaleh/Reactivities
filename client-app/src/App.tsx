import React,{Component} from 'react';
import './App.css';
import axios from 'axios';
import {Header,Icon,List} from 'semantic-ui-react';

class App extends Component {
  state = {
    values:[]
  }

  componentDidMount(){ //after rendering of the page
    axios.get('http://localhost:5000/api/values')
      .then(response => {
        this.setState({
          values: response.data
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
         {this.state.values.map((value : any) => ( //any type is given to value so it becomes like javascript instead of typeScript
            <List.Item key={value.id}>{value.name}</List.Item>
         ))}
         </List>
    </div>
  );
  }
}


export default App;
