import { Tally2 } from "lucide-react"
import { useState } from "react"
import { Modal } from "@/components"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context"
import EditPost from "@/features/posts/drawer/EditPost"
import { DeleteModal, ShareModal, usePostFromCache } from "@/shared"

const PostOptions = ({ postId, dropdown }) => {
  const post = usePostFromCache(postId, "feed", dropdown)

  const [showModal, setShowModal] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { currentUserId } = useAuth()
  const authorized = currentUserId === post?.author?._id
  const isThoughts = !!post?.thoughts

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer outline-hidden">
          <Tally2 />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="cursor-pointer bg-card font-Poppins">
          {authorized && !isThoughts && (
            <DropdownMenuItem className="cursor-pointer px-3" onClick={() => setEditOpen(true)}>
              ⚙ Edit
            </DropdownMenuItem>
          )}
          {authorized && (
            <DropdownMenuItem className="cursor-pointer" onClick={() => setConfirmDelete(true)}>
              ❌ Delete
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="cursor-pointer" onClick={() => setShowModal(true)}>
            🚀 Share
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      {editOpen && <EditPost open={open} setOpen={setEditOpen} postId={postId} />}
      {/* Share Modal */}
      {showModal && (
        <Modal darkModal={true} onCancel={() => setShowModal(false)} title="Share Post">
          <ShareModal postId={postId} />
        </Modal>
      )}
      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <Modal darkModal={true}>
          <DeleteModal onCancel={() => setConfirmDelete(false)} postId={postId} />
        </Modal>
      )}
    </>
  )
}

export default PostOptions
