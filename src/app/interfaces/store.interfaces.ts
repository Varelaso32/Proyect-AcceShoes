export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: Category;
    image: string;
    rating: Rating;
  }
  
  export enum Category {
    Electronics = 'electronics',
    Jewelery = 'jewelery',
    MenSClothing = "men's clothing",
    WomenSClothing = "women's clothing",
  }
  
  export interface Rating {
    rate: number;
    count: number;
  }
  export interface User {
    address: Address;
    id: number;
    email: string;
    username: string;
    password: string;
    name: Name;
    phone: string;
    __v: number;
  }
  
  export interface Address {
    geolocation: Geolocation;
    city: string;
    street: string;
    number: number;
    zipcode: string;
  }
  
  export interface Geolocation {
    lat: string;
    long: string;
  }
  
  export interface Name {
    firstname: string;
    lastname: string;
  }
  
  export interface Login {
    username: string;
    password: string;
  }
  
  export interface ProductItemCart {
    product: Product;
    quantity: number;
  }
  