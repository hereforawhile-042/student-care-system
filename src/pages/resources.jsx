/* eslint-disable react/prop-types */
import { useState } from "react";
import Layout from "../components/layout";
import ResourceList from "../components/articles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Play, BookOpen, Heart, Loader2 } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Resources = ({ mood }) => {
  const [loadingVideos, setLoadingVideos] = useState({});

  // More diverse and mood-appropriate video recommendations
  const recommendedVideos = [
    {
      id: 1,
      title: "5-Minute Mindfulness Meditation",
      url: "https://www.youtube.com/embed/ZToicYcHIOU",
      description: "Quick meditation for busy schedules",
      duration: "5:23",
      category: "Mindfulness",
    },
    {
      id: 2,
      title: "Box Breathing for Anxiety Relief",
      url: "https://www.youtube.com/embed/1Vv1GlzDJzs",
      description: "Evidence-based breathing technique",
      duration: "8:15",
      category: "Breathing",
    },
    {
      id: 3,
      title: "Progressive Muscle Relaxation",
      url: "https://www.youtube.com/embed/1nZEdqcGVzo",
      description: "Release physical tension and stress",
      duration: "12:30",
      category: "Relaxation",
    },
    {
      id: 4,
      title: "Positive Affirmations for Self-Worth",
      url: "https://www.youtube.com/embed/ZToicYcHIOU",
      description: "Build confidence and self-compassion",
      duration: "10:45",
      category: "Affirmations",
    },
    {
      id: 5,
      title: "Sleep Meditation & Body Scan",
      url: "https://www.youtube.com/embed/ZToicYcHIOU",
      description: "Gentle guide to peaceful sleep",
      duration: "25:00",
      category: "Sleep",
    },
  ];

  const otherResources = [
    {
      id: 6,
      title: "Building Unshakeable Confidence",
      url: "https://www.youtube.com/embed/w-HYZv6HzAs",
      description: "Practical strategies for self-assurance",
      duration: "15:22",
      category: "Confidence",
    },
    {
      id: 7,
      title: "Understanding Anxiety: A Gentle Guide",
      url: "https://www.youtube.com/embed/w-HYZv6HzAs",
      description: "Learn about anxiety and coping methods",
      duration: "18:45",
      category: "Anxiety",
    },
    {
      id: 8,
      title: "Developing Mental Resilience",
      url: "https://www.youtube.com/embed/w-HYZv6HzAs",
      description: "Bounce back stronger from challenges",
      duration: "22:10",
      category: "Resilience",
    },
    {
      id: 9,
      title: "Cognitive Restructuring Techniques",
      url: "https://www.youtube.com/embed/w-HYZv6HzAs",
      description: "Transform negative thought patterns",
      duration: "16:33",
      category: "Cognitive",
    },
    {
      id: 10,
      title: "Stress Management Masterclass",
      url: "https://www.youtube.com/embed/w-HYZv6HzAs",
      description: "Comprehensive stress reduction strategies",
      duration: "28:17",
      category: "Stress",
    },
  ];

  const handleVideoLoad = (videoId) => {
    setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
  };

  const handleVideoLoadStart = (videoId) => {
    setLoadingVideos(prev => ({ ...prev, [videoId]: true }));
  };

  const getCategoryColor = (category) => {
    const colors = {
      Mindfulness: "bg-purple-100 text-purple-800",
      Breathing: "bg-blue-100 text-blue-800",
      Relaxation: "bg-green-100 text-green-800",
      Affirmations: "bg-rose-100 text-rose-800",
      Sleep: "bg-indigo-100 text-indigo-800",
      Confidence: "bg-orange-100 text-orange-800",
      Anxiety: "bg-teal-100 text-teal-800",
      Resilience: "bg-emerald-100 text-emerald-800",
      Cognitive: "bg-cyan-100 text-cyan-800",
      Stress: "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const VideoCarousel = ({ title, videos, icon: Icon }) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: `.swiper-button-next-${title.replace(/\s+/g, '-')}`,
          prevEl: `.swiper-button-prev-${title.replace(/\s+/g, '-')}`,
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2.5 },
          1280: { slidesPerView: 3 },
        }}
        className="pb-12"
      >
        {videos.map((video) => (
          <SwiperSlide key={video.id}>
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="relative">
                {loadingVideos[video.id] && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                  </div>
                )}
                <iframe
                  src={video.url}
                  title={video.title}
                  allowFullScreen
                  className="w-full h-48 transition-transform duration-300 group-hover:scale-105"
                  onLoad={() => handleVideoLoad(video.id)}
                  onLoadStart={() => handleVideoLoadStart(video.id)}
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(video.category)}`}>
                    {video.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                    {video.duration}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-purple-600">
                    <Play className="w-4 h-4" />
                    <span className="text-sm font-medium">Watch Now</span>
                  </div>
                  <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Curated Wellness Resources
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover personalized content designed to support your mental health journey. 
            From guided meditations to expert insights, find the resources that resonate with you.
          </p>
        </div>

        {/* Mood-based recommendation banner */}
        {mood && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h3 className="font-semibold text-purple-900">
                Personalized for Your Current Mood: {mood}
              </h3>
            </div>
            <p className="text-purple-700 text-sm">
              These resources are specially selected based on how you're feeling today.
            </p>
          </div>
        )}

        <VideoCarousel
          title="Recommended for You"
          videos={recommendedVideos}
          icon={Heart}
        />
        
        <VideoCarousel
          title="Explore More Resources"
          videos={otherResources}
          icon={BookOpen}
        />

        <ResourceList mood={mood} />
      </div>
    </Layout>
  );
};

export default Resources;