export function PostData(type, userData){
    let BaseURL = 'https://localhost:8000/authentication/';

    return new Promise((resolve, reject) =>{
    
      console.log(JSON.stringify(userData));
        fetch(BaseURL+type, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
          })
          .then((response) => response.json())
          .then((res) => {
            resolve(res);
            console.log(res);
          })
          .catch((error) => {
            reject(error);
          });
          
  
      });
}