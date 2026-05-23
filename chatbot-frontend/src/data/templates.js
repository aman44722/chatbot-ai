const TEMPLATES = [
  {
    industry: "E-commerce",
    icon: "🛒",
    color: "#f59e0b",
    templates: [
      {
        id: "ecom-1",
        name: "Order Support",
        desc: "Handle order inquiries, returns & tracking",
        botSettings: {
          botName: "ShopBot",
          welcomeText: "Hi there! Welcome to our store. How can I help you today?",
          description: "We usually reply within a minute",
          themeColors: { header: "#f59e0b", question: "#ffffff", answer: "#f59e0b", option: "#f59e0b", optionBorder: "#f59e0b", chatBackground: "#ffffff" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style1",
          borderRadius: 10,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "radio", required: true, text: "What can we help you with?", options: [{ label: "Track my order", value: "track" }, { label: "Return / Refund", value: "return" }, { label: "Product question", value: "product" }, { label: "Talk to support", value: "support" }], style: "button", otherOption: false, language: "en" },
              { id: "q2", type: "text", required: true, text: "Please enter your order number:", validations: { minLength: 3, maxLength: 50 }, language: "en" },
              { id: "q3", type: "textarea", required: false, text: "Anything else you'd like to add?", language: "en" },
              { id: "q4", type: "email", required: true, text: "Share your email so we can follow up:", language: "en" },
            ],
          },
        },
      },
      {
        id: "ecom-2",
        name: "Product Finder",
        desc: "Help customers discover products",
        botSettings: {
          botName: "StyleGuide",
          welcomeText: "Hey! Looking for something special? Let me help you find it!",
          description: "Your personal shopping assistant",
          themeColors: { header: "#ec4899", question: "#ffffff", answer: "#ec4899", option: "#ec4899", optionBorder: "#ec4899", chatBackground: "#fff5f7" },
          font: "Poppins",
          fontSize: "14px",
          selectedBubbleStyle: "style2",
          borderRadius: 12,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "radio", required: true, text: "What are you shopping for?", options: [{ label: "Clothing", value: "clothing" }, { label: "Electronics", value: "electronics" }, { label: "Home & Decor", value: "home" }, { label: "Beauty", value: "beauty" }], style: "button", otherOption: true, language: "en" },
              { id: "q2", type: "select", required: true, text: "What's your budget range?", options: [{ label: "Under ₹1,000", value: "budget" }, { label: "₹1,000 – ₹5,000", value: "mid" }, { label: "₹5,000 – ₹15,000", value: "high" }, { label: "No limit", value: "premium" }], style: "dropdown", language: "en" },
              { id: "q3", type: "text", required: false, text: "Any specific brand or style you like?", language: "en" },
            ],
          },
        },
      },
    ],
  },
  {
    industry: "Healthcare",
    icon: "🏥",
    color: "#10b981",
    templates: [
      {
        id: "health-1",
        name: "Appointment Booking",
        desc: "Schedule doctor appointments easily",
        botSettings: {
          botName: "MediCare",
          welcomeText: "Welcome to MediCare! Let us help you book an appointment.",
          description: "We respond within minutes",
          themeColors: { header: "#10b981", question: "#ffffff", answer: "#10b981", option: "#10b981", optionBorder: "#10b981", chatBackground: "#ecfdf5" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style1",
          borderRadius: 10,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "radio", required: true, text: "What type of appointment do you need?", options: [{ label: "General Checkup", value: "general" }, { label: "Dental", value: "dental" }, { label: "Eye Checkup", value: "eye" }, { label: "Consultation", value: "consult" }], style: "button", language: "en" },
              { id: "q2", type: "text", required: true, text: "What's your full name?", language: "en" },
              { id: "q3", type: "mobile_number", required: true, text: "Your mobile number:", validations: { minLength: 10, maxLength: 10 }, language: "en" },
              { id: "q4", type: "date", required: true, text: "Preferred date for the appointment:", settings: { dateFormat: "DD/MM/YYYY" }, language: "en" },
            ],
          },
        },
      },
      {
        id: "health-2",
        name: "Symptom Checker",
        desc: "Collect symptoms before consultation",
        botSettings: {
          botName: "SympCheck",
          welcomeText: "Hello! Describe your symptoms and we'll guide you.",
          description: "Preliminary health guidance",
          themeColors: { header: "#0284c7", question: "#ffffff", answer: "#0284c7", option: "#0284c7", optionBorder: "#0284c7", chatBackground: "#f0f9ff" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style3",
          borderRadius: 8,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "textarea", required: true, text: "Please describe your symptoms in detail:", language: "en" },
              { id: "q2", type: "number", required: true, text: "What is your age?", validations: { minLength: 1, maxLength: 3 }, language: "en" },
              { id: "q3", type: "radio", required: true, text: "How long have you had these symptoms?", options: [{ label: "Less than a day", value: "1d" }, { label: "2-3 days", value: "2-3d" }, { label: "A week", value: "week" }, { label: "More than a week", value: "month" }], style: "button", language: "en" },
              { id: "q4", type: "email", required: true, text: "Your email for reports:", language: "en" },
            ],
          },
        },
      },
    ],
  },
  {
    industry: "Education",
    icon: "📚",
    color: "#6366f1",
    templates: [
      {
        id: "edu-1",
        name: "Course Inquiry",
        desc: "Answer questions about courses & admissions",
        botSettings: {
          botName: "EduBot",
          welcomeText: "Welcome to our learning portal! Ask me anything about our courses.",
          description: "Admission support",
          themeColors: { header: "#6366f1", question: "#ffffff", answer: "#6366f1", option: "#6366f1", optionBorder: "#6366f1", chatBackground: "#eef2ff" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style1",
          borderRadius: 10,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "radio", required: true, text: "Which program interests you?", options: [{ label: "Undergraduate", value: "ug" }, { label: "Postgraduate", value: "pg" }, { label: "Certification", value: "cert" }, { label: "Online Course", value: "online" }], style: "button", language: "en" },
              { id: "q2", type: "text", required: true, text: "Your name:", language: "en" },
              { id: "q3", type: "email", required: true, text: "Email address:", language: "en" },
              { id: "q4", type: "textarea", required: false, text: "Any specific questions about the program?", language: "en" },
            ],
          },
        },
      },
      {
        id: "edu-2",
        name: "Student Feedback",
        desc: "Collect feedback and reviews from students",
        botSettings: {
          botName: "FeedBack",
          welcomeText: "We value your feedback! A quick survey to help us improve.",
          description: "Takes 2 minutes",
          themeColors: { header: "#8b5cf6", question: "#ffffff", answer: "#8b5cf6", option: "#8b5cf6", optionBorder: "#8b5cf6", chatBackground: "#f5f3ff" },
          font: "Poppins",
          fontSize: "14px",
          selectedBubbleStyle: "style2",
          borderRadius: 12,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "radio", required: true, text: "How satisfied are you with the course?", options: [{ label: "Very Satisfied", value: "5" }, { label: "Satisfied", value: "4" }, { label: "Neutral", value: "3" }, { label: "Dissatisfied", value: "2" }], style: "button", language: "en" },
              { id: "q2", type: "textarea", required: true, text: "What did you like most?", language: "en" },
              { id: "q3", type: "textarea", required: false, text: "What can we improve?", language: "en" },
              { id: "q4", type: "number", required: false, text: "Rate your instructor (1-10):", validations: { minLength: 1, maxLength: 2 }, language: "en" },
            ],
          },
        },
      },
    ],
  },
  {
    industry: "Real Estate",
    icon: "🏠",
    color: "#f97316",
    templates: [
      {
        id: "real-1",
        name: "Property Inquiry",
        desc: "Capture leads interested in properties",
        botSettings: {
          botName: "HomeFinder",
          welcomeText: "Looking for your dream home? Let's find it together!",
          description: "Property experts",
          themeColors: { header: "#f97316", question: "#ffffff", answer: "#f97316", option: "#f97316", optionBorder: "#f97316", chatBackground: "#fff7ed" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style1",
          borderRadius: 10,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "radio", required: true, text: "What type of property are you looking for?", options: [{ label: "Apartment", value: "apt" }, { label: "Villa", value: "villa" }, { label: "Plot", value: "plot" }, { label: "Commercial", value: "commercial" }], style: "button", language: "en" },
              { id: "q2", type: "select", required: true, text: "Budget range:", options: [{ label: "Under ₹50L", value: "low" }, { label: "₹50L – ₹1Cr", value: "mid" }, { label: "₹1Cr – ₹2Cr", value: "high" }, { label: "₹2Cr+", value: "luxury" }], style: "dropdown", language: "en" },
              { id: "q3", type: "text", required: true, text: "Preferred location / city:", language: "en" },
              { id: "q4", type: "mobile_number", required: true, text: "Your phone number:", language: "en" },
            ],
          },
        },
      },
      {
        id: "real-2",
        name: "Visit Scheduler",
        desc: "Schedule property visits with agents",
        botSettings: {
          botName: "VisitPro",
          welcomeText: "Ready to see a property in person? Let's schedule a visit!",
          description: "We'll confirm within 2 hours",
          themeColors: { header: "#059669", question: "#ffffff", answer: "#059669", option: "#059669", optionBorder: "#059669", chatBackground: "#ecfdf5" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style3",
          borderRadius: 8,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "text", required: true, text: "Which property are you interested in?", language: "en" },
              { id: "q2", type: "date", required: true, text: "Select a date for the visit:", settings: { dateFormat: "DD/MM/YYYY" }, language: "en" },
              { id: "q3", type: "select", required: true, text: "Preferred time slot:", options: [{ label: "9 AM – 12 PM", value: "morning" }, { label: "12 PM – 3 PM", value: "afternoon" }, { label: "3 PM – 6 PM", value: "evening" }], style: "dropdown", language: "en" },
              { id: "q4", type: "mobile_number", required: true, text: "Your contact number:", language: "en" },
            ],
          },
        },
      },
    ],
  },
  {
    industry: "Restaurant & Hospitality",
    icon: "🍽️",
    color: "#ef4444",
    templates: [
      {
        id: "rest-1",
        name: "Table Booking",
        desc: "Accept reservations & table bookings",
        botSettings: {
          botName: "TableBot",
          welcomeText: "Welcome! Reserve your table in seconds.",
          description: "Instant confirmation",
          themeColors: { header: "#ef4444", question: "#ffffff", answer: "#ef4444", option: "#ef4444", optionBorder: "#ef4444", chatBackground: "#fef2f2" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style1",
          borderRadius: 10,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "number", required: true, text: "How many guests?", validations: { minLength: 1, maxLength: 2 }, language: "en" },
              { id: "q2", type: "date", required: true, text: "Select a date:", settings: { dateFormat: "DD/MM/YYYY" }, language: "en" },
              { id: "q3", type: "select", required: true, text: "Choose time:", options: [{ label: "12:00 PM", value: "12" }, { label: "1:00 PM", value: "13" }, { label: "7:00 PM", value: "19" }, { label: "8:00 PM", value: "20" }, { label: "9:00 PM", value: "21" }], style: "dropdown", language: "en" },
              { id: "q4", type: "text", required: true, text: "Name for the reservation:", language: "en" },
              { id: "q5", type: "mobile_number", required: true, text: "Phone number:", language: "en" },
            ],
          },
        },
      },
      {
        id: "rest-2",
        name: "Menu Explorer",
        desc: "Show menu, recommendations & take orders",
        botSettings: {
          botName: "MenuMate",
          welcomeText: "Hungry? Let's find the perfect dish for you!",
          description: "Explore our menu",
          themeColors: { header: "#dc2626", question: "#ffffff", answer: "#dc2626", option: "#dc2626", optionBorder: "#dc2626", chatBackground: "#fff5f5" },
          font: "Poppins",
          fontSize: "14px",
          selectedBubbleStyle: "style2",
          borderRadius: 12,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "radio", required: true, text: "What are you in the mood for?", options: [{ label: "Starters", value: "starters" }, { label: "Main Course", value: "main" }, { label: "Desserts", value: "desserts" }, { label: "Beverages", value: "drinks" }], style: "button", language: "en" },
              { id: "q2", type: "textarea", required: false, text: "Any dietary preferences or allergies?", language: "en" },
              { id: "q3", type: "text", required: false, text: "Special requests for the chef?", language: "en" },
            ],
          },
        },
      },
    ],
  },
  {
    industry: "Finance & Banking",
    icon: "💰",
    color: "#059669",
    templates: [
      {
        id: "fin-1",
        name: "Loan Inquiry",
        desc: "Collect loan application details",
        botSettings: {
          botName: "LoanBot",
          welcomeText: "Looking for a loan? Let me help you get started.",
          description: "Secure & confidential",
          themeColors: { header: "#059669", question: "#ffffff", answer: "#059669", option: "#059669", optionBorder: "#059669", chatBackground: "#ecfdf5" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style1",
          borderRadius: 10,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "radio", required: true, text: "What type of loan are you looking for?", options: [{ label: "Home Loan", value: "home" }, { label: "Car Loan", value: "car" }, { label: "Personal Loan", value: "personal" }, { label: "Business Loan", value: "business" }], style: "button", language: "en" },
              { id: "q2", type: "number", required: true, text: "Loan amount you need (₹):", language: "en" },
              { id: "q3", type: "select", required: true, text: "Employment type:", options: [{ label: "Salaried", value: "salaried" }, { label: "Self-Employed", value: "self" }, { label: "Business Owner", value: "business" }, { label: "Freelancer", value: "freelance" }], style: "dropdown", language: "en" },
              { id: "q4", type: "mobile_number", required: true, text: "Your phone number:", language: "en" },
            ],
          },
        },
      },
      {
        id: "fin-2",
        name: "Customer Support",
        desc: "Handle banking queries & complaints",
        botSettings: {
          botName: "BankCare",
          welcomeText: "Welcome to BankCare. How may we assist you today?",
          description: "24/7 support",
          themeColors: { header: "#2563eb", question: "#ffffff", answer: "#2563eb", option: "#2563eb", optionBorder: "#2563eb", chatBackground: "#eff6ff" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style3",
          borderRadius: 8,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "radio", required: true, text: "How can we help?", options: [{ label: "Card Issue", value: "card" }, { label: "Transaction Issue", value: "txn" }, { label: "Account Query", value: "account" }, { label: "Complaint", value: "complaint" }, { label: "Talk to Agent", value: "agent" }], style: "button", language: "en" },
              { id: "q2", type: "text", required: true, text: "Your registered mobile number:", validations: { minLength: 10, maxLength: 10 }, language: "en" },
              { id: "q3", type: "textarea", required: true, text: "Describe your issue in detail:", language: "en" },
              { id: "q4", type: "email", required: false, text: "Email for confirmation:", language: "en" },
            ],
          },
        },
      },
    ],
  },
  {
    industry: "Customer Support",
    icon: "🎧",
    color: "#8b5cf6",
    templates: [
      {
        id: "cs-1",
        name: "Help Desk",
        desc: "Tier-1 support for common issues",
        botSettings: {
          botName: "HelpBot",
          welcomeText: "Hi! I'm here to help. What brings you here today?",
          description: "We reply instantly",
          themeColors: { header: "#8b5cf6", question: "#ffffff", answer: "#8b5cf6", option: "#8b5cf6", optionBorder: "#8b5cf6", chatBackground: "#f5f3ff" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style1",
          borderRadius: 10,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "radio", required: true, text: "What do you need help with?", options: [{ label: "Account Issue", value: "account" }, { label: "Billing", value: "billing" }, { label: "Technical Issue", value: "tech" }, { label: "General Query", value: "general" }], style: "button", language: "en" },
              { id: "q2", type: "email", required: true, text: "Your registered email:", language: "en" },
              { id: "q3", type: "textarea", required: true, text: "Please describe your issue:", language: "en" },
              { id: "q4", type: "file", required: false, text: "Upload a screenshot (optional):", settings: { uploadLimit: 5 }, language: "en" },
            ],
          },
        },
      },
      {
        id: "cs-2",
        name: "Ticket Tracker",
        desc: "Check support ticket status & updates",
        botSettings: {
          botName: "TicketBot",
          welcomeText: "Track your support tickets or raise a new one.",
          description: "Ticket management",
          themeColors: { header: "#0ea5e9", question: "#ffffff", answer: "#0ea5e9", option: "#0ea5e9", optionBorder: "#0ea5e9", chatBackground: "#f0f9ff" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style2",
          borderRadius: 12,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "radio", required: true, text: "What would you like to do?", options: [{ label: "Track Ticket", value: "track" }, { label: "New Ticket", value: "new" }, { label: "Escalate", value: "escalate" }], style: "button", language: "en" },
              { id: "q2", type: "text", required: true, text: "Ticket ID (if tracking):", language: "en" },
              { id: "q3", type: "textarea", required: false, text: "Describe your concern:", language: "en" },
            ],
          },
        },
      },
    ],
  },
  {
    industry: "SaaS & Technology",
    icon: "💻",
    color: "#6366f1",
    templates: [
      {
        id: "saas-1",
        name: "Onboarding Flow",
        desc: "Guide new users through product setup",
        botSettings: {
          botName: "OnboardBot",
          welcomeText: "Welcome aboard! Let's get you set up in no time.",
          description: "Setup guide",
          themeColors: { header: "#6366f1", question: "#ffffff", answer: "#6366f1", option: "#6366f1", optionBorder: "#6366f1", chatBackground: "#eef2ff" },
          font: "Inter",
          fontSize: "14px",
          selectedBubbleStyle: "style1",
          borderRadius: 10,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "text", required: true, text: "What's your company name?", language: "en" },
              { id: "q2", type: "select", required: true, text: "How many team members?", options: [{ label: "Just me", value: "1" }, { label: "2-5", value: "2-5" }, { label: "6-20", value: "6-20" }, { label: "20+", value: "20" }], style: "dropdown", language: "en" },
              { id: "q3", type: "radio", required: true, text: "What's your primary use case?", options: [{ label: "Customer Support", value: "support" }, { label: "Lead Generation", value: "leads" }, { label: "Internal Tool", value: "internal" }, { label: "Marketing", value: "marketing" }], style: "button", language: "en" },
              { id: "q4", type: "email", required: true, text: "Work email for updates:", language: "en" },
            ],
          },
        },
      },
      {
        id: "saas-2",
        name: "Feature Request",
        desc: "Collect feature requests & feedback",
        botSettings: {
          botName: "FeatureBot",
          welcomeText: "Got an idea? We're all ears! Tell us what you'd like to see.",
          description: "We read every suggestion",
          themeColors: { header: "#7c3aed", question: "#ffffff", answer: "#7c3aed", option: "#7c3aed", optionBorder: "#7c3aed", chatBackground: "#f5f3ff" },
          font: "Poppins",
          fontSize: "14px",
          selectedBubbleStyle: "style3",
          borderRadius: 8,
        },
        flowSetupSetting: {
          question: {
            list: [
              { id: "q1", type: "textarea", required: true, text: "Describe the feature you'd like:", language: "en" },
              { id: "q2", type: "select", required: true, text: "How important is this?", options: [{ label: "Critical - Can't work without it", value: "critical" }, { label: "Important - Would help a lot", value: "important" }, { label: "Nice to have", value: "nice" }], style: "dropdown", language: "en" },
              { id: "q3", type: "email", required: true, text: "Your email for follow-up:", language: "en" },
            ],
          },
        },
      },
    ],
  },
];

export default TEMPLATES;
