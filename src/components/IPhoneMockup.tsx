export default function IPhoneMockup() {
  return (
    <div className="relative w-[280px] sm:w-[320px] animate-float">
      <div className="relative bg-dark rounded-[3rem] p-3 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-dark rounded-b-3xl z-10" />

        <div className="relative bg-gradient-to-b from-[#1a365d] to-[#2d4a5e] rounded-[2.5rem] overflow-hidden aspect-[9/19.5]">
          <img
            src="https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Peaceful mountain sunrise"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

          <div className="relative h-full flex flex-col p-6 pt-12">
            <div className="text-center text-white mb-2">
              <p className="text-sm font-light">Monday, December 23</p>
              <p className="text-5xl font-light tracking-tight">9:41</p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <p className="text-white font-display text-lg leading-relaxed italic">
                    "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."
                  </p>
                  <p className="text-gold-light text-sm mt-3 font-medium">
                    Jeremiah 29:11
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mt-auto">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.25 10c0 .66-.16 1.31-.47 1.89L12 22l-4.78-10.11c-.31-.58-.47-1.23-.47-1.89a5.25 5.25 0 1110.5 0z" />
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4a4 4 0 014 4v4a4 4 0 01-8 0V8a4 4 0 014-4zm0 14a8 8 0 01-8-8V9a1 1 0 012 0v1a6 6 0 1012 0V9a1 1 0 012 0v1a8 8 0 01-8 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
    </div>
  );
}
