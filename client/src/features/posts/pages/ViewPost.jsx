import { useState } from "react"
import { useParams } from "react-router-dom"
import { Loading, Modal, ShowError } from "@/components"
import { ShareModal } from "@/shared"
import { useGetSinglePost } from "@/shared/api/useQueries"
import ViewPostInfo from "../components/view-post/ViewPostInfo"
import ViewPostMedia from "../components/view-post/ViewPostMedia"

export default function ViewPost() {
  const { postId } = useParams()
  const { data, isLoading, isError } = useGetSinglePost(postId)
  const post = data?.post

  const [showModal, setShowModal] = useState(false)

  if (isLoading)
    return (
      <div className="mt-8">
        <Loading />
      </div>
    )
  if (isError || !post) return <ShowError />

  const { media, thoughts, _id } = post

  return (
    <div className="inset-0 z-50 flex h-screen items-center justify-center bg-background p-2 md:p-4">
      <main className="flex h-full w-full max-w-6xl flex-col overflow-y-auto bg-background md:flex-row md:overflow-hidden">
        <ViewPostMedia media={media} thoughts={thoughts} />
        <ViewPostInfo postId={_id} post={post} setShowModal={setShowModal} />

        {showModal && (
          <Modal onCancel={() => setShowModal(false)} title="Share Post">
            <ShareModal postId={postId} />
          </Modal>
        )}
      </main>
    </div>
  )
}
