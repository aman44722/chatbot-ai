import { useEffect, useState } from "react";
import { fetchConversationById } from "../api/conversationApi";
import { useParams } from "react-router-dom";

export default function ConversationView() {
  const { id } = useParams();
  const [convo, setConvo] = useState(null);

  useEffect(() => {
    fetchConversationById(id).then(setConvo);
  }, [id]);

  if (!convo) return <p>Loading...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h3>Conversation</h3>

      <div style={{ border: "1px solid #eee", padding: 12 }}>
        {convo.messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 10,
              textAlign: m.sender === "user" ? "right" : "left",
            }}
          >
            <b>{m.sender.toUpperCase()}</b>
            <br />
            <span>{m.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
