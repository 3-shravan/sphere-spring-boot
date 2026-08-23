export default function ViewPostMedia({ media, thoughts }) {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center rounded-lg bg-neutral-800/5 md:h-full md:w-1/2">
      {media ? (
        <img
          src={media}
          alt="Post"
          className="h-auto max-h-[50vh] w-full rounded-4xl object-contain p-4 md:max-h-full"
        />
      ) : (
        <div className="flex items-center justify-center p-4 font-Poppins text-neutral-600 text-sm uppercase leading-5 md:leading-8">
          {thoughts}
        </div>
      )}
    </div>
  )
}
