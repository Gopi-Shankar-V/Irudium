import { useState, useMemo, useEffect } from "react";
import { Calendar, User, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Blog = () => {
  useScrollReveal();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [allBlogPosts, setAllBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // All useMemo hooks must be called before any conditional returns
  const featuredPost = useMemo(() => {
    if (allBlogPosts.length === 0) return null;
    return allBlogPosts.find(post => post.featured) || allBlogPosts[0];
  }, [allBlogPosts]);

  // Filter posts based on search term and category
  const filteredPosts = useMemo(() => {
    return allBlogPosts.filter(post => {
      const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory && !post.featured;
    });
  }, [allBlogPosts, searchTerm, selectedCategory]);

  // Generate categories with counts
  const categories = useMemo(() => {
    const categoryCount = allBlogPosts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: "All", count: allBlogPosts.length },
      ...Object.entries(categoryCount).map(([name, count]) => ({ name, count }))
    ];
  }, [allBlogPosts]);

  // Recent posts (last 3 posts)
  const recentPosts = useMemo(() => {
    return allBlogPosts.slice(0, 3).map(post => ({
      id: post.id,
      title: post.title,
      date: new Date(post.created_at).toLocaleDateString()
    }));
  }, [allBlogPosts]);

  // Get visible posts based on load more functionality
  const visiblePostsData = useMemo(() => {
    return filteredPosts.slice(0, visiblePosts);
  }, [filteredPosts, visiblePosts]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          title: "Error loading blog posts",
          description: "Please try again later.",
          variant: "destructive"
        });
        return;
      }

      setAllBlogPosts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (allBlogPosts.length === 0) {
    return (
      <Layout>
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-k2d font-bold mb-6">
                Our <span className="text-gradient">Blog</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-k2d">
                No blog posts available yet. Check back soon!
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 6);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setVisiblePosts(6); // Reset visible posts when changing category
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16 animate-float">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-k2d font-bold mb-6">
              Our <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-k2d">
              Insights, tips, and latest trends in web development and digital innovation
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-20 bg-background-secondary">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="mb-12 animate-slide-up">
              <h2 className="text-2xl font-k2d font-bold text-gradient mb-8">Featured Article</h2>
              <Card className="card-glass hover-lift overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-64 lg:h-auto overflow-hidden">
                  <img 
                    src={featuredPost.image_urls?.[0] || featuredPost.image_url || '/placeholder.svg'} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium font-k2d">
                        {featuredPost.category}
                      </span>
                      <span className="text-sm text-muted-foreground font-k2d">Featured</span>
                    </div>
                    <h3 className="text-2xl font-k2d font-bold text-foreground mb-4">
                      {featuredPost.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed font-k2d">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User size={16} />
                          <span className="font-k2d">{featuredPost.author_name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span className="font-k2d">{new Date(featuredPost.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span className="font-k2d">{featuredPost.read_time || '5 min read'}</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/blog/${featuredPost.id}`}>
                      <Button className="btn-primary w-fit">
                        <span className="font-k2d">Read Article</span>
                        <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {visiblePostsData.map((post, index) => (
                  <Card key={post.id} className="card-service blog__card">
                    <CardHeader className="p-0">
                      <div className="h-48 rounded-t-2xl overflow-hidden">
                        <img 
                          src={post.image_urls?.[0] || post.image_url || '/placeholder.svg'} 
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium font-k2d">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 font-k2d">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3 font-k2d">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <User size={14} />
                          <span className="font-k2d">{post.author_name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span className="font-k2d">{post.read_time || '5 min read'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-k2d">{new Date(post.created_at).toLocaleDateString()}</span>
                        <Link to={`/blog/${post.id}`}>
                          <Button className="btn-secondary text-sm px-4 py-2">
                            <span className="font-k2d">Read More</span>
                            <ArrowRight className="ml-1" size={14} />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {visiblePosts < filteredPosts.length && (
                <div className="text-center mt-12">
                  <Button onClick={handleLoadMore} className="btn-secondary px-8 py-3">
                    <span className="font-k2d">Load More Articles</span>
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              )}

              {/* Read More Articles Button */}
              {visiblePosts >= filteredPosts.length && filteredPosts.length > 0 && (
                <div className="text-center mt-16 py-12 border-t border-border/50">
                  <h3 className="text-2xl font-bold mb-4 font-orbitron">
                    Looking for more <span className="text-gradient">insights</span>?
                  </h3>
                  <p className="text-muted-foreground mb-6 font-k2d">
                    Explore our complete collection of articles and stay updated with the latest trends.
                  </p>
                  <Button className="btn-primary px-8 py-3">
                    <span className="font-k2d">Read More Articles</span>
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Search */}
              <Card className="card-glass animate-slide-up">
                <CardHeader>
                  <h3 className="text-lg font-k2d font-semibold text-foreground">Search</h3>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-card border-border/50 focus:border-primary font-k2d"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="card-glass animate-slide-up delay-200">
                <CardHeader>
                  <h3 className="text-lg font-k2d font-semibold text-foreground">Categories</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <button
                          onClick={() => handleCategoryClick(category.name)}
                          className={`flex items-center justify-between text-sm w-full text-left p-2 rounded-lg transition-colors font-k2d ${
                            selectedCategory === category.name
                              ? 'text-primary bg-primary/10'
                              : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                          }`}
                        >
                          <span>{category.name}</span>
                           <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                             {String(category.count)}
                           </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card className="card-glass animate-slide-up delay-400">
                <CardHeader>
                  <h3 className="text-lg font-k2d font-semibold text-foreground">Recent Posts</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {recentPosts.map((post, index) => (
                      <li key={index}>
                        <Link to={`/blog/${post.id}`} className="block group">
                          <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-1 font-k2d">
                            {post.title}
                          </h4>
                          <p className="text-xs text-muted-foreground font-k2d">{post.date}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="card-glass animate-slide-up delay-600">
                <CardHeader>
                  <h3 className="text-lg font-k2d font-semibold text-foreground">Newsletter</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 font-k2d">
                    Subscribe to get the latest articles and insights delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Your email"
                      className="bg-card border-border/50 focus:border-primary font-k2d"
                    />
                    <Button className="btn-primary w-full">
                      <span className="font-k2d">Subscribe</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;