import { Battery, Plus, Search, Wifi } from "lucide-react"

const imgSrc = [
  "https://images.pexels.com/photos/4029925/pexels-photo-4029925.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/5105049/pexels-photo-5105049.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/5461379/pexels-photo-5461379.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/325045/pexels-photo-325045.jpeg?auto=compress&cs=tinysrgb&w=600",
]
const PhoneMockup = () => {
  return (
    <div className="relative mx-auto mt-10 hidden max-w-sm md:block">
      {/* Phone frame */}

      <div className="h-[70vh] overflow-hidden rounded-[40px] border-2 border-[#111] bg-black shadow-4xl">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-2 pb-1 text-white">
          <span className="pt-3 font-Poppins font-semibold text-xs">
            9<span className="text-gray-400">:</span>41
          </span>

          <div className="-translate-x-1/2 absolute top-0 left-1/2 flex h-12 transform items-center justify-center rounded-b-xl">
            <div className="h-6 w-6 rounded-full bg-bg"></div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Wifi size={14} strokeWidth={1} absoluteStrokeWidth />
            <Battery size={20} strokeWidth={1} absoluteStrokeWidth />
          </div>
        </div>

        {/* App content */}
        <div className="h-[100px] w-full p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="p-1 font-semibold text-2xl text-white">Chats</h2>
            <div className="h-12 w-12 overflow-hidden rounded-full">
              <img
                src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-bg px-3 py-3">
            <span className="text-gray-400">
              <Search size={18} />
            </span>
            <span className="text-gray-400 text-sm">Search</span>
          </div>

          {/* Contact circles */}
          <div className="mb-4 flex justify-between px-2">
            {["Caroline", "Damon", "Stefan", "Klaus"].map((name, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-1 h-18 w-18 overflow-hidden rounded-full bg-gray-200">
                  <img
                    src={imgSrc[index]}
                    alt={name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100"
                    }}
                  />
                </div>
                <span className="font-semibold text-xs">{name}</span>
              </div>
            ))}
          </div>

          <div className="mt-14 flex items-center justify-between">
            <h2 className="p-1 font-semibold text-2xl text-white">Posts</h2>
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-1 border-zinc-800">
              <Plus />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom shadow */}
      <div className="absolute bottom-0 left-0 h-30 w-full bg-gradient-to-t from-[#000] to-transparent shadow-3xl"></div>

      {/* Connect button */}
    </div>
  )
}

export default PhoneMockup
