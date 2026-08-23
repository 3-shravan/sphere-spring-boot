export default function ShowTags({ tags, count = tags?.length }) {
  return (
    <div>
      {tags?.length > 0 && (
        <div className="mt-1">
          {tags.slice(0, count).map((tag, index) => (
            <span key={index} className="tags">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
