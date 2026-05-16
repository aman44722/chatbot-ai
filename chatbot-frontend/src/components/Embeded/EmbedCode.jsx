import React, { useState } from 'react';

const EmbedCode = () => {
  const [websiteURL, setWebsiteURL] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleGenerate = () => {
    const script = `<script>
var chatbot_id = 25252;
!function(){
  var t,e,a=document,
  s="chatbot-script";
  t=a.getElementById(s) || (t=a.createElement("script"),
  t.id=s,t.type="text/javascript",
  t.src="http://localhost:3000/chatbot-plugin.js";
  e=a.getElementsByTagName("script")[0],
  e.parentNode.insertBefore(t,e))
}();
</script>`;

    setGeneratedCode(script);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Website / Blog Installation</h2>
      <input
        type="text"
        placeholder="Enter your website URL"
        value={websiteURL}
        onChange={(e) => setWebsiteURL(e.target.value)}
        style={{ padding: '10px', width: '60%' }}
      />
      <button onClick={handleGenerate} style={{ marginLeft: '10px', padding: '10px 20px' }}>
        Generate Embed Code
      </button>

      {generatedCode && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>Copy this code snippet</strong> and paste in your website head tag:</p>
          <textarea
            readOnly
            value={generatedCode}
            style={{ width: '100%', height: '150px', padding: '10px' }}
          />
        </div>
      )}
    </div>
  );
};

export default EmbedCode;
