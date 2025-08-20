import React from 'react';
import Head from 'next/head';
import LessonPage from '../components/LessonPage';

export default function LessonDemo() {
  const handleEnagicClick = () => {
    console.log('Enagic Fast Track clicked');
    // Navigate to calendar scheduler
  };

  const handleSkillsClick = () => {
    console.log('Build Skills First clicked');
    // Navigate to Discovery Process course
  };

  const handleMarkComplete = () => {
    console.log('Lesson marked as complete');
  };

  const handleContinue = () => {
    console.log('Continue to next lesson');
  };

  const handleUpgrade = () => {
    console.log('Upgrade clicked');
  };

  return (
    <>
      <Head>
        <title>Lesson Demo - TikTok Mastery</title>
        <meta name="description" content="Demo of the responsive lesson page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <LessonPage
        breadcrumbs={['Dashboard', 'All Courses', 'TIK-TOK MASTERY', 'Viral Content Creation']}
        videoTitle="Viral Content Creation"
        videoPoster="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
        currentTime="3:44"
        totalTime="8:00"
        lessonTitle="Lesson Overview"
        lessonDescription="Create content that goes viral consistently"
        keyTakeaways={[
          'How to conduct effective market research',
          'Creating detailed customer personas',
          'Positioning strategies for your business'
        ]}
        estimatedTime="8:00"
        progress={{
          percentage: 71,
          moduleProgress: '1 of 3 lessons',
          courseProgress: '5 of 7 lessons',
          xpEarned: '+50 XP'
        }}
        materials={[
          { name: 'Market Research Works...', type: 'PDF', size: '1.2 MB' },
          { name: 'Customer Persona Temp...', type: 'DOCX', size: '856 KB' }
        ]}
        onEnagicClick={handleEnagicClick}
        onSkillsClick={handleSkillsClick}
        onMarkComplete={handleMarkComplete}
        onContinue={handleContinue}
        onUpgrade={handleUpgrade}
      />
    </>
  );
}