import './App.css';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from './Components/Home'
import Post from './Components/Post';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/post/:objectId" element={<Post />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
