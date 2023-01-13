import logo from './logo.svg';
import './App.css';

const title = 'React';
const welcome = {
  greeting: 'Hey',
  title: 'React'
}
function getTitle(title) {
  return title;
}

function App() {
  return (
    <div>
      {/* <h1>Hello { title }</h1> */}
      {/* {welcome.greeting} {welcome.title} */}
      <h1>Hello {getTitle('React')}</h1>

      <label htmlFor="search">Search: </label>
      <input type="text" id="search" />
    </div>
  );
}

export default App;
