import {
    Lock,
    Shield,
    EnhancedEncryption,
    VerifiedUser,
    Speed,
    PeopleAlt,
    Public,
    CloudSync,
  } from "@mui/icons-material";
import { Feature } from "../models/common";

export const allFeatures: Feature[] = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Military-grade AES-256 encryption for all your transfers.",
      category: "security",
    },
    {
      icon: Speed,
      title: "Lightning Fast",
      description: "Direct P2P connections for maximum transfer speeds.",
      category: "feature",
    },
    {
      icon: Shield,
      title: "Zero Knowledge",
      description:
        "Your files never touch our servers. Complete privacy guaranteed.",
      category: "security",
    },
    {
      icon: Public,
      title: "Cross Platform",
      description: "Works on any device with a modern web browser.",
      category: "feature",
    },
    {
      icon: EnhancedEncryption,
      title: "Secure Key Exchange",
      description: "RSA key pairs ensure secure communication between peers.",
      category: "security",
    },
    {
      icon: CloudSync,
      title: "No Cloud Storage",
      description:
        "Direct peer-to-peer transfers without intermediary storage.",
      category: "feature",
    },
    {
      icon: VerifiedUser,
      title: "No Authentication",
      description: "Share files instantly without creating an account.",
      category: "security",
    },
    {
      icon: PeopleAlt,
      title: "Multiple Recipients",
      description: "Share with multiple people using unique transfer codes.",
      category: "feature",
    },
];

export const socialLinks = {
    email: 'hiteshsaha52@gmail.com',
    instagram: 'https://www.instagram.com/storm_charger_03',
    linkedin: 'https://www.linkedin.com/in/hitesh-saha-5401671b3/',
    github: 'https://github.com/Hitesh-Saha',
    twitter: 'https://x.com/hiteshsaha03?s=21',
    medium: 'https://medium.com/@HiteshSaha'
};