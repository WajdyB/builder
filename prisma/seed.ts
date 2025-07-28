// Seed script for development
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...')
  await prisma.component.deleteMany()
  await prisma.page.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()

  // Create sample users
  console.log('👥 Creating sample users...')
  
  // Hash passwords for sample users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
  })

  // Create sample projects
  console.log('📁 Creating sample projects...')
  const project1 = await prisma.project.create({
    data: {
      title: 'My Personal Website',
      description: 'A beautiful personal portfolio website',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      status: 'DRAFT',
      userId: user1.id,
    },
  })

  const project2 = await prisma.project.create({
    data: {
      title: 'E-commerce Store',
      description: 'Modern e-commerce website with shopping cart',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      status: 'PUBLISHED',
      userId: user1.id,
    },
  })

  const project3 = await prisma.project.create({
    data: {
      title: 'Restaurant Website',
      description: 'Elegant restaurant website with menu and reservations',
      thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      status: 'DRAFT',
      userId: user2.id,
    },
  })

  // Create sample pages
  console.log('📄 Creating sample pages...')
  const homePage = await prisma.page.create({
    data: {
      name: 'Home',
      slug: 'home',
      isHomePage: true,
      projectId: project1.id,
    },
  })

  const aboutPage = await prisma.page.create({
    data: {
      name: 'About',
      slug: 'about',
      isHomePage: false,
      projectId: project1.id,
    },
  })

  const contactPage = await prisma.page.create({
    data: {
      name: 'Contact',
      slug: 'contact',
      isHomePage: false,
      projectId: project1.id,
    },
  })

  const shopPage = await prisma.page.create({
    data: {
      name: 'Shop',
      slug: 'shop',
      isHomePage: true,
      projectId: project2.id,
    },
  })

  const menuPage = await prisma.page.create({
    data: {
      name: 'Menu',
      slug: 'menu',
      isHomePage: true,
      projectId: project3.id,
    },
  })

  // Create sample components for home page
  console.log('🧩 Creating sample components...')
  
  // Header component
  const headerComponent = await prisma.component.create({
    data: {
      type: 'header',
      properties: {
        title: 'Welcome to My Website',
        subtitle: 'Professional Portfolio & Services',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        alignment: 'center',
      },
      x: 0,
      y: 0,
      width: '100%',
      height: '80px',
      zIndex: 10,
      pageId: homePage.id,
    },
  })

  // Hero section
  const heroComponent = await prisma.component.create({
    data: {
      type: 'hero',
      properties: {
        title: 'John Doe',
        subtitle: 'Full Stack Developer',
        description: 'Passionate about creating beautiful and functional web applications',
        buttonText: 'Get In Touch',
        buttonLink: '/contact',
        backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
        overlay: true,
      },
      x: 0,
      y: 80,
      width: '100%',
      height: '500px',
      zIndex: 5,
      pageId: homePage.id,
    },
  })

  // About section
  const aboutComponent = await prisma.component.create({
    data: {
      type: 'section',
      properties: {
        title: 'About Me',
        content: 'I am a passionate developer with 5+ years of experience in web development. I specialize in React, Node.js, and modern web technologies.',
        backgroundColor: '#f8f9fa',
        padding: '60px 0',
      },
      x: 0,
      y: 580,
      width: '100%',
      height: '300px',
      zIndex: 5,
      pageId: homePage.id,
    },
  })

  // Services grid
  const servicesComponent = await prisma.component.create({
    data: {
      type: 'grid',
      properties: {
        title: 'My Services',
        items: [
          {
            title: 'Web Development',
            description: 'Custom websites and web applications',
            icon: 'code',
          },
          {
            title: 'UI/UX Design',
            description: 'Beautiful and intuitive user interfaces',
            icon: 'palette',
          },
          {
            title: 'Mobile Apps',
            description: 'Cross-platform mobile applications',
            icon: 'smartphone',
          },
        ],
        columns: 3,
        gap: '20px',
      },
      x: 0,
      y: 880,
      width: '100%',
      height: '400px',
      zIndex: 5,
      pageId: homePage.id,
    },
  })

  // Footer component
  const footerComponent = await prisma.component.create({
    data: {
      type: 'footer',
      properties: {
        copyright: '© 2024 John Doe. All rights reserved.',
        links: [
          { text: 'Privacy Policy', url: '/privacy' },
          { text: 'Terms of Service', url: '/terms' },
        ],
        backgroundColor: '#2c3e50',
        textColor: '#ffffff',
      },
      x: 0,
      y: 1280,
      width: '100%',
      height: '100px',
      zIndex: 10,
      pageId: homePage.id,
    },
  })

  // Create components for shop page
  const shopHeader = await prisma.component.create({
    data: {
      type: 'header',
      properties: {
        title: 'Online Store',
        subtitle: 'Quality Products at Great Prices',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        alignment: 'center',
      },
      x: 0,
      y: 0,
      width: '100%',
      height: '80px',
      zIndex: 10,
      pageId: shopPage.id,
    },
  })

  const productGrid = await prisma.component.create({
    data: {
      type: 'product-grid',
      properties: {
        title: 'Featured Products',
        products: [
          {
            name: 'Premium T-Shirt',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
            description: 'Comfortable cotton t-shirt',
          },
          {
            name: 'Designer Jeans',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
            description: 'High-quality denim jeans',
          },
          {
            name: 'Running Shoes',
            price: 129.99,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
            description: 'Comfortable athletic shoes',
          },
        ],
        columns: 3,
        gap: '20px',
      },
      x: 0,
      y: 80,
      width: '100%',
      height: '600px',
      zIndex: 5,
      pageId: shopPage.id,
    },
  })

  // Create components for menu page
  const menuHeader = await prisma.component.create({
    data: {
      type: 'header',
      properties: {
        title: 'Our Menu',
        subtitle: 'Delicious dishes prepared with fresh ingredients',
        backgroundColor: '#2c3e50',
        textColor: '#ffffff',
        alignment: 'center',
      },
      x: 0,
      y: 0,
      width: '100%',
      height: '80px',
      zIndex: 10,
      pageId: menuPage.id,
    },
  })

  const menuSection = await prisma.component.create({
    data: {
      type: 'menu-section',
      properties: {
        title: 'Main Courses',
        items: [
          {
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon with herbs and lemon',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
          },
          {
            name: 'Beef Tenderloin',
            description: 'Premium cut with red wine reduction',
            price: 32.99,
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
          },
          {
            name: 'Vegetarian Pasta',
            description: 'Fresh vegetables with homemade pasta',
            price: 18.99,
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
          },
        ],
        layout: 'grid',
        columns: 2,
      },
      x: 0,
      y: 80,
      width: '100%',
      height: '800px',
      zIndex: 5,
      pageId: menuPage.id,
    },
  })

  console.log('✅ Database seeding completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${2} users`)
  console.log(`   - ${3} projects`)
  console.log(`   - ${5} pages`)
  console.log(`   - ${10} components`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

