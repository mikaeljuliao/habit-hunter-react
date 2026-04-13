import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Home from './pages/Home'
import Home2 from './pages/Home2'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Home />
      <Home2 />
    </>
  )
}

export default App
