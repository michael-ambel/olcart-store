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
    _id: "7",
    name: "Home Appliances",
    slug: "home-appliances",
    subCategories: [
      {
        _id: "33",
        name: "Refrigerators",
        slug: "refrigerators",
        subCategories: [
          {
            _id: "34",
            name: "Side-by-Side",
            slug: "side-by-side",
            subCategories: [],
          },
          {
            _id: "35",
            name: "Top Freezer",
            slug: "top-freezer",
            subCategories: [],
          },
        ],
      },
      {
        _id: "36",
        name: "Washing Machines",
        slug: "washing-machines",
        subCategories: [
          {
            _id: "37",
            name: "Front Load",
            slug: "front-load",
            subCategories: [],
          },
          {
            _id: "38",
            name: "Top Load",
            slug: "top-load",
            subCategories: [],
          },
        ],
      },
    ],
  },
  {
    _id: "8",
    name: "Books",
    slug: "books",
    subCategories: [
      {
        _id: "39",
        name: "Fiction",
        slug: "fiction",
        subCategories: [
          {
            _id: "40",
            name: "Sci-Fi",
            slug: "sci-fi",
            subCategories: [],
          },
          {
            _id: "41",
            name: "Fantasy",
            slug: "fantasy",
            subCategories: [],
          },
        ],
      },
      {
        _id: "42",
        name: "Non-Fiction",
        slug: "non-fiction",
        subCategories: [
          {
            _id: "43",
            name: "Biography",
            slug: "biography",
            subCategories: [],
          },
          {
            _id: "44",
            name: "Self-Help",
            slug: "self-help",
            subCategories: [],
          },
        ],
      },
    ],
  },
];
