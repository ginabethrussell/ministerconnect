export default function Footer() {
  return (
    <footer className="bg-efcaBlue text-white py-8 mt-12">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
        <div>
          <span className="block text-sm mt-1">
            &copy; {new Date().getFullYear()} EFCA Great Lakes District Minister Connect. All rights
            reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
