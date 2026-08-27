import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Modal, ProfilePicture } from "@/components"
import { Button } from "@/components/ui/button"
import { useStartChat } from "@/hooks/useStartChat"
import { FollowUser, ShowUserModal, SocialLinksModal } from "@/shared"
import EditProfile from "../drawer/EditProfile"
import useProfile from "../hooks/useProfile"

export function ProfileCard({ user }) {
  const [activeModal, setActiveModal] = useState(null)
  const [showLinksModal, setShowLinksModal] = useState(false)
  const [socialLinks, setSocialLinks] = useState({})

  const { me, followersCount, isFollowing, followUser, isPending } = useProfile(user)

  const userId = user._id || user.id
  useEffect(() => {
    const saved = localStorage.getItem(`links_${userId}`)
    if (saved) setSocialLinks(JSON.parse(saved))
  }, [userId])

  const startChat = useStartChat(user)

  const { fullName, dob, name, bio, following, followers, followingCount: initialFollowingCount } = user
  if (!user) return null
  return (
    <div className="flex w-full flex-col items-center justify-center font-Gilroy backdrop-blur-md">
      <ProfilePicture profilePicture={user.profilePicture} username={name} size="profile" />

      <div className="mt-3 flex flex-col items-center text-neutral-700">
        <h2 className="font-Futura font-bold text-2xl text-second">{name}</h2>
        {fullName && <h3 className="text-base">{fullName}</h3>}
        {dob && <p className="text-xs">{new Date(dob).toLocaleDateString()}</p>}

        <div className="mt-1 flex gap-10">
          <div
            className="flex cursor-pointer flex-col items-center"
            onClick={() => setActiveModal("followers")}
          >
            <span className="font-extrabold text-lg">{followersCount}</span>
            <span className="text-neutral-500 text-xs">Followers</span>
          </div>
          <div
            className="flex cursor-pointer flex-col items-center"
            onClick={() => setActiveModal("following")}
          >
            <span className="font-extrabold text-lg">{initialFollowingCount ?? (following?.length || 0)}</span>
            <span className="text-neutral-500 text-xs">Following</span>
          </div>
        </div>

        {bio && (
          <p className="mt-3 max-w-sm break-words text-center font-mono text-foreground italic">
            “{bio}”
          </p>
        )}
        <div className="mt-4 flex gap-4 font-semibold text-xs">
          {Object.entries(socialLinks).map(
            ([key, val]) =>
              val && (
                <Link
                  key={key}
                  to={`https://${key}.com/${val}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border px-3 py-1 text-neutral-600 transition hover:bg-muted"
                >
                  {key}
                </Link>
              ),
          )}
        </div>

        {me ? (
          <div className="space-x-2">
            <EditProfile user={user} />
            <Button
              variant="outline"
              className="rounded-xl bg-input/20 font-Gilroy text-foreground/90 text-xs"
              onClick={() => setShowLinksModal(true)}
            >
              add links 🚀
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap justify-center gap-3 font-mono md:justify-start">
            <FollowUser
              userId={userId}
              isFollowing={isFollowing}
              followUser={followUser}
              isPending={isPending}
            />
            {/* <Button
              variant="secondary"
              onClick={startChat}
              className="cursor-pointer rounded-xl border bg-input/20 font-Gilroy font-bold text-xs"
            >
              Message
            </Button> */}
          </div>
        )}
      </div>

      {activeModal && (
        <Modal darkModal={false}>
          <ShowUserModal
            title={activeModal === "followers" ? "Followers" : "Following"}
            type={activeModal}
            userId={userId}
            onCancel={() => setActiveModal(null)}
          />{" "}
        </Modal>
      )}

      {showLinksModal && (
        <SocialLinksModal
          userId={userId}
          onClose={() => setShowLinksModal(false)}
          onSave={setSocialLinks}
        />
      )}
    </div>
  )
}
