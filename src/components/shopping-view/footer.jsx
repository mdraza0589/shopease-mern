import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const ShopingFooter = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Logo & About */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-3">ShopEase</h2>
                    <p className="text-sm text-gray-400 leading-6">
                        Your one-stop destination for trendy products and amazing deals.
                        Shop with confidence and comfort from anywhere, anytime.
                    </p>
                </div>

                {/* Customer Service */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white transition">Help & FAQ</a></li>
                        <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
                        <li><a href="#" className="hover:text-white transition">Return Policy</a></li>
                        <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white transition">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-blue-500 transition"><FaFacebook size={20} /></a>
                        <a href="#" className="hover:text-pink-500 transition"><FaInstagram size={20} /></a>
                        <a href="#" className="hover:text-sky-400 transition"><FaTwitter size={20} /></a>
                        <a href="#" className="hover:text-blue-400 transition"><FaLinkedin size={20} /></a>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} ShopEase. All rights reserved.
            </div>
        </footer>
    );
};

export default ShopingFooter;

