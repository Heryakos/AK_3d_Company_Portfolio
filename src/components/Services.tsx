"use client"

import { Server, Cloud, Shield, HardDrive, Network, Settings, Zap, Monitor, Wrench } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const services = [
  {
    icon: <Server className="h-10 w-10 text-primary" />,
    title: "Server Hardware Sales & Integration",
    description:
      "Custom server builds with RAM, CPUs, SSDs, HDDs, network cards, and chassis. High-performance storage and enterprise server solutions.",
  },
  {
    icon: <Settings className="h-10 w-10 text-primary" />,
    title: "Server Configuration & Deployment",
    description:
      "Windows Server (AD, DNS, DHCP, Clustering) and Linux (CentOS, Ubuntu) installation. RAID setup, BIOS configuration, and firmware updates.",
  },
  {
    icon: <Network className="h-10 w-10 text-primary" />,
    title: "Network & Server Clustering",
    description:
      "Windows Failover Clustering, load balancing, redundancy systems. Network switches, routers, and VLAN configuration.",
  },
  {
    icon: <Cloud className="h-10 w-10 text-primary" />,
    title: "Cloud & Hybrid Solutions",
    description:
      "AWS, Azure, Google Cloud migration. Remote desktop services, file sharing, backup and disaster recovery solutions.",
  },
  {
    icon: <HardDrive className="h-10 w-10 text-primary" />,
    title: "Storage Solutions & RAID",
    description:
      "Enterprise storage arrays, SAN/NAS configuration, RAID 0/1/5/10 setup, and high-availability storage systems.",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Security & Compliance",
    description:
      "Server hardening, firewall configuration, SSL certificates, and compliance with industry standards (HIPAA, SOX, PCI-DSS).",
  },
  {
    icon: <Wrench className="h-10 w-10 text-primary" />,
    title: "Technical Troubleshooting",
    description:
      "Hardware diagnostics, performance optimization, system monitoring, and 24/7 technical support for enterprise environments.",
  },
  {
    icon: <Monitor className="h-10 w-10 text-primary" />,
    title: "Virtualization & Containers",
    description:
      "VMware vSphere, Hyper-V, Docker containers, Kubernetes orchestration, and virtual infrastructure management.",
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Performance Optimization",
    description:
      "Server performance tuning, resource allocation, capacity planning, and scalability solutions for large-scale systems.",
  },
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section ref={ref} id="services" className="bg-muted/50 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-foreground">Server Infrastructure & Solutions</h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto h-1 bg-primary"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto mt-6 max-w-3xl text-muted-foreground"
          >
            Comprehensive server infrastructure services from hardware sales and custom builds to enterprise deployment,
            clustering, and cloud integration. Specializing in Windows Server, Linux, and hybrid cloud solutions.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 },
              }}
              className="rounded-lg bg-card p-8 shadow-md transition-all hover:shadow-lg border hover:border-primary/50 group"
            >
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }} className="mb-4">
                {service.icon}
              </motion.div>
              <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
