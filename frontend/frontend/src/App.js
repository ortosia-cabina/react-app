import React from 'react';
import 'antd/dist/antd.css'; 
import './App.css';
import CustomLayout from './containers/Layout';
import Voting from './components/Voting';
import Login from './components/Login';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
       username : '',
       password : '',
       token : ''
    };
    // this.getLoginData = this.getLoginData.bind(this);

  }
  // getLoginData(){
  //   var username;
  //   //var token;
  //   this.setState({username: username})
  //   console.log(this.state.username)
  // }

  componentWillMount(){
    if(sessionStorage.getItem("userData")){
        console.log("Call user feed");
    }else{
        this.setState({redirect: true});
    }
}



// componentDidMount(){
//   const script1 = document.createElement("script");
//   const script2 = document.createElement("script");
//   const script3 = document.createElement("script");
//   const script4 = document.createElement("script");
//   const script5 = document.createElement("script");

//   script1.src = "http://localhost:8000/static/crypto/sjcl.js";
//   script2.src = "http://localhost:8000/static/crypto/jsbn.js";
//   script3.src = "http://localhost:8000/static/crypto/jsbn2.js";
//   script4.src = "http://localhost:8000/static/crypto/bigint.js";
//   script5.src = "http://localhost:8000/static/crypto/elgamal.js";
//   script1.async = true;
//   script2.async = true;
//   script3.async = true;
//   script4.async = true;
//   script5.async = true;

//   document.body.appendChild(script1);
//   document.body.appendChild(script2);
//   document.body.appendChild(script3);
//   document.body.appendChild(script4);
//   document.body.appendChild(script5);
// }
  render() {
    if(sessionStorage.userData){
      return (
        <div className="App">
          <CustomLayout >
            <Voting/> 
          </CustomLayout>
          </div>
      );
    }else{
      return (
        <div className="App">
          <CustomLayout >
            <Login/>
          </CustomLayout>
        </div>
      );
    }
    
  }
}

export default App;
