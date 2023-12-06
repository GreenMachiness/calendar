import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import './index.css'
import App from './App'

const prepare = () => {
  // prevents the mock server from working in a deployed, production env, or when the env variable is set to disabled
  if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_DISABLE_MSW) {  
    const { worker } = require('./mocks/browser.js')
    return worker.start({ onUnhandledRequest: "bypass" }) // start option removes warnings from msw
  }
  return Promise.resolve()
}

prepare().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
})


