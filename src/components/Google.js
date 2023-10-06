import React from 'react';

export default function Google () {
  return (
    <div>
      <a href="http://localhost:3000/auth/google" style={{ textDecoration: 'none' }}>
        <button style={{ padding: '10px 20px', backgroundColor: '#4285F4', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Se connecter avec Google
        </button>
      </a>
    </div>
  );
};

