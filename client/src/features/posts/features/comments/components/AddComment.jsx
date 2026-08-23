import { BiSend } from "react-icons/bi"
import { Spinner } from "@/components"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import useComment from "../hooks/useComment"

const AddComment = ({ postId }) => {
  const { comment, setComment, handleCreate, commenting } = useComment(postId)
  return (
    <div className="-mb-2 flex items-center space-x-2 px-1.5 pb-1">
      <Textarea
        type="text"
        value={comment}
        variant="reply"
        onChange={(e) => setComment(e.target.value)}
        placeholder="whats your thought on this ? "
        className="custom-scrollbar-hide h-9 flex-1 resize-none border px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-muted"
        rows={1}
      />
      <Button variant="outline" onClick={() => !commenting && handleCreate()}>
        {commenting ? <Spinner size="3" /> : <BiSend />}
      </Button>
    </div>
  )
}

export default AddComment
