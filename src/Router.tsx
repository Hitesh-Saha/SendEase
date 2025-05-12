import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import HomePage from './pages/HomePage'
import Sender from './pages/Sender'
import Receiver from './pages/Receiver'

const Router = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/sender" element={<Sender />} />
            <Route path="/receiver" element={<Receiver />} />
            <Route path="/receiver/:id" element={<Receiver />} />
            <Route path="/*" element={<Navigate to='/' />} />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default Router