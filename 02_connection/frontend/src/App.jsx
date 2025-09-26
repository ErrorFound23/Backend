// https://axios-http.com/docs/res_schema
import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const [jokes, setJokes] = useState([]);

  
  useEffect(() => {
    // Various way to fetch data from a server
    // fetch, axios, react query

    // How resolve cros error
    // It mostly fixed by backend using white list IP address or domain and special keyword

    // fetch('http://localhost:5000/jokes').then((res) => res.json()).then((res) => setJokes(res))
    // console.log(jokes);

    // use /api/v1/jokes/ instead of http://localhost:5000/api/v1/jokes/ beacause it make dynamic api route using adding proxy attribute in package.json file in react but in vite+react it work different , it use vite.config.js file
    //for react => https://create-react-app.dev/docs/proxying-api-requests-in-development/
    //for vite+react => https://vite.dev/config/
    axios
      .get("/api/v1/jokes")
      .then((res) => setJokes(res.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <h1>Chai and backend</h1>
      <p>JOKES: {jokes.length}</p>
      {jokes.map((joke) => (
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <p>{joke.content}</p>
        </div>
      ))}
    </>
  );
}

export default App;
