import React from 'react';

interface StudentAvatarProps {
  emailLength: number;
  isPasswordFocused: boolean;
  isEmailFocused: boolean;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({ 
  emailLength, 
  isPasswordFocused,
  isEmailFocused
}) => {
  // Calculate eye pupil position based on email length
  const maxMove = 8; 
  const charsToMap = 30;
  const progress = Math.min(emailLength, charsToMap) / charsToMap; // 0 to 1
  
  // X: If email is focused, move based on length (from left to right). 
  // If NOT focused, center the eyes (0).
  const eyeX = isEmailFocused ? ((progress * (maxMove * 2)) - maxMove) : 0;
  
  // Y: Look down towards input (positive Y) ONLY when email is focused
  // Look straight ahead (0) when not focused
  const eyeY = isEmailFocused ? 6 : 0;

  return (
    <div className="w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 relative mx-auto mb-2 xs:mb-4 transition-all duration-500">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffdec7" />
            <stop offset="100%" stopColor="#eebc98" />
          </linearGradient>
          <linearGradient id="gownGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="50%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="90%" stopColor="#18181b" />
          </linearGradient>
          <linearGradient id="hatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" /> 
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          
          <clipPath id="eyesClip">
            <ellipse cx="82" cy="116" rx="10" ry="10" />
            <ellipse cx="118" cy="116" rx="10" ry="10" />
          </clipPath>
        </defs>

        {/* --- BODY & CLOTHING --- */}
        <g id="body">
            <path d="M40 185 Q100 165 160 185 L160 210 L40 210 Z" fill="url(#gownGradient)" />
            <path d="M78 185 L100 205 L122 185" fill="#f8fafc" />
            <path d="M94 185 L100 192 L106 185 L100 210 Z" fill="#ef4444" />
            <path d="M94 185 L106 185" stroke="#ef4444" strokeWidth="2" />
            <path d="M40 185 Q70 195 90 210" stroke="#000000" strokeOpacity="0.1" fill="none" />
            <path d="M160 185 Q130 195 110 210" stroke="#000000" strokeOpacity="0.1" fill="none" />
        </g>

        {/* --- NECK --- */}
        <g id="neck">
            <path d="M85 150 Q85 165 82 185 L118 185 Q115 165 115 150" fill="#eebc98" />
            <path d="M85 150 Q100 162 115 150 L115 158 Q100 170 85 158 Z" fill="#dcb8a0" opacity="0.6" />
        </g>

        {/* --- HEAD & FACE --- */}
        <g id="head">
            <path d="M55 90 Q40 120 50 145 Q60 155 70 145 L130 145 Q140 155 150 145 Q160 120 145 90 Q100 70 55 90" fill="url(#hairGradient)" />
            <path d="M50 115 Q45 120 50 130" fill="#eebc98" />
            <path d="M150 115 Q155 120 150 130" fill="#eebc98" />
            <ellipse cx="100" cy="115" rx="46" ry="48" fill="url(#skinGradient)" />
            <ellipse cx="70" cy="125" rx="6" ry="3" fill="#ff9999" opacity="0.1" />
            <ellipse cx="130" cy="125" rx="6" ry="3" fill="#ff9999" opacity="0.1" />
            <path d="M98 122 Q100 125 102 122" stroke="#dcb8a0" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
        </g>

        {/* --- FEATURES --- */}
        <g id="features">
            <path d="M72 102 Q82 98 92 102" stroke="#7c3aed" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
            <path d="M108 102 Q118 98 128 102" stroke="#7c3aed" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />

            <g>
                <ellipse 
                    cx="82" cy="116" rx="10" ry="10" 
                    fill="white" 
                    className={`transition-all duration-200 ease-in-out ${isPasswordFocused ? 'opacity-0 scale-y-0' : 'opacity-100 scale-y-100'}`} 
                    style={{ transformOrigin: '82px 116px' }}
                />
                <ellipse 
                    cx="118" cy="116" rx="10" ry="10" 
                    fill="white" 
                    className={`transition-all duration-200 ease-in-out ${isPasswordFocused ? 'opacity-0 scale-y-0' : 'opacity-100 scale-y-100'}`} 
                    style={{ transformOrigin: '118px 116px' }}
                />

                <g clipPath="url(#eyesClip)">
                    <g 
                        style={{ 
                            transform: `translateX(${isPasswordFocused ? 0 : eyeX}px) translateY(${eyeY}px)`,
                            transition: 'transform 0.1s linear'
                        }}
                    >
                        <g className="transition-opacity duration-150" opacity={isPasswordFocused ? 0 : 1}>
                            <circle cx="82" cy="116" r="4" fill="#1e293b" />
                            <circle cx="84" cy="114" r="1.5" fill="white" opacity="0.6" />
                        </g>
                        <g className="transition-opacity duration-150" opacity={isPasswordFocused ? 0 : 1}>
                            <circle cx="118" cy="116" r="4" fill="#1e293b" />
                            <circle cx="120" cy="114" r="1.5" fill="white" opacity="0.6" />
                        </g>
                    </g>
                </g>

                <g className={`transition-all duration-200 ease-in-out origin-top ${isPasswordFocused ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}>
                    <path d="M72 116 Q82 122 92 116" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M108 116 Q118 122 128 116" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
                </g>
            </g>

            <path 
                d={isPasswordFocused ? "M92 145 Q100 142 108 145" : "M92 142 Q100 148 108 142"} 
                stroke="#c28e68" strokeWidth="2.5" strokeLinecap="round" fill="none" 
                className="transition-all duration-300"
            />
        </g>

        {/* --- HAIR FRONT & CAP --- */}
        <g id="hair-front">
             <path d="M55 85 Q65 110 85 95 Q95 85 105 95 Q115 110 145 85 L145 60 Q100 50 55 60 Z" fill="url(#hairGradient)" />
             <path d="M70 75 Q90 80 110 70" stroke="white" strokeOpacity="0.05" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>

        <g id="hat">
            <path d="M60 65 Q100 58 140 65 L140 78 Q100 85 60 78 Z" fill="#1e293b" />
            <path d="M20 58 L100 85 L180 58 L100 32 Z" fill="#0f172a" />
            <path d="M20 55 L100 82 L180 55 L100 28 Z" fill="url(#hatGradient)" stroke="#334155" strokeWidth="0.5" />
            <path d="M20 55 L100 82 L100 86 L20 59 Z" fill="#1e293b" />
            <path d="M180 55 L100 82 L100 86 L180 59 Z" fill="#1e293b" />
            <circle cx="100" cy="55" r="3.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5"/>
            <path d="M100 55 Q135 55 158 80" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
            <g transform="translate(155, 80) rotate(10)">
                <rect x="-2" y="0" width="4" height="14" rx="1" fill="#fbbf24" />
                <path d="M-2 14 L-3 18" stroke="#fbbf24" strokeWidth="1" />
                <path d="M0 14 L0 19" stroke="#fbbf24" strokeWidth="1" />
                <path d="M2 14 L3 18" stroke="#fbbf24" strokeWidth="1" />
            </g>
        </g>

      </svg>
    </div>
  );
};