import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  
  return (
    <Html lang="en">
      <Head>
        {/* SEO Meta Tags */}
        <meta name="description" content="Advanced Learning Management System with expert booking, courses, and affiliate tools" />
        <meta name="keywords" content="LMS, learning, courses, education, training, experts" />
        <meta name="author" content="Your Company Name" />
        
        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="LMS Platform" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/twitter-image.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Font Awesome CSS */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
        
        {/* Preconnect to font providers for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Inter font for better typography */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        
        {/* Preconnect to analytics and third-party services */}
        {GA_ID && (
          <>
            <link rel="preconnect" href="https://www.google-analytics.com" />
            <link rel="preconnect" href="https://www.googletagmanager.com" />
          </>
        )}
        
        {/* Performance optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                    anonymize_ip: true,
                    cookie_flags: 'SameSite=None;Secure'
                  });
                `,
              }}
            />
          </>
        )}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        
        {/* Accessibility Skip Links */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded">
          Skip to main content
        </a>
        
        {/* Noscript fallback */}
        <noscript>
          <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold mb-4">JavaScript Required</h1>
              <p className="text-gray-600">Please enable JavaScript in your browser to use this application.</p>
            </div>
          </div>
        </noscript>
      </body>
    </Html>
  );
}