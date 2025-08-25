import React from 'react';
import Head from 'next/head';
import { DigitalEraLibrary } from '../components/digital-era/DigitalEraLibrary';

export default function DigitalEraLibraryPage() {
  return (
    <>
      <Head>
        <title>Digital Era Library - Premium Business Education Platform</title>
        <meta name="description" content="Explore our comprehensive library of business courses, masterclasses, and call replays designed for modern entrepreneurs." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DigitalEraLibrary />
    </>
  );
}