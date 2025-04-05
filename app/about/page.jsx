'use client'
import React from 'react';

function AboutPage() {
  return (
    <div
      style={{
        fontFamily: 'Inter, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url("/defo.png")', // Utilisation correcte de l'image dans le dossier public
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {/* Blur overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1,
        }}
      ></div>

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: '#f4f4f4',
          padding: '24px',
          maxWidth: '800px',
          marginTop: '10px',
        }}
      >
        <h1 style={{ fontSize: '65px', fontWeight: 'bold', color: '#d4f4dd', marginBottom: '85px' }}>
          About the Project
        </h1>
        <p style={{ fontSize: '24px', lineHeight: '1.6', color: '#e0e0e0', marginBottom: '24px' }}>
          This project aims to revolutionize the funding of NGOs and projects through tokenization. Donors receive unique
          NFTs based on the size of their donation, with increased chances of obtaining a rare NFT for larger
          contributions. Donors also accumulate XP that places them on a leaderboard, fostering healthy competition for
          solidarity and philanthropy.
        </p>
        <p style={{ fontSize: '17px', lineHeight: '1.6', color: '#c0c0c0', marginTop: '100px' }}>
          Developed during the Paris Blockchain Week as part of the XRP Humanity & Solidarity track by Elina
          Jankovskaja , Ramzy Bouziane, Joseph Sommet, Teo Babou, and Lucas Maret.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;