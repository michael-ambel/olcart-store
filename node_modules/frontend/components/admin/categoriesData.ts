import { CategoryTree } from "@/store/types/categoryTypes";

export const categoriesData: CategoryTree[] = [
  {
    _id: "1",
    name: "Electronics",
    slug: "electronics",
    subCategories: [
      {
        _id: "3",
        name: "Smartphones",
        slug: "smartphones",
        subCategories: [
          {
            _id: "7",
            name: "Apple",
            slug: "apple",
            subCategories: [
              {
                _id: "13",
                name: "iPhone 14",
                slug: "iphone-14",
                subCategories: [],
              },
              {
                _id: "14",
                name: "iPhone 13",
                slug: "iphone-13",
                subCategories: [],
              },
            ],
          },
          {
            _id: "8",
            name: "Samsung",
            slug: "samsung",
            subCategories: [
              {
                _id: "15",
                name: "Galaxy S22",
                slug: "galaxy-s22",
                subCategories: [
                  {
                    _id: "5656",
                    name: "Galaxy S22 16 GB RAM",
                    slug: "galaxy-s22",
                    subCategories: [],
                  },
                  {
                    _id: "4545",
                    name: "Galaxy S22 32 GB RAM",
                    slug: "galaxy-s22",
                    subCategories: [],
                  },
                ],
              },
              {
                _id: "16",
                name: "Galaxy Note 20",
                slug: "galaxy-note-20",
                subCategories: [],
              },
            ],
          },
        ],
      },
      {
        _id: "4",
        name: "Laptops",
        slug: "laptops",
        subCategories: [
          {
            _id: "9",
            name: "MacBooks",
            slug: "macbooks",
            subCategories: [
              {
                _id: "17",
                name: "MacBook Pro",
                slug: "macbook-pro",
                subCategories: [],
              },
              {
                _id: "18",
                name: "MacBook Air",
                slug: "macbook-air",
                subCategories: [],
              },
            ],
          },
          {
            _id: "10",
            name: "Windows Laptops",
            slug: "windows-laptops",
            subCategories: [
              {
                _id: "19",
                name: "Dell XPS",
                slug: "dell-xps",
                subCategories: [],
              },
              {
                _id: "20",
                name: "HP Spectre",
                slug: "hp-spectre",
                subCategories: [],
              },
            ],
          },
        ],
      },
      {
        _id: "11",
        name: "Accessories & Gadgets",
        slug: "accessories-gadgets",
        subCategories: [
          {
            _id: "45",
            name: "Headphones",
            slug: "headphones",
            subCategories: [],
          },
          {
            _id: "46",
            name: "Bluetooth Speakers",
            slug: "bluetooth-speakers",
            subCategories: [],
          },
          {
            _id: "47",
            name: "Mice",
            slug: "mice",
            subCategories: [],
          },
          {
            _id: "48",
            name: "Earbuds",
            slug: "earbuds",
            subCategories: [],
          },
          {
            _id: "49",
            name: "Smartwatches",
            slug: "smartwatches",
            subCategories: [],
          },
          {
            _id: "50",
            name: "Mini Fans",
            slug: "mini-fans",
            subCategories: [],
          },
          {
            _id: "51",
            name: "Other Gadgets",
            slug: "other-gadgets",
            subCategories: [],
          },
        ],
      },
    ],
  },
  {
    _id: "2",
    name: "Fashion",
    slug: "fashion",
    subCategories: [
      {
        _id: "5",
        name: "Men's Fashion",
        slug: "mens-fashion",
        subCategories: [
          {
            _id: "52",
            name: "Clothing",
            slug: "mens-clothing",
            subCategories: [
              {
                _id: "53",
                name: "Tops",
                slug: "tops",
                subCategories: [],
              },
              {
                _id: "54",
                name: "T-Shirts",
                slug: "t-shirts",
                subCategories: [],
              },
              {
                _id: "55",
                name: "Jackets",
                slug: "jackets",
                subCategories: [],
              },
              {
                _id: "56",
                name: "Jeans",
                slug: "jeans",
                subCategories: [],
              },
              {
                _id: "57",
                name: "Shorts",
                slug: "shorts",
                subCategories: [],
              },
            ],
          },
          {
            _id: "58",
            name: "Shoes",
            slug: "mens-shoes",
            subCategories: [
              {
                _id: "59",
                name: "Casual Shoes",
                slug: "casual-shoes",
                subCategories: [],
              },
              {
                _id: "60",
                name: "Sports Shoes",
                slug: "sports-shoes",
                subCategories: [],
              },
              {
                _id: "61",
                name: "Boots",
                slug: "boots",
                subCategories: [],
              },
            ],
          },
        ],
      },
      {
        _id: "6",
        name: "Women's Fashion",
        slug: "womens-fashion",
        subCategories: [
          {
            _id: "62",
            name: "Clothing",
            slug: "womens-clothing",
            subCategories: [
              {
                _id: "63",
                name: "Dresses",
                slug: "dresses",
                subCategories: [],
              },
              {
                _id: "64",
                name: "Tops",
                slug: "womens-tops",
                subCategories: [],
              },
              {
                _id: "65",
                name: "T-Shirts",
                slug: "womens-t-shirts",
                subCategories: [],
              },
              {
                _id: "66",
                name: "Jackets",
                slug: "womens-jackets",
                subCategories: [],
              },
              {
                _id: "67",
                name: "Skirts",
                slug: "skirts",
                subCategories: [],
              },
            ],
          },
          {
            _id: "68",
            name: "Shoes",
            slug: "womens-shoes",
            subCategories: [
              {
                _id: "69",
                name: "Flats",
                slug: "flats",
                subCategories: [],
              },
              {
                _id: "70",
                name: "Heels",
                slug: "heels",
                subCategories: [],
              },
              {
                _id: "71",
                name: "Boots",
                slug: "boots",
                subCategories: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    _id: "3",
    name: "Vehicles",
    slug: "vehicles",
    subCategories: [
      {
        _id: "72",
        name: "Fuel",
        slug: "fuel",
        subCategories: [
          {
            _id: "73",
            name: "Sedans",
            slug: "sedans",
            subCategories: [
              {
                _id: "109",
                name: "Compact Sedans",
                slug: "compact-sedans",
                subCategories: [],
              },
              {
                _id: "110",
                name: "Mid-size Sedans",
                slug: "mid-size-sedans",
                subCategories: [],
              },
              {
                _id: "111",
                name: "Luxury Sedans",
                slug: "luxury-sedans",
                subCategories: [],
              },
            ],
          },
          {
            _id: "74",
            name: "SUVs",
            slug: "suvs",
            subCategories: [
              {
                _id: "112",
                name: "Compact SUVs",
                slug: "compact-suvs",
                subCategories: [],
              },
              {
                _id: "113",
                name: "Mid-size SUVs",
                slug: "mid-size-suvs",
                subCategories: [],
              },
              {
                _id: "114",
                name: "Full-size SUVs",
                slug: "full-size-suvs",
                subCategories: [],
              },
            ],
          },
          {
            _id: "75",
            name: "Trucks",
            slug: "trucks",
            subCategories: [
              {
                _id: "115",
                name: "Light Duty Trucks",
                slug: "light-duty-trucks",
                subCategories: [],
              },
              {
                _id: "116",
                name: "Heavy Duty Trucks",
                slug: "heavy-duty-trucks",
                subCategories: [],
              },
            ],
          },
        ],
      },
      {
        _id: "76",
        name: "Electric",
        slug: "electric",
        subCategories: [
          {
            _id: "77",
            name: "Sedans",
            slug: "electric-sedans",
            subCategories: [],
          },
          { _id: "78", name: "SUVs", slug: "electric-suvs", subCategories: [] },
          {
            _id: "79",
            name: "Trucks",
            slug: "electric-trucks",
            subCategories: [],
          },
        ],
      },
      {
        _id: "80",
        name: "Hybrid",
        slug: "hybrid",
        subCategories: [
          {
            _id: "81",
            name: "Sedans",
            slug: "hybrid-sedans",
            subCategories: [],
          },
          { _id: "82", name: "SUVs", slug: "hybrid-suvs", subCategories: [] },
          {
            _id: "83",
            name: "Trucks",
            slug: "hybrid-trucks",
            subCategories: [],
          },
        ],
      },
    ],
  },
  {
    _id: "4",
    name: "Motorcycles",
    slug: "motorcycles",
    subCategories: [
      {
        _id: "84",
        name: "Sport Bikes",
        slug: "sport-bikes",
        subCategories: [
          {
            _id: "117",
            name: "SuperSport",
            slug: "supersport",
            subCategories: [],
          },
          { _id: "118", name: "Street", slug: "street", subCategories: [] },
        ],
      },
      {
        _id: "85",
        name: "Cruisers",
        slug: "cruisers",
        subCategories: [
          { _id: "119", name: "Touring", slug: "touring", subCategories: [] },
          {
            _id: "120",
            name: "Power Cruisers",
            slug: "power-cruisers",
            subCategories: [],
          },
        ],
      },
      {
        _id: "86",
        name: "Off-road",
        slug: "off-road",
        subCategories: [
          {
            _id: "121",
            name: "Motocross",
            slug: "motocross",
            subCategories: [],
          },
          {
            _id: "122",
            name: "Dual-Sport",
            slug: "dual-sport",
            subCategories: [],
          },
        ],
      },
    ],
  },
  {
    _id: "5",
    name: "Sport",
    slug: "sport",
    subCategories: [
      {
        _id: "87",
        name: "Team Sports",
        slug: "team-sports",
        subCategories: [
          { _id: "88", name: "Soccer", slug: "soccer", subCategories: [] },
          {
            _id: "89",
            name: "Basketball",
            slug: "basketball",
            subCategories: [],
          },
          { _id: "90", name: "Baseball", slug: "baseball", subCategories: [] },
        ],
      },
      {
        _id: "91",
        name: "Individual Sports",
        slug: "individual-sports",
        subCategories: [
          { _id: "92", name: "Tennis", slug: "tennis", subCategories: [] },
          { _id: "93", name: "Boxing", slug: "boxing", subCategories: [] },
          { _id: "94", name: "Golf", slug: "golf", subCategories: [] },
        ],
      },
    ],
  },
  {
    _id: "6",
    name: "Beauty",
    slug: "beauty",
    subCategories: [
      {
        _id: "95",
        name: "Skincare",
        slug: "skincare",
        subCategories: [
          {
            _id: "96",
            name: "Moisturizers",
            slug: "moisturizers",
            subCategories: [],
          },
          {
            _id: "97",
            name: "Cleansers",
            slug: "cleansers",
            subCategories: [],
          },
          {
            _id: "98",
            name: "Sunscreen",
            slug: "sunscreen",
            subCategories: [],
          },
        ],
      },
      {
        _id: "99",
        name: "Makeup",
        slug: "makeup",
        subCategories: [
          {
            _id: "100",
            name: "Foundation",
            slug: "foundation",
            subCategories: [],
          },
          { _id: "101", name: "Mascara", slug: "mascara", subCategories: [] },
          { _id: "102", name: "Lipstick", slug: "lipstick", subCategories: [] },
        ],
      },
      {
        _id: "103",
        name: "Haircare",
        slug: "haircare",
        subCategories: [
          { _id: "104", name: "Shampoo", slug: "shampoo", subCategories: [] },
          {
            _id: "105",
            name: "Conditioner",
            slug: "conditioner",
            subCategories: [],
          },
          {
            _id: "106",
            name: "Styling Products",
            slug: "styling-products",
            subCategories: [],
          },
        ],
      },
    ],
  },
];

[
  {
    category: "Electronics",
    products: [
      { name: "iPhone 14 128GB", slug: "iphone-14-128gb" }, // Electronics, Smartphone, Apple, iPhone 14, iPhone 14 128GB
      { name: "iPhone 14 Pro Max", slug: "iphone-14-pro-max" }, // Electronics, Smartphone, Apple, iPhone 14, iPhone 14 Pro Max
      { name: "iPhone 13 Mini", slug: "iphone-13-mini" }, // Electronics, Smartphone, Apple, iPhone 13, iPhone 13 Mini
      { name: "Galaxy S22 16GB RAM", slug: "galaxy-s22-16gb-ram" }, // Electronics, Smartphone, Samsung, Galaxy S22, Galaxy S22 16GB RAM
      { name: "Galaxy S22 32GB RAM", slug: "galaxy-s22-32gb-ram" }, // Electronics, Smartphone, Samsung, Galaxy S22, Galaxy S22 32GB RAM
      { name: "Galaxy Note 20 Ultra", slug: "galaxy-note-20-ultra" }, // Electronics, Smartphone, Samsung, Galaxy Note 20, Galaxy Note 20 Ultra
      { name: "MacBook Pro M1 16-inch", slug: "macbook-pro-m1" }, // Electronics, Laptop, Apple, MacBook Pro, MacBook Pro M1 16-inch
      { name: "MacBook Air M2", slug: "macbook-air-m2" }, // Electronics, Laptop, Apple, MacBook Air, MacBook Air M2
      { name: "Dell XPS 13", slug: "dell-xps-13" }, // Electronics, Laptop, Dell, XPS Series, Dell XPS 13
      { name: "HP Spectre x360", slug: "hp-spectre-x360" }, // Electronics, Laptop, HP, Spectre Series, HP Spectre x360
      { name: "Bluetooth Headphones", slug: "bluetooth-headphones" }, // Electronics, Accessories, Audio, Bluetooth Headphones
      { name: "Noise Cancelling Earbuds", slug: "noise-cancelling-earbuds" }, // Electronics, Accessories, Audio, Noise Cancelling Earbuds
    ],
  },
  {
    category: "Fashion",
    products: [
      { name: "Men's Slim Fit T-Shirt", slug: "mens-slim-fit-tshirt" }, // Fashion, Men's Clothing, Tops, T-Shirts, Slim Fit T-Shirt
      { name: "Men's Bomber Jacket", slug: "mens-bomber-jacket" }, // Fashion, Men's Clothing, Outerwear, Jackets, Bomber Jacket
      { name: "Men's Distressed Jeans", slug: "mens-distressed-jeans" }, // Fashion, Men's Clothing, Bottoms, Jeans, Distressed Jeans
      { name: "Men's Casual Sneakers", slug: "mens-casual-sneakers" }, // Fashion, Men's Footwear, Casual Shoes, Sneakers
      { name: "Men's Hiking Boots", slug: "mens-hiking-boots" }, // Fashion, Men's Footwear, Outdoor, Hiking Boots
      { name: "Women's Maxi Dress", slug: "womens-maxi-dress" }, // Fashion, Women's Clothing, Dresses, Maxi Dress
      { name: "Women's Crop Top", slug: "womens-crop-top" }, // Fashion, Women's Clothing, Tops, Crop Top
      { name: "Women's Leather Jacket", slug: "womens-leather-jacket" }, // Fashion, Women's Clothing, Outerwear, Jackets, Leather Jacket
      { name: "Women's Pencil Skirt", slug: "womens-pencil-skirt" }, // Fashion, Women's Clothing, Bottoms, Skirts, Pencil Skirt
      { name: "Women's Heeled Sandals", slug: "womens-heeled-sandals" }, // Fashion, Women's Footwear, Dress Shoes, Heeled Sandals
      { name: "Men's Formal Shoes", slug: "mens-formal-shoes" }, // Fashion, Men's Footwear, Dress Shoes, Formal Shoes
      { name: "Women's Flats", slug: "womens-flats" }, // Fashion, Women's Footwear, Casual Shoes, Flats
    ],
  },
  {
    category: "Vehicles",
    products: [
      { name: "Compact Sedan", slug: "compact-sedan" }, // Vehicles, Cars, Sedan, Compact Sedan
      { name: "Luxury Sedan", slug: "luxury-sedan" }, // Vehicles, Cars, Sedan, Luxury Sedan
      { name: "Mid-Size SUV", slug: "mid-size-suv" }, // Vehicles, Cars, SUV, Mid-Size SUV
      { name: "Compact SUV", slug: "compact-suv" }, // Vehicles, Cars, SUV, Compact SUV
      { name: "Light Duty Truck", slug: "light-duty-truck" }, // Vehicles, Trucks, Light Duty Truck
      { name: "Heavy Duty Truck", slug: "heavy-duty-truck" }, // Vehicles, Trucks, Heavy Duty Truck
      { name: "Electric Sedan", slug: "electric-sedan" }, // Vehicles, Cars, Electric, Sedan, Electric Sedan
      { name: "Electric Truck", slug: "electric-truck" }, // Vehicles, Trucks, Electric, Electric Truck
      { name: "Hybrid Sedan", slug: "hybrid-sedan" }, // Vehicles, Cars, Hybrid, Sedan, Hybrid Sedan
      { name: "Hybrid SUV", slug: "hybrid-suv" }, // Vehicles, Cars, Hybrid, SUV, Hybrid SUV
      { name: "Electric Compact SUV", slug: "electric-compact-suv" }, // Vehicles, Cars, Electric, SUV, Compact SUV
      { name: "Hybrid Pickup Truck", slug: "hybrid-pickup-truck" }, // Vehicles, Trucks, Hybrid, Pickup Truck
    ],
  },
  {
    category: "Motorcycles",
    products: [
      { name: "Sport Bike 500cc", slug: "sport-bike-500cc" }, // Motorcycles, Sport Bike, 500cc
      { name: "SuperSport 1000cc", slug: "supersport-1000cc" }, // Motorcycles, SuperSport, 1000cc
      { name: "Street Bike 600cc", slug: "street-bike-600cc" }, // Motorcycles, Street Bike, 600cc
      { name: "Touring Cruiser 750cc", slug: "touring-cruiser-750cc" }, // Motorcycles, Cruiser, Touring, 750cc
      { name: "Power Cruiser 1200cc", slug: "power-cruiser-1200cc" }, // Motorcycles, Cruiser, Power, 1200cc
      { name: "Motocross Bike 450cc", slug: "motocross-bike-450cc" }, // Motorcycles, Motocross, 450cc
      { name: "Dual-Sport Bike 650cc", slug: "dual-sport-bike-650cc" }, // Motorcycles, Dual-Sport, 650cc
      { name: "Street Naked Bike", slug: "street-naked-bike" }, // Motorcycles, Naked Bike, Street
      { name: "SuperSport R", slug: "supersport-r" }, // Motorcycles, SuperSport, R Model
      { name: "Adventure Cruiser", slug: "adventure-cruiser" }, // Motorcycles, Cruiser, Adventure
    ],
  },
  {
    category: "Sport",
    products: [
      { name: "Professional Soccer Ball", slug: "professional-soccer-ball" }, // Sport, Soccer, Equipment, Soccer Ball
      { name: "Basketball Hoop System", slug: "basketball-hoop-system" }, // Sport, Basketball, Equipment, Hoop System
      { name: "Baseball Glove", slug: "baseball-glove" }, // Sport, Baseball, Equipment, Glove
      { name: "Tennis Racket Pro", slug: "tennis-racket-pro" }, // Sport, Tennis, Equipment, Racket, Pro Series
      { name: "Boxing Gloves", slug: "boxing-gloves" }, // Sport, Boxing, Equipment, Gloves
      { name: "Golf Club Set", slug: "golf-club-set" }, // Sport, Golf, Equipment, Club Set
      { name: "Running Shoes", slug: "running-shoes" }, // Sport, Running, Footwear, Running Shoes
      { name: "Cycling Helmet", slug: "cycling-helmet" }, // Sport, Cycling, Gear, Helmet
      { name: "Swim Goggles", slug: "swim-goggles" }, // Sport, Swimming, Gear, Goggles
      { name: "Fitness Tracker", slug: "fitness-tracker" }, // Sport, Fitness, Wearable, Tracker
    ],
  },
  {
    category: "Beauty",
    products: [
      { name: "Moisturizer SPF 30", slug: "moisturizer-spf-30" }, // Beauty, Skincare, Moisturizers, SPF 30
      { name: "Sunscreen Gel SPF 50", slug: "sunscreen-gel-spf-50" }, // Beauty, Skincare, Sunscreen, SPF 50 Gel
      { name: "Vitamin C Serum", slug: "vitamin-c-serum" }, // Beauty, Skincare, Serums, Vitamin C
      { name: "Foundation Matte Finish", slug: "foundation-matte-finish" }, // Beauty, Makeup, Foundation, Matte Finish
      { name: "Mascara Waterproof", slug: "mascara-waterproof" }, // Beauty, Makeup, Mascara, Waterproof
      { name: "Matte Lipstick", slug: "matte-lipstick" }, // Beauty, Makeup, Lipstick, Matte
      { name: "Shampoo for Dry Hair", slug: "shampoo-for-dry-hair" }, // Beauty, Haircare, Shampoo, Dry Hair
      { name: "Conditioner for Volume", slug: "conditioner-for-volume" }, // Beauty, Haircare, Conditioner, Volume
      { name: "Styling Gel Extra Hold", slug: "styling-gel-extra-hold" }, // Beauty, Haircare, Styling, Gel, Extra Hold
      { name: "Hair Mask Deep Repair", slug: "hair-mask-deep-repair" }, // Beauty, Haircare, Masks, Deep Repair
    ],
  },
];
