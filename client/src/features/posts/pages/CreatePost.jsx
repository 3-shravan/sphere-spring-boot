import { Container, H2 } from "@/components"
import CreatePostForm from "../components/CreatePostForm"

const CreatePost = () => {
  return (
    <Container>
      <H2 text={"Create Post"} />
      <div className="w-full md:mt-7 lg:mt-5">
        <CreatePostForm />
      </div>
    </Container>
  )
}

export default CreatePost
