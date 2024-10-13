import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
import UserLoginStore from './contexts/UserLoginStore.jsx'
import HostelLoginStore from './contexts/HostelLoginStore.jsx'
import PropertyStore from './contexts/PropertyStore.jsx'

createRoot(document.getElementById('root')).render(
    <HostelLoginStore>
      <PropertyStore>
     <UserLoginStore>
    <App />
     </UserLoginStore>
     </PropertyStore>
  </HostelLoginStore>
)