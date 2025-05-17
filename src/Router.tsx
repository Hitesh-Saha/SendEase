import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Landing from './Pages/Landing'
import HomePage from './Pages/HomePage'
import Sender from './Pages/Sender'
import Receiver from './Pages/Receiver'

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