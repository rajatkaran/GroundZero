import { prisma } from "./db";

export async function checkAndSeedDatabase() {
  try {
    const festivalCount = await prisma.festival.count();
    
    if (festivalCount > 0) {
      return; // Database already has data
    }

    console.log("Seeding database with default festivals and stalls...");

    // Find or create a mock Organizer user
    let organizer = await prisma.user.findUnique({
      where: { email: "convener@moodindigo.org" }
    });
    
    if (!organizer) {
      organizer = await prisma.user.create({
        data: {
          email: "convener@moodindigo.org",
          role: "ORGANIZER",
          passwordHash: "12345678",
          profile: {
            create: {
              companyName: "IIT Bombay Mood Indigo Committee",
              contactPhone: "+91 99999 88888",
              category: "FESTIVAL_HOST",
              verified: true,
              metadata: JSON.stringify({
                institution: "IIT Bombay",
                department: "Cultural Committee"
              })
            }
          }
        }
      });
    }

    // Find or create a mock Vendor user
    let vendor = await prisma.user.findUnique({
      where: { email: "tea_stall@gmail.com" }
    });

    if (!vendor) {
      vendor = await prisma.user.create({
        data: {
          email: "tea_stall@gmail.com",
          role: "VENDOR",
          passwordHash: "12345678",
          profile: {
            create: {
              companyName: "Chaayos Teas Ltd",
              contactPhone: "+91 98765 43210",
              category: "FOOD",
              verified: true,
              metadata: JSON.stringify({
                scale: "National Brand",
                averageRevenue: "₹5L+"
              })
            }
          }
        }
      });
    }

    // Find or create a mock Admin user
    let admin = await prisma.user.findUnique({
      where: { email: "admin@thinkthrough.co.in" }
    });

    if (!admin) {
      const seedPassword = process.env.SEED_ADMIN_PASSWORD;
      if (!seedPassword) {
        throw new Error("SEED_ADMIN_PASSWORD environment variable is not defined");
      }
      await prisma.user.create({
        data: {
          email: "admin@thinkthrough.co.in",
          role: "ADMIN",
          passwordHash: seedPassword,
          profile: {
            create: {
              companyName: "Ground Zero Operations Panel",
              contactPhone: "+91 99999 11111",
              category: "ADMINISTRATION",
              verified: true,
              metadata: JSON.stringify({
                clearance: "Super Admin"
              })
            }
          }
        }
      });
    }

    // Seed Festival 1: Mood Indigo
    const mi = await prisma.festival.create({
      data: {
        organizerId: organizer.id,
        name: "Mood Indigo '26",
        collegeName: "IIT Bombay",
        location: "Powai, Mumbai",
        startDate: new Date("2026-12-18"),
        endDate: new Date("2026-12-21"),
        expectedFootfall: 140000,
        artistLineup: "Arijit Singh, Nucleya, Divine, Salim-Sulaiman",
        demographics: "85% student youth, 15% corporate professionals and alumni",
        opportunityScore: 96,
        layoutMapUrl: "/blueprints/mood_indigo_layout.png",
        bannerUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200",
        galleryUrls: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600,https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600",
        defaultStallPrice: 35000.0,
        mapDimensions: JSON.stringify({ width: 1000, height: 600 }),
        published: true,
      }
    });

    // Seed Stalls for Mood Indigo
    const miStalls = [
      {
        stallNumber: "A1",
        dimensions: "10x10",
        basePrice: 35000,
        publicPrice: 45000,
        commissionAmount: 10000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 100, y: 150, w: 80, h: 80 }),
        expectedTraffic: 9.2,
        visibilityScore: 9.0,
        minSales: 150000,
        maxSales: 220000
      },
      {
        stallNumber: "A2",
        dimensions: "10x10",
        basePrice: 35000,
        publicPrice: 45000,
        commissionAmount: 10000,
        status: "AVAILABLE",
        coordinates: JSON.stringify({ type: "rect", x: 220, y: 150, w: 80, h: 80 }),
        expectedTraffic: 8.5,
        visibilityScore: 8.2,
        minSales: 120000,
        maxSales: 180000
      },
      {
        stallNumber: "A3",
        dimensions: "10x10",
        basePrice: 45000,
        publicPrice: 55000,
        commissionAmount: 10000,
        status: "NEGOTIATION",
        coordinates: JSON.stringify({ type: "rect", x: 340, y: 150, w: 80, h: 80 }),
        expectedTraffic: 9.8,
        visibilityScore: 9.6,
        minSales: 200000,
        maxSales: 300000
      },
      {
        stallNumber: "A4",
        dimensions: "12x12",
        basePrice: 50000,
        publicPrice: 65000,
        commissionAmount: 15000,
        status: "AVAILABLE",
        coordinates: JSON.stringify({ type: "rect", x: 460, y: 150, w: 90, h: 90 }),
        expectedTraffic: 7.9,
        visibilityScore: 8.0,
        minSales: 100000,
        maxSales: 150000
      },
      {
        stallNumber: "B1",
        dimensions: "10x10",
        basePrice: 30000,
        publicPrice: 40000,
        commissionAmount: 10000,
        status: "AVAILABLE",
        coordinates: JSON.stringify({ type: "rect", x: 100, y: 320, w: 80, h: 80 }),
        expectedTraffic: 8.8,
        visibilityScore: 8.5,
        minSales: 130000,
        maxSales: 190000
      },
      {
        stallNumber: "B2",
        dimensions: "10x10",
        basePrice: 30000,
        publicPrice: 40000,
        commissionAmount: 10000,
        status: "RESERVED",
        coordinates: JSON.stringify({ type: "rect", x: 220, y: 320, w: 80, h: 80 }),
        expectedTraffic: 8.0,
        visibilityScore: 7.9,
        minSales: 95000,
        maxSales: 140000
      }
    ];

    for (const stall of miStalls) {
      await prisma.stall.create({
        data: {
          festivalId: mi.id,
          festivalName: mi.name,
          ...stall
        }
      });
    }

    // Seed Festival 2: Oasis
    const oasis = await prisma.festival.create({
      data: {
        organizerId: organizer.id,
        name: "Oasis '26",
        collegeName: "BITS Pilani",
        location: "Pilani, Rajasthan",
        startDate: new Date("2026-10-24"),
        endDate: new Date("2026-10-28"),
        expectedFootfall: 45000,
        artistLineup: "Amit Trivedi, Sunidhi Chauhan, Shankar Mahadevan",
        demographics: "90% student youth, 10% faculty and visiting parents",
        opportunityScore: 88,
        layoutMapUrl: "/blueprints/oasis_layout.png",
        bannerUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200",
        galleryUrls: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600,https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600",
        defaultStallPrice: 20000.0,
        mapDimensions: JSON.stringify({ width: 800, height: 500 }),
        published: true,
      }
    });

    const oasisStalls = [
      {
        stallNumber: "S1",
        dimensions: "10x10",
        basePrice: 20000,
        publicPrice: 28000,
        commissionAmount: 8000,
        status: "AVAILABLE",
        coordinates: JSON.stringify({ type: "rect", x: 150, y: 120, w: 70, h: 70 }),
        expectedTraffic: 7.5,
        visibilityScore: 7.8,
        minSales: 60000,
        maxSales: 95000
      },
      {
        stallNumber: "S2",
        dimensions: "10x10",
        basePrice: 25000,
        publicPrice: 35000,
        commissionAmount: 10000,
        status: "AVAILABLE",
        coordinates: JSON.stringify({ type: "rect", x: 260, y: 120, w: 70, h: 70 }),
        expectedTraffic: 8.9,
        visibilityScore: 8.7,
        minSales: 110000,
        maxSales: 160000
      }
    ];

    for (const stall of oasisStalls) {
      await prisma.stall.create({
        data: {
          festivalId: oasis.id,
          festivalName: oasis.name,
          ...stall
        }
      });
    }

    // Seed Festival 3: Mood Indigo '25 (Past Event)
    const mi25 = await prisma.festival.create({
      data: {
        organizerId: organizer.id,
        name: "Mood Indigo '25",
        collegeName: "IIT Bombay",
        location: "Powai, Mumbai",
        startDate: new Date("2025-12-18"),
        endDate: new Date("2025-12-21"),
        expectedFootfall: 135000,
        artistLineup: "Vishal-Shekhar, Zakir Khan, Amit Trivedi",
        demographics: "80% student youth, 20% external public",
        opportunityScore: 94,
        layoutMapUrl: null, // Blank canvas mode simulation!
        bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200",
        galleryUrls: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600",
        defaultStallPrice: 30000.0,
        mapDimensions: JSON.stringify({
          width: 1000,
          height: 600,
          decorations: [
            { type: "stage", x: 750, y: 220, w: 160, h: 160, label: "MAIN CONCERT STAGE" },
            { type: "walkway", x: 100, y: 280, w: 600, h: 30, label: "MAIN ARTERY" },
            { type: "utility", x: 400, y: 40, w: 120, h: 60, label: "FOOD COURT A" }
          ]
        }),
        published: true,
      }
    });

    const mi25Stalls = [
      {
        stallNumber: "A1",
        dimensions: "10x10",
        basePrice: 30000,
        publicPrice: 40000,
        commissionAmount: 10000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 100, y: 120, w: 80, h: 80 }),
        expectedTraffic: 9.5,
        visibilityScore: 9.2,
        minSales: 160000,
        maxSales: 240000
      },
      {
        stallNumber: "A2",
        dimensions: "10x10",
        basePrice: 30000,
        publicPrice: 40000,
        commissionAmount: 10000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 200, y: 120, w: 80, h: 80 }),
        expectedTraffic: 8.8,
        visibilityScore: 8.5,
        minSales: 130000,
        maxSales: 190000
      },
      {
        stallNumber: "A3",
        dimensions: "10x10",
        basePrice: 35000,
        publicPrice: 45000,
        commissionAmount: 10000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 300, y: 120, w: 80, h: 80 }),
        expectedTraffic: 9.2,
        visibilityScore: 9.0,
        minSales: 150000,
        maxSales: 220000
      },
      {
        stallNumber: "B1",
        dimensions: "12x12",
        basePrice: 40000,
        publicPrice: 50000,
        commissionAmount: 10000,
        status: "AVAILABLE",
        coordinates: JSON.stringify({ type: "rect", x: 100, y: 240, w: 90, h: 90 }),
        expectedTraffic: 7.8,
        visibilityScore: 8.0,
        minSales: 100000,
        maxSales: 150000
      },
      {
        stallNumber: "B2",
        dimensions: "10x10",
        basePrice: 28000,
        publicPrice: 35000,
        commissionAmount: 7000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 210, y: 240, w: 80, h: 80 }),
        expectedTraffic: 8.5,
        visibilityScore: 8.2,
        minSales: 110000,
        maxSales: 165000
      },
      {
        stallNumber: "B3",
        dimensions: "10x10",
        basePrice: 30000,
        publicPrice: 38000,
        commissionAmount: 8000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 310, y: 240, w: 80, h: 80 }),
        expectedTraffic: 8.9,
        visibilityScore: 8.6,
        minSales: 125000,
        maxSales: 185000
      }
    ];

    for (const stall of mi25Stalls) {
      const createdStall = await prisma.stall.create({
        data: {
          festivalId: mi25.id,
          festivalName: mi25.name,
          ...stall
        }
      });

      // Create booking for BOOKED stalls
      if (stall.status === "BOOKED") {
        await prisma.booking.create({
          data: {
            festivalId: mi25.id,
            vendorId: vendor.id,
            stallId: createdStall.id,
            status: "PAID",
            finalPrice: stall.publicPrice,
            contractUrl: "/contracts/mock_mou.pdf"
          }
        });
      }
    }

    const mi25Reviews = [
      {
        festivalId: mi25.id,
        festivalName: mi25.name,
        userId: organizer.id,
        userName: "IIT Bombay Mood Indigo Committee",
        role: "ORGANIZER",
        rating: 5,
        comment: "Mood Indigo '25 was a massive hit. Ground Zero's digital mapping streamlined stall allocations, saving us 40+ hours of coordination. Footfall was 135k+."
      },
      {
        festivalId: mi25.id,
        festivalName: mi25.name,
        userId: vendor.id,
        userName: "Chaayos Teas Ltd",
        role: "VENDOR",
        rating: 5,
        comment: "We had Stall A1 near the main stage. The traffic estimate of 9.5 was highly accurate. Generated over ₹2.4 Lakhs in sales over 3 days!"
      }
    ];

    for (const rev of mi25Reviews) {
      await prisma.review.create({
        data: rev
      });
    }

    // Seed Festival 4: Rendezvous '26 (Active)
    const rd26 = await prisma.festival.create({
      data: {
        organizerId: organizer.id,
        name: "Rendezvous '26",
        collegeName: "IIT Delhi",
        location: "Hauz Khas, New Delhi",
        startDate: new Date("2026-10-15"),
        endDate: new Date("2026-10-18"),
        expectedFootfall: 80000,
        artistLineup: "Divine, Sunidhi Chauhan, Salim-Sulaiman",
        demographics: "85% student youth, 15% corporate",
        opportunityScore: 92,
        layoutMapUrl: null,
        bannerUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200",
        defaultStallPrice: 32000.0,
        mapDimensions: JSON.stringify({ width: 800, height: 500 }),
        published: true,
      }
    });

    const rd26Stalls = [
      {
        stallNumber: "R1",
        dimensions: "10x10",
        basePrice: 30000,
        publicPrice: 38000,
        commissionAmount: 8000,
        status: "AVAILABLE",
        coordinates: JSON.stringify({ type: "rect", x: 100, y: 100, w: 80, h: 80 }),
        expectedTraffic: 8.2,
        visibilityScore: 8.0,
        minSales: 80000,
        maxSales: 120000
      }
    ];
    for (const stall of rd26Stalls) {
      await prisma.stall.create({
        data: {
          festivalId: rd26.id,
          festivalName: rd26.name,
          ...stall
        }
      });
    }

    // Seed Festival 5: Rendezvous '25 (Past)
    const rd25 = await prisma.festival.create({
      data: {
        organizerId: organizer.id,
        name: "Rendezvous '25",
        collegeName: "IIT Delhi",
        location: "Hauz Khas, New Delhi",
        startDate: new Date("2025-10-15"),
        endDate: new Date("2025-10-18"),
        expectedFootfall: 75000,
        artistLineup: "Jubin Nautiyal, Ritviz",
        demographics: "80% student youth, 20% others",
        opportunityScore: 90,
        layoutMapUrl: null,
        bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200",
        defaultStallPrice: 30000.0,
        mapDimensions: JSON.stringify({ width: 800, height: 500 }),
        published: true,
      }
    });

    const rd25Stalls = [
      {
        stallNumber: "R1",
        dimensions: "10x10",
        basePrice: 28000,
        publicPrice: 35000,
        commissionAmount: 7000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 100, y: 100, w: 80, h: 80 }),
        expectedTraffic: 8.0,
        visibilityScore: 7.9,
        minSales: 120000,
        maxSales: 180000
      },
      {
        stallNumber: "R2",
        dimensions: "10x10",
        basePrice: 28000,
        publicPrice: 35000,
        commissionAmount: 7000,
        status: "AVAILABLE",
        coordinates: JSON.stringify({ type: "rect", x: 200, y: 100, w: 80, h: 80 }),
        expectedTraffic: 7.2,
        visibilityScore: 7.0,
        minSales: 80000,
        maxSales: 110000
      },
      {
        stallNumber: "R3",
        dimensions: "10x10",
        basePrice: 30000,
        publicPrice: 38000,
        commissionAmount: 8000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 300, y: 100, w: 80, h: 80 }),
        expectedTraffic: 8.5,
        visibilityScore: 8.2,
        minSales: 140000,
        maxSales: 210000
      },
      {
        stallNumber: "R4",
        dimensions: "10x10",
        basePrice: 25000,
        publicPrice: 32000,
        commissionAmount: 7000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 100, y: 200, w: 80, h: 80 }),
        expectedTraffic: 7.8,
        visibilityScore: 7.5,
        minSales: 105000,
        maxSales: 155000
      },
      {
        stallNumber: "S1",
        dimensions: "12x12",
        basePrice: 35000,
        publicPrice: 42000,
        commissionAmount: 7000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 200, y: 200, w: 90, h: 90 }),
        expectedTraffic: 9.0,
        visibilityScore: 8.8,
        minSales: 170000,
        maxSales: 260000
      },
      {
        stallNumber: "S2",
        dimensions: "10x10",
        basePrice: 24000,
        publicPrice: 30000,
        commissionAmount: 6000,
        status: "AVAILABLE",
        coordinates: JSON.stringify({ type: "rect", x: 310, y: 200, w: 80, h: 80 }),
        expectedTraffic: 6.8,
        visibilityScore: 6.5,
        minSales: 70000,
        maxSales: 100000
      }
    ];
    for (const stall of rd25Stalls) {
      const createdStall = await prisma.stall.create({
        data: {
          festivalId: rd25.id,
          festivalName: rd25.name,
          ...stall
        }
      });
      if (stall.status === "BOOKED") {
        await prisma.booking.create({
          data: {
            festivalId: rd25.id,
            vendorId: vendor.id,
            stallId: createdStall.id,
            status: "PAID",
            finalPrice: stall.publicPrice,
            contractUrl: "/contracts/mock_mou.pdf"
          }
        });
      }
    }

    const rd25Reviews = [
      {
        festivalId: rd25.id,
        festivalName: rd25.name,
        userId: organizer.id,
        userName: "IIT Delhi Rendezvous Committee",
        role: "ORGANIZER",
        rating: 5,
        comment: "Excellent experience. Stalls were managed fully online. Footfall was 75k+."
      },
      {
        festivalId: rd25.id,
        festivalName: rd25.name,
        userId: vendor.id,
        userName: "Chaayos Teas Ltd",
        role: "VENDOR",
        rating: 4,
        comment: "Generated good ROI, traffic estimate of 8.0 was very close to actual."
      }
    ];
    for (const rev of rd25Reviews) {
      await prisma.review.create({
        data: rev
      });
    }

    // Seed Festival 6: Oasis '25 (Past)
    const oasis25 = await prisma.festival.create({
      data: {
        organizerId: organizer.id,
        name: "Oasis '25",
        collegeName: "BITS Pilani",
        location: "Pilani, Rajasthan",
        startDate: new Date("2025-10-24"),
        endDate: new Date("2025-10-28"),
        expectedFootfall: 42000,
        artistLineup: "Nucleya, Zaeden",
        demographics: "90% student youth, 10% others",
        opportunityScore: 87,
        layoutMapUrl: null,
        bannerUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200",
        defaultStallPrice: 28000.0,
        mapDimensions: JSON.stringify({ width: 800, height: 500 }),
        published: true,
      }
    });

    const oasis25Stalls = [
      {
        stallNumber: "O1",
        dimensions: "10x10",
        basePrice: 25000,
        publicPrice: 32000,
        commissionAmount: 7000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 100, y: 100, w: 80, h: 80 }),
        expectedTraffic: 7.9,
        visibilityScore: 8.0,
        minSales: 90000,
        maxSales: 130000
      },
      {
        stallNumber: "O2",
        dimensions: "10x10",
        basePrice: 22000,
        publicPrice: 28000,
        commissionAmount: 6000,
        status: "AVAILABLE",
        coordinates: JSON.stringify({ type: "rect", x: 200, y: 100, w: 80, h: 80 }),
        expectedTraffic: 7.0,
        visibilityScore: 7.2,
        minSales: 70000,
        maxSales: 105000
      },
      {
        stallNumber: "O3",
        dimensions: "10x10",
        basePrice: 28000,
        publicPrice: 35000,
        commissionAmount: 7000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 300, y: 100, w: 80, h: 80 }),
        expectedTraffic: 8.2,
        visibilityScore: 8.0,
        minSales: 110000,
        maxSales: 155000
      },
      {
        stallNumber: "O4",
        dimensions: "10x10",
        basePrice: 24000,
        publicPrice: 30000,
        commissionAmount: 6000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 100, y: 200, w: 80, h: 80 }),
        expectedTraffic: 7.5,
        visibilityScore: 7.4,
        minSales: 85000,
        maxSales: 125000
      },
      {
        stallNumber: "P1",
        dimensions: "12x12",
        basePrice: 32000,
        publicPrice: 40000,
        commissionAmount: 8000,
        status: "BOOKED",
        coordinates: JSON.stringify({ type: "rect", x: 200, y: 200, w: 90, h: 90 }),
        expectedTraffic: 8.8,
        visibilityScore: 8.5,
        minSales: 130000,
        maxSales: 190000
      },
      {
        stallNumber: "P2",
        dimensions: "10x10",
        basePrice: 20000,
        publicPrice: 26000,
        commissionAmount: 6000,
        status: "AVAILABLE",
        coordinates: JSON.stringify({ type: "rect", x: 310, y: 200, w: 80, h: 80 }),
        expectedTraffic: 6.5,
        visibilityScore: 6.2,
        minSales: 60000,
        maxSales: 90000
      }
    ];
    for (const stall of oasis25Stalls) {
      const createdStall = await prisma.stall.create({
        data: {
          festivalId: oasis25.id,
          ...stall
        }
      });
      if (stall.status === "BOOKED") {
        await prisma.booking.create({
          data: {
            festivalId: oasis25.id,
            vendorId: vendor.id,
            stallId: createdStall.id,
            status: "PAID",
            finalPrice: stall.publicPrice,
            contractUrl: "/contracts/mock_mou.pdf"
          }
        });
      }
    }

    const oasis25Reviews = [
      {
        festivalId: oasis25.id,
        festivalName: oasis25.name,
        userId: vendor.id,
        userName: "Chaayos Teas Ltd",
        role: "VENDOR",
        rating: 5,
        comment: "Loved the crowd response. Ground Zero made checkout and security booking seamless."
      }
    ];
    for (const rev of oasis25Reviews) {
      await prisma.review.create({
        data: rev
      });
    }

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}
