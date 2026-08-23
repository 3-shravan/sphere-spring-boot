import { useEffect, useState } from "react"
import { Modal } from "@/components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const SocialLinksModal = ({ userId, onClose, onSave }) => {
  const [links, setLinks] = useState({
    instagram: "",
    twitter: "",
    facebook: "",
  })

  useEffect(() => {
    const saved = localStorage.getItem(`links_${userId}`)
    if (saved) setLinks(JSON.parse(saved))
  }, [userId])

  const handleSave = () => {
    localStorage.setItem(`links_${userId}`, JSON.stringify(links))
    onSave?.(links)
    onClose()
  }

  return (
    <Modal>
      <div className="w-full max-w-md space-y-4 rounded-xl bg-background p-6">
        <h2 className="font-Futura font-bold text-xl">Add Your Social Links</h2>

        {Object.keys(links).map((key) => (
          <Input
            key={key}
            placeholder={`${key} username`}
            value={links[key]}
            onChange={(e) => setLinks({ ...links, [key]: e.target.value })}
            className="font-Gilroy"
          />
        ))}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  )
}

export default SocialLinksModal
