import API from './axiosInstance';

export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

export const getMatches = (userId) => API.get(`/matches/${userId}`);
export const getAllMatches = () => API.get('/matches');
export const createSkillPost = (postData) => API.post('/matches', postData);

export const getBookings = (userId) => API.get(`/bookings/${userId}`);
export const bookSession = (bookingData) => API.post('/book-session', bookingData);
export const requestSwap = (swapData) => API.post('/swap-request', swapData);
export const acceptBooking = (bookingId, meetLink) => API.put(`/accept-booking/${bookingId}`, { meetLink });
export const rejectBooking = (bookingId) => API.put(`/reject-booking/${bookingId}`);

export const getProfile = (userId) => API.get(`/profile/${userId}`);
export const updateProfileData = (userId, profileData) => API.put(`/profile/${userId}`, profileData);

export const getAllJobs = () => API.get('/jobs');
export const createJob = (jobData) => API.post('/jobs', jobData);
export const applyForJob = (jobId, applicationData) => API.post(`/jobs/${jobId}/apply`, applicationData);
export const getMyActivities = (userId) => API.get(`/jobs/user/${userId}`);