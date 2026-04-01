'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose    = require('mongoose');
const Admin       = require('../models/Admin');
const Package     = require('../models/Package');
const Testimonial = require('../models/Testimonial');
const Gallery     = require('../models/Gallery');

async function seed() {
  console.log('\n🌱  Travelyug Seed Script\n');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  Connected to MongoDB');

    /* ── admin ── */
    await Admin.deleteMany({});
    const admin = await Admin.create({
      name:     process.env.ADMIN_NAME     || 'Travelyug Admin',
      email:    process.env.ADMIN_EMAIL    || 'admin@travelyug.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'superadmin'
    });
    console.log(`✅  Admin created: ${admin.email}`);

    /* ── packages ── */
    await Package.deleteMany({});
    const packages = await Package.insertMany([
      { title:'Kerala Backwaters & Beaches', shortDescription:"Glide through emerald backwaters in God's Own Country.", description:'Explore Alleppey houseboat stays, Munnar tea gardens, and Kovalam Beach.', price:25000, discountedPrice:21999, duration:'6 Days / 5 Nights', location:'Kerala, India', category:'domestic', isFeatured:true, isActive:true, rating:4.8, reviewCount:124, highlights:['Alleppey Houseboat Stay','Munnar Tea Estates','Kovalam Beach','Kathakali Show','Ayurvedic Massage'], inclusions:['AC accommodation','Daily breakfast & dinner','Houseboat 1 night','All transfers'], exclusions:['Airfare','Lunches','Personal expenses'], images:[{url:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',alt:'Kerala',isPrimary:true}] },
      { title:'Rajasthan Royal Heritage Tour', shortDescription:'Magnificent forts, colourful bazaars and desert sunsets.', description:'Journey through Jaipur, Jodhpur, Udaipur and Jaisalmer.', price:32000, discountedPrice:27500, duration:'8 Days / 7 Nights', location:'Rajasthan, India', category:'domestic', isFeatured:true, isActive:true, rating:4.9, reviewCount:198, highlights:['Amber Fort','Lake Pichola','Mehrangarh Fort','Camel Safari','Desert Camp'], inclusions:['Heritage hotels','Daily breakfast','AC transport','Expert guide'], exclusions:['Flights','Lunch & dinner','Entry tickets'], images:[{url:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',alt:'Rajasthan',isPrimary:true}] },
      { title:'Bali Paradise Escape', shortDescription:'Ancient temples, rice terraces and crystal blue waters.', description:'Ubud, Seminyak, Tanah Lot and Tegallalang Rice Terraces.', price:55000, discountedPrice:48000, duration:'7 Days / 6 Nights', location:'Bali, Indonesia', category:'international', isFeatured:true, isActive:true, rating:4.9, reviewCount:215, highlights:['Tanah Lot Temple','Rice Terraces','Mount Batur Trek','Seminyak Beach','Cooking Class'], inclusions:['4-star resort','Daily breakfast','Airport transfers','Temple tour'], exclusions:['International flights','Bali e-Visa','Lunch & dinner'], images:[{url:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',alt:'Bali',isPrimary:true}] },
      { title:'Maldives Luxury Honeymoon', shortDescription:'Overwater villas and unforgettable sunsets for two.', description:'Your own private overwater villa, snorkelling, beach dinners.', price:120000, discountedPrice:99000, duration:'6 Days / 5 Nights', location:'Maldives', category:'honeymoon', isFeatured:true, isActive:true, rating:5.0, reviewCount:67, highlights:['Private Overwater Villa','Beach Dinner','Snorkelling','Couple Spa','Sunset Cruise'], inclusions:['Overwater villa','All meals','Seaplane transfers','Snorkelling gear'], exclusions:['International flights','Scuba certification','Personal expenses'], images:[{url:'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800',alt:'Maldives',isPrimary:true}] },
      { title:'Himachal Adventure — Manali', shortDescription:'Snow peaks, roaring rivers and ancient monasteries.', description:'Rohtang Pass, Spiti Valley, river rafting on the Beas.', price:18000, duration:'5 Days / 4 Nights', location:'Himachal Pradesh, India', category:'adventure', isFeatured:true, isActive:true, rating:4.7, reviewCount:89, highlights:['Rohtang Pass','Hadimba Temple','River Rafting','Solang Valley','Old Manali'], inclusions:['Hotel stay','Breakfast & dinner','Volvo bus','River rafting'], exclusions:['Airfare','Lunch','Snow activity charges'], images:[{url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',alt:'Himachal',isPrimary:true}] },
      { title:'Golden Triangle — Delhi Agra Jaipur', shortDescription:"India's most iconic circuit starting at the Taj Mahal.", description:'Taj Mahal sunrise, Amber Fort, India Gate and Hawa Mahal.', price:22000, discountedPrice:18500, duration:'6 Days / 5 Nights', location:'Delhi – Agra – Jaipur', category:'domestic', isFeatured:false, isActive:true, rating:4.6, reviewCount:312, highlights:['Taj Mahal Sunrise','Agra Fort','Amber Fort','India Gate','Hawa Mahal'], inclusions:['4-star hotels','Daily breakfast','AC vehicle','Guide','Entry fees'], exclusions:['Flights','Lunch & dinner','Personal shopping'], images:[{url:'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',alt:'Taj Mahal',isPrimary:true}] },
      { title:'Andaman Islands — Beach & Dive', shortDescription:"Asia's best beaches and vibrant coral reef diving.", description:'Radhanagar Beach, scuba diving, Cellular Jail, Neil Island.', price:35000, discountedPrice:29999, duration:'7 Days / 6 Nights', location:'Andaman & Nicobar Islands', category:'domestic', isFeatured:false, isActive:true, rating:4.8, reviewCount:143, highlights:['Radhanagar Beach','Scuba Diving','Cellular Jail','Glass Bottom Boat','Neil Island'], inclusions:['Resort stays','Breakfast & dinner','Ferry tickets','1 scuba session'], exclusions:['Flights to Port Blair','Lunch','Additional dives'], images:[{url:'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',alt:'Andaman',isPrimary:true}] },
      { title:'Thailand — Bangkok & Phuket', shortDescription:'Golden temples, floating markets and island beaches.', description:'Grand Palace, Phi Phi Islands, elephant sanctuary, Thai cooking class.', price:65000, discountedPrice:55000, duration:'8 Days / 7 Nights', location:'Bangkok & Phuket, Thailand', category:'international', isFeatured:false, isActive:true, rating:4.7, reviewCount:176, highlights:['Grand Palace','Phi Phi Islands','Floating Market','Elephant Sanctuary','Cooking Class'], inclusions:['4-star hotels','Daily breakfast','Internal flight','Airport transfers'], exclusions:['International flights','Thai visa','Lunch & dinner'], images:[{url:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',alt:'Bangkok',isPrimary:true}] }
    ]);
    console.log(`✅  ${packages.length} packages created`);

    /* ── testimonials ── */
    await Testimonial.deleteMany({});
    const testimonials = await Testimonial.insertMany([
      { customerName:'Priya Sharma',            location:'Mumbai, India',     rating:5, review:'The Kerala backwaters trip was absolutely magical! Travelyug handled every detail perfectly. Highly recommend.',                                                packageName:'Kerala Backwaters',  isFeatured:true,  isActive:true, avatar:'https://i.pravatar.cc/100?img=1'  },
      { customerName:'Rahul & Deepika Gupta',   location:'Bengaluru, India',  rating:5, review:'Our Maldives honeymoon was a dream come true. The overwater villa was breathtaking and the team arranged a surprise cake!',                                       packageName:'Maldives Honeymoon', isFeatured:true,  isActive:true, avatar:'https://i.pravatar.cc/100?img=5'  },
      { customerName:'Anil Mehta',              location:'Delhi, India',      rating:5, review:'Rajasthan Heritage Tour with family of 6 was fantastic. Camel safari and desert camp were unforgettable. Guide was brilliant.',                                   packageName:'Rajasthan Heritage', isFeatured:true,  isActive:true, avatar:'https://i.pravatar.cc/100?img=8'  },
      { customerName:'Sunita & Family',         location:'Hyderabad, India',  rating:4, review:'Bali trip for 5 including two kids was perfectly planned. Cooking class was a big hit and hotels were excellent.',                                                 packageName:'Bali Paradise',      isFeatured:true,  isActive:true, avatar:'https://i.pravatar.cc/100?img=9'  },
      { customerName:'Vikram Singh',            location:'Chandigarh, India', rating:5, review:'Himachal adventure with friends was epic! Rohtang snow, river rafting, campfire at night. Great value for money.',                                                 packageName:'Himachal Adventure', isFeatured:false, isActive:true, avatar:'https://i.pravatar.cc/100?img=12' },
      { customerName:'Kavita Nair',             location:'Kochi, India',      rating:5, review:'Golden Triangle solo trip was flawless. Hotels great, guide outstanding, logistics perfect. Already told 10 friends to book!',                                     packageName:'Golden Triangle',    isFeatured:true,  isActive:true, avatar:'https://i.pravatar.cc/100?img=16' }
    ]);
    console.log(`✅  ${testimonials.length} testimonials created`);

    /* ── gallery ── */
    await Gallery.deleteMany({});
    const gallery = await Gallery.insertMany([
      { title:'Kerala Backwaters Sunrise',  imageUrl:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', category:'beaches',   destination:'Kerala, India'        },
      { title:'Rajasthan Desert Dunes',     imageUrl:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', category:'heritage',  destination:'Rajasthan, India'     },
      { title:'Bali Rice Terraces',         imageUrl:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', category:'culture',   destination:'Bali, Indonesia'      },
      { title:'Himalayan Snow Peaks',       imageUrl:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', category:'mountains', destination:'Himachal Pradesh'     },
      { title:'Maldives Crystal Lagoon',    imageUrl:'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600', category:'beaches',   destination:'Maldives'             },
      { title:'Taj Mahal at Dawn',          imageUrl:'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600', category:'heritage',  destination:'Agra, India'          },
      { title:'Andaman Turquoise Waters',   imageUrl:'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600', category:'beaches',   destination:'Andaman, India'       },
      { title:'Bangkok Golden Temple',      imageUrl:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600', category:'culture',   destination:'Bangkok, Thailand'    },
      { title:'Udaipur Lake Palace View',   imageUrl:'https://images.unsplash.com/photo-1548013146-72479768bada?w=600', category:'heritage',  destination:'Udaipur, India'       },
      { title:'Manali Snow Valley',         imageUrl:'https://images.unsplash.com/photo-1574181611642-a8a4c1699fd6?w=600', category:'mountains', destination:'Manali, India'        },
      { title:'Goa Beach Sunset',           imageUrl:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', category:'beaches',   destination:'Goa, India'           },
      { title:'Coorg Coffee Estate',        imageUrl:'https://images.unsplash.com/photo-1595356700395-45ba5dcba0a1?w=600', category:'mountains', destination:'Coorg, India'         }
    ]);
    console.log(`✅  ${gallery.length} gallery images created`);

    console.log('\n🎉  Seed complete!');
    console.log('─────────────────────────────────────');
    console.log(`   Admin email:    ${process.env.ADMIN_EMAIL    || 'admin@travelyug.com'}`);
    console.log(`   Admin password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('─────────────────────────────────────\n');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
