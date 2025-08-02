import React from 'react';

export default function PasswordRequirements() {
  return (
    <div className="text-sm text-efcaMuted mt-2 space-y-1">
      <p>Your password must:</p>
      <ul className="list-disc list-inside ml-2">
        <li>Be at least 8 characters long</li>
        <li>Not be too similar to your personal information</li>
        <li>Not be a commonly used password</li>
        <li>Not be entirely numeric</li>
      </ul>
    </div>
  );
}
