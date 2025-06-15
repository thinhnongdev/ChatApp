import { Route, Routes } from 'react-router'
import App from '../App';
import ChatPage from '../components/ChatPage';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/about' element={<div>Hello i'm thịnh gió tai</div>} />
            <Route path='/chat' element={<ChatPage />}/>
        </Routes>
    )
}
export default AppRoutes;