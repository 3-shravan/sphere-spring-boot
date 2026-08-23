export const CHAT_QUERY_KEYS = {
  connections: ["chats", "connections"],
  search: (q) => ["chats", "search", q],
  chat: (chatId) => ["chat", chatId],
  chatExists: (userId) => ["chat", "exists", userId],
  messages: (chatId) => ["chat", chatId, "messages"],
  group: (groupId) => ["chat", "groups", groupId],
}

/*  CACHE DIAGRAM EXAMPLE 

Cache
│
├─ ["chats", "connections"] 
│    └─ value: [{ id: 101, name: "Alice" }, { id: 102, name: "Bob" }]
│
├─ ["chat", 101] 
│    └─ value: { id: 101, participants: ["me", "Alice"], lastMessage: "Hi" }
│
├─ ["chat", 101, "messages"]
│    └─ value: [
│          { id: 1, text: "Hi", sender: "me" },
│          { id: 2, text: "Hello", sender: "Alice" }
│       ]
│
├─ ["chat", 102] 
│    └─ value: { id: 102, participants: ["me", "Bob"], lastMessage: "Hey" }
│
├─ ["chat", 102, "messages"]
│    └─ value: [
│          { id: 1, text: "Hey", sender: "Bob" },
│          { id: 2, text: "Yo", sender: "me" }
│       ]
│
└─ ["chat", "groups", 201] 
     └─ value: { id: 201, name: "Friends Group", members: ["me", "Alice", "Bob"] }


*/
