const Footer = () => {
    return (
      <footer className="bg-gray-200 text-gray-700 text-sm p-4 flex justify-between items-center h-[80px] w-[1170px] mx-88 px-3 border-md rounded">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          <p>Copyright © 2025 AMD. All rights reserved.</p>
          
          <a
            href="/terms-of-use"
            className="text-blue-600 hover:underline cursor-pointer mx-44"
          >
            Terms of Use
          </a>
          <span className="text-gray-400 -mx-44">|</span>
          <a
            href="/privacy-policy"
            className="text-blue-600 hover:underline cursor-pointer mx-48"
          >
            Privacy Policy
          </a>
        </div>
  
        {/* Right Section */}
        <div className="text-gray-700">
          <p>Seek insights that are valuable to you</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  