import { useEffect, useState } from "react";
import { fetchConversations } from "../api/conversationApi";
import { useNavigate } from "react-router-dom";

export default function Conversations() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations().then(setList);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Conversations</h2>

      {list.map((c) => (
        <div
          key={c._id}
          onClick={() => navigate(`/app/conversations/${c._id}`)}
          style={{
            padding: 12,
            border: "1px solid #ddd",
            marginBottom: 8,
            cursor: "pointer",
          }}
        >
          <strong>Session:</strong> {c.sessionId}
          <br />
          <small>{new Date(c.updatedAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
