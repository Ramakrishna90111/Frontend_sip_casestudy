export default function Footer() {
  return (
    <div className="bg-[#02051a] text-white px-[120px] py-[60px] mt-[50px]">
      <div className="grid grid-cols-4 gap-16">
        {/* Left Section */}
        <div className="space-y-7">
          <img
            width="250"
            src="https://media.licdn.com/dms/image/v2/D5612AQF2a3w6KSWWdA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1675007152298?e=2147483647&v=beta&t=yiHyMxJ8zPL5_gfLv6YwU46FhhPwmB1YCv0duA390SY"
            alt="logo"
          />
          <p className="text-gray-400 leading-10 text-[13px]">
            KFintech serves the mission-critical needs of asset managers with clients spanning mutual funds, AIFs (alternative investments), pension, wealth managers and corporates in India and abroad. The company provides SaaS based end-to-end transaction management, channel management, compliance solutions, data analytics and various other digital services to asset managers across segments, as well as outsourcing services for global players.
          </p>
        </div>

        {/* Column 2 */}
        <div className="space-y-10">
          <div>
            <h1 className="font-bold text-[20px] mb-4">ABOUT US</h1>

            <div className="space-y-3 text-gray-400">
              <p>About KFintech</p>
              <p>Careers</p>
              <p>Contact Us</p>
            </div>
          </div>

          <div>
            <h1 className="font-bold text-[20px] mb-4">
              MUTUAL FUND SOLUTIONS
            </h1>

            <div className="space-y-3 text-gray-400">
              <p>Distributor Solutions</p>
              <p>Channel Partner Solutions</p>
              <p>Investor Solutions</p>
              <p>RIA Solutions</p>
              <p>AMC Solutions</p>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-5">
          <div>
            <h1 className="font-bold text-[20px] mb-4">
              CORPORATE REGISTRY
            </h1>

            <div className="space-y-3 text-gray-400">
              <p>Karisma</p>
              <p>Evoting</p>
              <p>Fintrak</p>
              <p>Kprism</p>
            </div>
          </div>

          <div>
            <h1 className="font-bold text-[20px] mb-4">
              GLOBAL BUSINESS SOLUTIONS
            </h1>
            <div className="space-y-3 text-gray-400">
              <p>Mortgage Solutions</p>
              <p>Investor Solutions</p>
              <p>Legal Solutions</p>
              <p>Finance Solutions</p>
            </div>
          </div>
        </div>

        {/* Column 4 */}
        <div className="space-y-5">
          <div>
            <h1 className="font-bold text-[20px] mb-4">
              OTHER SOLUTIONS
            </h1>

            <div className="space-y-3 text-gray-400">
              <p>GFS</p>
              <p>PWM</p>
              <p>PMS</p>
              <p>AIF</p>
            </div>
          </div>

          <div>
            <h1 className="font-bold text-[20px] mb-4">
              LEGAL & PRIVACY
            </h1>

            <div className="space-y-3 text-gray-400">
              <p>Terms of Use</p>
              <p>Privacy Policy</p>
              <p>Disclosures</p>
            </div>
          </div>

          <div>
            <h1 className="font-bold text-[20px] mb-4">
              GET IN TOUCH
            </h1>

            <div className="space-y-3 text-gray-400">
              <p>+91-40-67162222</p>
              <p>91000 94099</p>
              <p>einward.ris@kfintech.com</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}