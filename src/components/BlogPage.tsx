
import React from 'react';
import SectionHeader from './SectionHeader';
import { Calendar, User, ArrowRight } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Ancient Secret of Kumkumadi Tailam",
    excerpt: "Discover how this miraculous oil blend of saffron and herbs can transform your skin texture and radiance overnight.",
    category: "Skin Care",
    author: "Dr. Anand Mandhane",
    date: "Oct 12, 2023",
    image: "https://picsum.photos/id/1011/800/600"
  },
  {
    id: 2,
    title: "Ayurvedic Morning Routine for Glowing Skin",
    excerpt: "Start your day with these simple Dinacharya practices to detoxify your body and achieve a natural glow.",
    category: "Wellness",
    author: "Dr. Suteja Mandhane",
    date: "Sep 28, 2023",
    image: "https://picsum.photos/id/1029/800/600"
  },
  {
    id: 3,
    title: "Understanding Your Dosha: Vata, Pitta, Kapha",
    excerpt: "A beginner's guide to identifying your body constitution and choosing the right skincare products for your type.",
    category: "Ayurveda",
    author: "Pure Elements Team",
    date: "Sep 15, 2023",
    image: "https://picsum.photos/id/1015/800/600"
  },
  {
    id: 4,
    title: "Why Sulfate-Free Shampoos Matter",
    excerpt: "Learn why switching to natural cleansers can save your hair from damage and long-term hair fall.",
    category: "Hair Care",
    author: "Dr. Anand Mandhane",
    date: "Aug 30, 2023",
    image: "https://picsum.photos/id/1020/800/600"
  },
  {
    id: 5,
    title: "The Power of Neem in Acne Treatment",
    excerpt: "How this bitter herb acts as a powerful antibacterial agent to clear skin impurities and prevent breakouts.",
    category: "Ingredients",
    author: "Dr. Suteja Mandhane",
    date: "Aug 12, 2023",
    image: "https://picsum.photos/id/1018/800/600"
  },
  {
    id: 6,
    title: "Aromatherapy for Stress Relief",
    excerpt: "Explore how essential oils like Lavender and Oudh can effect your mood and reduce stress levels instantly.",
    category: "Wellness",
    author: "Pure Elements Team",
    date: "Jul 25, 2023",
    image: "https://picsum.photos/id/1027/800/600"
  }
];

const BlogPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-[#FFFBF2] py-16 mb-10">
        <div className="container mx-auto px-4">
             <SectionHeader title="Our Blog" subtitle="Wisdom of Ayurveda" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <RevealOnScroll key={post.id} delay={index * 100}>
              <div className="bg-white border border-gray-100 rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden relative">
                   <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#8B7E66]">
                      {post.category}
                   </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                   <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                         <Calendar size={12} />
                         <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <User size={12} />
                         <span>{post.author}</span>
                      </div>
                   </div>

                   <h3 className="font-serif text-xl font-bold text-gray-800 mb-3 group-hover:text-[#8B7E66] transition-colors">
                      {post.title}
                   </h3>

                   <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                      {post.excerpt}
                   </p>

                   <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B7E66] hover:text-[#5D6D55] transition-colors self-start mt-auto">
                      Read More <ArrowRight size={14} />
                   </button>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
