"use client"

import { Server, Users, Award, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import ScrollingText from "./ui/ScrollingText"

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const expertise = [
    {
      icon: <Server className="h-8 w-8 text-primary" />,
      title: "Server Hardware Expertise",
      description: "Custom server builds, component integration, and enterprise hardware solutions",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Enterprise Deployment",
      description: "Windows Server, Linux systems, clustering, and network infrastructure",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Cloud Integration",
      description: "AWS, Azure, Google Cloud migration and hybrid solution architecture",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "24/7 Support",
      description: "Technical troubleshooting, performance optimization, and system monitoring",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section ref={ref} id="about" className="bg-background py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-foreground">Server Infrastructure Specialists</h2>
          <div className="mx-auto h-1 w-24 bg-primary"></div>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="mb-6 text-2xl font-bold text-foreground">Our Expertise</h3>
            <p className="mb-6 text-muted-foreground">
              As certified Server Infrastructure Specialists and Systems & Server Solutions Engineers, we provide
              comprehensive server solutions from hardware sales and custom builds to enterprise deployment and cloud
              integration.
            </p>
            <p className="mb-8 text-muted-foreground">
              Our team specializes in Windows Server environments (Active Directory, DNS, DHCP, Failover Clustering),
              Linux distributions (CentOS, Ubuntu Server), and hybrid cloud solutions with AWS, Azure, and Google Cloud.
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {expertise.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-accent/50 transition-colors duration-300"
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="flex-shrink-0">
                    {item.icon}
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { number: "500+", label: "Servers Deployed" },
              { number: "99.9%", label: "Uptime SLA" },
              { number: "24/7", label: "Technical Support" },
              { number: "15+", label: "Years Experience" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="rounded-lg bg-card p-6 shadow-md border hover:shadow-lg transition-all duration-300"
              >
                <motion.h4
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  className="mb-2 text-2xl font-bold text-primary"
                >
                  {stat.number}
                </motion.h4>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Technical Certifications with Animation */}
        <div className="mt-16">
          <h3 className="mb-8 text-2xl font-bold text-foreground text-center">Certifications & Technologies</h3>
          <div className="overflow-hidden">
            <div className="flex flex-nowrap py-8">
              {[
                "Windows Server",
                "VMware vSphere",
                "AWS Solutions",
                "Azure Infrastructure",
                "Linux Administration",
                "Cisco Networking",
                "Dell PowerEdge",
                "HP ProLiant",
                "RAID Configuration",
                "Hyper-V",
                "Docker/Kubernetes",
                "Network Security",
              ].map((cert, index) => (
                <ScrollingText 
                  key={index} 
                  text={cert} 
                  delay={index * 0.8} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
