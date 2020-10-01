import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    values:[]
  }

  componentDidMount(){ //after rendering of the page
    axios.get('http://localhost:5000/API/Values')
      .then(response => {
        console.log(response);
        this.setState({
          values: response.data
        })
      })
   
  }

  render(){
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
       <ul>
         {this.state.values.map((value : any) => ( //any type is given to value so it becomes like javascript instead of typeScript
            <li>{value.name}</li>
         ))}
       </ul>
      </header>
    </div>
  );
  }
}


export default App;
