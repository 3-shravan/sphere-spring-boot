export default function Container({ children }) {
  return (
    <div className="flex h-[100svh] w-full flex-1 overflow-y-auto pb-2 md:gap-10 md:px-8 md:py-4 lg:px-4 lg:py-2.5">
      {children}
    </div>
  )
}
