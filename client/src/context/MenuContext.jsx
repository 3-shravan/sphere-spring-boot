import React, { createContext } from "react"

const MenuContext = createContext()

export function MenuProvider({ children }) {
  const [menu, setMenu] = React.useState(false)
  const [isMenuDisabled, setIsMenuDisabled] = React.useState(false)

  const disableMenu = () => setIsMenuDisabled(true)
  const enableMenu = () => setIsMenuDisabled(false)
  const toggleMenu = () => setMenu((prev) => !prev)

  return (
    <MenuContext.Provider value={{ menu, toggleMenu, isMenuDisabled, disableMenu, enableMenu }}>
      {children}
    </MenuContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMenu = () => React.useContext(MenuContext)
