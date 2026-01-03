import {
  PrismaClient,
  UserRole,
  ContentStatus,
  PrayerStatus,
  PrayerCategory,
  PrayerPriority,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🧹 Cleaning existing data...");
  await prisma.sermon.deleteMany({});
  await prisma.prayerRequest.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.calendarEvent.deleteMany({});
  await prisma.user.deleteMany({});

  // Create Users (passwords stored as plain text per user request)
  console.log("👥 Creating users...");

  const admin = await prisma.user.create({
    data: {
      email: "admin@tenthave.com",
      passwordHash: "admin123", // Plain text password
      name: "Admin User",
      role: UserRole.ADMIN,
      isActive: true,
      isApproved: true, // Admins are auto-approved
    },
  });

  const member1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      passwordHash: "member123", // Plain text password
      name: "John Smith",
      role: UserRole.MEMBER,
      isActive: true,
      isApproved: true, // Approved member - can view prayer requests
    },
  });

  const member2 = await prisma.user.create({
    data: {
      email: "mary@example.com",
      passwordHash: "member123", // Plain text password
      name: "Mary Johnson",
      role: UserRole.MEMBER,
      isActive: true,
      isApproved: false, // Unapproved member - pending admin approval
    },
  });

  const guest = await prisma.user.create({
    data: {
      email: "guest@example.com",
      passwordHash: "guest123", // Plain text password
      name: "Guest User",
      role: UserRole.GUEST,
      isActive: true,
      isApproved: false, // Guest user - not approved
    },
  });

  console.log("✅ Created users:", [admin.email, member1.email, member2.email, guest.email]);

  // Create Announcements
  console.log("📢 Creating announcements...");
  const announcements = await Promise.all([
    prisma.announcement.create({
      data: {
        title: "Welcome to Our Church Family!",
        content:
          "We're excited to announce the launch of our new church website and member portal. You can now access sermons, events, and submit prayer requests online.",
        category: "general",
        priority: "high",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        pinned: true,
        publishedAt: new Date("2024-01-01"),
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Mission Trip to Guatemala - Sign Up Now!",
        content:
          "Join us for our annual mission trip to Guatemala from February 15-22, 2024. We'll be working with local communities to build homes and share the Gospel. Sign up at the church office.",
        category: "missions",
        priority: "high",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        pinned: false,
        publishedAt: new Date("2024-01-01"),
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-02-10"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "New Bible Study Series Starting",
        content:
          "Join us for a 12-week study on the Book of Romans. Wednesdays at 7:00 PM in the Fellowship Hall. All are welcome!",
        category: "ministry",
        priority: "normal",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        pinned: false,
        publishedAt: new Date("2024-01-15"),
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-04-30"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Building Maintenance Schedule",
        content:
          "Our sanctuary will be closed for maintenance on February 1st. Services will be held in the fellowship hall that day.",
        category: "general",
        priority: "normal",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-01-25"),
        endDate: new Date("2024-02-01"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Easter Sunday Service - Special Celebration",
        content:
          "Join us for our special Easter Sunday service on March 31st at 10:00 AM. We'll have a special message, music, and a community breakfast following the service. All are welcome!",
        category: "worship",
        priority: "high",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-03-15"),
        endDate: new Date("2024-03-31"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Women's Ministry Spring Retreat",
        content:
          "Ladies, mark your calendars for our annual Spring Retreat on April 12-14 at the Mountain View Retreat Center. Registration opens March 1st. Contact Sarah Johnson for more information.",
        category: "ministry",
        priority: "normal",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-02-15"),
        endDate: new Date("2024-04-05"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Men's Breakfast Fellowship",
        content:
          "Join us for our monthly Men's Breakfast on the first Saturday of each month at 8:00 AM in the Fellowship Hall. Great food, fellowship, and Bible study. No registration required.",
        category: "ministry",
        priority: "normal",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Children's Sunday School Registration",
        content:
          "Registration for our Children's Sunday School program is now open! Classes available for ages 3-12. Please register your children at the welcome desk or online. Classes begin January 14th.",
        category: "ministry",
        priority: "normal",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-13"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Community Food Drive - Help Needed",
        content:
          "We're collecting non-perishable food items for our local food pantry. Drop off donations in the collection bins in the lobby. Most needed items: canned goods, pasta, rice, and cereal. Thank you for your generosity!",
        category: "outreach",
        priority: "normal",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-02-29"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Prayer Meeting - Every Tuesday Evening",
        content:
          "Join us for our weekly prayer meeting every Tuesday at 7:00 PM in the Prayer Room. We pray for our church, community, and world. All are welcome to join us in prayer.",
        category: "ministry",
        priority: "normal",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Youth Summer Camp Registration Open",
        content:
          "Registration is now open for our annual Youth Summer Camp, July 15-20. Open to students entering 6th-12th grade. Early bird pricing available until May 1st. Contact Pastor Mike for details.",
        category: "youth",
        priority: "high",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-06-15"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "New Member Orientation Class",
        content:
          "Interested in becoming a member? Join us for our New Member Orientation on the first Sunday of each month at 9:00 AM. Learn about our church history, beliefs, and how to get involved.",
        category: "general",
        priority: "normal",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Christmas Eve Candlelight Service",
        content:
          "Join us for our beautiful Christmas Eve Candlelight Service on December 24th at 7:00 PM. Special music, message, and candlelight ceremony. Childcare provided for ages 0-3.",
        category: "worship",
        priority: "high",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-12-01"),
        endDate: new Date("2024-12-24"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Volunteer Appreciation Dinner",
        content:
          "We want to thank all our amazing volunteers! Join us for a special appreciation dinner on March 15th at 6:00 PM. Please RSVP by March 8th. Your service to our church family is deeply appreciated.",
        category: "general",
        priority: "normal",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-02-20"),
        endDate: new Date("2024-03-08"),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Financial Stewardship Update",
        content:
          "Thank you for your faithful giving! We're pleased to share that we've reached 85% of our annual budget goal. Your generosity enables us to serve our community and support missions worldwide.",
        category: "general",
        priority: "normal",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-06-30"),
      },
    }),
  ]);

  console.log(`✅ Created ${announcements.length} announcements`);

  // Create Calendar Events
  console.log("📅 Creating calendar events...");
  const today = new Date();
  const events = await Promise.all([
    prisma.calendarEvent.create({
      data: {
        title: "Sunday Worship Service",
        description: "Join us for worship, prayer, and Bible teaching",
        startDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 7,
          10,
          0
        ),
        endDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 7,
          12,
          0
        ),
        isAllDay: false,
        location: "Main Sanctuary",
        category: "worship",
        color: "#3B82F6",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Wednesday Night Bible Study",
        description: "Study of the Book of Romans",
        startDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 3,
          19,
          0
        ),
        endDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 3,
          20,
          30
        ),
        isAllDay: false,
        location: "Fellowship Hall",
        category: "study",
        color: "#10B981",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Youth Group Meeting",
        description: "Games, fellowship, and Bible study for teens",
        startDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 5,
          18,
          30
        ),
        endDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 5,
          20,
          30
        ),
        isAllDay: false,
        location: "Youth Room",
        category: "youth",
        color: "#F59E0B",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Prayer Meeting",
        description:
          "Weekly prayer meeting for church, community, and missions",
        startDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 2,
          18,
          30
        ),
        endDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 2,
          19,
          30
        ),
        isAllDay: false,
        location: "Prayer Room",
        category: "prayer",
        color: "#8B5CF6",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
      },
    }),
    prisma.calendarEvent.create({
      data: {
        title: "Men's Breakfast Fellowship",
        description: "Breakfast and fellowship for men of the church",
        startDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 6,
          8,
          0
        ),
        endDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 6,
          10,
          0
        ),
        isAllDay: false,
        location: "Church Kitchen",
        category: "fellowship",
        color: "#06B6D4",
        status: ContentStatus.PUBLISHED,
        isPublic: true,
      },
    }),
  ]);

  console.log(`✅ Created ${events.length} calendar events`);

  // Create Sermons - Extensive fake data with multiple series
  console.log("🎤 Creating sermons...");

  const sermonData = [
    // Bigger Than Us Series (12 sermons)
    {
      title: "BEST IS YET TO COME",
      subtitle: "A Future Bigger Than Us",
      passage: "Hebrews 11:8-10",
      speaker: "Finu type",
      date: "2025-06-01",
      series: "Bigger Than Us",
    },
    {
      title: "LIVE A BIGGER STORY",
      subtitle: "A Story That's Bigger Than Us",
      passage: "Ephesians 2:10",
      speaker: "Finu type",
      date: "2025-05-04",
      series: "Bigger Than Us",
    },
    {
      title: "NOTHING IS TOO BIG",
      subtitle: "A God Who's Bigger than Us",
      passage: "Jeremiah 32:27",
      speaker: "Finu type",
      date: "2025-05-11",
      series: "Bigger Than Us",
    },
    {
      title: "THIS IS WHY WE GO",
      subtitle: "A Mission Bigger Than Us",
      passage: "Matthew 28:19-20",
      speaker: "Chris de Mony",
      date: "2025-05-18",
      series: "Bigger Than Us",
    },
    {
      title: "LEGACY STARTS NOW",
      subtitle: "A Legacy Bigger Than Us",
      passage: "2 Timothy 2:2",
      speaker: "Finu lypa",
      date: "2025-05-25",
      series: "Bigger Than Us",
    },
    {
      title: "FAITH BEYOND FEAR",
      subtitle: "Trusting in God's Plan",
      passage: "Proverbs 3:5-6",
      speaker: "Finu type",
      date: "2025-06-08",
      series: "Bigger Than Us",
    },
    {
      title: "HOPE IN THE DARKNESS",
      subtitle: "Finding Light in Difficult Times",
      passage: "Psalm 23:4",
      speaker: "Chris de Mony",
      date: "2025-06-15",
      series: "Bigger Than Us",
    },
    {
      title: "LOVE WITHOUT LIMITS",
      subtitle: "God's Unconditional Love",
      passage: "Romans 8:38-39",
      speaker: "Finu lypa",
      date: "2025-06-22",
      series: "Bigger Than Us",
    },
    {
      title: "GRACE THAT TRANSFORMS",
      subtitle: "The Power of God's Grace",
      passage: "Ephesians 2:8-9",
      speaker: "Finu lype",
      date: "2025-06-29",
      series: "Bigger Than Us",
    },
    {
      title: "PURPOSE IN THE PAIN",
      subtitle: "Finding Meaning in Suffering",
      passage: "Romans 8:28",
      speaker: "Finu type",
      date: "2025-07-06",
      series: "Bigger Than Us",
    },
    {
      title: "VICTORY IN CHRIST",
      subtitle: "Overcoming Through Faith",
      passage: "1 Corinthians 15:57",
      speaker: "Chris de Mony",
      date: "2025-07-13",
      series: "Bigger Than Us",
    },
    {
      title: "ETERNAL PERSPECTIVE",
      subtitle: "Living for What Matters Most",
      passage: "Colossians 3:2",
      speaker: "Finu lypa",
      date: "2025-07-20",
      series: "Bigger Than Us",
    },

    // Relationships Anonymous Series (4 sermons)
    {
      title: "LOVE WITHOUT CONDITIONS",
      subtitle: "Building Healthy Relationships",
      passage: "1 Corinthians 13:4-7",
      speaker: "Pastor John",
      date: "2025-04-15",
      series: "Relationships Anonymous",
    },
    {
      title: "FORGIVENESS FIRST",
      subtitle: "The Foundation of Strong Relationships",
      passage: "Ephesians 4:32",
      speaker: "Pastor John",
      date: "2025-04-22",
      series: "Relationships Anonymous",
    },
    {
      title: "COMMUNITY MATTERS",
      subtitle: "Finding Your People",
      passage: "Hebrews 10:24-25",
      speaker: "Pastor Sarah",
      date: "2025-04-29",
      series: "Relationships Anonymous",
    },
    {
      title: "BOUNDARIES & BALANCE",
      subtitle: "Healthy Limits in Relationships",
      passage: "Proverbs 25:17",
      speaker: "Pastor John",
      date: "2025-05-06",
      series: "Relationships Anonymous",
    },

    // Romans Series (11 sermons)
    {
      title: "Introduction to Romans",
      subtitle: "The Gospel of God",
      passage: "Romans 1:1-17",
      speaker: "Pastor John Smith",
      date: "2024-01-21",
      series: "Romans",
    },
    {
      title: "The Wrath of God",
      subtitle: "God's Righteous Judgment",
      passage: "Romans 1:18-32",
      speaker: "Pastor John Smith",
      date: "2024-01-28",
      series: "Romans",
    },
    {
      title: "The Righteousness of God",
      subtitle: "Justification by Faith",
      passage: "Romans 3:21-26",
      speaker: "Pastor John Smith",
      date: "2024-02-04",
      series: "Romans",
    },
    {
      title: "Abraham's Faith",
      subtitle: "The Father of Faith",
      passage: "Romans 4:1-25",
      speaker: "Pastor John Smith",
      date: "2024-02-11",
      series: "Romans",
    },
    {
      title: "Peace with God",
      subtitle: "Reconciled Through Christ",
      passage: "Romans 5:1-11",
      speaker: "Pastor John Smith",
      date: "2024-02-18",
      series: "Romans",
    },
    {
      title: "Dead to Sin, Alive in Christ",
      subtitle: "The New Life",
      passage: "Romans 6:1-14",
      speaker: "Pastor John Smith",
      date: "2024-02-25",
      series: "Romans",
    },
    {
      title: "The Law and Sin",
      subtitle: "Struggling with Sin",
      passage: "Romans 7:7-25",
      speaker: "Pastor John Smith",
      date: "2024-03-04",
      series: "Romans",
    },
    {
      title: "Life in the Spirit",
      subtitle: "Walking by the Spirit",
      passage: "Romans 8:1-17",
      speaker: "Pastor John Smith",
      date: "2024-03-11",
      series: "Romans",
    },
    {
      title: "More Than Conquerors",
      subtitle: "Victory in Christ",
      passage: "Romans 8:28-39",
      speaker: "Pastor John Smith",
      date: "2024-03-18",
      series: "Romans",
    },
    {
      title: "God's Sovereign Choice",
      subtitle: "Election and Predestination",
      passage: "Romans 9:1-33",
      speaker: "Pastor John Smith",
      date: "2024-03-25",
      series: "Romans",
    },
    {
      title: "A Living Sacrifice",
      subtitle: "Practical Christian Living",
      passage: "Romans 12:1-2",
      speaker: "Pastor John Smith",
      date: "2024-04-01",
      series: "Romans",
    },

    // Follow Me Series (4 sermons)
    {
      title: "The Call to Follow",
      subtitle: "Leaving Everything Behind",
      passage: "Matthew 4:18-22",
      speaker: "Pastor John Smith",
      date: "2024-04-08",
      series: "Follow Me",
    },
    {
      title: "Counting the Cost",
      subtitle: "What It Means to Follow",
      passage: "Luke 14:25-33",
      speaker: "Pastor John Smith",
      date: "2024-04-15",
      series: "Follow Me",
    },
    {
      title: "The Narrow Path",
      subtitle: "Following in His Steps",
      passage: "Matthew 7:13-14",
      speaker: "Pastor John Smith",
      date: "2024-04-22",
      series: "Follow Me",
    },
    {
      title: "The Reward of Following",
      subtitle: "Eternal Life",
      passage: "Matthew 19:27-30",
      speaker: "Pastor John Smith",
      date: "2024-04-29",
      series: "Follow Me",
    },

    // A Great Light Series (3 sermons)
    {
      title: "Light in the Darkness",
      subtitle: "The Coming of the Light",
      passage: "Isaiah 9:2",
      speaker: "Pastor John Smith",
      date: "2024-12-15",
      series: "A Great Light",
    },
    {
      title: "Walking in the Light",
      subtitle: "Living as Children of Light",
      passage: "Ephesians 5:8-14",
      speaker: "Pastor John Smith",
      date: "2024-12-22",
      series: "A Great Light",
    },
    {
      title: "The Light of the World",
      subtitle: "Shining Your Light",
      passage: "Matthew 5:14-16",
      speaker: "Pastor John Smith",
      date: "2024-12-29",
      series: "A Great Light",
    },

    // The Exodus Series (8 sermons)
    {
      title: "The Call of Moses",
      subtitle: "God's Plan Revealed",
      passage: "Exodus 3:1-10",
      speaker: "Pastor John Smith",
      date: "2024-05-06",
      series: "The Exodus",
    },
    {
      title: "The Plagues of Egypt",
      subtitle: "God's Power Displayed",
      passage: "Exodus 7:14-11:10",
      speaker: "Pastor John Smith",
      date: "2024-05-13",
      series: "The Exodus",
    },
    {
      title: "The Passover",
      subtitle: "Salvation Through Blood",
      passage: "Exodus 12:1-30",
      speaker: "Pastor John Smith",
      date: "2024-05-20",
      series: "The Exodus",
    },
    {
      title: "Crossing the Red Sea",
      subtitle: "Deliverance from Bondage",
      passage: "Exodus 14:1-31",
      speaker: "Pastor John Smith",
      date: "2024-05-27",
      series: "The Exodus",
    },
    {
      title: "Water from the Rock",
      subtitle: "God Provides",
      passage: "Exodus 17:1-7",
      speaker: "Pastor John Smith",
      date: "2024-06-03",
      series: "The Exodus",
    },
    {
      title: "The Ten Commandments",
      subtitle: "God's Law",
      passage: "Exodus 20:1-17",
      speaker: "Pastor John Smith",
      date: "2024-06-10",
      series: "The Exodus",
    },
    {
      title: "The Golden Calf",
      subtitle: "The Danger of Idolatry",
      passage: "Exodus 32:1-35",
      speaker: "Pastor John Smith",
      date: "2024-06-17",
      series: "The Exodus",
    },
    {
      title: "The Tabernacle",
      subtitle: "God's Presence",
      passage: "Exodus 25:1-9",
      speaker: "Pastor John Smith",
      date: "2024-06-24",
      series: "The Exodus",
    },

    // Beyond Series (6 sermons)
    {
      title: "Beyond Our Understanding",
      subtitle: "God's Ways Are Higher",
      passage: "Isaiah 55:8-9",
      speaker: "Pastor John Smith",
      date: "2024-07-01",
      series: "Beyond",
    },
    {
      title: "Beyond Our Strength",
      subtitle: "God's Power in Weakness",
      passage: "2 Corinthians 12:9-10",
      speaker: "Pastor John Smith",
      date: "2024-07-08",
      series: "Beyond",
    },
    {
      title: "Beyond Our Expectations",
      subtitle: "More Than We Can Imagine",
      passage: "Ephesians 3:20-21",
      speaker: "Pastor John Smith",
      date: "2024-07-15",
      series: "Beyond",
    },
    {
      title: "Beyond This Life",
      subtitle: "Eternal Perspective",
      passage: "2 Corinthians 4:16-18",
      speaker: "Pastor John Smith",
      date: "2024-07-22",
      series: "Beyond",
    },
    {
      title: "Beyond Our Sins",
      subtitle: "Forgiveness and Redemption",
      passage: "Psalm 103:12",
      speaker: "Pastor John Smith",
      date: "2024-07-29",
      series: "Beyond",
    },
    {
      title: "Beyond Our Dreams",
      subtitle: "God's Perfect Plan",
      passage: "Jeremiah 29:11",
      speaker: "Pastor John Smith",
      date: "2024-08-05",
      series: "Beyond",
    },

    // Recapturing Humanity Series (7 sermons)
    {
      title: "Created in God's Image",
      subtitle: "Our True Identity",
      passage: "Genesis 1:26-27",
      speaker: "Pastor John Smith",
      date: "2024-08-12",
      series: "Recapturing Humanity",
    },
    {
      title: "The Fall of Man",
      subtitle: "What Went Wrong",
      passage: "Genesis 3:1-24",
      speaker: "Pastor John Smith",
      date: "2024-08-19",
      series: "Recapturing Humanity",
    },
    {
      title: "Restored Through Christ",
      subtitle: "New Creation",
      passage: "2 Corinthians 5:17",
      speaker: "Pastor John Smith",
      date: "2024-08-26",
      series: "Recapturing Humanity",
    },
    {
      title: "Living as Image Bearers",
      subtitle: "Reflecting God's Character",
      passage: "Colossians 3:10",
      speaker: "Pastor John Smith",
      date: "2024-09-02",
      series: "Recapturing Humanity",
    },
    {
      title: "The Value of Every Person",
      subtitle: "Dignity and Worth",
      passage: "Psalm 139:13-16",
      speaker: "Pastor John Smith",
      date: "2024-09-09",
      series: "Recapturing Humanity",
    },
    {
      title: "Loving Our Neighbor",
      subtitle: "The Second Greatest Commandment",
      passage: "Matthew 22:39",
      speaker: "Pastor John Smith",
      date: "2024-09-16",
      series: "Recapturing Humanity",
    },
    {
      title: "The Hope of Glory",
      subtitle: "Future Restoration",
      passage: "Romans 8:18-25",
      speaker: "Pastor John Smith",
      date: "2024-09-23",
      series: "Recapturing Humanity",
    },

    // Additional standalone sermons
    {
      title: "The Grace of God",
      subtitle: "Exploring the depth and power of God's amazing grace",
      passage: "Ephesians 2:8-9",
      speaker: "Pastor John Smith",
      date: "2024-01-14",
      series: "Foundations of Faith",
    },
    {
      title: "Walking by Faith",
      subtitle: "What it means to live a life of faith",
      passage: "2 Corinthians 5:7",
      speaker: "Pastor John Smith",
      date: "2024-01-07",
      series: "Foundations of Faith",
    },
    {
      title: "The Power of Prayer",
      subtitle: "Understanding prayer as our direct line to God",
      passage: "James 5:16",
      speaker: "Elder Mary Johnson",
      date: "2023-12-31",
      series: "Spiritual Disciplines",
    },
    {
      title: "Love One Another",
      subtitle: "Christ's command to love",
      passage: "John 13:34-35",
      speaker: "Pastor John Smith",
      date: "2023-12-24",
      series: "The Heart of Christianity",
    },
    {
      title: "Hope in Difficult Times",
      subtitle: "Finding hope and strength",
      passage: "Romans 15:13",
      speaker: "Rev. Dr. Sarah Williams",
      date: "2023-12-17",
      series: null,
    },
  ];

  const sermons = await Promise.all(
    sermonData.map((sermon) =>
      prisma.sermon.create({
        data: {
          title: sermon.title,
          description: sermon.subtitle,
          speaker: sermon.speaker,
          date: new Date(sermon.date),
          passage: sermon.passage,
          series: sermon.series,
          videoUrl: `https://youtube.com/watch?v=${sermon.title
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
          audioUrl: `https://example.com/audio/${sermon.title
            .toLowerCase()
            .replace(/\s+/g, "-")}.mp3`,
          thumbnail: "/assets/sermonCardImg.svg",
          status: ContentStatus.PUBLISHED,
          isPublic: true,
          isFeatured:
            sermon.title.includes("BEST IS YET TO COME") ||
            sermon.title.includes("The Grace of God"),
        },
      })
    )
  );

  console.log(`✅ Created ${sermons.length} sermons`);

  // Create Prayer Requests
  console.log("🙏 Creating prayer requests...");
  const prayerRequests = await Promise.all([
    prisma.prayerRequest.create({
      data: {
        title: "Healing for Sarah",
        description:
          "Please pray for Sarah who is undergoing surgery next week. Pray for successful surgery and quick recovery.",
        requester: "John Smith",
        category: PrayerCategory.HEALTH,
        priority: PrayerPriority.URGENT,
        status: PrayerStatus.APPROVED,
        isPrivate: false,
        isAnswered: false,
      },
    }),
    prisma.prayerRequest.create({
      data: {
        title: "Mission Trip Safety",
        description:
          "Pray for our mission team traveling to Guatemala. Pray for safety, health, and open hearts in the communities we serve.",
        requester: "Mary Johnson",
        category: PrayerCategory.COMMUNITY,
        priority: PrayerPriority.HIGH,
        status: PrayerStatus.APPROVED,
        isPrivate: false,
        isAnswered: false,
      },
    }),
    prisma.prayerRequest.create({
      data: {
        title: "Job Search Guidance",
        description:
          "Seeking prayers for guidance and favor as I search for new employment opportunities.",
        requester: "Anonymous",
        category: PrayerCategory.WORK,
        priority: PrayerPriority.NORMAL,
        status: PrayerStatus.APPROVED,
        isPrivate: false,
        isAnswered: false,
      },
    }),
    prisma.prayerRequest.create({
      data: {
        title: "Family Reconciliation",
        description:
          "Pray for healing and restoration in a family experiencing conflict.",
        requester: null,
        category: PrayerCategory.FAMILY,
        priority: PrayerPriority.HIGH,
        status: PrayerStatus.APPROVED,
        isPrivate: true,
        isAnswered: false,
      },
    }),
    prisma.prayerRequest.create({
      data: {
        title: "Spiritual Growth",
        description:
          "Please pray for our church family to grow deeper in faith and love for God and one another.",
        requester: "Pastor John",
        category: PrayerCategory.SPIRITUAL,
        priority: PrayerPriority.NORMAL,
        status: PrayerStatus.APPROVED,
        isPrivate: false,
        isAnswered: false,
      },
    }),
    prisma.prayerRequest.create({
      data: {
        title: "New Baby",
        description:
          "Thank you for your prayers! Our baby was born healthy. Praise God!",
        requester: "The Johnson Family",
        category: PrayerCategory.FAMILY,
        priority: PrayerPriority.NORMAL,
        status: PrayerStatus.ANSWERED,
        isPrivate: false,
        isAnswered: true,
        answeredAt: new Date(),
        answerNotes: "Baby born healthy on January 5th!",
      },
    }),
  ]);

  console.log(`✅ Created ${prayerRequests.length} prayer requests`);

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📋 Summary:");
  console.log(`   - Users: 4 (1 admin, 2 members, 1 guest)`);
  console.log(`   - Announcements: ${announcements.length}`);
  console.log(`   - Calendar Events: ${events.length}`);
  console.log(`   - Sermons: ${sermons.length}`);
  console.log(`   - Prayer Requests: ${prayerRequests.length}`);
  console.log("\n🔐 Test Credentials:");
  console.log("   Admin (approved): admin@tenthave.com / admin123");
  console.log("   Member (approved): john@example.com / member123");
  console.log("   Member (pending): mary@example.com / member123");
  console.log("   Guest (pending): guest@example.com / guest123");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
