import React from 'react';

export default function PasswordRequirements() {
  return (
    <div className="text-efcaMuted mt-2 space-y-1 text-sm">
      <p>Your password must:</p>
      <ul className="ml-2 list-inside list-disc">
        <li>Be at least 8 characters long</li>
        <li>Not be too similar to your personal information</li>
        <li>Not be a commonly used password</li>
        <li>Not be entirely numeric</li>
      </ul>
    </div>
  );
}
