export const addProductFormElements = [
    {
        name: "title",
        label: "Product Title",
        placeholder: "Enter product title",
        componentType: "input",
        type: "text",
    },
    {
        name: "description",
        label: "Description",
        placeholder: "Enter product description",
        componentType: "textarea",
    },
    {
        name: "brand",
        label: "Brand",
        placeholder: "Select brand",
        componentType: "select",
        options: [
            { id: "nike", label: "nike" },
            { id: "adidas", label: "adidas" },
            { id: "puma", label: "puma" },
            { id: "levis", label: "levis" },
            { id: "woodland", label: "woodland" },
            { id: "hm", label: "hm" },
            { id: "mufti", label: "mufti" },
            { id: "zara", label: "zara" },
        ],
    },
    {
        name: "category",
        label: "Category",
        placeholder: "Select category",
        componentType: "select",
        options: [
            { id: "men", label: "men" },
            { id: "women", label: "women" },
            { id: "kids", label: "kids" },
            { id: "footwear", label: "footwear" },
            { id: "accessories", label: "accessories" },
        ],
    },
    {
        name: "price",
        label: "Price",
        placeholder: "Enter price",
        componentType: "input",
        type: "number",
    },
    {
        name: "salePrice",
        label: "Sale Price",
        placeholder: "Enter sale price",
        componentType: "input",
        type: "number",
    },
    {
        name: "totalStock",
        label: "Stock",
        placeholder: "Enter available stock",
        componentType: "input",
        type: "number",
    },
];

export const filterOptions = {
    category: [
        { label: "men", value: "men" },
        { label: "women", value: "women" },
        { label: "kids", value: "kids" },
        { label: "footwear", value: "footwear" },
        // { label: "accessories", value: "accessories" },
    ],

    brand: [
        { label: "nike", value: "nike" },
        { label: "adidas", value: "adidas" },
        { label: "puma", value: "puma" },
        { label: "levis", value: "levis" },
        { label: "hm", value: "hm" },
        { label: "zara", value: "zara" },
        { label: "woodland", value: "woodland" },
        { label: "mufti", value: "mufti" },
    ],
};

export const sortOptions = [
    { label: "Low to High", id: "price-lowToHigh" },
    { label: "High to Low", id: "price-highToLow" },
    { label: "A to Z", id: "name-atoz" },
    { label: "Z to A", id: "name-ztoa" },
];

export const categoryOptionMap = {
    accessories: "Accessories",
    footwear: "Footwear",
    kids: "Kids",
    women: "Women",
    men: "Men",
};

export const brandOptionMap = {
    nike: "Nike",
    adidas: "Adidas",
    puma: "Puma",
    levis: "Levis",
    hm: "hm",
    woodland: "Woodland",
    zara: "Zara",
    mufti: "Mufti",
};




export const shoppingViewHeaderMenuItem = [
    {
        id: 'home',
        label: "Home",
        path: "/shop/home"
    },
    {
        id: 'product',
        label: "Product",
        path: "/shop/listing"
    },
    {
        id: 'men',
        label: "Men",
        path: "/shop/listing"
    },
    {
        id: 'women',
        label: "Women",
        path: "/shop/listing"
    },
    {
        id: 'kids',
        label: "Kids",
        path: "/shop/listing"
    },
    {
        id: 'footwear',
        label: "Footwear",
        path: "/shop/listing"
    },
    {
        id: 'search',
        label: "Search",
        path: "/shop/search"
    },
]




export const addressFormControls = [
    {
        label: "Address",
        name: "address",
        componentType: "input",
        type: "text",
        placeholder: "Enter your address",
    },
    {
        label: "City",
        name: "city",
        componentType: "input",
        type: "text",
        placeholder: "Enter your city",
    },
    {
        label: "Pincode",
        name: "pincode",
        componentType: "input",
        type: "text",
        placeholder: "Enter your pincode",
    },
    {
        label: "Phone",
        name: "phone",
        componentType: "input",
        type: "text",
        placeholder: "Enter your phone number",
    },
    {
        label: "Notes",
        name: "notes",
        componentType: "textarea",
        placeholder: "Enter any additional notes",
    },
];
