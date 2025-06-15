
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'

import { Toaster } from 'react-hot-toast'
import AppRoutes from './config/routes'
import { ChatProvider } from './context/ChatContext'

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <Toaster position='top-right' />
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </BrowserRouter>

)
