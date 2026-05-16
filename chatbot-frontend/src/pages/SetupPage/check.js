import React, { useState, useEffect, useRef } from 'react';
import './AdminSettings.css';
import { RgbaColorPicker } from "react-colorful";
import picImg from "../../assets/images/picture.svg";
import avt1 from "../../assets/images/avatar/avatar-v101.svg";
import avt2 from "../../assets/images/avatar/avatar-v102.svg";
import avt3 from "../../assets/images/avatar/avatar-v103.svg";
import avt4 from "../../assets/images/avatar/avatar-v104.svg";
import avt5 from "../../assets/images/avatar/avatar-v105.svg";
import avt6 from "../../assets/images/avatar/avatar-v107.svg";
import avt7 from "../../assets/images/avatar/avatar-v108.svg";
import avt8 from "../../assets/images/avatar/avatar-v109.svg";
import avt9 from "../../assets/images/avatar/avatar-v110.svg";
import avt10 from "../../assets/images/avatar/avatar-v111.svg";
import AddIcon from '@mui/icons-material/Add';
import { Box, colors } from '@mui/material';

const SetUp = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [botName, setBotName] = useState('chatbot');
  const [welcomeText, setWelcomeText] = useState('Hey');
  const [description, setDescription] = useState('Discriptions');
  const [font, setFont] = useState('Nanum Gothic Coding');
  const [fontSize, setFontSize] = useState('14px');
  const [companyLogo, setCompanyLogo] = useState('https://cdn-icons-png.flaticon.com/512/4712/4712027.png');
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [botPosition, setBotPosition] = useState('right'); // default value
  const [selectedBubbleStyle, setSelectedBubbleStyle] = useState('style1');
  const [borderRadius, setBorderRadius] = useState('10');
  const [textAlign, setTextAlign] = useState('left'); // for selected button
  const [themeColors, setThemeColors] = useState({ header: "#006C74", question: "#ffffff", answer: "#007bff", option: "#007bff", });

  const [selectedTab, setSelectedTab] = useState("Gradient");
  const [chatColor, setChatColor] = useState({ r: 255, g: 255, b: 255, a: 1 });


  const [selectedTheme, setSelectedTheme] = useState('#006C74');
  const [overlayOpacity, setOverlayOpacity] = useState(0);


  const [showDropdown, setShowDropdown] = useState(false);
  const [hovered, setHovered] = useState(false);

  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);




  const isColorDark = (hexColor) => {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };
  const textColor = isColorDark(themeColors.answer) ? '#ffffff' : '#000000';
  const textColorQuestion = isColorDark(themeColors.question) ? '#ffffff' : '#000000';
  const textColorOptions = isColorDark(themeColors.option) ? '#ffffff' : '#000000';


  const botPositions = [
    { key: 'right', justify: 'flex-end', alignItems: 'flex-end' },   // Bottom-right
    { key: 'center', justify: 'end', alignItems: 'center' },    // Bottom-center
    { key: 'left', justify: 'flex-start', alignItems: 'flex-end' },   // Bottom-left
  ];

  const [avatarOptions, setAvatarOptions] = useState([[avt1], [avt2], [avt3], [avt4], [avt5], [avt6], [avt7], [avt8], [avt9], [avt10]]);
  const [avatar, setAvatar] = useState(null);
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);


  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.offsetWidth * 0.1, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.offsetWidth * 0.1, behavior: 'smooth' });
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarOptions((prev) => [reader.result, ...prev]);
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('File size must be under 5MB');
    }
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: '#999',
    marginBottom: '6px',
    gap: '4px',
    fontWeight: 600,
  };
  const infoStyle = {
    fontSize: '12px',
    color: '#aaa',
    cursor: 'help'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };


  const InfoIcon = () => (
    <span style={{ fontSize: '12px', color: '#aaa', cursor: 'help' }}>ⓘ</span>
  );

  // const [avatar, setAvatar] = useState(avatarOptions[0]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('botSettings'));
    if (saved) {
      setCompanyLogo(saved.companyLogo || companyLogo);
      setAvatar(saved.avatar || avatar);
      setBotName(saved.botName || botName);
      setWelcomeText(saved.welcomeText || welcomeText);
      setDescription(saved.description || description);
      setFont(saved.font || font);
      setFontSize(saved.fontSize || fontSize);
      setBotPosition(saved.botPosition || botPosition)
      setSelectedBubbleStyle(saved.selectedBubbleStyle || selectedBubbleStyle)
      setBorderRadius(saved.borderRadius || borderRadius)
      setTextAlign(saved.textAlign || textAlign)
      setThemeColors(saved.themeColors || themeColors)
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // If user has scrolled more than 5px, show left arrow
      setShowLeftArrow(scrollContainer.scrollLeft > 5);
    };

    // Add listener
    scrollContainer.addEventListener('scroll', handleScroll);

    // Fire once on mount to check scroll state
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);



  const handleSave = () => {
    localStorage.setItem(
      'botSettings',
      JSON.stringify({ companyLogo, avatar, botName, welcomeText, description, font, fontSize, botPosition, selectedBubbleStyle, borderRadius, textAlign, themeColors })
    );
    alert('Settings saved!');
  };

  const handleReset = () => {
    // Clear localStorage
    localStorage.removeItem('botSettings');

    // Reset all states to default
    setCompanyLogo('https://cdn-icons-png.flaticon.com/512/4712/4712027.png');
    setAvatar(null);
    setBotName('chatbot');
    setWelcomeText('Hey');
    setDescription('Discriptions');
    setFont('Nanum Gothic Coding');
    setFontSize('14px');
    setBotPosition('right');
    setSelectedBubbleStyle('style1');
    setBorderRadius('10');
    setTextAlign('left');
    setThemeColors({
      header: "#006C74",
      question: "#ffffff",
      answer: "#007bff",
      option: "#007bff",
    });
    setUploadedImage(null);
    setSelectedTheme('#006C74');
    setOverlayOpacity(0);
    setChatColor({ r: 255, g: 255, b: 255, a: 1 });

    alert('Settings reset to default!');
  };


  return (
    <>
      <Box style={{ display: 'flex', height: '84vh', marginTop: '5%', padding: '10px', width: '100%' }}>


        {/* left */}
        <Box
          className="custom-scrollbar"
          sx={{
            width: '30%',
            boxShadow: '0px 4px 20px #d8d8d8',
            borderRadius: '20px',
            borderRight: '1px solid #eee',
            overflowY: 'auto',
            background: '#f9fbfd',
          }}
        >

          {/* Tab */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              background: '#fff',
              borderTop: '1px solid #eee',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 9,
              boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
              marginTop: 'auto'
            }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              {['text', 'logo', 'layout', 'themes'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === tab ? '#ffffff' : '#f4f4f4',
                    boxShadow: activeTab === tab ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
                    fontWeight: activeTab === tab ? '600' : '500',
                    color: activeTab === tab ? '#333' : '#777',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, padding: '15px', height: '100vh', boxShadow: '0 10px 14px rgba(0,0,0,0.05)' }}>

            {activeTab === 'text' && (
              <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Bot Name */}
                <div>
                  <label style={labelStyle}>
                    Bot Name <InfoIcon />
                  </label>
                  <input type="text" value={botName} onChange={(e) => setBotName(e.target.value)} style={inputStyle} />
                </div>

                {/* Welcome Text */}
                <div>
                  <label style={labelStyle}>
                    Welcome Text <InfoIcon />
                  </label>
                  <input type="text" value={welcomeText} onChange={(e) => setWelcomeText(e.target.value)} style={inputStyle} />
                </div>

                {/* Bot Description */}
                <div>
                  <label style={labelStyle}>
                    Bot Description <InfoIcon />
                  </label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
                </div>

                {/* Font and Font Size */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Choose a Font</label>
                    <input type="text" value={font} onChange={(e) => setFont(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Font Size</label>
                    <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} style={inputStyle}>
                      <option value="14px">14px</option>
                      <option value="16px">16px</option>
                      <option value="18px">18px</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'logo' && (
              <div style={{ marginTop: '40px' }}>
                {/* Label with Info */}
                <label style={labelStyle}>
                  Company Logo <span style={infoStyle}>ⓘ</span>
                </label>

                {/* Placeholder or Uploaded Logo */}
                {companyLogo ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '15px 0' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={companyLogo}
                        alt="logo"
                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span
                        onClick={() => setCompanyLogo('')}
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          background: '#fff',
                          color: '#333',
                          fontSize: '12px',
                          border: '1px solid #ccc',
                          borderRadius: '50%',
                          padding: '0 5px',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </span>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="upload-logo"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed #d1d5db',
                      borderRadius: '10px',
                      padding: '20px',
                      cursor: 'pointer',
                      marginTop: '15px'
                    }}
                  >
                    <img
                      src={picImg} // Replace with your placeholder image path
                      alt="placeholder"
                      style={{ width: '40px', height: '40px', marginBottom: '10px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>File Size should be less than 5 MB</span>
                    <input
                      id="upload-logo"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.size < 5 * 1024 * 1024) {
                          const reader = new FileReader();
                          reader.onloadend = () => setCompanyLogo(reader.result);
                          reader.readAsDataURL(file);
                        } else {
                          alert('File size exceeds 5MB');
                        }
                      }}
                    />
                  </label>
                )}

                <label style={{ marginTop: '20px', fontWeight: '500' }}>
                  Avatar <span style={{ fontSize: '12px', color: '#888' }}>ⓘ</span>
                </label>

                <div style={{ position: 'relative', marginTop: '10px' }}>
                  {/* Left Arrow */}
                  {showLeftArrow && (
                    <button
                      onClick={scrollLeft}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        background: 'white',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      ◀
                    </button>
                  )}

                  {/* Avatar Scroll List */}
                  <div
                    ref={scrollRef}
                    style={{
                      display: 'flex',
                      overflowX: 'auto',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      scrollBehavior: 'smooth'
                    }}
                  >
                    {/* Upload Button */}
                    <label
                      htmlFor="upload-avatar"
                      style={{
                        minWidth: '60px',
                        minHeight: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        border: '2px solid #ccc'
                      }}
                    >
                      <AddIcon style={{
                        width: '54px', height: '54px',
                      }} />
                      <input
                        id="upload-avatar"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarUpload}
                      />
                    </label>

                    {/* Avatar Options */}
                    {avatarOptions.map((avt, index) => (
                      <div
                        key={index}
                        onClick={() => setAvatar(avt)}
                        style={{
                          minWidth: '60px',
                          minHeight: '60px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: avt === avatar ? '3px solid #00C896' : '2px solid transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <img
                          src={avt}
                          alt="avatar"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={scrollRight}
                    style={{
                      position: 'absolute',
                      right: '-10px',
                      height: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      background: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    ▶
                  </button>
                </div>

              </div>
            )}
            {activeTab === 'layout' && (
              <div style={{ marginTop: '40px' }}>
                {/* Bot Position Section */}
                <label style={{ fontWeight: 600, fontSize: '14px', color: '#555' }}>
                  Bot Position <span title="Select the corner where your bot appears">ℹ️</span>
                </label>
                <div onClick={() => setIsChatOpen(false)} style={{ display: 'flex', gap: '10px', margin: '10px 0 20px 0' }}>
                  {botPositions.map((pos, idx) => (
                    <div
                      key={idx}

                      value={botPosition}
                      onClick={() => setBotPosition(pos.key)}
                      style={{
                        width: '100%',
                        height: '40px',
                        background: '#444c5c',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: pos.justify,
                        alignItems: pos.alignItems,
                        padding: '5px',
                        cursor: 'pointer',
                        border: botPosition === pos.key ? '2px solid #00C896' : '2px solid transparent'
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          background: '#ddd',
                          borderRadius: '2px'
                        }}
                      ></div>
                    </div>
                  ))}
                </div>

                {/* Message Bubbles Section */}
                <label style={{ fontWeight: 600, fontSize: '14px', color: '#555' }}>
                  Message Bubbles <span title="Choose your chat bubble style">ℹ️</span>
                </label>
                <div style={{ display: 'flex', gap: '10px', margin: '10px 0 20px 0' }}>
                  <div
                    value={selectedBubbleStyle}
                    onClick={() => setSelectedBubbleStyle('style1')}
                    style={{
                      background: '#f1f1f1',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      width: '100%',
                      cursor: 'pointer',
                      border: selectedBubbleStyle === 'style1' ? '2px solid #00C896' : '1px solid #ccc'
                    }}
                  >
                    Hi!
                  </div>

                  <div
                    onClick={() => setSelectedBubbleStyle('style2')}
                    style={{
                      background: '#f1f1f1',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      width: '100%',
                      cursor: 'pointer',
                      border: selectedBubbleStyle === 'style2' ? '2px solid #00C896' : '1px solid #ccc'
                    }}
                  >
                    Hi!
                  </div>

                  <div
                    onClick={() => setSelectedBubbleStyle('style3')}
                    style={{
                      background: '#f1f1f1',
                      padding: '5px 10px',
                      borderRadius: '12px 12px 12px 0',
                      width: '100%',
                      cursor: 'pointer',
                      border: selectedBubbleStyle === 'style3' ? '2px solid #00C896' : '1px solid #ccc'
                    }}
                  >
                    Hi!
                  </div>
                </div>

                {/* Option Border Radius */}
                {/* Label */}
                <label style={{ fontWeight: 600, fontSize: '14px', color: '#555', display: 'block' }}>
                  Option Border Radius <span title="Adjust button corner roundness">ℹ️</span>
                </label>

                {/* Slider and Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginTop: '10px' }}>
                  {/* Slider */}
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />

                  {/* Live Preview */}
                  <div
                    style={{
                      width: '26%',
                      height: '40px',
                      background: '#007bff',
                      borderRadius: `${borderRadius}px`,
                      transition: 'border-radius 0.2s ease'
                    }}
                  ></div>
                </div>

                {/* Button Text Alignment */}
                <label style={{ fontWeight: 600, fontSize: '14px', color: '#555' }}>
                  Button Text Alignment <span title="Align text inside buttons">ℹ️</span>
                </label>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  {['left', 'center', 'right'].map((align) => (
                    <button
                      key={align}
                      value={textAlign}
                      onClick={() => setTextAlign(align)}
                      style={{
                        flex: 1,
                        padding: '10px 15px',
                        background: '#007bff',
                        color: 'white',
                        border: textAlign === align ? '3px solid white' : 'none',
                        outline: textAlign === align ? '3px solid rgb(163, 163, 163)' : 'none',
                        borderRadius: `${borderRadius}px`,
                        textAlign: align,
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Hi
                    </button>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'themes' && (
              <div style={{ marginTop: '40px' }}>
                <label style={{ fontWeight: 600, fontSize: '14px', color: '#555' }}>
                  Choose a theme <span title="Choose your preferred theme">ℹ️</span>
                </label>

                <div onClick={() => setShowDropdown(!showDropdown)} style={{ position: 'relative', marginTop: '10px', cursor: 'pointer' }}>
                  {/* Top Bar */}
                  <div
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '5px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      background: hovered ? '#F1EFEC' : '#f7f7f7', // change on hover
                      transition: 'background 0.3s ease',

                    }}
                  >
                    {/* Color Swatches */}
                    {[themeColors.header, themeColors.question, themeColors.answer, themeColors.option, themeColors.optionBorder].map((color, idx) => (
                      <div
                        key={idx}
                        value={themeColors} onChange={(e) => setThemeColors({ ...themeColors, header: e.target.value })}
                        onClick={() => setSelectedTheme(color)}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          backgroundColor: color,
                          cursor: 'pointer',
                          border: selectedTheme === color ? '2px solid #007bff' : '2px solid #ccc',
                        }}
                      />
                    ))}

                    {/* Dropdown Toggle */}
                    <div
                      onClick={() => setShowDropdown(!showDropdown)}
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid #333',
                        cursor: 'pointer',


                      }}
                    />
                  </div>

                  {/* Dropdown Panel */}
                  {showDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '10%',
                        marginTop: '10px',
                        width: '70%',
                        background: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 20px #d8d8d8',
                        padding: '15px 20px',
                        zIndex: 10,
                        fontSize: '13px',
                        overflowY: 'scroll',
                        height: '45vh',
                        scrollbarWidth: 'thin'

                      }}
                    >
                      {[
                        { title: "Purple", colors: ["#BD7FF5", "#ffffff", "#F1F1F1", "#3375B3", "#3375B3"] },
                        { title: "Blue", colors: ["#505DD3", "#ffffff", "#F8F8F8", "#0076FF", "0076FF"] },
                        { title: "Orange", colors: ["#FFBD36", "#F9F9F9", "#F3F3F3", "#212E3F", "#212E3F"] },
                        { title: "Black", colors: ["#000000", "#ffffff", "#E1E0E1", "#AA1E0D", '#AA1E0D'] },
                        { title: "Green", colors: ["#000000", "#ffffff", "#C6E300", "#000000", '#000000'] },
                        { title: "Plain White", colors: ["#ffffff", "#ffffff", "#11999E", "#F0EEEE", '#F0EEEE'] },
                        { title: "Mixed", colors: ["#434343", "#ffffff", "#298FCA", "#00A0F6", '#00A0F6'] },
                      ].map((theme, idx) => (
                        <div key={idx} style={{ marginBottom: '20px' }}>
                          <div style={{ marginBottom: '8px' }}>{theme.title}</div>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-evenly', border: '1px solid rgba(221, 221, 221, 0.5)', boxShadow: '0px 4px 20px #d8d8d8', borderRadius: '10px', padding: '10px', }}>
                            {theme.colors.map((color, i) => (
                              <div
                                key={i}
                                onClick={() =>
                                  setThemeColors({
                                    header: theme.colors[0],         // 1st color → Header
                                    question: theme.colors[1],       // 2nd color → Question
                                    answer: theme.colors[2],         // 3rd color → Answer
                                    option: theme.colors[3],         // 4th color → Option
                                    optionBorder: theme.colors[4],   // 5th color → Option Border
                                  })
                                }

                                style={{
                                  width: '20px',
                                  height: '20px',
                                  backgroundColor: color,
                                  borderRadius: '6px',
                                  border: selectedTheme === color ? '2px solid #007bff' : '2px solid #ccc',
                                  cursor: 'pointer',
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Header Background */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '15px 0'
                }}>
                  <label>Header Background</label>
                  <input value={themeColors.header} onChange={(e) => setThemeColors({ ...themeColors, header: e.target.value })} type="color" defaultValue="#006C74" style={{ marginBottom: '15px', width: "40px", height: '30px', }} />
                </div>
                {/* Question Background */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '15px 0'
                }}>
                  <label>Question Background</label>
                  <input value={themeColors.question} onChange={(e) => setThemeColors({ ...themeColors, question: e.target.value })} type="color" defaultValue="#ffffff" style={{ width: "40px", height: '30px', marginBottom: '15px' }} />
                </div>
                {/* Answer Background */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '15px 0'
                }}>
                  <label>Answer Background</label>
                  <input value={themeColors.answer} onChange={(e) => setThemeColors({ ...themeColors, answer: e.target.value })} type="color" defaultValue="#007bff" style={{ width: "40px", height: '30px', marginBottom: '15px', }} />
                </div>
                {/* Options Background */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '15px 0'
                }}>
                  <label>Options Background</label>
                  <input value={themeColors.option} onChange={(e) => setThemeColors({ ...themeColors, option: e.target.value })} type="color" defaultValue="#007bff" style={{ width: "40px", height: '30px', marginBottom: '15px' }} />
                </div>
                {/* Option Border Color */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '15px 0'
                }}>
                  <label>Option Border Color </label>
                  <input value={themeColors.optionBorder} onChange={(e) => setThemeColors({ ...themeColors, optionBorder: e.target.value })} type="color" defaultValue="#444c5c" style={{ width: "40px", height: '30px', marginBottom: '15px' }} />
                </div>

                {/* Chat Background */}
                <div>
                  <div style={{ display: 'flex', gap: '10px', margin: 'auto', width: '100%' }}>
                    {["Gradient", "Color", "Image"].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        style={{
                          border: '1px solid rgb(209, 208, 208)',
                          width: '100%',
                          height: '40px',
                          borderRadius: '10px',
                          backgroundColor: selectedTab === tab ? '#4F46E5' : '#fff',
                          color: selectedTab === tab ? '#fff' : '#000',
                          boxShadow: '0px 4px 20px #d8d8d8',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {tab}
                      </button>
                    ))}


                  </div>

                  {selectedTab === "Gradient" && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginTop: '20px', height: '30vh', overflowY: 'scroll', scrollbarWidth: 'thin' }}>
                      {[
                        'linear-gradient(45deg, #00ff87, #60efff)',
                        'linear-gradient(45deg, #0061ff, #60efff)',
                        'linear-gradient(45deg, #ff1b6b, #45caff)',
                        'linear-gradient(45deg, #40c9ff, #e81cff)',
                        'linear-gradient(45deg, #ff930f, #fff95b)',
                        'linear-gradient(45deg, #ff0f7b, #f89b29)',
                        'linear-gradient(45deg, #bf0fff, #cbff49)',
                        'linear-gradient(45deg, #696eff, #f8acff)',
                        'linear-gradient(45deg, #a9ff68, #ff8989)',
                        'linear-gradient(45deg, #595cff, #c6f8ff)',
                        'linear-gradient(45deg, #ffa585, #ffeda0)',
                        'linear-gradient(45deg, #84ffc9, #aab2ff, #eca0ff)',
                        'linear-gradient(45deg, #ef709b, #fa9372)',
                        'linear-gradient(45deg, #b2ef91, #fa9372)',
                        'linear-gradient(45deg, #9bf8f4, #6f7bf7)',
                        'linear-gradient(45deg, #f9c58d, #f492f0)',
                        'linear-gradient(45deg, #f492f0, #a18dce)',
                        'linear-gradient(45deg, #f9b16e, #f68080)',
                        'linear-gradient(45deg, #9bafd9, #103783)',
                        'linear-gradient(45deg, #fbd07c, #f7f779)',
                        'linear-gradient(45deg, #c5f9d7, #f7d486, #f27a7d)',
                        'linear-gradient(45deg, #ebf4f5, #b5c6e0)',
                        'linear-gradient(45deg, #f6d5f7, #fbe9d7)',
                        'linear-gradient(45deg, #432371, #faae7b)',
                        'linear-gradient(45deg, #e9b7ce, #d3f3f1)',
                        'linear-gradient(45deg, #439cfb, #f187fb)',
                        'linear-gradient(45deg, #1dbde6, #f1515e)',
                        'linear-gradient(45deg, #57ebde, #aefb2a)',
                        'linear-gradient(45deg, #42047e, #07f49e)',
                        'linear-gradient(45deg, #f4f269, #5cb270)',
                        'linear-gradient(45deg, #b190ba, #e8b595)',
                        'linear-gradient(45deg, #b597f6, #96c6ea)',
                        'linear-gradient(45deg, #c9def4, #f5ccd4, #b8a4c9)',
                        'linear-gradient(45deg, #7c65a9, #96d4ca)',
                        'linear-gradient(45deg, #f6cfbe, #b9dcf2)',
                        'linear-gradient(45deg, #caefd7, #f5bfd7, #abc9e9)',
                        'linear-gradient(45deg, #9fccfa, #0974f1)',
                        'linear-gradient(45deg, #ffb88e, #ea5753)',
                        'linear-gradient(45deg, #d397fa, #8364e8)',
                        'linear-gradient(45deg, #8de9d5, #32c4c0)',
                        'linear-gradient(45deg, #f5e6ad, #f13c77)',
                        'linear-gradient(45deg, #82f4b1, #30c67c)',
                        'linear-gradient(45deg, #d4acfb, #b84fce)',
                        'linear-gradient(45deg, #f7ba2c, #ea5459)',
                        'linear-gradient(45deg, #61f4de, #6e78ff)',
                        'linear-gradient(45deg, #ffcb6b, #3d8bff)',
                        'linear-gradient(45deg, #a8f368, #f9035e)',
                        'linear-gradient(45deg, #f5c900, #183182)',
                        'linear-gradient(45deg, #ffcf67, #d3321d)',
                        'linear-gradient(45deg, #95f9c3, #0b3866)',
                        'linear-gradient(45deg, #4dc9e6, #210cae)',
                        'linear-gradient(45deg, #eeb86d, #9946b2)',
                        'linear-gradient(45deg, #d9cf79, #5612d6)',
                        'linear-gradient(45deg, #e2db1f, #ae10f9)',
                      ].map((gradient, idx) => (
                        <div
                          key={idx}
                          onClick={() => setThemeColors({ ...themeColors, chatBackground: gradient })}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: gradient,
                            cursor: 'pointer',
                            border: themeColors.chatBackground === gradient ? '3px solid #4F46E5' : '1px solid #ccc',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {selectedTab === "Color" && (
                    <div style={{ marginTop: '20px' }}>
                      <RgbaColorPicker
                        color={chatColor}
                        onChange={(newColor) => {
                          setChatColor(newColor);
                          setThemeColors({ ...themeColors, chatBackground: `rgba(${newColor.r},${newColor.g},${newColor.b},${newColor.a})` });
                        }}
                        style={{ width: '100%', }}
                      />
                      <p style={{ textAlign: 'center', fontWeight: 500 }}>
                        rgba({chatColor.r}, {chatColor.g}, {chatColor.b}, {chatColor.a})
                      </p>
                    </div>
                  )}

                  {selectedTab === "Image" && (
                    <div style={{ margin: '20px 0px', padding: '20px 15px', backgroundColor: '#f2f4f7', boxShadow: '0px 4px 20px #d8d8d8', borderRadius: '10px', border: '2px solid #d8d8d8', height: '30vh', overflowY: 'scroll', overflowX: 'hidden', scrollbarWidth: 'thin' }}>

                      {/* Image Preview Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        margin: '20px 0px',
                      }}>
                        {[
                          'https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_1.png',
                          'https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_2.png',
                          'https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_3.png',
                          'https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_4.png',
                          'https://custpostimages.s3.ap-south-1.amazonaws.com/ss_images/bot_background_5.png',
                        ].map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            onClick={() => setThemeColors({ ...themeColors, chatBackground: `url(${img})` })}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                              border:
                                themeColors.chatBackground === `url(${img})`
                                  ? '3px solid #4F46E5'
                                  : '1px solid #ccc',
                              cursor: 'pointer',
                            }}
                          />
                        ))}

                        {uploadedImage && (
                          <div style={{ position: 'relative' }}>
                            <img
                              src={uploadedImage}
                              onClick={() => setThemeColors({ ...themeColors, chatBackground: `url(${uploadedImage})` })}
                              style={{
                                width: '100%',
                                height: '100% ',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                border:
                                  themeColors.chatBackground === `url(${uploadedImage})`
                                    ? '3px solid #4F46E5'
                                    : '1px solid #ccc',
                                cursor: 'pointer',
                              }}
                            />
                            {/* Delete X Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // prevent image click trigger
                                setUploadedImage(null);
                                setThemeColors({ ...themeColors, chatBackground: '' });
                              }}
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                backgroundColor: '#ff4d4f',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                              }}
                              title="Delete uploaded image"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>


                      {/* Hidden File Input */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none', backgroundSize:'contain', backgroundPosition: 'center', }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file && file.size < 2 * 380 * 685) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setUploadedImage(reader.result); // Show in preview
                              setThemeColors({
                                ...themeColors,
                                chatBackground: `url(${reader.result})`, // Apply immediately
                              });
                            };
                            reader.readAsDataURL(file);
                          } else {
                            alert('File size should be less than 5MB');
                          }
                        }}
                      />


                      {/* Upload Button */}
                      <div style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => fileInputRef.current.click()}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: '#4F46E5',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            marginTop: '10px'
                          }}
                        >
                          Upload
                        </button>
                        <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                          File Size should be less than 5 MB <br /> <span> Image Must Be 380*585 </span>
                        </p>
                      </div>

                      {/* Overlay Slider */}
                      <div style={{ marginTop: '20px' }}>
                        <label style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          Overlay ({overlayOpacity}%)
                          <span title="Adjust background overlay opacity">ℹ️</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={overlayOpacity}
                          onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  )}


                </div>
              </div>
            )}
          </div>

          {/* Save & Reset Button Footer */}
          <div
            style={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#fff',
              borderTop: '1px solid #eee',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 9,
              boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
              marginTop: 'auto',
            }}
          >
            <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>Apply Changes?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={{
                  background: '#f44336',
                  color: 'white',
                  padding: '10px 25px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
                onClick={handleReset} // Your reset logic here
              >
                Reset
              </button>
              <button
                style={{
                  background: '#4F46E5',
                  color: 'white',
                  padding: '10px 25px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>

        </Box>

        {/* right  */}
        <div style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '75%', }}>
          <div className="mock-browser-layout">
            {/* Browser Top Bar */}
            <div className="browser-bar">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot blue"></span>
            </div>

            {/* Navigation Bars */}
            <div className="nav-line"></div>
            <div className="nav-line"></div>
            <div className="nav-line"></div>

            {/* Content Area */}
            <div className="content">
              <div className="block"></div>
              <div className="block"></div>
            </div>
            {!isChatOpen && (
              <div
                onClick={() => setIsChatOpen(true)}
                style={{
                  position: 'fixed',
                  bottom: botPosition === 'center' ? '50%' : '30px',
                  top: botPosition === 'center' ? 'unset' : 'auto',
                  right: botPosition === 'left' ? 'unset' : '30px',
                  left: botPosition === 'left' ? '42%' : botPosition === 'center' ? 'unset' : 'auto',
                  transform: botPosition === 'center' ? 'translateY(50%)' : 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  zIndex: 1000,
                }}
              >
                {/* Welcome Text (Bubble) */}
                {welcomeText && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '80px', // move left from icon
                      top: '20px',
                      backgroundColor: '#0F1C3F',
                      color: '#fff',
                      fontSize: '13px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    {welcomeText}
                  </div>
                )}
                {/* Chat Icon */}
                <div style={{ position: 'relative', borderRadius: '50%', boxShadow: '0px 4px 20px #d8d8d8', }}>
                  <span className="status-dot"></span>
                  <img
                    src={companyLogo}
                    alt="Bot"
                    style={{ height: '70px', width: '70px', borderRadius: '50%' }}
                  />
                </div>
              </div>
            )}

            {/* Footer Block */}
            <div className="footer-block"></div>

          </div>
          {isChatOpen && (
            <div
              style={{
                position: 'fixed',
                bottom: '30px',
                left: botPosition === 'left' ? '50%' : botPosition === 'center' ? '85%' : 'unset',
                right: botPosition === 'right' ? '30px' : 'unset',
                transform: botPosition === 'center' ? 'translateX(-50%)' : 'none',
                zIndex: 1000,
                transition: 'all 0.3s ease-in-out'
              }}
            >
              {/* Your full chat window starts here */}
              <div
                style={{
                  width: '400px',
                  height: '80vh',
                  background: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  fontFamily: font,
                  overflow: 'hidden'
                }}
              >
                {/* Header Section */}
                <div
                  onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                  style={{
                    background: themeColors.header,
                    borderRadius: '10px 10px 0 0',
                    padding: isHeaderExpanded ? '25px' : '20px 15px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: isHeaderExpanded ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: isHeaderExpanded ? 'center' : 'flex-start',
                    position: 'relative',
                    textAlign: 'center'
                  }}
                >
                  <img
                    src={companyLogo}
                    alt="logo"
                    style={{
                      width: isHeaderExpanded ? '50px' : '30px',
                      height: isHeaderExpanded ? '50px' : '30px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: isHeaderExpanded ? '0' : '10px'
                    }}
                  />
                  <div>
                    <h3 style={{
                      margin: isHeaderExpanded ? '8px 0 2px' : '0',
                      fontSize: isHeaderExpanded ? '16px' : '14px',
                      fontWeight: 'bold'
                    }}>
                      {botName}
                    </h3>
                    {isHeaderExpanded && (
                      <p style={{ margin: 0, fontSize: '12px', color: '#e0e0e0' }}>{description}</p>
                    )}
                  </div>
                  {isHeaderExpanded && (
                    <div style={{
                      position: 'absolute',
                      right: '20px',
                      top: '20px',
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <span onClick={() => setIsChatOpen(false)} style={{ cursor: 'pointer' }}>✕</span>
                    </div>
                  )}
                </div>

                {/* Body Section */}
                <div style={{
                  padding: '15px', overflowY: 'auto', height: '61vh', background: themeColors.chatBackground, objectFit: 'contain', backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})`,
                  backgroundBlendMode: 'overlay'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', }}>
                    <img src={avatar} alt="bot" style={{ width: '20px', height: '20px', marginRight: '10px', borderRadius: '50%' }} />
                    <div style={{ background: themeColors.question, color: textColorQuestion, padding: '8px 12px', borderRadius: '10px', fontSize: '13px' }}>Bot question here</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <div style={{
                      background: themeColors.answer, color: textColor,
                      padding: '8px 12px',
                      ...(selectedBubbleStyle === 'style1' && { borderRadius: '8px' }),
                      ...(selectedBubbleStyle === 'style2' && { borderRadius: '20px' }),
                      ...(selectedBubbleStyle === 'style3' && { borderRadius: '12px 12px 0 12px' }),
                    }}>Visitor answer here</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', }}>
                    <img src={avatar} alt="number" style={{ width: '20px', height: '20px', marginRight: '10px', borderRadius: '50%' }} />
                    <div style={{ background: themeColors.question, color: textColorQuestion, padding: '8px 12px', borderRadius: '10px', fontSize: '13px' }}>+91-7207897336 - Number here</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <img src={avatar} alt="options" style={{ width: '20px', height: '20px', marginRight: '10px', borderRadius: '50%' }} />
                    <div style={{ background: themeColors.question, color: textColorQuestion, padding: '8px 12px', borderRadius: '10px', fontSize: '13px' }}>Sample options and button will look like this</div>
                  </div>

                  <button style={{ width: '100%', padding: '8px', background: themeColors.option, color: textColorOptions, border: 'none', borderRadius: '6px', marginTop: '5px', border: `2px solid ${themeColors.optionBorder}`, borderRadius: `${borderRadius}px `, }}>Option 1</button>
                  <button style={{ width: '100%', padding: '8px', background: themeColors.option, color: textColorOptions, border: 'none', borderRadius: '6px', marginTop: '5px', borderRadius: `${borderRadius}px`, border: `2px solid ${themeColors.optionBorder}` }}>Option 2</button>
                  <button style={{ width: '100%', padding: '8px', background: themeColors.answer, color: textColor, border: 'none', borderRadius: '6px', marginTop: '10px', borderRadius: `${borderRadius}px`, textAlign: textAlign, }}>Confirm</button>
                </div>


                {/* Footer */}
                <div style={{
                  background: '#fff',
                  textAlign: 'center',
                  padding: '10px 15px',
                  boxShadow: '0px 4px 20px #d8d8d8',
                  fontSize: '12px',
                  borderTop: '1px solid #ddd'
                }}>
                  Powered by A2 Digital
                </div>
              </div>
            </div>
          )}



        </div>


      </Box>
    </>
  );
};

export default SetUp;