"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Sparkles, Users, Calendar } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { ChatWidget, useChatWidget } from "@/components/chat-widget";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const chatWidget = useChatWidget();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const featureVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
        <motion.div
          className="text-center space-y-8 lg:space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Header with Badge */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge
                variant="secondary"
                className="mx-auto px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                </motion.div>
                AI-Powered Student Assistant
              </Badge>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                ETIC AI
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                Your intelligent assistant for exploring ETIC Algarve programs
                and opportunities. Get instant answers, schedule interviews, and
                discover your perfect educational path.
              </motion.p>
            </div>
          </motion.div>

          {/* Main CTA Card */}
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="max-w-lg mx-auto p-6 lg:p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl shadow-blue-500/10 dark:shadow-blue-500/5">
              <div className="space-y-6">
                <motion.div
                  className="flex items-center justify-center space-x-6 text-sm text-slate-600 dark:text-slate-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span>Instant Answers</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>Easy Scheduling</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span>Expert Guidance</span>
                  </motion.div>
                </motion.div>

                <motion.p
                  className="text-slate-700 dark:text-slate-300 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  Chat with our AI assistant to learn about courses, schedule
                  interviews, book campus tours, or arrange calls with our
                  admissions team.
                </motion.p>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => {
                      chatWidget.toggleWidget();
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                    </motion.div>
                    Start Conversation
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto mt-12"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <motion.div variants={featureVariants} whileHover="hover">
              <Card className="p-4 lg:p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer">
                <div className="text-center space-y-2">
                  <motion.div
                    className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Course Information
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Get detailed info about all ETIC Algarve programs
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={featureVariants} whileHover="hover">
              <Card className="p-4 lg:p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer">
                <div className="text-center space-y-2">
                  <motion.div
                    className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </motion.div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Easy Scheduling
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Book interviews, tours, and calls in seconds
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={featureVariants} whileHover="hover">
              <Card className="p-4 lg:p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer">
                <div className="text-center space-y-2">
                  <motion.div
                    className="w-12 h-12 mx-auto bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </motion.div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Personal Guidance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Connect with admissions experts for personalized help
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Chat Widget */}
      <ChatWidget
        position="bottom-right"
        theme="light"
        sessionId="landing-page-session"
      />
    </div>
  );
}
