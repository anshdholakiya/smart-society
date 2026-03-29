import API from '../utils/api';

export const getNotices = async () => {
  const { data } = await API.get('/notices');
  return data;
};

export const getStats = async () => {
  const { data } = await API.get('/stats');
  return data;
};

export const getMyBills = async () => {
  const { data } = await API.get('/bills/my-bills');
  return data;
};

export const inviteResident = async (inviteData) => {
  const response = await API.post('/users/invite', inviteData);
  return response.data;
};
