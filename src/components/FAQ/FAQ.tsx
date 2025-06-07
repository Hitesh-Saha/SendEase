import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  borderRadius: `${theme.shape.borderRadius * 2}px !important`,
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `${theme.spacing(2)}px 0`,
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: theme.palette.primary.main,
    transition: 'transform 0.3s ease-in-out',
  },
  '&.Mui-expanded': {
    '& .MuiAccordionSummary-expandIconWrapper': {
      transform: 'rotate(180deg)',
    },
  },
}));

const FAQ = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      question: "How does SendEase ensure file security?",
      answer:
        "SendEase uses end-to-end encryption with AES-256 and RSA key pairs. Files are encrypted in your browser before transmission, and only the recipient can decrypt them. We never store your files or encryption keys on our servers.",
    },
    {
      question: "Is there a file size limit?",
      answer:
        "No, SendEase doesn't impose any file size limits. The only limitation is your browser's memory capacity and internet connection speed.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No, SendEase works without any registration or account creation. Simply open the app and start sharing files instantly.",
    },
    {
      question: "How long are my files available?",
      answer:
        "Files are transferred directly between peers and are not stored on any servers. They are available only during the active transfer session.",
    },
    {
      question: "Can I share files with multiple people?",
      answer:
        "Yes, you can share files with multiple recipients one at a time. Each transfer creates a unique secure connection between sender and receiver.",
    },
  ];
  return (
    <Box
      component="section"
      id="faq"
      sx={{
        py: 10,
        background: (theme) => `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        scrollMarginTop: "64px", // Add scroll margin to account for fixed navbar
      }}
    >
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 8,
            background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Frequently Asked Questions
        </Typography>
        <Box maxWidth="800px" mx="auto">
          {faqs.map((faq, index) => (
            <StyledAccordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={() => handleChange(`panel${index}`)}
            >
              <StyledAccordionSummary expandIcon={<ExpandMore />}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: expanded === `panel${index}` ? "primary.main" : "text.primary",
                  }}
                >
                  {faq.question}
                </Typography>
              </StyledAccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;
