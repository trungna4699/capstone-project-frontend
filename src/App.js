import React from 'react';
import './App.css';
import Main from './routes';
import SpeckioNavbar from './components/SpeckioNavBar/SpeckioNavbar';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossOrigin="anonymous"
      />

      <SpeckioNavbar />
      <div className="mainContent">
        <Main />
      </div>
      

    </div>
  );
}

export default App;
