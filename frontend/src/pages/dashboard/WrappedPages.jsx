import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Notices from '../../components/Notices';

export const NoticesPage = () => {
  const { user } = useAuth();
  return <Notices user={user} />;
};

import Profile from '../../components/Profile';
export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  return <Profile user={user} setUser={setUser} />;
};

import ManageResidents from '../../components/ManageResidents';
export const ManageResidentsPage = () => {
  const { user } = useAuth();
  return <ManageResidents currentUser={user} />;
};

import SocietyShowcase from '../../components/SocietyShowcase';
export const SocietyPage = () => {
  const { user } = useAuth();
  return <SocietyShowcase user={user} />;
};

import EventBooking from '../../components/EventBooking';
export const EventsPage = () => {
  const { user } = useAuth();
  return <EventBooking user={user} />;
};

import AdminFacilityManagement from '../../components/AdminFacilityManagement';
export const FacilitiesPage = () => {
  return <AdminFacilityManagement />;
};

import AdminBookingRequests from '../../components/AdminBookingRequests';
export const BookingsPage = () => {
  return <AdminBookingRequests />;
};
