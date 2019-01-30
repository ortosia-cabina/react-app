import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import RaisedButton from '@material-ui/core/Button';

import Login from '../components/Login';

import { createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});


const style = {
  margin: 15,
};

class LoginView extends Component {
  constructor(props){
    super(props);
    var loginButtons=[];
    loginButtons.push(
      <div>
      <MuiThemeProvider theme={theme}>
        <div>
           <RaisedButton label={"Register as Student"} primary={true} style={style} onClick={(event) => this.handleClick(event,'student')}/>
       </div>
       </MuiThemeProvider>
       <MuiThemeProvider theme={theme}>
       <div>
          <RaisedButton label={"Register as Teacher"} primary={true} style={style} onClick={(event) => this.handleClick(event,'teacher')}/>
      </div>
      </MuiThemeProvider>
      </div>
    )
    this.state={
      username:'',
      password:'',
      loginscreen:[],
      loginmessage:'',
      loginButtons:loginButtons,
      isLogin:true
    }
  }
  componentWillMount(){
    var loginscreen=[];
    loginscreen.push(<Login parentContext={this} appContext={this.props.appContext}/>);
  }

  render() {
    return (
      <div className="loginscreen" key="loginscreen">
        {this.state.loginscreen}
        <div>
          {this.state.loginmessage}
          {this.state.loginButtons}
        </div>
      </div>
    );
  }
}


export default LoginView;