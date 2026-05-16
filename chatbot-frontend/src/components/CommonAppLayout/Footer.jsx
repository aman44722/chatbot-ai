import React from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Link,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Twitter,
  LinkedIn,
  Facebook,
  YouTube,
  GitHub,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box className="footer-section background-light-purple">
      {/* Footer Grid */}
      <Grid container spacing={6} className="footer-space-btwn">
        {[
          {
            title: "Product",
            links: [
              "Pricing",
              "Artificial Intelligence",
              "Benefits",
              "Features",
              "Product Demo",
              "Visual Builder",
              "Dynamic Responses",
              "Analytics",
            ],
          },
          {
            title: "Solutions",
            links: ["Marketing", "Customer Support", "Sales", "Education"],
          },
          {
            title: "Integrations",
            links: [
              "Chat Widget",
              "LiveChat",
              "HelpDesk",
              "Facebook Messenger",
              "Shopify",
              "Slack",
              "Zapier",
              "WordPress",
            ],
          },
          {
            title: "ChatBot Templates",
            links: [
              "Marketing Templates",
              "Sales Templates",
              "Support Templates",
            ],
          },
          {
            title: "Resources",
            links: [
              "Help Center",
              "API & Developers",
              "ChatBot Academy",
              "Blog",
              "Chatbot Best Practices",
              "System Status",
            ],
          },
          {
            title: "Company",
            links: [
              "About Us",
              "Partner Program",
              "Press",
              "Careers",
              "LiveChat Incubator",
              "Legal",
            ],
          },
        ].map((section, i) => (
          <Grid item xs={12} sm={4} md={2} key={i}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{ marginBottom: "12px" }}
            >
              {section.title}
            </Typography>
            {section.links.map((link, idx) => (
              <Link
                key={idx}
                href="#"
                underline="hover"
                color="inherit"
                display="block"
                sx={{ fontSize: "14px", marginBottom: "6px" }}
              >
                {link}
              </Link>
            ))}
          </Grid>
        ))}
      </Grid>

      {/* CTA Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "60px",
          flexWrap: "wrap",
          gap: "16px",
          paddingTop: "20px",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Start your free trial
        </Typography>
        <Button
          variant="contained"
          color="error"
          sx={{ borderRadius: "8px", padding: "10px 32px", fontSize: "15px" }}
        >
          Sign up free
        </Button>
      </Box>

      {/* Social Media Icons */}
      <Box sx={{ marginTop: "40px", display: "flex", gap: "20px" }}>
        <IconButton>
          <Twitter />
        </IconButton>
        <IconButton>
          <LinkedIn />
        </IconButton>
        <IconButton>
          <Facebook />
        </IconButton>
        <IconButton>
          <YouTube />
        </IconButton>
        <IconButton>
          <GitHub />
        </IconButton>
      </Box>

      {/* Divider */}
      <Divider sx={{ marginTop: "40px", marginBottom: "30px" }} />

      {/* Fine Print / Policy */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: "13px", lineHeight: "1.6" }}
      >
        Copyright © 2025 SmatBot, Inc. All rights reserved.
        <br />
        We use cookies and similar technologies to enhance your interactions
        with our website and Services. Click the
        <Link href="#" underline="hover" sx={{ marginLeft: "4px" }}>
          Cookie Policy
        </Link>{" "}
        and
        <Link href="#" underline="hover" sx={{ marginLeft: "4px" }}>
          Privacy Policy
        </Link>{" "}
        to learn more.
      </Typography>
    </Box>
  );
};

export default Footer;
