import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/ui/hero-section-dark';
import { useAuth } from '@/context/AuthContext';

const HeroSectionDemo: React.FC = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (userRole) {
      navigate(`/${userRole}`);
    } else {
      navigate('/admin'); // Default to admin if no role is set
    }
  };

  return (
    <HeroSection
      title="RouteOptimizer: Smart Delivery Solutions"
      subtitle="Optimize your fleet, reduce costs, and enhance customer satisfaction with our AI-powered routing platform."
      description="Experience real-time tracking, predictive analytics, and seamless integration with leading mapping and environmental data providers."
      ctaText="Get Started"
      ctaOnClick={handleCtaClick}
      bottomImage={{
        light: "https://images.unsplash.com/photo-1521737711867-e3b973753422?q=80&w=2830&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        dark: "https://images.unsplash.com/photo-1521737711867-e3b9973753422?q=80&w=2830&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }}
    />
  );
};

export default HeroSectionDemo;
