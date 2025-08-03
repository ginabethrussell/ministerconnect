import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 bg-efcaBlue py-8 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
        <div>
          <span className="mt-1 block text-sm">
            &copy; {new Date().getFullYear()} EFCA Great Lakes District Minister Connect. All rights
            reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
