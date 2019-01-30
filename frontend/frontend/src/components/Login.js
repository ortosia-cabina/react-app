import React from 'react';
import PropTypes from 'prop-types';
// import {Redirect} from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import RaisedButton from '@material-ui/core/Button';
import TextField from  '@material-ui/core/TextField';
import axios from 'axios';
import { createMuiTheme, withStyles  } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
// import { PostData } from '../services/PostData';


const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = theme => ({
  form:{
    alignItems: 'center',
    display: 'flex'
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
    margin: 15,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    margin: 15,
  },
});


class Login extends React.Component {
  constructor(props){
    super(props);
    this.state={
    username:'',
    password:'',
    token: ''
    };
   this.handleClick = this.handleClick.bind(this);

  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <FormControl className={classes.textField} noValidate autoComplete="off" styles={{display:'flex'}}>
            <TextField 
              id="username"
              label="username"
              className={classes.textField}
              value={this.state.username}
              onChange = {this.handleChange('username')}
              margin="normal"
              />
            <br/>
              <TextField 
              id="password"
              label="password"
              className={classes.textField}
              value={this.state.password}
                type="password"
                onChange = {this.handleChange('password')}
                margin="normal"
                />
              <br/>
              <RaisedButton label="Submit" variant="contained" className={classes.button} 
                  onClick={this.handleClick}> Login </RaisedButton>
                  
            </FormControl>
        </MuiThemeProvider>
      </div>
      
    );

  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    // console.log(this.state);
};

 
  

handleClick(){

  var headers = {
    'Content-Type': 'application/json'
  }
  axios({
    url: 'http://localhost:8000/authentication/login/',
    method: 'POST',
    headers: headers,
    data: {
      password: this.state.password,
      username: this.state.username
    }
  }).then((response) => {
      console.log(response.data);
      // console.log(JSON.parse(response.data));
      sessionStorage.setItem('token', JSON.stringify(response.data));
      console.log(sessionStorage.token);

      axios.post('http://localhost:8000/authentication/getuser/', response.data)
      .then((response) =>{
        console.log(response.data);
        sessionStorage.setItem('userData', JSON.stringify(response.data));
        console.log(sessionStorage.userData);
      })
      .catch(error => {
        alert(error);
      })
  })
  .catch(error => {
    alert(error);
  })
}
  
//   const params = new URLSearchParams();
//   params.append('password', this.state.password);
//   params.append('username', this.state.username);

  
//   axios.post('http://localhost:8000/authentication/login/', params)
// .then(function (response) {
//   //console.log(response);
//     document.cookie = 'decide='+response.token+';';
//     const param = new URLSearchParams();
//     param.append('token', response.data.token)
//       axios.post('http://localhost:8000/authentication/getuser/', param)
//       .then(function(response2){
//         // handleLogin(response2)
//         console.log(response2.status)
//         if(response2.status === 200){
//           console.log("Login successfull");
//         }
//         else if(response2.status === 204){
//             console.log("Username password do not match");
//             alert(response2.data.success)
//         }
//         else{
//             console.log("Username does not exists");
//             alert("Username does not exist");
//         }
//       }).catch(error => {
//         alert(error);
//       });
     
    
//     })
//   };

}
  
Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);