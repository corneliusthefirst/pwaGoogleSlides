import React, { useCallback, useEffect } from "react"
import "./App.css"
import Login from "./screens/auth/login-page"
import { Routes, Route, Navigate} from "react-router-dom"
import Presentation from "./screens/presentation-page"
import EditSlide from "./screens/edit-slide-page"
import { database } from "./services/firebase"
import RevealSlides from "./screens/swiper/reveal-slides"
import Header from "./components/Header"
import Home from "./screens/home-page"
import { useAppState } from "./context/app-state-context"
import { ChatRoom } from "./components/chat-room"

function App() {
  const { initializeApp, appState  } = useAppState()
  const { user, isLoggedIn } = appState || {}


  const resetAppState = useCallback(
    (e) => {
      e.preventDefault()
      initializeApp()
    },
    [initializeApp]
  )

  useEffect(() => {
    window.addEventListener("beforeunload", resetAppState)
    return () => {
      window.removeEventListener("beforeunload", resetAppState)
    }
  }, [resetAppState])

  return (
    <div>
      <div>
        <Header user={user} />

        <Routes>
          <Route path="/login" element={<Login database={database} />} />

          <Route
            path="/presentation"
            element={<Home database={database} user={user} />}
          />
          <Route
            path="/"
            element={<Navigate replace to={isLoggedIn ? "presentation" : "/login"} />}
          />
          <Route
            path="/presentation/:id"
            element={<Presentation database={database} user={user} />}
          />
          <Route
            path="/presentation/chat/:id"
            element={<ChatRoom database={database} user={user} />}
          />
          <Route
            path="presentation/editDocs/:id"
            element={<EditSlide user={user} />}
          />
          <Route
            path="presentation/reveal/:id"
            element={<RevealSlides user={user} />}
          />
        </Routes>
      </div>
    </div>
  )
}
export default App
