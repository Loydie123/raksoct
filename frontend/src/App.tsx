import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib';
import { ROUTES } from './constants';
import { AuthProvider } from './context';
import { AuthGuard, AdminGuard, GuestGuard } from './guards';
import { MainLayout } from './layouts';
import Login from './pages/Login';
import Students from './pages/Students';
import ServiceRequests from './pages/ServiceRequests';
import Import from './pages/Import';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes - redirect to dashboard if logged in */}
            <Route
              path={ROUTES.LOGIN}
              element={
                <GuestGuard>
                  <Login />
                </GuestGuard>
              }
            />

            {/* Protected routes - require authentication */}
            <Route
              path="/"
              element={
                <AuthGuard>
                  <MainLayout />
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to={ROUTES.STUDENTS} replace />} />
              <Route path="students" element={<Students />} />
              <Route path="service-requests" element={<ServiceRequests />} />

              {/* Admin only routes */}
              <Route
                path="import"
                element={
                  <AdminGuard>
                    <Import />
                  </AdminGuard>
                }
              />
            </Route>

            {/* Catch all - redirect to students */}
            <Route path="*" element={<Navigate to={ROUTES.STUDENTS} replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
