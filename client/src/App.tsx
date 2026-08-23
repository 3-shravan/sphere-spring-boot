import {
  ForgetPassword,
  Login,
  Register,
  ResetPasswordViaEmail,
} from "@features/auth";
import { Toast } from "@lib/Toast";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {
  NonExistRoutes,
  Offline,
  PageSuspenseLoader,
  ProtectedRoutes,
  PublicRoutes,
} from "@/components";
import { CreatePost, SavedPosts } from "@/features/posts";
import { FeedLayout, HomePage } from "@/layouts";
import { DeveloperRoute } from "./components/routing/DeveloperRoutes";
import PostProviderWrapper from "./components/routing/PostProviderWrapper";
import { ChatLayout, ChatPage, Conversations } from "./features/chat";
import DeveloperPage from "./features/developer/pages/DeveloperPage";
import Explore from "./features/explore/pages/Explore";
import Page from "./features/landing-page/pages/Page";
import ViewPost from "./features/posts/pages/ViewPost";
import useNetworkStatus from "./hooks/useNetworkStatus";

const Profile = lazy(() => import("@/features/users/profile/pages/Profile"));

export default function App() {
  const isOnline = useNetworkStatus();
  if (!isOnline) return <Offline />;

  return (
    <>
      <Toast />
      <Suspense fallback={<PageSuspenseLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoutes />}>
            <Route path="/" element={<Page />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/reset-password/email/:token"
              element={<ResetPasswordViaEmail />}
            />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<PostProviderWrapper />}>
              <Route path="/" element={<FeedLayout />}>
                <Route path="feeds" element={<HomePage />} />
                <Route path="saved" element={<SavedPosts />} />
                <Route path="create-post" element={<CreatePost />} />
                <Route path="explore" element={<Explore />} />
                <Route path="conversations" element={<ChatLayout />}>
                  <Route index element={<Conversations />} />
                  <Route path="chat/:chatId" element={<ChatPage />} />
                </Route>
                <Route path="profile/:username" element={<Profile />} />
              </Route>
            </Route>
          </Route>

          <Route
            path="/developer"
            element={
              <DeveloperRoute>
                <DeveloperPage />
              </DeveloperRoute>
            }
          />

          {/* View Post - Publicly Accessible */}
          <Route path="/post/:postId" element={<ViewPost />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <NonExistRoutes />
              </motion.div>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}
