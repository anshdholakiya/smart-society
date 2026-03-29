import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import SetupPassword from '../pages/SetupPassword';

import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

const OverviewPage = lazy(() => import('../pages/dashboard/OverviewPage'));
const ComplaintsPage = lazy(() => import('../pages/dashboard/ComplaintsPage'));
const BillsPage = lazy(() => import('../pages/dashboard/BillsPage'));
const InvitePage = lazy(() => import('../pages/dashboard/InvitePage'));

const NoticesPage = lazy(() => import('../pages/dashboard/WrappedPages').then(module => ({ default: module.NoticesPage })));
const ProfilePage = lazy(() => import('../pages/dashboard/WrappedPages').then(module => ({ default: module.ProfilePage })));
const ManageResidentsPage = lazy(() => import('../pages/dashboard/WrappedPages').then(module => ({ default: module.ManageResidentsPage })));
const SocietyPage = lazy(() => import('../pages/dashboard/WrappedPages').then(module => ({ default: module.SocietyPage })));
const EventsPage = lazy(() => import('../pages/dashboard/WrappedPages').then(module => ({ default: module.EventsPage })));
const FacilitiesPage = lazy(() => import('../pages/dashboard/WrappedPages').then(module => ({ default: module.FacilitiesPage })));
const BookingsPage = lazy(() => import('../pages/dashboard/WrappedPages').then(module => ({ default: module.BookingsPage })));

const Loader = () => <div className="p-8 text-slate-500 animate-pulse font-bold">Loading view...</div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup-password/:token" element={<SetupPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="bills" element={<BillsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="society" element={<SocietyPage />} />
            <Route path="events" element={<EventsPage />} />

            <Route path="invite" element={<InvitePage />} />
            <Route path="manage-society" element={<SocietyPage />} />
            <Route path="facilities" element={<FacilitiesPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="admin-bills" element={<BillsPage />} />
            <Route path="residents" element={<ManageResidentsPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
