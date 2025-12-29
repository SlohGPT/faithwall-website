export default function IPhoneMockup() {
  return (
    <div className="relative w-[280px] sm:w-[320px] animate-float">
      <div className="relative bg-surface-elevated rounded-[3rem] p-3 shadow-2xl border border-surface-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-surface-elevated rounded-b-3xl z-10" />

        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[9/19.5]">
          <img
            src="https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Peaceful mountain sunrise"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

          <div className="relative h-full flex flex-col p-6 pt-12">
            <div className="text-center text-white mb-2">
              <p className="text-sm font-light opacity-80">Monday, December 23</p>
              <p className="text-5xl font-light tracking-tight">9:41</p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-2">
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-white text-base leading-relaxed">
                    "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you."
                  </p>
                  <p className="text-brand-light text-sm mt-3 font-medium">
                    Jeremiah 29:11
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mt-auto">
              <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
