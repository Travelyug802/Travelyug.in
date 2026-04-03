'use strict';
const router      = require('express').Router();
const { protect } = require('../middleware/auth');
const Package     = require('../models/Package');
const Testimonial = require('../models/Testimonial');
const Gallery     = require('../models/Gallery');
const Admin       = require('../models/Admin');
const bcrypt      = require('bcryptjs');

/* POST /api/admin/create-admin  ─ creates admin user (run once, then remove) */
router.post('/create-admin', async (req, res) => {
  try {
    const Admin = require('../models/Admin');
    await Admin.deleteMany({});
    const admin = new Admin({
      name: 'Travelyug Admin',
      email: 'admin@travelyug.com',
      password: 'GauravSharma0165'
    });
    await admin.save();
    res.json({ success: true, message: 'Admin created!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* POST /api/admin/seed  ─ demo data (dev) */
router.post('/seed', async (req, res, next) => {
  try {
    await Promise.all([Package.deleteMany({}), Testimonial.deleteMany({}), Gallery.deleteMany({})]);

    const packages = await Package.insertMany([
      {
        title: 'Kerala Backwaters & Beaches', shortDescription: "Glide through emerald backwaters in God's Own Country.",
        description: 'Explore Alleppey houseboat stays, Munnar tea gardens, Periyar Wildlife Sanctuary, and unwind on pristine Kovalam Beach. Kerala is a sensory feast of coconut groves, ayurvedic spas, and fresh seafood.',
        price: 25000, discountedPrice: 21999, duration: '6 Days / 5 Nights', location: 'Kerala, India',
        category: 'domestic', isFeatured: true, isActive: true, rating: 4.8, reviewCount: 124,
        highlights: ['Alleppey Houseboat Stay', 'Munnar Tea Estates', 'Kovalam Beach', 'Kathakali Cultural Show', 'Ayurvedic Massage'],
        inclusions: ['AC hotel accommodation', 'Daily breakfast & dinner', 'Houseboat (1 night)', 'All transfers', 'Guided sightseeing'],
        exclusions: ['Airfare / train tickets', 'Lunches', 'Personal expenses', 'Travel insurance'],
        images: [{ url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', alt: 'Kerala Backwaters', isPrimary: true }]
      },
      {
        title: 'Rajasthan Royal Heritage Tour', shortDescription: 'Magnificent forts, colourful bazaars and camel rides in the desert.',
        description: 'Journey through Jaipur Pink City, blue lanes of Jodhpur, lakeside Udaipur, and golden dunes of Jaisalmer. Rajasthan is India at its most regal — palaces, forts and desert nights under the stars.',
        price: 32000, discountedPrice: 27500, duration: '8 Days / 7 Nights', location: 'Rajasthan, India',
        category: 'domestic', isFeatured: true, isActive: true, rating: 4.9, reviewCount: 198,
        highlights: ['Amber Fort Jaipur', 'Lake Pichola Udaipur', 'Mehrangarh Fort Jodhpur', 'Camel Safari Jaisalmer', 'Desert Camp Stay'],
        inclusions: ['Heritage hotel stays', 'Daily breakfast', 'AC transport', 'Expert local guide', 'Camel safari (1 hr)'],
        exclusions: ['Flights', 'Lunch & dinner', 'Monument entry tickets', 'Personal shopping'],
        images: [{ url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', alt: 'Rajasthan Fort', isPrimary: true }]
      },
      {
        title: 'Bali Paradise Escape', shortDescription: 'Ancient temples, emerald rice terraces and crystal turquoise waters.',
        description: 'From spiritual Ubud to surfer paradise Seminyak, Bali offers culture, adventure, and relaxation. Visit water temples, trek rice paddies at sunrise, take a cooking class, and watch magical Kecak fire dance.',
        price: 55000, discountedPrice: 48000, duration: '7 Days / 6 Nights', location: 'Bali, Indonesia',
        category: 'international', isFeatured: true, isActive: true, rating: 4.9, reviewCount: 215,
        highlights: ['Tanah Lot Sea Temple', 'Tegallalang Rice Terraces', 'Mount Batur Sunrise Trek', 'Seminyak Beach', 'Balinese Cooking Class'],
        inclusions: ['4-star resort stay', 'Daily breakfast', 'Airport transfers', 'Temple tour', 'Cooking class'],
        exclusions: ['International flights', 'Bali e-Visa', 'Lunch & dinner', 'Travel insurance'],
        images: [{ url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', alt: 'Bali Temple', isPrimary: true }]
      },
      {
        title: 'Maldives Luxury Honeymoon', shortDescription: 'Overwater villas, turquoise lagoons and unforgettable sunsets for two.',
        description: 'Celebrate love in your own overwater villa in the Maldives. Snorkel with manta rays, enjoy a private candlelit dinner on the beach, indulge in couple spa rituals and wake up to infinite ocean.',
        price: 120000, discountedPrice: 99000, duration: '6 Days / 5 Nights', location: 'Maldives',
        category: 'honeymoon', isFeatured: true, isActive: true, rating: 5.0, reviewCount: 67,
        highlights: ['Private Overwater Villa', 'Candlelit Beach Dinner', 'Snorkelling & Reef Diving', 'Couple Spa Treatment', 'Sunset Dolphin Cruise'],
        inclusions: ['Overwater villa', 'Full board (all meals)', 'Seaplane transfers', 'Snorkelling gear', 'Sunset cruise'],
        exclusions: ['International flights', 'Scuba certification', 'Premium spirits', 'Personal expenses'],
        images: [{ url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800', alt: 'Maldives Bungalow', isPrimary: true }]
      },
      {
        title: 'Himachal Adventure — Manali & Spiti', shortDescription: 'Snow peaks, roaring rivers and ancient Buddhist monasteries.',
        description: 'Drive through Rohtang Pass snowfields, explore Spiti Valley monasteries, raft the Beas River, camp under a billion stars at 4000m. Himachal Pradesh at its most wild and beautiful.',
        price: 18000, discountedPrice: null, duration: '5 Days / 4 Nights', location: 'Himachal Pradesh, India',
        category: 'adventure', isFeatured: true, isActive: true, rating: 4.7, reviewCount: 89,
        highlights: ['Rohtang Pass Snow Walk', 'Hadimba Devi Temple', 'Beas River Rafting', 'Old Manali & Café Walk', 'Solang Valley Zipline'],
        inclusions: ['Hotel accommodation', 'Breakfast & dinner', 'Volvo bus Manali transfer', 'River rafting session'],
        exclusions: ['Airfare', 'Lunch', 'Snow activity charges (₹300–600)', 'Personal expenses'],
        images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', alt: 'Himachal Mountains', isPrimary: true }]
      },
      {
        title: 'Golden Triangle — Delhi Agra Jaipur', shortDescription: "India's most iconic circuit: Taj Mahal, Mughal forts, and Rajput palaces.",
        description: 'The Golden Triangle is India distilled. Stand in front of the Taj Mahal at sunrise, wander Agra Fort, explore Qutub Minar in Delhi, and end in magnificent Jaipur — the Pink City.',
        price: 22000, discountedPrice: 18500, duration: '6 Days / 5 Nights', location: 'Delhi – Agra – Jaipur',
        category: 'domestic', isFeatured: false, isActive: true, rating: 4.6, reviewCount: 312,
        highlights: ['Taj Mahal at Sunrise', 'Agra Fort & Itimad-ud-Daulah', 'Amber Fort Jaipur', 'Qutub Minar Delhi', 'Hawa Mahal & City Palace'],
        inclusions: ['4-star hotels', 'Daily breakfast', 'AC vehicle throughout', 'Expert English-speaking guide', 'Monument entry fees'],
        exclusions: ['Flights to Delhi / from Jaipur', 'Lunch & dinner', 'Personal shopping', 'Camera charges inside monuments'],
        images: [{ url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', alt: 'Taj Mahal', isPrimary: true }]
      },
      {
        title: 'Andaman Islands — Beach & Dive', shortDescription: 'Asia-rated beaches, thrilling scuba diving and tropical island life.',
        description: 'The Andamans are India\'s best-kept tropical secret. Visit Radhanagar Beach (Asia\'s No.1), scuba-dive vibrant coral reefs at Havelock Island, explore the haunting Cellular Jail, and island-hop to Neil Island.',
        price: 35000, discountedPrice: 29999, duration: '7 Days / 6 Nights', location: 'Andaman & Nicobar Islands',
        category: 'domestic', isFeatured: false, isActive: true, rating: 4.8, reviewCount: 143,
        highlights: ['Radhanagar Beach', 'Scuba Diving at Havelock', 'Cellular Jail Light & Sound Show', 'Glass Bottom Boat', 'Neil Island Day Trip'],
        inclusions: ['Beach resort stays', 'Breakfast & dinner', 'Inter-island ferry tickets', '1 scuba session (intro dive)', 'Sightseeing tours'],
        exclusions: ['Flights to Port Blair', 'Lunch', 'Additional dive sessions', 'Water sports charges'],
        images: [{ url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', alt: 'Andaman Beach', isPrimary: true }]
      },
      {
        title: 'Thailand — Bangkok & Phuket Explorer', shortDescription: 'Golden temples, vibrant street food and stunning island beaches.',
        description: 'Start in Bangkok\'s magnificent Grand Palace and floating markets, then fly south to Phuket for white-sand beaches, legendary Thai street food, Phi Phi Islands, and an elephant sanctuary visit.',
        price: 65000, discountedPrice: 55000, duration: '8 Days / 7 Nights', location: 'Bangkok & Phuket, Thailand',
        category: 'international', isFeatured: false, isActive: true, rating: 4.7, reviewCount: 176,
        highlights: ['Grand Palace Bangkok', 'Phi Phi Islands Boat Tour', 'Damnoen Saduak Floating Market', 'Ethical Elephant Sanctuary', 'Thai Cooking Class'],
        inclusions: ['4-star hotels', 'Daily breakfast', 'Bangkok–Phuket internal flight', 'Airport transfers', 'Island tour (half day)'],
        exclusions: ['International flights', 'Thai visa on arrival (₹1500)', 'Lunch & dinner', 'Personal expenses'],
        images: [{ url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800', alt: 'Bangkok Temple', isPrimary: true }]
      }
    ]);

    const testimonials = await Testimonial.insertMany([
      { customerName: 'Priya Sharma', location: 'Mumbai, India', rating: 5, review: 'The Kerala backwaters trip was absolutely magical! The houseboat experience was unlike anything I\'ve ever seen. Travelyug handled every detail perfectly — hotels, transfers, everything. Highly recommend to anyone looking for a stress-free holiday.', packageName: 'Kerala Backwaters', isFeatured: true, isActive: true, avatar: 'https://i.pravatar.cc/100?img=1' },
      { customerName: 'Rahul & Deepika Gupta', location: 'Bengaluru, India', rating: 5, review: 'Our Maldives honeymoon was a dream come true. The overwater villa was breathtaking and the staff at Travelyug even arranged a surprise anniversary cake! We felt like royalty the entire trip. Already planning our next holiday with them.', packageName: 'Maldives Luxury Honeymoon', isFeatured: true, isActive: true, avatar: 'https://i.pravatar.cc/100?img=5' },
      { customerName: 'Anil Mehta', location: 'Delhi, India', rating: 5, review: 'Did the Rajasthan Heritage Tour last November with my family of 6. The camel safari and desert camp under the stars were the highlights. Our guide was knowledgeable, patient, and really funny! Travelyug is now our go-to for all travels.', packageName: 'Rajasthan Royal Heritage', isFeatured: true, isActive: true, avatar: 'https://i.pravatar.cc/100?img=8' },
      { customerName: 'Sunita & Family', location: 'Hyderabad, India', rating: 4, review: 'Booked the Bali trip for our family of 5, including two kids. The itinerary was perfectly balanced — temples in the morning, beach in the afternoon, and the cooking class was a big hit with everyone. Very smooth experience.', packageName: 'Bali Paradise Escape', isFeatured: true, isActive: true, avatar: 'https://i.pravatar.cc/100?img=9' },
      { customerName: 'Vikram Singh', location: 'Chandigarh, India', rating: 5, review: 'Himachal adventure with 4 friends was epic! Rohtang Pass snow walk, river rafting in Beas, campfire at night — priceless memories. Great value for money and the team was super responsive throughout the planning.', packageName: 'Himachal Adventure', isFeatured: false, isActive: true, avatar: 'https://i.pravatar.cc/100?img=12' },
      { customerName: 'Kavita Nair', location: 'Kochi, India', rating: 5, review: 'Golden Triangle was my first solo trip and Travelyug made it incredibly easy. Hotels were excellent, guide at Agra was outstanding, and the logistics were flawless. Already told 10 friends to book with them!', packageName: 'Golden Triangle', isFeatured: true, isActive: true, avatar: 'https://i.pravatar.cc/100?img=16' }
    ]);

    const gallery = await Gallery.insertMany([
      { title: 'Kerala Backwaters Sunrise',  imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', category: 'beaches',   destination: 'Kerala, India' },
      { title: 'Rajasthan Desert Dunes',     imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', category: 'heritage',  destination: 'Rajasthan, India' },
      { title: 'Bali Tegallalang Terraces',  imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', category: 'culture',   destination: 'Bali, Indonesia' },
      { title: 'Himalayan Snow Peaks',       imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', category: 'mountains', destination: 'Himachal Pradesh' },
      { title: 'Maldives Crystal Lagoon',    imageUrl: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600', category: 'beaches',   destination: 'Maldives' },
      { title: 'Taj Mahal at Dawn',          imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600', category: 'heritage',  destination: 'Agra, India' },
      { title: 'Andaman Turquoise Waters',   imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600', category: 'beaches',   destination: 'Andaman, India' },
      { title: 'Bangkok Golden Temple',      imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600', category: 'culture',   destination: 'Bangkok, Thailand' },
      { title: 'Udaipur Lake Palace',        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600', category: 'heritage',  destination: 'Udaipur, India' },
      { title: 'Manali Snow Valley',         imageUrl: 'https://images.unsplash.com/photo-1574181611642-a8a4c1699fd6?w=600', category: 'mountains', destination: 'Manali, India' },
      { title: 'Goa Beach Sunset',           imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', category: 'beaches',   destination: 'Goa, India' },
      { title: 'Coorg Coffee Plantation',    imageUrl: 'https://images.unsplash.com/photo-1595356700395-45ba5dcba0a1?w=600', category: 'mountains', destination: 'Coorg, India' }
    ]);

    res.json({ success: true, message: 'Demo data seeded!', data: { packages: packages.length, testimonials: testimonials.length, gallery: gallery.length } });
  } catch (err) { next(err); }
});

module.exports = router;
