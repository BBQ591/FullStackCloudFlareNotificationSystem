import './App.css';
import VirtualizedList from './containers/VirtualizedList';
import NotificationForm from './containers/NotificationForm';

function App() {
  return (
    <div className='container'>
      <NotificationForm />
      <VirtualizedList />
    </div>
    
  );
}

export default App;