function Footer() {
  return (
    <footer className="bg-[#06436B] text-[#ccdce4] shadow-top p-2">
      <div className="max-w-7xl mx-auto px-4 text-sm md:text-xl sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-auto  mb-4 md:mb-0">
            <ul className="mt-2 mb-4 flex flex-col md:flex-row">
              <li>
                <a
                  href="#"
                  className="md:mr-10 hover:text-gray-300 hover:underline"
                >
                  All Campaigns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 hover:underline">
                  Add Campaign
                </a>
              </li>
            </ul>
            <p>&copy; 2024 IA Campaign Tracker. All rights reserved.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col justify-center">
            <h5 className=" font-bold">Contact Information</h5>
            <p>Developer: Christine Bergen</p>
            <p>
              Email:{" "}
              <a
                href="mailto:christine.bergen@itas.ca"
                className="hover:underline hover:text-gray-300"
              >
                christine.bergen@itas.ca
              </a>
            </p>
          </div>
        </div>
        <div className="mt-2 text-center md:text-left"></div>
      </div>
    </footer>
  );
}

export default Footer;
