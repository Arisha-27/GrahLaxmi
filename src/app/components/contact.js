export default function ContactPage() {
  return (
    <div className="bg-white py-16 px-6" id="contact">
      <div className="max-w-3xl mx-auto text-[#203C5B]">
        <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-center text-gray-600 mb-10 text-lg">
          We'd love to hear from you! Whether it's a question, suggestion, or partnership idea — feel free to drop a message.
        </p>

        <form className="space-y-6 bg-[#FFF6EA] p-8 rounded-2xl shadow-lg">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#203C5B] bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#203C5B] bg-white"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="message">
              Your Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Write your message here..."
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#203C5B] bg-white"
            />
          </div>

          {/* Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#203C5B] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#162B40] transition duration-200"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
