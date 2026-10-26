import './globals.css';

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-night-950 px-4 text-bone">
        <div className="text-center">
          <p className="h-section">This page went dark.</p>
          <a href="/en" className="btn btn-primary mt-8">
            Back to the journey
          </a>
        </div>
      </body>
    </html>
  );
}
