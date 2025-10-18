import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // ============================================================================
  // CREATE ADMIN USER
  // ============================================================================

  const adminPassword = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@10thavebiblechapel.com" },
    update: {},
    create: {
      email: "admin@10thavebiblechapel.com",
      passwordHash: adminPassword,
      name: "Church Administrator",
      role: "ADMIN",
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log("✅ Admin user created:", adminUser.email);

  // ============================================================================
  // CREATE SAMPLE MEMBER USER
  // ============================================================================

  const memberPassword = await bcrypt.hash("member123", 12);
  const memberUser = await prisma.user.upsert({
    where: { email: "member@10thavebiblechapel.com" },
    update: {},
    create: {
      email: "member@10thavebiblechapel.com",
      passwordHash: memberPassword,
      name: "John Doe",
      role: "MEMBER",
      phone: "+1 (604) 123-4567",
      address: "123 Main St, Burnaby, BC",
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log("✅ Member user created:", memberUser.email);

  // ============================================================================
  // CREATE SERVICES
  // ============================================================================

  const services = [
    {
      name: "BREAKING OF BREAD",
      description:
        "Join us for our weekly breaking of bread service where we remember the Lord's death and resurrection.",
      icon: "/assets/prayingiconround.svg",
      type: "WEEKLY",
      isActive: true,
      order: 1,
      dayOfWeek: "Sunday",
      startTime: "9:30 AM",
      endTime: "10:30 AM",
      zoomLink:
        "https://us02web.zoom.us/j/6042227777?pwd=R2tDVy92NGlsWVkyb1BEendaRllPQT09",
    },
    {
      name: "FAMILY BIBLE HOUR",
      description: "A time for family Bible study and fellowship together.",
      icon: "/assets/bible.svg",
      type: "WEEKLY",
      isActive: true,
      order: 2,
      dayOfWeek: "Sunday",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      zoomLink:
        "https://us02web.zoom.us/j/6042227777?pwd=R2tDVy92NGlsWVkyb1BEendaRllPQT09",
    },
    {
      name: "ESTUDIO BÍBLICO",
      description: "Spanish Bible study for our Spanish-speaking community.",
      icon: "/assets/breakingofbread.svg",
      type: "WEEKLY",
      isActive: true,
      order: 3,
      dayOfWeek: "Sunday",
      startTime: "12:30 PM",
      endTime: "1:30 PM",
      zoomLink:
        "https://us02web.zoom.us/j/6042227777?pwd=R2tDVy92NGlsWVkyb1BEendaRllPQT09",
    },
  ];

  await prisma.service.createMany({
    data: services as any,
    skipDuplicates: true,
  });

  console.log("✅ Services created");

  // ============================================================================
  // CREATE MINISTRIES
  // ============================================================================

  const ministries = [
    {
      name: "SUNDAY SCHOOL CLASS",
      description:
        "Weekly kids club, Sundays from 11:30 am to 12:30 pm, for children ages 8 through 14.",
      icon: "/assets/sundaySchool.png",
      isActive: true,
      order: 1,
      schedule: "Sundays 11:30 AM - 12:30 PM",
      location: "Main Hall",
      ageRange: "Ages 8-14",
    },
    {
      name: "SPANISH BIBLE STUDY",
      description: "Weekly Spanish Bible study for adults and families.",
      icon: "/assets/spanishBible.png",
      isActive: true,
      order: 2,
      schedule: "Sundays 12:30 PM - 1:30 PM",
      location: "Room 101",
      ageRange: "Adults",
    },
    {
      name: "ESL (CANCELLED)",
      description: "English as a Second Language classes - currently on hold.",
      icon: "/assets/ESL.png",
      isActive: false,
      order: 3,
      schedule: "Temporarily suspended",
      location: "TBD",
      ageRange: "Adults",
    },
  ];

  await prisma.ministry.createMany({
    data: ministries as any,
    skipDuplicates: true,
  });

  console.log("✅ Ministries created");

  // ============================================================================
  // CREATE ABOUT SECTIONS
  // ============================================================================

  const aboutSections = [
    {
      title: "Who We Are",
      content: `
        <p>We believe in a personal God, who cares for all men, offering forgiveness and a fulfilling life through faith in the Lord Jesus. No matter one's past, or who we might be, we know that Jesus came to offer hope and salvation to all. Jesus said:</p>
        
        <blockquote>
          "Come to me, all who labor and are heavy laden, and I will give you rest."
          <cite>— <strong>Matthew 11:28</strong></cite>
        </blockquote>
        
        <p>As a small church, with almost 100 years of history and having been directly involved in missionary work around the world, we warmly welcome young and old, rich and poor—not to join a church, but to come to know, through faith, the Lord Jesus.</p>
        
        <p>We are delighted to have this opportunity to invite you to our services and look forward to your visit.</p>
      `,
      status: "PUBLISHED",
      order: 1,
      slug: "who-we-are",
      metaDescription:
        "Learn about 10th Avenue Bible Chapel and our mission to share the love of Christ with our community.",
    },
    {
      title: "What We Believe",
      content: `
        <h3>Our Core Beliefs</h3>
        
        <div class="beliefs-list">
          <div class="belief-item">
            <p>The Bible is the inspired "Word" of God, our final authority in matters of faith and conduct.</p>
            <strong>II Timothy 3:16-17</strong>
          </div>
          
          <div class="belief-item">
            <p>There is one God, revealing Himself in three Persons: the Father, the Son, and the Holy Spirit.</p>
            <strong>Hebrews 9:14; Matthew 28:19</strong>
          </div>
          
          <div class="belief-item">
            <p>In the essential deity and true humanity of Jesus Christ our Lord, who lived on earth, died upon the cross, rose from the dead, ascended to heaven, and will soon return in person.</p>
            <strong>Philippians 2:6-11; I Thessalonians 4:16</strong>
          </div>
          
          <div class="belief-item">
            <p>Man is sinful by nature and practice but through grace can be restored to fellowship with God.</p>
            <strong>Romans 3:23; Ephesians 2:8-9</strong>
          </div>
          
          <div class="belief-item">
            <p>The only way for man to be right with God is through faith in Christ alone, whose sinless life and saving death were for our redemption.</p>
            <strong>Romans 10:8-10</strong>
          </div>
          
          <div class="belief-item">
            <p>There is one true Church under the sole authority of Christ, comprised of all believers in the Lord Jesus Christ.</p>
            <strong>Ephesians 1:19-23; Galatians 3:28</strong>
          </div>
          
          <div class="belief-item">
            <p>In the Christian ordinances: believer's baptism by immersion and the Lord's Supper.</p>
            <strong>Matthew 28:19; Luke 22:19-20</strong>
          </div>
        </div>
      `,
      status: "PUBLISHED",
      order: 2,
      slug: "what-we-believe",
      metaDescription:
        "Discover the core beliefs and doctrines of 10th Avenue Bible Chapel based on biblical truth.",
    },
  ];

  for (const sectionData of aboutSections) {
    await prisma.aboutSection.upsert({
      where: { slug: sectionData.slug },
      update: {},
      create: sectionData as any,
    });
  }

  console.log("✅ About sections created");

  // ============================================================================
  // CREATE CONTACT INFO
  // ============================================================================

  await prisma.contactInfo.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      phone: "+1 (604) 222-7777",
      email: "info@10thavebiblechapel.com",
      address: "7103 - 10th Ave., Burnaby, BC V3N 2R5",
      mapUrl: "https://maps.google.com/?q=7103+10th+Ave+Burnaby+BC",
      sundayHours: "10:00 AM - 12:30 PM",
      wednesdayHours: "7:00 PM - 8:00 PM",
      website: "https://10thavebiblechapel.com",
      additionalInfo:
        "We welcome visitors to all our services. Please feel free to contact us with any questions.",
    },
  });

  console.log("✅ Contact info created");

  // ============================================================================
  // CREATE SERMON SERIES
  // ============================================================================

  const sermonSeries = [
    {
      title: "Bigger Than Us",
      description:
        "A series exploring how God's plan is bigger than our individual stories",
      image: "/assets/crosss-mountain.png",
      isActive: true,
      order: 1,
      slug: "bigger-than-us",
      metaDescription:
        "Discover how God's plan is bigger than our individual stories in this inspiring sermon series.",
    },
    {
      title: "Relationships Anonymous",
      description: "Exploring healthy relationships and community",
      image: "/assets/sermonCardImg.svg",
      isActive: true,
      order: 2,
      slug: "relationships-anonymous",
      metaDescription:
        "Learn about building healthy relationships and community in this practical sermon series.",
    },
    {
      title: "Romans",
      description: "A comprehensive study of the book of Romans",
      image: "/assets/sermonCardImg.svg",
      isActive: true,
      order: 3,
      slug: "romans",
      metaDescription:
        "Join us for a comprehensive study of the book of Romans and its timeless truths.",
    },
  ];

  for (const seriesData of sermonSeries) {
    await prisma.sermonSeries.upsert({
      where: { slug: seriesData.slug },
      update: {},
      create: seriesData,
    });
  }

  console.log("✅ Sermon series created");

  // ============================================================================
  // CREATE SAMPLE SERMONS
  // ============================================================================

  const biggerThanUsSeries = await prisma.sermonSeries.findUnique({
    where: { slug: "bigger-than-us" },
  });

  if (biggerThanUsSeries) {
    const sermons = [
      {
        title: "BEST IS YET TO COME",
        subtitle: "A Future Bigger Than Us",
        description: "Exploring the hope we have in Christ for the future",
        speaker: "Pastor John",
        date: new Date("2025-01-06"),
        youtubeUrl: "https://www.youtube.com/watch?v=example1",
        passage: "Hebrews 11:8-10",
        seriesId: biggerThanUsSeries.id,
        status: "PUBLISHED",
        isFeatured: true,
        order: 1,
        slug: "best-is-yet-to-come",
        metaDescription:
          "Discover the hope we have in Christ for the future in this inspiring message.",
      },
      {
        title: "LIVE A BIGGER STORY",
        subtitle: "A Story That's Bigger Than Us",
        description: "How to live a life that reflects God's greater story",
        speaker: "Pastor John",
        date: new Date("2025-01-13"),
        youtubeUrl: "https://www.youtube.com/watch?v=example2",
        passage: "Ephesians 2:10",
        seriesId: biggerThanUsSeries.id,
        status: "PUBLISHED",
        isFeatured: false,
        order: 2,
        slug: "live-a-bigger-story",
        metaDescription:
          "Learn how to live a life that reflects God's greater story.",
      },
    ];

    for (const sermonData of sermons) {
      await prisma.sermon.upsert({
        where: { slug: sermonData.slug },
        update: {},
        create: sermonData as any,
      });
    }
  }

  console.log("✅ Sample sermons created");

  // ============================================================================
  // CREATE SAMPLE PRAYER REQUESTS
  // ============================================================================

  const prayerRequests = [
    {
      title: "Prayer for Healing",
      description:
        "Please pray for my grandmother who is recovering from surgery. We trust in God's healing power.",
      requester: "Sarah Johnson",
      category: "HEALTH",
      priority: "HIGH",
      status: "APPROVED",
      isPrivate: false,
      userId: memberUser.id,
    },
    {
      title: "Family Unity",
      description:
        "Our family is going through a difficult time. Please pray for unity and peace in our home.",
      requester: "Anonymous",
      category: "FAMILY",
      priority: "NORMAL",
      status: "APPROVED",
      isPrivate: false,
    },
    {
      title: "Job Search",
      description:
        "I have been looking for employment for several months. Please pray for God's guidance and provision.",
      requester: "Mike Chen",
      category: "WORK",
      priority: "NORMAL",
      status: "PENDING",
      isPrivate: false,
    },
    {
      title: "Spiritual Growth",
      description:
        "Pray for my spiritual growth and deeper relationship with God.",
      requester: "Anonymous",
      category: "SPIRITUAL",
      priority: "NORMAL",
      status: "APPROVED",
      isPrivate: true,
    },
  ];

  for (const prayerData of prayerRequests) {
    await prisma.prayerRequest.create({
      data: prayerData as any,
    });
  }

  console.log("✅ Sample prayer requests created");

  // ============================================================================
  // CREATE SITE CONFIGURATION
  // ============================================================================

  const siteConfigs = [
    {
      key: "church_name",
      value: "10th Avenue Bible Chapel",
      description: "Official church name",
    },
    {
      key: "church_tagline",
      value: "A SMALL BIBLE BELIEVING CHRISTIAN FELLOWSHIP",
      description: "Church tagline",
    },
    {
      key: "welcome_message",
      value: "WELCOME TO OUR CHURCH",
      description: "Welcome message for visitors",
    },
    {
      key: "john_3_16_verse",
      value:
        "FOR GOD SO LOVED THE WORLD THAT HE GAVE HIS ONLY BEGOTTEN SON, THAT WHOEVER BELIEVES IN HIM SHOULD NOT PERISH BUT HAVE EVERLASTING LIFE.",
      description: "John 3:16 verse text",
    },
  ];

  for (const configData of siteConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: configData.key },
      update: {},
      create: configData,
    });
  }

  console.log("✅ Site configuration created");

  console.log("🎉 Database seed completed successfully!");
  console.log("\n📋 Default Login Credentials:");
  console.log("Admin: admin@10thavebiblechapel.com / admin123");
  console.log("Member: member@10thavebiblechapel.com / member123");
  console.log("\n⚠️  Please change these passwords in production!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
