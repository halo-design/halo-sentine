import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import App from '@/App'
import store from '~/store'
import { routeRootPath } from '~/constants/config'

const supportsHistory = 'pushState' in window.history

render(
  <Provider {...store}>
    <Router
      basename={routeRootPath}
      forceRefresh={!supportsHistory}
    >
      <App />
    </Router>
  </Provider>,
  document.getElementById('MOUNT_NODE')
)
