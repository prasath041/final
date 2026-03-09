const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Category = require('./models/Category');
const Furniture = require('./models/Furniture');
const Wood = require('./models/Wood');
const Door = require('./models/Door');
const Window = require('./models/Window');
const Locker = require('./models/Locker');

const sampleCategories = [
  { name: 'Living Room', description: 'Comfortable furniture for your living space' },
  { name: 'Bedroom', description: 'Cozy and stylish bedroom furniture' },
  { name: 'Dining Room', description: 'Elegant dining furniture for family gatherings' },
  { name: 'Office', description: 'Professional furniture for your workspace' },
  { name: 'Outdoor', description: 'Durable furniture for outdoor spaces' }
];

const sampleWoods = [
  {
    name: 'Sheesham (Indian Rosewood)',
    description: 'Premium Indian hardwood known for its durability and beautiful grain patterns. Most popular choice for traditional Indian furniture.',
    origin: 'North India (Punjab, Rajasthan)',
    durability: 'Very High',
    grain: 'Straight to interlocked with golden streaks',
    color: 'Golden brown to deep brown',
    priceMultiplier: 1.3,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  },
  {
    name: 'Teak (Sagwan)',
    description: 'India\'s most prized hardwood from the forests of Central and South India. Natural oils provide excellent weather and pest resistance.',
    origin: 'Central & South India (MP, Maharashtra, Karnataka)',
    durability: 'Very High',
    grain: 'Straight to slightly wavy',
    color: 'Golden brown to dark brown',
    priceMultiplier: 1.6,
    image: 'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=400'
  },
  {
    name: 'Mango Wood (Aam)',
    description: 'Sustainable and eco-friendly wood from mango trees. Popular for its unique grain patterns and affordable pricing.',
    origin: 'All over India',
    durability: 'Medium',
    grain: 'Varied with interesting patterns',
    color: 'Light golden to brown with dark streaks',
    priceMultiplier: 0.8,
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400'
  },
  {
    name: 'Sal Wood',
    description: 'Strong and heavy hardwood from Eastern India. Known for its termite resistance and use in traditional construction.',
    origin: 'Eastern India (Jharkhand, Odisha, West Bengal)',
    durability: 'Very High',
    grain: 'Interlocked',
    color: 'Light brown to dark brown',
    priceMultiplier: 1.2,
    image: 'https://images.unsplash.com/photo-1610500795224-fb86b02926d7?w=400'
  },
  {
    name: 'Deodar (Himalayan Cedar)',
    description: 'Sacred wood from the Himalayan region with natural aromatic properties. Excellent for carved furniture and resistant to decay.',
    origin: 'Himalayan Region (Himachal, Uttarakhand, J&K)',
    durability: 'High',
    grain: 'Straight and fine',
    color: 'Light yellowish-brown',
    priceMultiplier: 1.4,
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400'
  },
  {
    name: 'Neem Wood',
    description: 'Traditional Indian wood with natural antibacterial properties. Commonly used for kitchen furniture and storage.',
    origin: 'All over India',
    durability: 'High',
    grain: 'Straight to interlocked',
    color: 'Reddish-brown',
    priceMultiplier: 0.9,
    image: 'https://images.unsplash.com/photo-1594969155368-f19485a9d88c?w=400'
  },
  {
    name: 'Indian Walnut (Akhrot)',
    description: 'Premium hardwood from Kashmir region prized for its rich color and workability. Ideal for luxury carved furniture.',
    origin: 'Kashmir Valley',
    durability: 'High',
    grain: 'Straight with beautiful patterns',
    color: 'Dark chocolate brown',
    priceMultiplier: 1.8,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  },
  {
    name: 'Indian Bamboo',
    description: 'Sustainable and fast-growing option from Northeast India. Harder than many hardwoods and eco-friendly.',
    origin: 'Northeast India (Assam, Tripura, Mizoram)',
    durability: 'High',
    grain: 'Distinct nodes and linear pattern',
    color: 'Natural tan to caramelized brown',
    priceMultiplier: 0.7,
    image: 'https://images.unsplash.com/photo-1545147986-a9d6f2ab03b5?w=400'
  }
];

const sampleFurniture = [
  {
    name: 'Rajasthani Carved Wooden Sofa',
    description: 'Traditional 3-seater sofa with intricate Rajasthani hand-carved designs. Made from premium Sheesham wood with comfortable cotton cushions.',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
      'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=600'
    ],
    material: 'Sheesham Wood & Cotton',
    color: 'Natural Brown',
    dimensions: { length: 200, width: 85, height: 90 },
    stock: 12,
    isAvailable: true,
    features: ['Hand-carved Rajasthani design', 'Premium Sheesham wood', 'Traditional jali work', 'Removable cushion covers'],
    rating: 4.8,
    categoryIndex: 0
  },
  {
    name: 'Kerala Rosewood Coffee Table',
    description: 'Elegant coffee table crafted by Kerala artisans from solid rosewood with traditional brass inlay work.',
    price: 18500,
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600',
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600'
    ],
    material: 'Rosewood & Brass',
    color: 'Dark Rosewood',
    dimensions: { length: 110, width: 55, height: 42 },
    stock: 20,
    isAvailable: true,
    features: ['Solid rosewood', 'Brass inlay work', 'Hand-polished finish', 'Traditional Kerala design'],
    rating: 4.9,
    categoryIndex: 0
  },
  {
    name: 'Jodhpur Blue Pottery Accent Chair',
    description: 'Unique accent chair featuring Jodhpur blue pottery tile accents on solid mango wood frame with handwoven cotton upholstery.',
    price: 15500,
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600'
    ],
    material: 'Mango Wood & Cotton',
    color: 'Blue & Natural',
    dimensions: { length: 65, width: 70, height: 80 },
    stock: 18,
    isAvailable: true,
    features: ['Blue pottery tile accents', 'Handwoven cotton fabric', 'Mango wood frame', 'Artisan crafted'],
    rating: 4.7,
    categoryIndex: 0
  },
  {
    name: 'Saharanpur Carved King Bed',
    description: 'Magnificent king-size bed with elaborate Saharanpur wood carving tradition. Features intricate headboard with floral motifs.',
    price: 85000,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600'
    ],
    material: 'Teak Wood',
    color: 'Golden Teak',
    dimensions: { length: 215, width: 185, height: 135 },
    stock: 8,
    isAvailable: true,
    features: ['Saharanpur carving tradition', 'Solid teak construction', 'Carved headboard & footboard', 'Under-bed storage'],
    rating: 4.9,
    categoryIndex: 1
  },
  {
    name: 'Gujarat Bandhani Wardrobe',
    description: 'Spacious 3-door wardrobe with traditional Gujarat-inspired mirror work and painted Bandhani patterns on Sheesham wood.',
    price: 55000,
    images: [
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600',
      'https://images.unsplash.com/photo-1595428773960-5bea2c885407?w=600'
    ],
    material: 'Sheesham Wood',
    color: 'Multi-color Traditional',
    dimensions: { length: 175, width: 55, height: 210 },
    stock: 6,
    isAvailable: true,
    features: ['Traditional mirror work', 'Bandhani painted patterns', 'Multiple compartments', 'Full-length mirror'],
    rating: 4.6,
    categoryIndex: 1
  },
  {
    name: 'Mysore Inlay Bedside Table',
    description: 'Exquisite pair of bedside tables featuring traditional Mysore rosewood inlay work with ivory-colored patterns.',
    price: 22000,
    images: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600',
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600'
    ],
    material: 'Rosewood',
    color: 'Dark Brown with Ivory Inlay',
    dimensions: { length: 48, width: 42, height: 58 },
    stock: 14,
    isAvailable: true,
    features: ['Set of 2 tables', 'Mysore inlay craftsmanship', 'Soft-close drawers', 'Hand-polished finish'],
    rating: 4.8,
    categoryIndex: 1
  },
  {
    name: 'Punjab Jali Work Dining Table',
    description: 'Stunning 8-seater dining table featuring intricate Punjab-style jali (lattice) work on solid Sheesham wood.',
    price: 65000,
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600'
    ],
    material: 'Sheesham Wood',
    color: 'Honey Brown',
    dimensions: { length: 200, width: 100, height: 78 },
    stock: 10,
    isAvailable: true,
    features: ['Punjab jali lattice work', 'Seats 8 comfortably', 'Solid Sheesham construction', 'Hand-carved details'],
    rating: 4.8,
    categoryIndex: 2
  },
  {
    name: 'Chettinad Style Dining Chairs',
    description: 'Set of 6 dining chairs inspired by Tamil Nadu Chettinad mansion style with cane weaving and teak wood frame.',
    price: 48000,
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600'
    ],
    material: 'Teak Wood & Cane',
    color: 'Natural Teak',
    dimensions: { length: 48, width: 52, height: 95 },
    stock: 16,
    isAvailable: true,
    features: ['Set of 6 chairs', 'Traditional cane weaving', 'Solid teak frame', 'Chettinad heritage design'],
    rating: 4.7,
    categoryIndex: 2
  },
  {
    name: 'Jodhpur Antique Study Desk',
    description: 'Heritage-style study desk with multiple drawers featuring traditional Jodhpur antique finish and brass hardware.',
    price: 35000,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600'
    ],
    material: 'Mango Wood & Brass',
    color: 'Antique Brown',
    dimensions: { length: 150, width: 70, height: 78 },
    stock: 15,
    isAvailable: true,
    features: ['Antique Jodhpur finish', 'Brass drawer handles', 'Multiple storage drawers', 'Leather writing pad'],
    rating: 4.6,
    categoryIndex: 3
  },
  {
    name: 'Chandigarh Heritage Office Chair',
    description: 'Ergonomic office chair inspired by Pierre Jeanneret Chandigarh furniture with cane back and solid teak construction.',
    price: 28000,
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600',
      'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?w=600'
    ],
    material: 'Teak Wood & Cane',
    color: 'Natural Teak',
    dimensions: { length: 55, width: 55, height: 85 },
    stock: 25,
    isAvailable: true,
    features: ['Chandigarh heritage design', 'Cane back support', 'Solid teak frame', 'Cushioned seat'],
    rating: 4.8,
    categoryIndex: 3
  },
  {
    name: 'Assam Bamboo Garden Set',
    description: 'Complete 5-piece outdoor set handcrafted by Assam artisans using sustainable bamboo with traditional weaving patterns.',
    price: 32000,
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600',
      'https://images.unsplash.com/photo-1595428773960-5bea2c885407?w=600'
    ],
    material: 'Bamboo & Cotton',
    color: 'Natural Bamboo',
    dimensions: { length: 130, width: 130, height: 78 },
    stock: 8,
    isAvailable: true,
    features: ['Sustainable bamboo', 'Traditional Assam weaving', 'Weather-treated', 'Cushions included'],
    rating: 4.5,
    categoryIndex: 4
  },
  {
    name: 'Goa Portuguese-Indian Swing Chair',
    description: 'Unique hanging swing chair combining Goan Portuguese-Indian design elements with solid teak wood and cotton rope.',
    price: 18000,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'
    ],
    material: 'Teak Wood & Cotton Rope',
    color: 'White & Natural',
    dimensions: { length: 100, width: 75, height: 120 },
    stock: 12,
    isAvailable: true,
    features: ['Indo-Portuguese design', 'Handwoven cotton rope', 'Ceiling mount included', 'Weather-resistant'],
    rating: 4.6,
    categoryIndex: 4
  },
  {
    name: 'Madhubani Art Bookshelf',
    description: 'Stunning bookshelf featuring hand-painted Madhubani art from Bihar on solid mango wood with traditional motifs.',
    price: 28000,
    images: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600',
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600'
    ],
    material: 'Mango Wood',
    color: 'Multi-color Madhubani',
    dimensions: { length: 90, width: 35, height: 180 },
    stock: 10,
    isAvailable: true,
    features: ['Hand-painted Madhubani art', 'Solid mango wood', 'Multiple shelves', 'Unique art piece'],
    rating: 4.9,
    categoryIndex: 0
  },
  {
    name: 'Kashmir Walnut Wood Cabinet',
    description: 'Luxurious display cabinet crafted from genuine Kashmir walnut wood with traditional carved patterns and glass panels.',
    price: 75000,
    images: [
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600',
      'https://images.unsplash.com/photo-1595428773960-5bea2c885407?w=600'
    ],
    material: 'Kashmir Walnut Wood',
    color: 'Dark Walnut',
    dimensions: { length: 120, width: 45, height: 200 },
    stock: 5,
    isAvailable: true,
    features: ['Genuine Kashmir walnut', 'Traditional carving', 'Glass display panels', 'Premium brass handles'],
    rating: 4.9,
    categoryIndex: 0
  },
  {
    name: 'Orissa Tribal Art Console Table',
    description: 'Unique console table featuring Orissa tribal Dokra art brass work on solid iron frame with mango wood top.',
    price: 22000,
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600',
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600'
    ],
    material: 'Mango Wood & Iron',
    color: 'Rustic Brown',
    dimensions: { length: 120, width: 35, height: 80 },
    stock: 12,
    isAvailable: true,
    features: ['Dokra brass art accents', 'Tribal design elements', 'Solid mango wood top', 'Iron frame'],
    rating: 4.7,
    categoryIndex: 0
  }
];

// Additional Teak Wood Products
const teakFurniture = [
  {
    name: 'Teak Wood Round Dining Table',
    description: 'Premium 6-seater round dining table crafted from solid Burma Teak with traditional Indian carved border design.',
    price: 72000,
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600'
    ],
    material: 'Burma Teak Wood',
    color: 'Golden Teak',
    dimensions: { length: 150, width: 150, height: 76 },
    stock: 8,
    isAvailable: true,
    features: ['Solid Burma Teak', 'Hand-carved border', 'Rotating center (Lazy Susan)', 'Seats 6 comfortably'],
    rating: 4.9,
    categoryIndex: 2
  },
  {
    name: 'Teak Wood Arm Chair Set',
    description: 'Set of 4 elegant arm chairs in solid Teak wood with traditional Indian cushion work and brass accents.',
    price: 56000,
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600'
    ],
    material: 'Teak Wood & Cotton',
    color: 'Natural Teak',
    dimensions: { length: 55, width: 58, height: 92 },
    stock: 12,
    isAvailable: true,
    features: ['Set of 4 chairs', 'Solid teak construction', 'Removable cushions', 'Brass arm accents'],
    rating: 4.8,
    categoryIndex: 2
  },
  {
    name: 'Teak Wood Temple Design Pooja Unit',
    description: 'Traditional temple-style Pooja unit with intricate carvings, bells, and brass kalash finials in premium Teak.',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600',
      'https://images.unsplash.com/photo-1595428773960-5bea2c885407?w=600'
    ],
    material: 'Teak Wood & Brass',
    color: 'Golden Teak',
    dimensions: { length: 90, width: 45, height: 150 },
    stock: 10,
    isAvailable: true,
    features: ['Temple style design', 'Brass bells & kalash', 'Storage drawers', 'LED light provision'],
    rating: 4.9,
    categoryIndex: 0
  },
  {
    name: 'Teak Wood Sofa Cum Bed',
    description: 'Versatile 3-seater sofa that converts to a comfortable bed. Made from solid Teak with storage underneath.',
    price: 68000,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
      'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=600'
    ],
    material: 'Teak Wood & Fabric',
    color: 'Natural Teak with Beige Fabric',
    dimensions: { length: 200, width: 85, height: 80 },
    stock: 6,
    isAvailable: true,
    features: ['Converts to bed', 'Under-seat storage', 'Solid teak frame', 'High-density foam'],
    rating: 4.7,
    categoryIndex: 0
  },
  {
    name: 'Teak Wood Center Table with Glass Top',
    description: 'Elegant center table with solid Teak base featuring traditional elephant carved legs and tempered glass top.',
    price: 28000,
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600',
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600'
    ],
    material: 'Teak Wood & Glass',
    color: 'Natural Teak',
    dimensions: { length: 120, width: 60, height: 45 },
    stock: 15,
    isAvailable: true,
    features: ['Elephant carved legs', 'Tempered glass top', 'Solid teak construction', 'Traditional design'],
    rating: 4.8,
    categoryIndex: 0
  },
  {
    name: 'Teak Wood King Size Cot',
    description: 'Majestic king-size cot with carved headboard featuring peacock motifs. Solid Teak construction with box storage.',
    price: 95000,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600'
    ],
    material: 'Teak Wood',
    color: 'Golden Teak',
    dimensions: { length: 210, width: 190, height: 120 },
    stock: 5,
    isAvailable: true,
    features: ['Peacock carved headboard', 'Hydraulic box storage', 'Solid teak frame', 'Sturdy support system'],
    rating: 5.0,
    categoryIndex: 1
  },
  {
    name: 'Teak Wood Dressing Table',
    description: 'Traditional dressing table with oval mirror, carved frame, and multiple drawers in premium Teak wood.',
    price: 38000,
    images: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600',
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600'
    ],
    material: 'Teak Wood & Mirror',
    color: 'Natural Teak',
    dimensions: { length: 105, width: 45, height: 165 },
    stock: 10,
    isAvailable: true,
    features: ['Oval carved mirror frame', 'Multiple drawers', 'Jewelry compartment', 'Matching stool included'],
    rating: 4.7,
    categoryIndex: 1
  },
  {
    name: 'Teak Wood TV Entertainment Unit',
    description: 'Modern entertainment unit with traditional Indian touch. Features cable management and multiple shelves.',
    price: 42000,
    images: [
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600',
      'https://images.unsplash.com/photo-1595428773960-5bea2c885407?w=600'
    ],
    material: 'Teak Wood',
    color: 'Honey Teak',
    dimensions: { length: 180, width: 45, height: 55 },
    stock: 12,
    isAvailable: true,
    features: ['Cable management', 'Multiple shelves', 'Drawer storage', 'Supports up to 65" TV'],
    rating: 4.6,
    categoryIndex: 0
  },
  {
    name: 'Teak Wood Rocking Chair',
    description: 'Classic Indian-style rocking chair with cane seat and back. Perfect for verandah and living rooms.',
    price: 22000,
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600'
    ],
    material: 'Teak Wood & Cane',
    color: 'Natural Teak',
    dimensions: { length: 65, width: 80, height: 110 },
    stock: 18,
    isAvailable: true,
    features: ['Smooth rocking motion', 'Cane seat & back', 'Armrests with carved design', 'Suitable for all ages'],
    rating: 4.8,
    categoryIndex: 0
  },
  {
    name: 'Teak Wood Writing Desk',
    description: 'Elegant writing desk with leather top and brass handles. Traditional Rajasthani design in solid Teak.',
    price: 48000,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600'
    ],
    material: 'Teak Wood & Leather',
    color: 'Dark Teak',
    dimensions: { length: 140, width: 65, height: 78 },
    stock: 8,
    isAvailable: true,
    features: ['Leather writing surface', 'Brass drawer handles', 'Secret compartment', 'Solid teak construction'],
    rating: 4.9,
    categoryIndex: 3
  }
];

const sampleDoors = [
  {
    name: 'Rajasthani Haveli Main Door',
    description: 'Grand entrance door inspired by Rajasthani Haveli architecture with intricate jali work and brass studs.',
    doorType: 'Exterior',
    price: 85000,
    image: '/assets/rajasthan door.webp',
    dimensions: { height: 240, width: 120, thickness: 6 },
    finish: 'Antique Brown Polish',
    style: 'Carved',
    glassType: 'None',
    hardware: 'Antique brass handles & studs',
    stock: 6,
    features: ['Haveli-style architecture', 'Traditional jali work', 'Brass stud detailing', 'Termite resistant'],
    rating: 4.9,
    woodIndex: 1
  },
  {
    name: 'Kerala Temple Style Door',
    description: 'Sacred temple-style door featuring traditional Kerala mural-inspired carvings with brass fittings.',
    doorType: 'Interior',
    price: 55000,
    image: '/assets/KERALA-DOOR2.png',
    dimensions: { height: 210, width: 100, thickness: 5 },
    finish: 'Natural Teak Oil',
    style: 'Carved',
    glassType: 'None',
    hardware: 'Brass temple bells & handles',
    stock: 8,
    features: ['Temple-style design', 'Mural-inspired carvings', 'Brass bells included', 'Auspicious motifs'],
    rating: 4.8,
    woodIndex: 1
  },
  {
    name: 'Teak Wood Pooja Room Door',
    description: 'Traditional pooja room door with carved Om symbol and sacred geometry patterns in premium Teak.',
    doorType: 'Interior',
    price: 35000,
    image: '/assets/pooja door.jpg',
    dimensions: { height: 200, width: 80, thickness: 4 },
    finish: 'Golden Teak Polish',
    style: 'Carved',
    glassType: 'None',
    hardware: 'Brass handles with bells',
    stock: 15,
    features: ['Om symbol carving', 'Sacred geometry patterns', 'Brass bells', 'Solid teak construction'],
    rating: 4.9,
    woodIndex: 1
  },
  {
    name: 'Chettinad Palace Door',
    description: 'Magnificent double door inspired by Tamil Nadu Chettinad mansions with rosewood inlay and brass work.',
    doorType: 'Exterior',
    price: 125000,
    image: '/assets/chettinad door.jpg',
    dimensions: { height: 260, width: 180, thickness: 7 },
    finish: 'Dark Rosewood Stain',
    style: 'Carved',
    glassType: 'Decorative',
    hardware: 'Heavy brass rings & locks',
    stock: 3,
    features: ['Chettinad mansion style', 'Rosewood inlay work', 'Double door design', 'Heritage craftsmanship'],
    rating: 5.0,
    woodIndex: 1
  },
  {
    name: 'Teak Wood Jali Door',
    description: 'Beautiful interior door with traditional Indian jali (lattice) work. Perfect for airflow between rooms.',
    doorType: 'Interior',
    price: 28000,
    image: '/assets/jali door.jpg',
    dimensions: { height: 210, width: 90, thickness: 4 },
    finish: 'Natural Satin',
    style: 'Louver',
    glassType: 'None',
    hardware: 'Antique brass hardware',
    stock: 20,
    features: ['Traditional jali pattern', 'Excellent ventilation', 'Solid teak frame', 'Privacy with airflow'],
    rating: 4.7,
    woodIndex: 1
  },
  {
    name: 'South Indian Antique Door',
    description: 'Vintage-style door with traditional South Indian carved panels and iron ring handles.',
    doorType: 'Exterior',
    price: 65000,
    image: '/assets/south indian door.jpg',
    dimensions: { height: 220, width: 105, thickness: 5 },
    finish: 'Antique Dark Brown',
    style: 'Traditional',
    glassType: 'None',
    hardware: 'Iron ring handles & latches',
    stock: 7,
    features: ['South Indian traditional design', 'Carved panel work', 'Iron hardware', 'Weather resistant'],
    rating: 4.8,
    woodIndex: 1
  },
  {
    name: 'Gujarat Carved Sliding Door',
    description: 'Space-saving sliding door with traditional Gujarat mirror work and colorful painted designs.',
    doorType: 'Sliding',
    price: 42000,
    image: '/assets/gujarat.jpg',
    dimensions: { height: 210, width: 100, thickness: 4 },
    finish: 'Multi-color Traditional',
    style: 'Panel',
    glassType: 'None',
    hardware: 'Brass track system',
    stock: 10,
    features: ['Gujarat mirror work', 'Painted traditional motifs', 'Smooth sliding mechanism', 'Space saving'],
    rating: 4.6,
    woodIndex: 0
  }
];

const sampleLockers = [
  {
    name: 'Sheesham Wood 3-Door Wardrobe',
    description: 'Premium 3-door wardrobe crafted from solid Sheesham wood with traditional Rajasthani carved panels and brass handles.',
    lockerType: 'Wardrobe',
    material: 'Wood',
    price: 65000,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600', 'https://images.unsplash.com/photo-1595428773960-5bea2c885407?w=600'],
    dimensions: { height: 210, width: 180, depth: 60 },
    finish: 'Antique Brown Polish',
    color: 'Dark Brown',
    numberOfCompartments: 3,
    numberOfShelves: 6,
    lockType: 'Key Lock',
    stock: 8,
    features: ['Full-length mirror', 'Hanging rods', 'Drawer sections', 'Traditional carved design'],
    rating: 4.8
  },
  {
    name: 'Teak Wood Modular Wardrobe',
    description: 'Modern modular wardrobe system in premium Teak wood. Customize compartments as per your storage needs.',
    lockerType: 'Modular',
    material: 'Wood',
    price: 85000,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600', 'https://images.unsplash.com/photo-1595428773960-5bea2c885407?w=600'],
    dimensions: { height: 240, width: 300, depth: 65 },
    finish: 'Natural Teak Oil',
    color: 'Golden Teak',
    numberOfCompartments: 8,
    numberOfShelves: 12,
    lockType: 'Digital Lock',
    stock: 5,
    features: ['Modular design', 'LED lighting', 'Soft-close hinges', 'Shoe rack section'],
    rating: 4.9
  },
  {
    name: 'Industrial Steel Storage Cabinet',
    description: 'Heavy-duty industrial storage cabinet made from powder-coated steel. Perfect for workshops and garages.',
    lockerType: 'Storage Cabinet',
    material: 'Steel',
    price: 28000,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600'],
    dimensions: { height: 180, width: 90, depth: 45 },
    finish: 'Powder Coated',
    color: 'Grey',
    numberOfCompartments: 2,
    numberOfShelves: 4,
    lockType: 'Padlock Compatible',
    stock: 20,
    features: ['Heavy-duty construction', 'Adjustable shelves', 'Ventilation slots', 'Wall mounting option'],
    rating: 4.5
  },
  {
    name: 'Office Filing Cabinet 4-Drawer',
    description: 'Professional grade filing cabinet with 4 deep drawers for A4 and legal size files. Anti-tilt safety mechanism.',
    lockerType: 'Filing Cabinet',
    material: 'Steel',
    price: 18500,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600'],
    dimensions: { height: 130, width: 45, depth: 60 },
    finish: 'Matte Powder Coat',
    color: 'Black',
    numberOfCompartments: 4,
    numberOfShelves: 0,
    lockType: 'Key Lock',
    stock: 25,
    features: ['Anti-tilt mechanism', 'Ball bearing slides', 'Central locking', 'Label holders'],
    rating: 4.6
  },
  {
    name: 'Mango Wood Storage Chest',
    description: 'Rustic storage chest with brass fittings inspired by traditional Indian sandook. Perfect for blankets and linens.',
    lockerType: 'Storage Cabinet',
    material: 'Wood',
    price: 32000,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600', 'https://images.unsplash.com/photo-1595428773960-5bea2c885407?w=600'],
    dimensions: { height: 60, width: 120, depth: 50 },
    finish: 'Rustic Brown',
    color: 'Brown with Brass',
    numberOfCompartments: 1,
    numberOfShelves: 0,
    lockType: 'Key Lock',
    stock: 15,
    features: ['Traditional sandook design', 'Brass fittings', 'Lift-up lid', 'Cedar lined interior'],
    rating: 4.7
  },
  {
    name: 'Gym Locker - 6 Compartment',
    description: 'Commercial grade gym locker with 6 individual compartments. Ventilated design with number plates.',
    lockerType: 'Gym Locker',
    material: 'Steel',
    price: 35000,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600'],
    dimensions: { height: 180, width: 90, depth: 45 },
    finish: 'Powder Coated',
    color: 'Blue',
    numberOfCompartments: 6,
    numberOfShelves: 0,
    lockType: 'Padlock Compatible',
    stock: 30,
    features: ['Ventilated doors', 'Number plates', 'Coat hooks', 'Sloped top option'],
    rating: 4.4
  },
  {
    name: 'School Locker Unit - 9 Door',
    description: 'Compact 9-door locker unit ideal for schools and institutions. Durable construction with safety edges.',
    lockerType: 'School Locker',
    material: 'Steel',
    price: 42000,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600'],
    dimensions: { height: 150, width: 120, depth: 40 },
    finish: 'Powder Coated',
    color: 'Green',
    numberOfCompartments: 9,
    numberOfShelves: 0,
    lockType: 'Combination Lock',
    stock: 20,
    features: ['Child-safe edges', 'Magnetic door catches', 'Name card holders', 'Gang-able design'],
    rating: 4.5
  },
  {
    name: 'Premium Walk-in Closet System',
    description: 'Complete walk-in closet solution with hanging areas, drawers, shelves and accessories. Made from premium Plywood.',
    lockerType: 'Walk-in Closet',
    material: 'Plywood',
    price: 150000,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600', 'https://images.unsplash.com/photo-1595428773960-5bea2c885407?w=600'],
    dimensions: { height: 270, width: 400, depth: 60 },
    finish: 'Italian Laminate',
    color: 'White Oak',
    numberOfCompartments: 15,
    numberOfShelves: 20,
    lockType: 'Biometric',
    stock: 3,
    features: ['Custom layout', 'LED strip lighting', 'Pull-out accessories', 'Full-length mirrors'],
    rating: 5.0
  },
  {
    name: 'MDF Kids Wardrobe - Cartoon Theme',
    description: 'Colorful kids wardrobe with fun cartoon graphics. Safe rounded corners and child-height design.',
    lockerType: 'Wardrobe',
    material: 'MDF',
    price: 22000,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600'],
    dimensions: { height: 140, width: 90, depth: 50 },
    finish: 'High Gloss Laminate',
    color: 'Multi-color',
    numberOfCompartments: 2,
    numberOfShelves: 3,
    lockType: 'None',
    stock: 18,
    features: ['Child-safe design', 'Cartoon graphics', 'Easy-grip handles', 'Lightweight'],
    rating: 4.3
  },
  {
    name: 'Industrial Tool Storage Locker',
    description: 'Heavy-duty tool storage with pegboard doors and adjustable bins. Ideal for factories and workshops.',
    lockerType: 'Industrial Locker',
    material: 'Steel',
    price: 55000,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600'],
    dimensions: { height: 200, width: 120, depth: 60 },
    finish: 'Industrial Grey',
    color: 'Grey',
    numberOfCompartments: 4,
    numberOfShelves: 6,
    lockType: 'Digital Lock',
    stock: 10,
    features: ['Pegboard doors', 'Adjustable bins', 'Heavy load capacity', 'Lockable casters'],
    rating: 4.7
  },
  {
    name: 'Aluminum Outdoor Storage Cabinet',
    description: 'Weather-resistant outdoor storage cabinet made from marine-grade aluminum. Perfect for gardens and balconies.',
    lockerType: 'Storage Cabinet',
    material: 'Aluminum',
    price: 38000,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600'],
    dimensions: { height: 160, width: 80, depth: 45 },
    finish: 'Anodized',
    color: 'Silver',
    numberOfCompartments: 2,
    numberOfShelves: 4,
    lockType: 'Key Lock',
    stock: 12,
    features: ['Weather resistant', 'UV protected', 'Rust proof', 'Ventilated design'],
    rating: 4.6
  },
  {
    name: 'Heritage Almirah - Brass Inlay',
    description: 'Traditional Indian almirah with intricate brass inlay work. A collector\'s piece combining storage and art.',
    lockerType: 'Wardrobe',
    material: 'Wood',
    price: 125000,
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600', 'https://images.unsplash.com/photo-1595428773960-5bea2c885407?w=600'],
    dimensions: { height: 220, width: 150, depth: 55 },
    finish: 'Antique Polish',
    color: 'Dark Rosewood',
    numberOfCompartments: 4,
    numberOfShelves: 8,
    lockType: 'Key Lock',
    stock: 4,
    features: ['Brass inlay artwork', 'Traditional design', 'Hidden safe compartment', 'Heirloom quality'],
    rating: 4.9
  }
];

const sampleWindows = [
  {
    name: 'Rajasthani Jharokha Window',
    description: 'Traditional Rajasthani jharokha-style window with intricate carvings and jali work. Perfect for haveli-style homes.',
    windowType: 'Bay',
    price: 45000,
    image: '',
    dimensions: { height: 150, width: 120 },
    finish: 'Antique Brown Polish',
    glassType: 'Single Pane',
    frameStyle: 'Traditional',
    grillPattern: 'Custom',
    operationType: 'Fixed',
    energyRating: 'Standard',
    stock: 8,
    features: ['Jharokha design', 'Hand-carved jali work', 'Traditional Rajasthani motifs', 'Heritage craftsmanship'],
    rating: 4.9,
    woodIndex: 0
  },
  {
    name: 'Kerala Wooden Window',
    description: 'Traditional Kerala-style window with temple-inspired carvings and brass fittings. Made from premium Teak wood.',
    windowType: 'Casement',
    price: 35000,
    image: '/assets/windows/teak wood image.jpg',
    dimensions: { height: 120, width: 100 },
    finish: 'Natural Teak Oil',
    glassType: 'Single Pane',
    frameStyle: 'Traditional',
    grillPattern: 'Custom',
    operationType: 'Operable',
    energyRating: 'Standard',
    stock: 12,
    features: ['Temple-style carvings', 'Brass fittings', 'Traditional Kerala design', 'Termite resistant'],
    rating: 4.8,
    woodIndex: 1
  },
  {
    name: 'Teak Wood Jali Window',
    description: 'Beautiful window with traditional Indian jali (lattice) work. Provides privacy while allowing excellent airflow.',
    windowType: 'Fixed',
    price: 22000,
    image: '',
    dimensions: { height: 100, width: 80 },
    finish: 'Natural Satin',
    glassType: 'Single Pane',
    frameStyle: 'Traditional',
    grillPattern: 'Custom',
    operationType: 'Fixed',
    energyRating: 'Standard',
    stock: 20,
    features: ['Traditional jali pattern', 'Excellent ventilation', 'Privacy with airflow', 'Solid teak frame'],
    rating: 4.7,
    woodIndex: 1
  },
  {
    name: 'Chettinad Mansion Window',
    description: 'Grand window inspired by Tamil Nadu Chettinad architecture with rosewood inlay and antique brass work.',
    windowType: 'Bay',
    price: 65000,
    image: '/assets/windows/chettinad.jpg',
    dimensions: { height: 180, width: 150 },
    finish: 'Dark Rosewood Stain',
    glassType: 'Double Pane',
    frameStyle: 'Victorian',
    grillPattern: 'Diamond',
    operationType: 'Operable',
    energyRating: 'High Efficiency',
    stock: 5,
    features: ['Chettinad heritage design', 'Rosewood inlay work', 'Antique brass handles', 'Premium craftsmanship'],
    rating: 5.0,
    woodIndex: 1
  },
  {
    name: 'Gujarat Mirror Work Window',
    description: 'Colorful window featuring traditional Gujarat mirror work and painted designs on Sheesham wood frame.',
    windowType: 'Casement',
    price: 28000,
    image: '',
    dimensions: { height: 100, width: 80 },
    finish: 'Multi-color Traditional',
    glassType: 'Single Pane',
    frameStyle: 'Traditional',
    grillPattern: 'Custom',
    operationType: 'Operable',
    energyRating: 'Standard',
    stock: 15,
    features: ['Gujarat mirror work', 'Hand-painted motifs', 'Vibrant colors', 'Ethnic design'],
    rating: 4.6,
    woodIndex: 0
  },
  {
    name: 'South Indian Temple Window',
    description: 'Sacred temple-style window with carved deity panels and traditional South Indian architectural elements.',
    windowType: 'Fixed',
    price: 48000,
    image: '/assets/windows/temple window.jpg',
    dimensions: { height: 140, width: 100 },
    finish: 'Antique Dark Brown',
    glassType: 'Single Pane',
    frameStyle: 'Traditional',
    grillPattern: 'Custom',
    operationType: 'Fixed',
    energyRating: 'Standard',
    stock: 6,
    features: ['Temple architecture', 'Carved deity panels', 'Auspicious motifs', 'Heritage design'],
    rating: 4.9,
    woodIndex: 1
  },
  {
    name: 'Kashmiri Walnut Carved Window',
    description: 'Luxurious window crafted from genuine Kashmir Walnut with traditional Kashmiri carving patterns.',
    windowType: 'Casement',
    price: 75000,
    image: '',
    dimensions: { height: 130, width: 100 },
    finish: 'Natural Walnut Polish',
    glassType: 'Double Pane',
    frameStyle: 'Traditional',
    grillPattern: 'Custom',
    operationType: 'Operable',
    energyRating: 'High Efficiency',
    stock: 4,
    features: ['Genuine Kashmir Walnut', 'Traditional Kashmiri carving', 'Premium finish', 'Collector\'s piece'],
    rating: 5.0,
    woodIndex: 6
  },
  {
    name: 'Deodar Wood Himalayan Window',
    description: 'Traditional Himalayan-style window made from aromatic Deodar cedar with mountain-inspired carvings.',
    windowType: 'Double Hung',
    price: 38000,
    image: '',
    dimensions: { height: 120, width: 90 },
    finish: 'Natural Cedar Oil',
    glassType: 'Double Pane',
    frameStyle: 'Traditional',
    grillPattern: 'Colonial',
    operationType: 'Tilt-In',
    energyRating: 'High Efficiency',
    stock: 10,
    features: ['Aromatic Deodar wood', 'Mountain-inspired design', 'Natural insect repellent', 'Cold weather resistant'],
    rating: 4.7,
    woodIndex: 4
  },
  {
    name: 'Mango Wood Sliding Window',
    description: 'Eco-friendly sliding window made from sustainable Mango wood with modern Indian fusion design.',
    windowType: 'Sliding',
    price: 18000,
    image: '/assets/windows/mango.jpg',
    dimensions: { height: 100, width: 150 },
    finish: 'Light Golden Polish',
    glassType: 'Double Pane',
    frameStyle: 'Contemporary',
    grillPattern: 'None',
    operationType: 'Operable',
    energyRating: 'Energy Star',
    stock: 25,
    features: ['Sustainable mango wood', 'Smooth sliding', 'Eco-friendly', 'Modern Indian design'],
    rating: 4.5,
    woodIndex: 2
  },
  {
    name: 'Neem Wood Kitchen Window',
    description: 'Antibacterial Neem wood window perfect for kitchens. Traditional design with modern functionality.',
    windowType: 'Awning',
    price: 15000,
    image: '',
    dimensions: { height: 60, width: 90 },
    finish: 'Reddish Brown Polish',
    glassType: 'Single Pane',
    frameStyle: 'Traditional',
    grillPattern: 'None',
    operationType: 'Operable',
    energyRating: 'Standard',
    stock: 30,
    features: ['Natural antibacterial', 'Kitchen-friendly', 'Easy ventilation', 'Pest resistant'],
    rating: 4.4,
    woodIndex: 5
  },
  {
    name: 'Bamboo Skylight Window',
    description: 'Eco-friendly skylight made from sustainable Indian Bamboo. Brings natural light with minimal environmental impact.',
    windowType: 'Skylight',
    price: 12000,
    image: '',
    dimensions: { height: 100, width: 80 },
    finish: 'Natural Bamboo',
    glassType: 'Tempered',
    frameStyle: 'Modern',
    grillPattern: 'None',
    operationType: 'Fixed',
    energyRating: 'Energy Star',
    stock: 20,
    features: ['Sustainable bamboo', 'UV protection', 'Lightweight', 'Eco-conscious choice'],
    rating: 4.3,
    woodIndex: 7
  },
  {
    name: 'Sal Wood Storm Window',
    description: 'Heavy-duty storm window made from termite-resistant Sal wood. Built to withstand harsh Indian monsoons.',
    windowType: 'Fixed',
    price: 25000,
    image: '/assets/windows/sal window.jpg',
    dimensions: { height: 120, width: 100 },
    finish: 'Weather-Resistant Dark Brown',
    glassType: 'Laminated',
    frameStyle: 'Traditional',
    grillPattern: 'None',
    operationType: 'Fixed',
    energyRating: 'High Efficiency',
    stock: 18,
    features: ['Monsoon resistant', 'Termite proof', 'Heavy-duty construction', 'Long lasting'],
    rating: 4.6,
    woodIndex: 3
  },
  {
    name: 'Pooja Room Carved Window',
    description: 'Sacred window for pooja rooms with carved Om symbol, lotus patterns and temple bells in premium Teak.',
    windowType: 'Fixed',
    price: 32000,
    image: '/assets/windows/pooja room.jpg',
    dimensions: { height: 80, width: 60 },
    finish: 'Golden Teak Polish',
    glassType: 'Single Pane',
    frameStyle: 'Traditional',
    grillPattern: 'Custom',
    operationType: 'Fixed',
    energyRating: 'Standard',
    stock: 15,
    features: ['Om symbol carving', 'Lotus patterns', 'Temple bells design', 'Auspicious for home'],
    rating: 4.9,
    woodIndex: 1
  },
  {
    name: 'Colonial Heritage Window',
    description: 'Indo-European fusion window inspired by colonial-era architecture. Teak frame with stained glass panels.',
    windowType: 'Double Hung',
    price: 42000,
    image: '/assets/windows/colinal.jpg',
    dimensions: { height: 180, width: 100 },
    finish: 'Heritage Brown',
    glassType: 'Double Pane',
    frameStyle: 'Colonial',
    grillPattern: 'Colonial',
    operationType: 'Tilt-In',
    energyRating: 'Energy Star',
    stock: 8,
    features: ['Colonial design', 'Stained glass option', 'Indo-European fusion', 'Heritage appeal'],
    rating: 4.7,
    woodIndex: 1
  },
  {
    name: 'Tribal Art Window',
    description: 'Rustic window featuring Warli and Gond tribal art patterns. Handcrafted by tribal artisans.',
    windowType: 'Casement',
    price: 28000,
    image: '',
    dimensions: { height: 100, width: 80 },
    finish: 'Rustic Natural',
    glassType: 'Single Pane',
    frameStyle: 'Traditional',
    grillPattern: 'Custom',
    operationType: 'Operable',
    energyRating: 'Standard',
    stock: 10,
    features: ['Warli art patterns', 'Gond tribal designs', 'Handcrafted', 'Supports tribal artisans'],
    rating: 4.5,
    woodIndex: 2
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Furniture.deleteMany({});
    await Wood.deleteMany({});
    await Door.deleteMany({});
    await Window.deleteMany({});
    await Locker.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create wood types
    const createdWoods = await Wood.insertMany(sampleWoods);
    console.log(`✅ Created ${createdWoods.length} wood types`);

    // Create furniture with category and wood references
    const allFurniture = [...sampleFurniture, ...teakFurniture];
    const furnitureWithCategories = allFurniture.map((item, index) => ({
      ...item,
      category: createdCategories[item.categoryIndex]._id,
      // Assign wood types to some furniture items (Teak wood for teak products)
      wood: item.material.toLowerCase().includes('teak') ? createdWoods[1]._id : 
            (index % 3 === 0 ? createdWoods[index % createdWoods.length]._id : null)
    }));

    // Remove categoryIndex as it's not in the schema
    furnitureWithCategories.forEach(item => delete item.categoryIndex);

    const createdFurniture = await Furniture.insertMany(furnitureWithCategories);
    console.log(`✅ Created ${createdFurniture.length} furniture items`);

    // Create doors with wood references
    const doorsWithWoods = sampleDoors.map(item => ({
      ...item,
      wood: createdWoods[item.woodIndex]._id
    }));
    doorsWithWoods.forEach(item => delete item.woodIndex);
    
    const createdDoors = await Door.insertMany(doorsWithWoods);
    console.log(`✅ Created ${createdDoors.length} doors`);

    // Create windows with wood references
    const windowsWithWoods = sampleWindows.map(item => ({
      ...item,
      wood: createdWoods[item.woodIndex]._id
    }));
    windowsWithWoods.forEach(item => delete item.woodIndex);
    
    const createdWindows = await Window.insertMany(windowsWithWoods);
    console.log(`✅ Created ${createdWindows.length} windows`);

    // Create lockers
    const createdLockers = await Locker.insertMany(sampleLockers);
    console.log(`✅ Created ${createdLockers.length} lockers`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSample data created:');
    console.log('- Categories: Living Room, Bedroom, Dining Room, Office, Outdoor');
    console.log('- Wood Types: Oak, Teak, Walnut, Pine, Mahogany, Maple, Cherry, Bamboo');
    console.log('- Furniture items: 12 products');
    console.log('- Doors: 15 products with wood types');
    console.log('- Windows: 16 products with wood types');
    console.log('- Lockers: 12 products');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
