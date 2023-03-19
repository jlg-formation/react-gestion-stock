import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { routes } from './router/AppRouter'

const router = createBrowserRouter(routes)

function App() {
  return <RouterProvider router={router} />
}

export default App
