const Gradient = () => {
  return (
    <div className="-translate-x-1/2 absolute top-0 left-1/2 h-screen w-full max-w-4xl">
      <div className="-left-1/4 absolute top-1/4 h-1/2 w-1/2 rounded-full bg-emerald-700 opacity-20 blur-[100px]"></div>
      <div className="-right-1/4 absolute bottom-1/4 h-1/2 w-1/2 rounded-full bg-blue-700 opacity-20 blur-[100px]"></div>
    </div>
  )
}

export default Gradient
