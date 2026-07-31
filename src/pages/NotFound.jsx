import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-5 my-5">
      <h1 className="display-1 fw-bold text-primary mb-0">404</h1>
      <h3 className="fw-bold text-dark mb-2">Page Not Found</h3>
      <p className="text-secondary mb-4">আপনি যে পেজটি খুঁজছেন তা বিদ্যমান নেই বা সরিয়ে ফেলা হয়েছে।</p>
      <Link to="/matches" className="btn btn-primary rounded-pill px-4 fw-semibold">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;