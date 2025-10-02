'use client';

interface LoadingAnimationProps {
  showContent: boolean;
}

export default function LoadingAnimation({ showContent }: LoadingAnimationProps) {
  return (
    <div className={`loading-overlay ${showContent ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-text">
          <span>Vancouver Oldest</span>
          <span>tattoo shop</span>
        </div>
        <div className="loading-divider"></div>
        <div className="loading-images">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="loading-image" style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="image-placeholder"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
