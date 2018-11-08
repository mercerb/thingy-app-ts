import React, { Component } from 'react';
import './App.css';
// @ts-ignore
import Graph from './components/Graph';
import Pubnub from './components/Pubnub';
// import logo from './logo.svg';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './styles/theme';

class App extends Component {
  public render() {
    return (
        <MuiThemeProvider theme={theme}>
        <div className='App'>
          <header className='App-header'>
            <h1 className='App-title'>Realtime Data</h1>
          </header>
          {/* <header className='Graph-header'>
            <Graph width='300' height='500'/>
          </header> */}
          <Pubnub />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;