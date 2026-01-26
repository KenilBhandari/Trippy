import Home from "../src/pages/Home"
import './App.css'
import { TripProvider } from "./context/TripContext" 

function App() {
  return (
    <TripProvider>
      <Home />
    </TripProvider>
  )
}

export default App