import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Landing from './Pages/Landing';
import HomePage from './Pages/HomePage';
import Sender from './Pages/Sender';
import LoadingComponent from './components/LoadingComponent';

const Receiver = lazy(() => import('./Pages/Receiver'));

// const LoadingFallback = () => (
//   <div style={{
//     height: 'calc(100vh - 64px)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
//   }}>
//     Loading...
//   </div>
// );

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}>
          <Route index element={<HomePage />} />
          <Route path="/sender" element={<Sender />} />
          <Route path="/receiver" element={
            <Suspense fallback={<LoadingComponent />}>
              <Receiver />
            </Suspense>
          } />
          <Route path="/receiver/:id" element={
            <Suspense fallback={<LoadingComponent />}>
              <Receiver />
            </Suspense>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;