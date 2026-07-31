import API from './axiosInstance';

// --- Auth APIs ---
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

// --- Matchmaking APIs ---
export const getMatches = (userId) => API.get(`/matches/${userId}`);

// --- Session Booking APIs ---
export const getBookings = (userId) => API.get(`/bookings/${userId}`);
export const bookSession = (bookingData) => API.post('/book-session', bookingData);
export const acceptBooking = (bookingId, meetLink) => API.put(`/accept-booking/${bookingId}`, { meetLink });
export const rejectBooking = (bookingId) => API.put(`/reject-booking/${bookingId}`);

// --- Profile APIs ---
export const getProfile = (userId) => API.get(`/profile/${userId}`);
export const updateProfileData = (userId, profileData) => API.put(`/profile/${userId}`, profileData);

// --- Senior-Junior Work & Gig APIs (নতুন যুক্ত করা হয়েছে) ---
export const getAllJobs = () => API.get('/jobs');
export const createJob = (jobData) => API.post('/jobs', jobData);
export const applyForJob = (jobId, applicationData) => API.post(`/jobs/${jobId}/apply`, applicationData);
export const getMyActivities = (userId) => API.get(`/jobs/user/${userId}`);